/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/global.d.ts
interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: any) => void;
          onError?: (error: any) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }