const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

console.log("Base url -> ", import.meta.env.VITE_APP_BASE_URL);

export const roomEndpoints = {
  CREATE_AND_JOIN_ROOM: BASE_URL + "/room/create-and-join-room",
  FIND_ROOM_BY_EMAIL: BASE_URL + "/room/find-room-by-email",
};
 