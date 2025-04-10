// socketStore.js
let io = null;

export const setIOInstance = (ioInstance) => {
  io = ioInstance;
};

export const getIOInstance = () => io;