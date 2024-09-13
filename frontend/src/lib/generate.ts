import * as cryptoModule from "node:crypto";

export const generate = {
  generateId: () => {
    if (typeof window !== "undefined") {
      const array = new Uint32Array(1);
      return window.crypto.getRandomValues(array)[0];
    }
    return cryptoModule.randomBytes(16).toString("hex");
  },

  generateSecret: async () => {
    if (typeof window !== "undefined") {
      const array = new Uint8Array(32); // 256 bits = 32 bytes
      window.crypto.getRandomValues(array);
      return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
    }
    return cryptoModule.randomBytes(16).toString("hex");
  },
};
