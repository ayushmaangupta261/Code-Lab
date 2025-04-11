
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const PeerContext = createContext(null);

export const usePeer = () => {
  return useContext(PeerContext);
};

export const PeerProvider = ({ children }) => {
  const [remoteStream, setRemoteStream] = useState(null);
  const peerRef = useRef(null);
  const myStreamRef = useRef(null);

  const createPeer = useCallback(() => {
    const newPeer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
      ],
    });

    newPeer.addEventListener("track", (event) => {
      const incomingStream = new MediaStream();
      incomingStream.addTrack(event.track);
      setRemoteStream(incomingStream);
      console.log("🎥 Received remote track:", event.track);
    });

    newPeer.addEventListener("iceconnectionstatechange", () => {
      console.log("ICE State:", newPeer.iceConnectionState);
      if (newPeer.iceConnectionState === "disconnected") {
        newPeer.close();
        peerRef.current = null;
        console.warn("Peer disconnected and closed.");
      }
    });

    // peer.addEventListener("signalingstatechange", () => {
    //   console.log("🔁 Signaling state changed:", peer.signalingState);
    // });

    return newPeer;
  }, []);

  useEffect(() => {
    peerRef.current = createPeer();

    return () => {
      if (myStreamRef.current) {
        myStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (peerRef.current) {
        peerRef.current.close();
        peerRef.current = null;
      }

      console.log("🧹 Cleaned up peer connection");
    };
  }, [createPeer]);

  const createOffer = async () => {
    const peer = peerRef.current;
    if (!peer || peer.signalingState === "closed") {
      console.warn("Peer connection is closed. Cannot create offer.");
      return null;
    }

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    console.log("📤 Created Offer:", offer);
    return offer;
  };

  const createAnswer = async (offer) => {
    const peer = peerRef.current;
    if (!peer) return null;

    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    console.log("📤 Created Answer:", answer);
    return answer;
  };

  // const setRemoteAns = async (ans) => {
  //   const peer = peerRef.current;
  //   if (!peer) return;

  //   const currentRemote = peer.remoteDescription;
  //   if (currentRemote) {
  //     console.log("🛑 Remote description already set. Skipping. -> ",ans);
  //     return;
  //   }

  //   try {
  //     await peer.setRemoteDescription(new RTCSessionDescription(ans));
  //     console.log("✅ Remote description successfully set");
  //   } catch (err) {
  //     console.error("❌ Failed to set remote description:", err);
  //   }
  // };


  const setRemoteAns = async (ans) => {
    const peer = peerRef.current;
    if (!peer) return;
  
    const currentRemote = peer.remoteDescription;
  
    // If remoteDescription is already set
    if (currentRemote) {
      if (currentRemote.type === ans.type && currentRemote.sdp === ans.sdp) {
        console.warn("🛑 Remote description already set. Skipping.");
      } else {
        console.warn("⚠️ Remote description already set to something else. Aborting.");
      }
      return;
    }
  
    try {
      await peer.setRemoteDescription(new RTCSessionDescription(ans));
      console.log("✅ Remote description set:", ans);
    } catch (err) {
      console.error("❌ Error setting remote description:", err);
    }
  };
  
  


  const sendStream = async (stream) => {
    const peer = peerRef.current;
    if (!peer) return;

    myStreamRef.current = stream;

    const existingSenders = peer.getSenders();
    const tracks = stream.getTracks();

    for (const track of tracks) {
      const alreadyAdded = existingSenders.find(
        (sender) => sender.track && sender.track.id === track.id
      );
      if (!alreadyAdded) {
        peer.addTrack(track, stream);
      }
    }

    console.log("✅ Sent local stream:", stream);
  };

  const peerContextValue = useMemo(
    () => ({
      peer: peerRef.current,
      createOffer,
      createAnswer,
      setRemoteAns,
      sendStream,
      remoteStream,
      setRemoteStream,
    }),
    [remoteStream]
  );

  return (
    <PeerContext.Provider value={peerContextValue}>
      {children}
    </PeerContext.Provider>
  );
};
