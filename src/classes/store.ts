type StoreType = Record<string, unknown>;
const localStore: StoreType = {};

class Store {
  store = (): StoreType => (getgenv ? getgenv() : localStore);

  private format(key: string): string {
    return `RobloxAI.${key}`;
  }

  get<T>(key: string, fallback: T, setFallback: boolean): T;
  get<T>(key: string, fallback: T): T;
  get<T>(key: string): T | undefined;
  get<T>(key: string, fallback?: T, setFallback?: boolean): T | undefined {
    const value = this.store()[this.format(key)];
    if (value !== undefined) return value as T;

    return fallback
      ? setFallback
        ? this.set<T>(key, fallback)
        : fallback
      : undefined;
  }

  set<T>(key: string, value?: T): T {
    this.store()[this.format(key)] = value;
    return value as T;
  }
}

export default new Store();
