declare global {
  namespace NodeJS {
    interface Global {
      login(): Promise<string>;
    }
  }
}
export {};
