import React, { useState, useEffect, useRef } from "react";
import socket from "../socketLogic";
function Timer({ player, start, secs, handleMySecs }) {
  const [seconds, setSeconds] = useState(secs);
  const timeId = useRef(null);

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${min}:${secs < 10 ? "0" : ""}${secs}`;
  }

  useEffect(() => {
    // to update the seconds from the server.
    setSeconds(secs);
  }, [secs]);

  useEffect(() => {
    socket.on("delete peer", () => {
      if (timeId.current !== null) {
        clearInterval(timeId.current);
        timeId.current = null;
      }
    });
  }, []);

  useEffect(() => {
    // console.log("work hard.");
    // to handle start stop of chess clock.
    if (start && seconds > 0) {
      timeId.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          return prevSeconds - 1;
        });
      }, 1000);
    } else {
      if (timeId.current) {
        clearInterval(timeId.current);
        timeId.current = null;
      }
    }
    return () => {
      if (timeId.current !== null) {
        clearInterval(timeId.current);
        timeId.current = null;
      }
    };
  }, [start]);

  useEffect(() => {
    // console.log("updating your secs.", seconds);
    // delete the room when chess clock reaches 0.
    handleMySecs(seconds);
    if (seconds <= 0) {
      if (timeId.current) {
        clearInterval(timeId.current);
        timeId.current = null;
      }
      socket.emit("time expired");
    }
  }, [seconds]);

  return (
    <h1 style={{ position: "relative" }}>
      <span>{player}</span>
      <span style={{ position: "absolute", right: "0" }} className="timer">
        {formatTime(seconds)}
      </span>
    </h1>
  );
}

export default Timer;
