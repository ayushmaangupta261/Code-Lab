// import React, { useCallback, useEffect, useState } from "react";

// import { usePeer } from "../../providers/PeerProvider";
// import ReactPlayer from "react-player";

// const LiveMeet = () => {
//   const socket = useSocket();
//   const {
//     peer,
//     createOffer,
//     createAnswer,
//     setRemoteAns,
//     sendStream,
//     remoteStream,
//   } = usePeer();

//   const [myStream, setMyStream] = useState(null);
//   const [remoteEmailId, setRemoteEmailId] = useState(null);

//   // 🟢 Handle new user
//   const handleNewUserJoined = useCallback(
//     async ({ emailId }) => {
//       console.log("New user joined:", emailId);
//       setRemoteEmailId(emailId);
//       await sendStream(myStream);
//       const offer = await createOffer();
//       socket.emit("call-user", { emailId, offer });
//     },
//     [createOffer, socket, sendStream, myStream]
//   );

//   // 🟢 Handle incoming call
//   const handleIncomingCall = useCallback(
//     async ({ from, offer }) => {
//       console.log("Incoming call from:", from);
//       setRemoteEmailId(from);
//       await sendStream(myStream);
//       const ans = await createAnswer(offer);
//       socket.emit("call-accepted", { emailId: from, ans });
//     },
//     [createAnswer, socket, sendStream, myStream]
//   );

//   // 🟢 Handle answer after call
//   const handleCallAccepted = useCallback(
//     async ({ ans }) => {
//       console.log("Call accepted with answer:", ans);
//       await setRemoteAns(ans);
//     },
//     [setRemoteAns]
//   );

//   // 🟢 Handle negotiationneeded event from peer
//   const handleNegotiation = useCallback(async () => {
//     if (!remoteEmailId) return;
//     console.log("🌀 Negotiation triggered");
//     const offer = await createOffer();
//     socket.emit("negotiation-offer", { emailId: remoteEmailId, offer });
//   }, [createOffer, socket, remoteEmailId]);

//   // 🟢 When receiving a negotiation offer
//   const handleNegotiationOffer = useCallback(
//     async ({ emailId, offer }) => {
//       console.log("⚙️ Received negotiation offer");
//       const ans = await createAnswer(offer);
//       socket.emit("negotiation-answer", { emailId, ans });
//     },
//     [createAnswer, socket]
//   );

//   // 🟢 When receiving a negotiation answer
//   const handleNegotiationAnswer = useCallback(
//     async ({ ans }) => {
//       console.log("📨 Received negotiation answer");
//       await setRemoteAns(ans);
//     },
//     [setRemoteAns]
//   );

//   // 🟢 Add peer event listener
//   useEffect(() => {
//     peer.addEventListener("negotiationneeded", handleNegotiation);
//     return () => {
//       peer.removeEventListener("negotiationneeded", handleNegotiation);
//     };
//   }, [peer, handleNegotiation]);

//   // 🟢 Socket event listeners
//   useEffect(() => {
//     socket.on("user-joined", handleNewUserJoined);
//     socket.on("incoming-call", handleIncomingCall);
//     socket.on("call-accepted", handleCallAccepted);
//     socket.on("negotiation-offer", handleNegotiationOffer);
//     socket.on("negotiation-answer", handleNegotiationAnswer);

//     return () => {
//       socket.off("user-joined", handleNewUserJoined);
//       socket.off("incoming-call", handleIncomingCall);
//       socket.off("call-accepted", handleCallAccepted);
//       socket.off("negotiation-offer", handleNegotiationOffer);
//       socket.off("negotiation-answer", handleNegotiationAnswer);
//     };
//   }, [
//     socket,
//     handleNewUserJoined,
//     handleIncomingCall,
//     handleCallAccepted,
//     handleNegotiationOffer,
//     handleNegotiationAnswer,
//   ]);

//   // 🟢 Get local stream
//   useEffect(() => {
//     const getMedia = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true,
//         });
//         setMyStream(stream);
//       } catch (err) {
//         console.error("Error accessing media devices.", err);
//       }
//     };
//     getMedia();
//   }, []);

//   return (
//     <div className="w-screen h-screen flex flex-col">
//       <p>
//         Room Page {remoteEmailId && <span>Connected to: {remoteEmailId}</span>}
//       </p>

//       <div className="flex-1 flex gap-4 justify-center items-center">
//         {myStream && (
//           <ReactPlayer
//             url={myStream}
//             playing
//             muted
//             height={200}
//             width={300}
//           />
//         )}
//         {remoteStream && (
//           <ReactPlayer
//             url={remoteStream}
//             playing
//             muted={false}
//             height={200}
//             width={300}
//           />
//         )}
//       </div>

//       <button
//         onClick={() => sendStream(myStream)}
//         className="bg-white text-black w-[10rem] h-[2rem] mx-auto my-4"
//       >
//         Send My Video
//       </button>
//     </div>
//   );
// };

// export default LiveMeet;

