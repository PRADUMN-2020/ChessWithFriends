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
    setSeconds(secs);
  }, [secs]);

  useEffect(() => {
    if (start && seconds > 0) {
      timeId.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          return prevSeconds - 1;
        });
      }, 1000);
    } else {
      if (timeId.current !== null) {
        clearInterval(timeId.current);
        timeId.current = null;
      }
    }
    return () => {
      if (timeId.current) {
        clearInterval(timeId.current);
        timeId.current = null;
      }
    };
  }, [start]);

  useEffect(() => {
    console.log("updating your secs.", seconds);
    // handleMySecs(seconds);
    if (seconds <= 0) {
      socket.emit("time expired");
    }
    socket.on("delete peer", () => {
      if (timeId.current !== null) {
        clearInterval(timeId.current);
        timeId.current = null;
      }
    });
  }, [seconds]);

  return (
    <h1 style={{ position: "relative" }}>
      <span>{player}</span>
      <span style={{ position: "absolute", right: "0" }}>
        {formatTime(seconds)}
      </span>
    </h1>
  );
}

export default Timer;
