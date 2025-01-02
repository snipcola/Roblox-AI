import logger, { LogType } from "classes/logger";
const httpService = game.GetService("HttpService");

interface Header {
  Name: string;
  Value: string;
}

type Headers = Array<Header>;

export interface HttpResponse {
  Success: boolean;
  Body: string;
}

class HTTP {
  private library = request || httpService.RequestAsync;

  encodeJSON(json: unknown): string {
    try {
      return httpService.JSONEncode(json);
    } catch {
      return "";
    }
  }

  decodeJSON(json: string): unknown | undefined {
    try {
      return httpService.JSONDecode(json);
    } catch {
      return undefined;
    }
  }

  request(
    url: string,
    method: "GET" | "POST",
    headers: Headers,
    body: string | object,
  ): HttpResponse | undefined {
    if (!this.library) {
      logger.log(LogType.Error, "Request", "Request function unavailable.");
      return;
    }

    const args = {
      Url: url,
      Method: method,
      Headers: headers.reduce(
        (acc, { Name, Value }) => {
          acc[Name] = Value;
          return acc;
        },
        {} as Record<string, string>,
      ),
      Body: typeIs(body, "string") ? body : this.encodeJSON(body),
      Compress: Enum.HttpCompression.Gzip,
    };

    try {
      const { Success, Body } = this.library(args);
      return { Success, Body };
    } catch {
      logger.log(LogType.Error, "Request", "Failed to create request.");
    }
  }
}

export default new HTTP();
