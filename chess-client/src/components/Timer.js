/*
Copyright 2024 PRADUMN

Chess With Friends is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Chess With Friends is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with Chess With Friends. If not, see <https://www.gnu.org/licenses/>.
*/
import React, { useState, useEffect, useRef } from "react";
import socket from "../socketLogic";
function Timer({ player, start, secs, handleMySecs }) {
  const timeId = useRef(null);
  const [seconds, setSeconds] = useState(secs);

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
      socket.emit("time expired", player);
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
