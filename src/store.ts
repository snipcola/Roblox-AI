function format(key: string): string {
  return `RobloxAI.${key}`;
}

function get<T>(key: string, fallback: T, setFallback: boolean): T;
function get<T>(key: string, fallback: T): T;
function get<T>(key: string): T | undefined;
function get<T>(
  key: string,
  fallback?: T,
  setFallback?: boolean,
): T | undefined {
  const value = getgenv()[format(key)];

  if (value !== undefined) {
    return value as T;
  }

  return fallback
    ? setFallback
      ? set<T>(key, fallback)
      : fallback
    : undefined;
}

function set<T>(key: string, value: T): T {
  getgenv()[format(key)] = value;
  return value as T;
}

export default { get, set };
