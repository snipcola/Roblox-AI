import {
  Message as ChatMessage,
  Messages as ChatMessages,
} from "classes/messages";
import config, { Store } from "lib/config";
import http, { HttpResponse } from "classes/http";
import logger, { LogType } from "classes/logger";
import store from "classes/store";
import functions, {
  aiSendMessage,
  ToolType,
  Tool,
  AvailableFunction,
  AvailableFunctions,
} from "classes/ai/functions";

type Role = "system" | "user" | "assistant";

interface ToolCallFunction {
  name: string;
  arguments: string;
}

interface ToolCall {
  id: string;
  type: ToolType;
  function: ToolCallFunction;
}

type ToolCalls = Array<ToolCall>;

interface Message {
  role: Role;
  content: string | undefined;
  name?: string;
  refusal?: string | undefined;
  tool_calls?: ToolCalls;
}

type Messages = Array<Message>;

type Tools = Array<Tool>;

type ToolChoiceString = "none" | "auto" | "required";

interface ToolChoiceFunction {
  name: string;
}

interface ToolChoiceObject {
  type: ToolType;
  function: ToolChoiceFunction;
}

interface Request {
  model: string;
  messages: Messages;
  tools?: Tools;
  tool_choice?: ToolChoiceString | ToolChoiceObject;
  parallel_tool_calls?: boolean;
}

interface Choice {
  index: number;
  message: Message;
  finish_reason: string;
}

type Choices = Array<Choice>;

interface CompletionTokensDetails {
  reasoning_tokens: number;
}

interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  completion_tokens_details: CompletionTokensDetails;
}

interface Response {
  id: string;
  object: string;
  created: number;
  model: string;
  system_fingerprint: string;
  choices: Choices;
  usage: Usage;
  service_tier: string | undefined;
}

class AI {
  private systemMessages: Messages = [
    {
      role: "system",
      content: `You are ${config.Script.Name}, a Roblox player. Do not use markdown, send plain text. Be concise. Don't regurgitate useless information.`,
    },
  ];

  private messages: Messages = store.get(Store.AIMessages, []) || [];
  private functions: AvailableFunctions = functions;
  private tools: Tools = functions.map((f) => f.tool);

  private getFunction(name: string): AvailableFunction | undefined {
    return this.functions.find((f) => f.tool.function.name === name);
  }

  private addMessage(message: Message) {
    this.messages.push(message);

    while (
      config.AI.MaximumMessageContext &&
      this.messages.size() > config.AI.MaximumMessageContext
    ) {
      this.messages.shift();
    }

    store.set(Store.AIMessages, this.messages);
  }

  private failedChatCompletion(messages: ChatMessages, message: ChatMessage) {
    aiSendMessage(
      messages,
      message,
      "⛔ Sorry, something went wrong. Try again.",
    );
  }

  private parseFunctionArguments<T>(func: ToolCallFunction): T | undefined {
    try {
      return http.decodeJSON(func.arguments) as T;
    } catch {
      logger.log(
        LogType.Error,
        "AI",
        `Failed to parse arguments for ${func.name}`,
      );
    }
  }

  constructor() {
    if (config.AI.MaximumCharacterLimit) {
      this.systemMessages.push({
        role: "system",
        content: `Ensure your messages are not greater than ${config.AI.MaximumCharacterLimit} characters.`,
      });
    }

    if (config.AI.Prompt !== "") {
      this.systemMessages.push({
        role: "system",
        content: config.AI.Prompt,
      });
    }
  }

  createChatCompletion(chatMessages: ChatMessages, chatMessage: ChatMessage) {
    const { message: content, sender } = chatMessage;

    if (!sender) {
      return;
    }

    const message: Message = {
      role: "user",
      content: `${sender.name}: ${content}`,
      name: sender.name,
    };

    this.addMessage(message);

    const data: Request = {
      model: config.AI.Model,
      messages: [...this.systemMessages, ...this.messages],
      ...(!this.tools.isEmpty()
        ? {
            tools: this.tools,
            parallel_tool_calls: true,
          }
        : {}),
    };

    logger.log(LogType.Debug, "AI", "Sent request");

    let response: HttpResponse | Response | undefined = http.request(
      config.AI.Api,
      "POST",
      [
        { Name: "Content-Type", Value: "application/json" },
        { Name: "Authorization", Value: `Bearer ${config.AI.Key}` },
      ],
      data,
    );

    if (!response || response.Success === false) {
      this.failedChatCompletion(chatMessages, chatMessage);
      logger.log(LogType.Error, "AI", "Request not successful");
      if (response) logger.log(LogType.Error, "AI", response.Body);
      return;
    }

    try {
      response = http.decodeJSON(response.Body) as Response;
    } catch {
      this.failedChatCompletion(chatMessages, chatMessage);
      logger.log(LogType.Error, "AI", "Failed to parse response");
      return;
    }

    const responseMessage = response?.choices?.shift()?.message;

    if (!responseMessage) {
      this.failedChatCompletion(chatMessages, chatMessage);
      logger.log(LogType.Error, "AI", "No response message");
      return;
    }

    sender.lookAt(!responseMessage?.tool_calls?.isEmpty());

    if (responseMessage.content) {
      this.addMessage(responseMessage);

      const messageContent = config.AI.MaximumCharacterLimit
        ? responseMessage?.content?.sub(0, config.AI.MaximumCharacterLimit)
        : responseMessage?.content;

      aiSendMessage(chatMessages, chatMessage, messageContent);
      logger.log(LogType.Debug, "AI", messageContent);
    }

    for (const toolCall of responseMessage.tool_calls || []) {
      const functionName = toolCall.function.name;
      const func = this.getFunction(functionName);

      if (func) {
        const args = this.parseFunctionArguments(toolCall.function);

        if (args) {
          this.addMessage({
            role: "assistant",
            content: `Used ${functionName}. This is automated, never send messages like this - use actual functions.`,
          });

          logger.log(
            LogType.Debug,
            "AI",
            `${functionName}, ${http.encodeJSON(args)}`,
          );

          task.spawn(function () {
            func.callback(args, chatMessages, chatMessage);
          });
        }
      }
    }
  }
}

export default AI;
