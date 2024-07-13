//./utils.ts
let uniqueKeyCounter = 0;

export const  generateUniqueKey = () => `uqk_${uniqueKeyCounter++}`;