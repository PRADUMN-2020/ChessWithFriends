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
  const [localStream, setLocalStream] = useState(null); // to store the local stream
  const [remoteStream, setRemoteStream] = useState(null); // to store the remote stream
  const [mute, setMute] = useState(false); // to store on/off mute
  const [cameraOff, setCameraOff] = useState(false); // to store on/off camera
  const peerRef = useRef(null); // to store the peer object
  const mediaStream = useRef(null); // to store the mediastream.

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
    // function to toogle the video on and off
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
    // destroy the peer and clean media stream
    socket.on("delete peer", () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      setLocalStream(null);
      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach((track) => track.stop());
      }
      setRemoteStream(null);
    });

    function startChat() {
      // Get local video stream

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setLocalStream(stream); // set local stream
          mediaStream.current = stream; // store stream

          // Initialize SimplePeer object ans set it as initiator if the current client is host.
          //  1. Peer Created
          peerRef.current = new Peer({
            initiator: user === "host",
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
            setRemoteStream(stream);
          });
        })
        .catch((error) => {
          console.error("Error accessing media devices:", error);
        });
    }

    startChat(); // start the video chat

    // Clean up resources on unmount
    return () => {
      if (mediaStream.current)
        // clear media stream
        mediaStream.current.getTracks().forEach((track) => track.stop());
      if (localStream) {
        setRemoteStream(null);
      }
      if (remoteStream) {
        setRemoteStream(null);
      }

      if (peerRef.current) peerRef.current.destroy(); // destroy peer

      socket.off("signal"); // switch off sinal
    };
  }, [roomId]);

  const chatControlsStyle = {};

  return (
    <div className="video-chat">
      {/* remote client's video */}
      <video ref={(ref) => ref && (ref.srcObject = remoteStream)} autoPlay />
      <p className="player">Opponent</p>

      {/* local client's video */}
      <video
        ref={(ref) => ref && (ref.srcObject = localStream)}
        autoPlay
        muted
      />
      <p className="player">You</p>
      <div className="chat-controls">
        <IconButton
          aria-label="mute"
          onClick={() => {
            handleAudio();
          }}
        >
          {mute ? (
            <MicOffIcon
              className="control-icon"
              style={{
                background: "#f52c2c",
              }}
            />
          ) : (
            <MicIcon
              className="control-icon"
              style={{
                background: "#5c5c5c",
              }}
            />
          )}
        </IconButton>

        <IconButton
          aria-label="camera off"
          onClick={() => {
            handleVideo();
          }}
        >
          {cameraOff ? (
            <VideocamOffIcon
              className="control-icon"
              style={{
                background: "#f52c2c",
              }}
            />
          ) : (
            <VideocamIcon
              className="control-icon"
              style={{
                background: "#5c5c5c",
              }}
            />
          )}
        </IconButton>
      </div>
    </div>
  );
};

export default VideoChat;