import React, { useCallback, useEffect, useState } from "react";
import { initSocket } from "../../services/socket.js";
import { usePeer } from "../../providers/PeerProvider";
import ReactPlayer from "react-player";
import { Video, Mic, MicOff, VideoOff } from "lucide-react";

const LiveMeet = () => {
  const [socket, setSocket] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteEmailId, setRemoteEmailId] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteAns,
    sendStream,
    remoteStream,
  } = usePeer();

  // ✅ Socket init
  useEffect(() => {
    const setupSocket = async () => {
      const newSocket = await initSocket();
      setSocket(newSocket);
    };
    setupSocket();
  }, []);

  // ✅ Toggle mic
  const toggleMic = () => {
    if (myStream) {
      myStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setMicOn((prev) => !prev);
    }
  };

  // ✅ Toggle video
  const toggleVideo = async () => {
    if (!myStream) return;

    const videoTracks = myStream.getVideoTracks();

    if (videoOn) {
      // Stop and remove video tracks
      videoTracks.forEach((track) => {
        track.stop();
        myStream.removeTrack(track);
      });
    } else {
      // Add video track back
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const newVideoTrack = newStream.getVideoTracks()[0];
        myStream.addTrack(newVideoTrack);
        sendStream(myStream); // Send updated stream
      } catch (err) {
        console.error("Failed to re-acquire video stream:", err);
      }
    }

    setVideoOn((prev) => !prev);
  };

  // 🟢 Handle new user joined
  const handleNewUserJoined = useCallback(
    async ({ emailId }) => {
      console.log("New user joined:", emailId);
      setRemoteEmailId(emailId);
      await sendStream(myStream);
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
    },
    [createOffer, socket, sendStream, myStream]
  );

  // 🟢 Handle incoming call
  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      console.log("Incoming call from:", from);
      setRemoteEmailId(from);
      await sendStream(myStream);
      const ans = await createAnswer(offer);
      socket.emit("call-accepted", { emailId: from, ans });
    },
    [createAnswer, socket, sendStream, myStream]
  );

  // 🟢 Handle call accepted
  const handleCallAccepted = useCallback(
    async ({ ans }) => {
      console.log("Call accepted with answer:", ans);
      await setRemoteAns(ans);
    },
    [setRemoteAns]
  );

  // 🟢 Handle negotiationneeded event
  const handleNegotiation = useCallback(async () => {
    if (!remoteEmailId) return;
    const offer = await createOffer();
    socket.emit("negotiation-offer", { emailId: remoteEmailId, offer });
  }, [createOffer, socket, remoteEmailId]);

  // 🟢 Handle negotiation offer
  const handleNegotiationOffer = useCallback(
    async ({ emailId, offer }) => {
      const ans = await createAnswer(offer);
      socket.emit("negotiation-answer", { emailId, ans });
    },
    [createAnswer, socket]
  );

  // 🟢 Handle negotiation answer
  const handleNegotiationAnswer = useCallback(
    async ({ ans }) => {
      await setRemoteAns(ans);
    },
    [setRemoteAns]
  );

  // 🟢 Peer negotiation listener
  useEffect(() => {
    peer.addEventListener("negotiationneeded", handleNegotiation);
    return () => {
      peer.removeEventListener("negotiationneeded", handleNegotiation);
    };
  }, [peer, handleNegotiation]);

  // 🟢 Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("user-joined", handleNewUserJoined);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
    socket.on("negotiation-offer", handleNegotiationOffer);
    socket.on("negotiation-answer", handleNegotiationAnswer);

    return () => {
      socket.off("user-joined", handleNewUserJoined);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("negotiation-offer", handleNegotiationOffer);
      socket.off("negotiation-answer", handleNegotiationAnswer);
    };
  }, [
    socket,
    handleNewUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegotiationOffer,
    handleNegotiationAnswer,
  ]);

  // 🟢 Get local media stream
  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setMyStream(stream);
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    };

    getMedia();
  }, []);

  return (
    <div className="flex flex-col mx-auto  text-white pb-5 w-full">
      <div>
        <p className="text-center">Live</p>
      </div>

      {/* stream */}
      <div className="flex flex-col justify-center mx-auto mt-[-5rem]">
        {myStream && <ReactPlayer url={myStream} playing muted width={230} className="" />}
        <div className="flex overflow-x-auto">
        {remoteStream && (
          <ReactPlayer url={remoteStream} playing muted={false} width={100} />
        )}
        </div>
      </div>

      {/* camera and mic button */}
      <div className="flex justify-center gap-4">
        <button
          onClick={toggleVideo}
          className="bg-white text-black rounded p-2 flex items-center gap-2"
        >
          {videoOn ? (
            <Video className="w-5 h-5" />
          ) : (
            <VideoOff className="w-5 h-5" />
          )}
          {videoOn ? "Video On" : "Video Off"}
        </button>

        <button
          onClick={toggleMic}
          className="bg-white text-black rounded p-2 flex items-center gap-2"
        >
          {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          {micOn ? "Mic On" : "Mic Off"}
        </button>
      </div>
    </div>
  );
};

export default LiveMeet;
