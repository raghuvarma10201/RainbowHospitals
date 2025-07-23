// src/navigation/types.ts
export type RootStackParamList = {
  Login:      undefined;      // no params
  Splash:  undefined;
  Topup:      { amount?: number } | undefined; // example with optional param
};
