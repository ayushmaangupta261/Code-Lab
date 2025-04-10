import React, {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
  } from "react";
  
  const PeerContext = createContext(null);
  
  export const usePeer = () => {
    return React.useContext(PeerContext);
  };
  
  export const PeerProvider = (props) => {
    const [remoteStream, setRemoteStream] = useState(null);
    
    const peer = useMemo(
      () =>
        new RTCPeerConnection({
          iceServers: [
            {
              urls: [
                "stun:stun.l.google.com:19302",
                "stun:global.stun.twilio.com:3478",
              ],
            },
          ],
        }),
      []
    );
  
    // create offer
    const createOffer = async () => {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      // props.setLocalDescription(offer);
      return offer;
    };
  
    // create answer
    const createAnswer = async (offer) => {
      await peer.setRemoteDescription(offer);
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      // props.setLocalDescription(answer);
      return answer;
    };
  
    //set remote answer
    const setRemoteAns = async (ans) => {
      await peer.setRemoteDescription(ans);
    };
  
    // send stream
    // const sendStream = async (stream) => {
    //   const tracks = stream.getTracks();
    //   for (const track of tracks) {
    //     peer.addTrack(track, stream);
    //   }
    // };
  
    const sendStream = async (stream) => {
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
    };
  
    const handleTrackEvent = useCallback((ev) => {
      const streams = ev.streams;
      setRemoteStream(streams[0]);
    });
  
    
  
    useEffect(() => {
      peer.addEventListener("track", handleTrackEvent);
  
      return () => {
        peer.removeEventListener("track", handleTrackEvent);
        peer.removeEventListener("negotiationneeded", handleNegotiation);
      };
    }, [peer, handleTrackEvent]);
  
    return (
      <PeerContext.Provider
        value={{
          peer,
          createOffer,
          createAnswer,
          setRemoteAns,
          sendStream,
          remoteStream,
        }}
      >
        {props.children}
      </PeerContext.Provider>
    );
  };
  