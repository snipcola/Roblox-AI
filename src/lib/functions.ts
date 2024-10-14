import logger, { LogType } from "classes/logger";

export function waitForGameLoad() {
  logger.log(LogType.Debug, "Script", "Waiting for game load");
  if (!game.IsLoaded()) game.Loaded.Wait();
}

export function startsWith(one: string, two: string) {
  return one.sub(1, two.size()) === two;
}

export function getCustomService<T>(className: string) {
  return game.GetService(className as keyof Services) as T;
}
