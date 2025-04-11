

import React, { useCallback, useEffect, useRef, useState } from "react";
import { initSocket } from "../../services/socket.js";
import { usePeer } from "../../providers/PeerProvider";
import { Video, Mic, MicOff, VideoOff } from "lucide-react";
import { useParams } from "react-router-dom";
import liveStream from "../../assets/Editor/live-stream.png";

const LiveMeet = () => {
  const [socket, setSocket] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [remoteEmailId, setRemoteEmailId] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const { roomId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const emailId = user?.email;

  const { peer, createOffer, createAnswer, setRemoteAns, addTrack } = usePeer();

  // ✅ 1. Initialize socket and join room
  useEffect(() => {
    const setupSocket = async () => {
      const newSocket = await initSocket();
      setSocket(newSocket);
      newSocket.emit("join-call", { roomId, emailId });
    };

    if (emailId && roomId) {
      setupSocket();
    }
  }, [emailId, roomId]);

  // ✅ 2. Get media stream
  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setMyStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Only add track if peer is available
        if (peer) {
          stream.getTracks().forEach((track) => {
            peer.addTrack(track, stream);
          });
        }
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    };

    getMedia();
  }, [peer]);

  // ✅ 3. Handle track event safely
  useEffect(() => {
    if (!peer) return;

    const handleTrackEvent = (event) => {
      const [remoteStream] = event.streams;
      setRemoteStream(remoteStream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };

    peer.addEventListener("track", handleTrackEvent);

    return () => {
      peer.removeEventListener("track", handleTrackEvent);
    };
  }, [peer]);

  // ✅ 4. Toggle mic
  const toggleMic = () => {
    if (myStream) {
      myStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setMicOn((prev) => !prev);
    }
  };

  // ✅ 5. Toggle video
  const toggleVideo = () => {
    if (myStream) {
      myStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setVideoOn((prev) => !prev);
    }
  };

  // ✅ 6. Socket handlers
  const handleNewUserJoined = useCallback(
    async ({ emailId }) => {
      if (!socket) return;
      setRemoteEmailId(emailId);
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
    },
    [createOffer, socket]
  );

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      if (!socket) return;
      setRemoteEmailId(from);
      const answer = await createAnswer(offer);
      socket.emit("call-accepted", { emailId: from, ans: answer });
    },
    [createAnswer, socket]
  );

  // 🟢 Handle answer after call
  const handleCallAccepted = useCallback(
    async ({ ans }) => {
      console.log("Call accepted with answer:", ans);
      await setRemoteAns(ans);
    },
    [setRemoteAns]
  );

  // 🟢 Handle negotiationneeded event from peer
  const handleNegotiation = useCallback(async () => {
    if (!remoteEmailId) return;
    console.log("🌀 Negotiation triggered");
    const offer = await createOffer();
    socket.emit("negotiation-offer", { emailId: remoteEmailId, offer });
  }, [createOffer, socket, remoteEmailId]);

  // 🟢 When receiving a negotiation offer
  const handleNegotiationOffer = useCallback(
    async ({ emailId, offer }) => {
      console.log("⚙️ Received negotiation offer");
      const ans = await createAnswer(offer);
      socket.emit("negotiation-answer", { emailId, ans });
    },
    [createAnswer, socket]
  );

  // 🟢 When receiving a negotiation answer
  const handleNegotiationAnswer = useCallback(
    async ({ ans }) => {
      console.log("📨 Received negotiation answer");
      await setRemoteAns(ans);
    },
    [setRemoteAns]
  );

  // 🟢 Add peer event listener
  useEffect(() => {
    if (!peer) return;

    peer.addEventListener("negotiationneeded", handleNegotiation);

    return () => {
      peer.removeEventListener("negotiationneeded", handleNegotiation);
    };
  }, [peer, handleNegotiation]);

  // ✅ 7. Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("joined-call", handleNewUserJoined);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
    socket.on("negotiation-offer", handleNegotiationOffer);
    socket.on("negotiation-answer", handleNegotiationAnswer);

    return () => {
      socket.off("joined-call", handleNewUserJoined);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("negotiation-offer", handleNegotiationOffer);
      socket.off("negotiation-answer", handleNegotiationAnswer);
    };
  }, [socket, handleNewUserJoined, handleIncomingCall, handleCallAccepted]);

  // ✅ 8. Clean up on unmount
  useEffect(() => {
    return () => {
      if (myStream) {
        myStream.getTracks().forEach((track) => track.stop());
      }

      if (peer && peer.close) {
        peer.close();
      }
    };
  }, [myStream, peer]);

  return (
    <div className="flex flex-col justify-between min-h-[20vh] mx-auto text-white pb-5">
      <div>
        <img src={liveStream} alt="Live Stream" className="w-[3rem] mx-auto" />
      </div>

      <div className="flex flex-col justify-center mx-auto gap-y-5">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          width="230"
          style={{ borderRadius: "8px", objectFit: "cover" }}
        />
        {remoteStream && (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            muted={false}
            width="230"
            style={{ borderRadius: "8px", objectFit: "cover" }}
          />
        )}
      </div>

      <div className="flex justify-center gap-4 mt-10">
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
