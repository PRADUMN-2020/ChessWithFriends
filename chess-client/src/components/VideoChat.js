import React, { useEffect, useRef, useState } from "react";
import socket from "../socketLogic";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
const Peer = window.SimplePeer; // import Simple Peer as Peer.

const VideoChat = ({ user, roomId }) => {
  // catch user and roomId props

  const [mute, setMute] = useState(false); // to store on/off mute
  const [cameraOff, setCameraOff] = useState(false); // to store on/off camera
  const peerRef = useRef(null); // to store the peer object
  const mediaStream = useRef(null); // to store the mediastream.
  const localStream = useRef(null); // to store the remote stream
  const remoteStream = useRef(null); // to store the local stream
  const userType = useRef(user);
  // const deleted = useRef(true); // to store weather the room is deleted

  function handleAudio() {
    // function to toogle the audio on and off
    const audio = mediaStream.current
      .getTracks()
      .find((track) => track.kind === "audio");
    if (audio.enabled) {
      audio.enabled = false;
      setMute(!mute);
    } else {
      audio.enabled = true;
      setMute(!mute);
    }
  }

  function handleVideo() {
    // function to toggle the video on and off
    const video = mediaStream.current
      .getTracks()
      .find((track) => track.kind === "video");
    if (video.enabled) {
      video.enabled = false;
      setCameraOff(!cameraOff);
    } else {
      video.enabled = true;
      setCameraOff(!cameraOff);
    }
  }

  useEffect(() => {
    userType.current = user;
  }, [user]);

  useEffect(() => {
    socket.on("started game", () => {
      // room created
      // deleted.current = false;
      // console.log("room created ", deleted.current);
    });
    // destroy the peer and clean media stream
    socket.on("delete peer", () => {
      // deleted.current = true; // room deleted
      // console.log("room deleted ", deleted.current);
      if (peerRef.current) {
        socket.off("signal");
        peerRef.current.destroy();
        peerRef.current = null;
      }
      console.log("idhar aya.");

      if (localStream.current) localStream.current.srcObject = null;

      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach((track) => track.stop());
      }
    });

    socket.on("show opponent disconnection", () => {
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
        socket.off("signal");
      }

      // if (localStream.current) localStream.current.srcObject = null;

      // if (mediaStream.current) {
      //   mediaStream.current.getTracks().forEach((track) => track.stop());
      // }

      if (userType.current === "host") {
        setTimeout(startChat, 4000); // keep it higher than starting time
      } else {
        startChat();
      }
    });

    function startChat() {
      navigator.mediaDevices // Get local video stream
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          console.log("the user is from start Chat", user);
          localStream.current.srcObject = stream; // set local stream
          mediaStream.current = stream; // store stream

          // Initialize SimplePeer object ans set it as initiator if the current client is host.
          //  1. Peer Created
          peerRef.current = new Peer({
            initiator: userType.current === "host",
            trickle: true,
            stream: stream,
          });

          // Handle signaling events (listenes to signal event by the local peer and send it other peer via the server)
          // 2. Emit the Peer's offer/answer data to the server.
          peerRef.current.on("signal", (data) => {
            socket.emit("signal", { data, roomId });
          });

          // listen to singal from the server that contains answer/offer data of the other peer and give it to the local peer using singal() method.
          //  3. Peer got answer.
          socket.on("signal", (data) => {
            if (peerRef.current) peerRef.current.signal(data);
          });

          // Handle stream events (listens to stream event of the other peer via the peer to peer connection established by the web rtc)
          // 4. Peer Connection created and stream started.
          peerRef.current.on("stream", (stream) => {
            remoteStream.current.srcObject = stream;
          });
        })
        .catch((error) => {
          console.error("Error accessing media devices:", error);
        });
    }

    setTimeout(startChat, 3000); // start the video chat, keep it lower than show opponent disconnection time, on line 92

    // Clean up resources on unmount
    return () => {
      if (mediaStream.current)
        // clear media stream
        mediaStream.current.getTracks().forEach((track) => track.stop());
      // if (peerRef.current) peerRef.current.destroy(); // destroy peer
      // if (!deleted.current) {
      //   socket.emit("quit", { rmId: roomId, user }); // if user leaves page emit quit
      // }
      socket.off("signal"); // switch off signal
      // socket.off("delete peer"); //switch off delete peer
    };
  }, [roomId]);

  return (
    <div className="video-chat container">
      <div className="row">
        <div className="col-lg-12 col-6">
          {/* remote client's video */}

          <video className="video" ref={remoteStream} autoPlay />
          <p className="player">Opponent</p>
        </div>
        <div className="col-lg-12 col-6">
          {/* local client's video */}

          <video className="video" ref={localStream} autoPlay muted />
          <p className="player">You</p>
        </div>
        <div className="chat-controls col-lg-12">
          <IconButton
            aria-label="mute"
            style={
              mute
                ? { margin: "0 5%", backgroundColor: "#f52c2c" }
                : { margin: "0 5%", background: "#5c5c5c" }
            }
            onClick={() => {
              handleAudio();
            }}
          >
            {mute ? (
              <MicOffIcon className="control-icon" style={{}} />
            ) : (
              <MicIcon className="control-icon" />
            )}
          </IconButton>

          <IconButton
            aria-label="camera off"
            style={
              cameraOff
                ? { margin: "0 5%", backgroundColor: "#f52c2c" }
                : { margin: "0 5%", background: "#5c5c5c" }
            }
            onClick={() => {
              handleVideo();
            }}
          >
            {cameraOff ? (
              <VideocamOffIcon className="control-icon" />
            ) : (
              <VideocamIcon className="control-icon" />
            )}
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default VideoChat;
