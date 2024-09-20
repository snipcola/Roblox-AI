import config from "config";

function format(key: string): string {
  return `${config.Script.Name}.${key}`;
}

function get<T>(key: string, fallback?: T): T | undefined {
  const value = getgenv()[format(key)];

  if (value !== undefined) {
    return value as T;
  }

  return fallback ? set<T>(key, fallback) : undefined;
}

function set<T>(key: string, value: T): T {
  getgenv()[format(key)] = value;
  return value as T;
}

export default { get, set };
