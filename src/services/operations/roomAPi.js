import { apiConnector } from "../apiConnector";
import { roomEndpoints } from "../endPoints/roomEndpoints";
import toast from "react-hot-toast";
import { setRoomData } from "../../redux/slices/authSlice";

const { CREATE_AND_JOIN_ROOM, FIND_ROOM_BY_EMAIL } = roomEndpoints;

export const createAndJoinRoom = (data, token) => async (dispatch) => {
  const toastId = toast.loading("Please wait ...");
  try {
    if (!data) {
      toast.dismiss(toastId);
      toast.error("Please provide the deatials");
    }

    const response = await apiConnector(
      "POST",
      CREATE_AND_JOIN_ROOM,
      { data },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("Join response -> ", response);
    // toast.success("")
    dispatch(setRoomData(response?.data?.roomData));
    toast.dismiss(toastId);
    return response?.data;
  } catch (error) {
    toast.dismiss(toastId);
    console.log("Errorin creating room -> ", error);
    return;
  }
};

export const findRoomByEmail = (email, token) => async (dispatch) => {
  const toastId = toast.loading("Please wait ...");
  try {
    console.log("Email -> ", email);

    if (!email) {
      toast.dismiss(toastId);
      toast.error("Please provide an email");
      return;
    }

    const response = await apiConnector(
      "POST",
      FIND_ROOM_BY_EMAIL, // assuming this is the correct route
      { email },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("Find Room by Email response -> ", response);

    dispatch(setRoomData(response?.data?.rooms)); // Assuming rooms is the field with the populated room data
    toast.dismiss(toastId);
    // toast.success("Rooms")
    return response?.data?.rooms;
  } catch (error) {
    toast.dismiss(toastId);
    toast.success("No rooms found for you");
    console.log("Error finding room by email -> ", error);
    return;
  }
};
