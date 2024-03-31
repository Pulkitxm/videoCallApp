import { Navigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import ReactPlayer from "react-player";
import peer from "../service/PeerService";

const Room = ({ redirected }) => {
  const { id } = useParams();
  const socket = useSocket();
  const [remoteSocketID, setRemoteSocketID] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const handleRoomJoin = useCallback((data) => {
    console.log("user joined this room", data);
    setRemoteSocketID(data.id);
  }, []);
  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const offer = await peer.getOffer();
    console.log(offer);
    socket.emit("call:user", { offer, to: remoteSocketID });

    setMyStream(stream);
  }, [remoteSocketID, socket]);
  const handleIncomingCall = useCallback(
    async (data) => {
      setRemoteSocketID(data.from);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMyStream(stream);
      console.log("incoming call", data);
      let ans = await peer.getAnswer(data.offer);
      socket.emit("call:accepted", { to: data.from, ans });
    },
    [socket]
  );
  const handleIncomingCallAccepeted = useCallback(
    async ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("call accepted", { from, ans });
      sendStream();
    },
    [myStream]
  );
  const sendStream= async() => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    for (const track of stream.getTracks()) {
      peer.peer.addTrack(track, stream);
    }
  };
  const negotiationneeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("user:nego:needde", { offer, to: remoteSocketID });
  }, [remoteSocketID, socket]);
  const handleNegoNeededIncoming = useCallback(
    async (data) => {
      let ans = await peer.getAnswer(data.offer);
      socket.emit("peer:nego:done", { to: data.from, ans });
    },
    [socket]
  );
  const handleNegoNeededFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleRoomJoin);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleIncomingCallAccepeted);
    socket.on("peer:nego:needed", handleNegoNeededIncoming);
    socket.on("peer:nego:final", handleNegoNeededFinal);
    return () => {
      socket.off("room:join", handleRoomJoin);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleIncomingCallAccepeted);
      socket.off("peer:nego:needed", handleNegoNeededIncoming);
      socket.off("peer:nego:final", handleNegoNeededFinal);
    };
  }, []);
  useEffect(() => {
    peer.peer.addEventListener("track", (event) => {
      setRemoteStream(event.streams[0]);
    });
  }, []);
  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", negotiationneeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", negotiationneeded);
    };
  }, [negotiationneeded, remoteSocketID, socket]);

  if (!redirected) {
    return <Navigate to="/" />;
  }
  return (
    <div>
      Room
      {remoteSocketID && (
        <>
          <h1>{remoteSocketID}</h1>
        </>
      )}
      {myStream && <button onClick={sendStream} >Send Strem</button>}
      <button onClick={handleCallUser}>Call</button>
      {myStream && (
        <>
          <p>My Stream</p>
          <ReactPlayer
            url={myStream}
            playing
            controls
            muted
            width={300}
            height={300}
          />
        </>
      )}
      {remoteStream && (
        <>
          <p>Remote Stream Stream</p>
          <ReactPlayer
            url={remoteStream}
            playing
            controls
            muted
            width={300}
            height={300}
          />
        </>
      )}
    </div>
  );
};

export default Room;
Room.propTypes = {
  redirected: PropTypes.bool,
};
