/*
Copyright 2023 PRADUMN

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
import { useNavigate } from "react-router-dom";
import socket from "../socketLogic";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import copy from "clipboard-copy";
import IconButton from "@mui/material/IconButton";
import HorizontalToggleBtn from "./HorizontalToggleBtn";
import CustomButton from "./CustomButton";
import Footer from "./Footer";
import ShareButtons from "./ShareButtons";

function InitiatorScreen({ handleUser }) {
  const [selectedColor, setSelectedColor] = useState("black");
  const clicked = useRef(false);
  const [gameUrl, setGameUrl] = useState("");
  const navigate = useNavigate();
  const roomId = useRef(""); // to store the give room Id.

  const Redirect = () => {
    navigate("/" + roomId.current); // Redirect to a specific game UI room
  };

  useEffect(() => {
    // when room is created set roomId and game url.
    socket.on("room created", (Id) => {
      roomId.current = Id;
      setGameUrl(process.env.REACT_APP_SERVER_URI + "/" + Id);
    });
    // to redirect the host to game ui once the guest joins
    socket.on("redirect host", () => {
      Redirect();
    });
    return () => {
      socket.off("room created");
      socket.off("redirect host");
    };
  }, []);

  // to set the user as host and order server to create a new room.

  function handleClick(event) {
    if (!clicked.current) {
      handleUser("host");
      const userId = localStorage.getItem("chessWithFriendsId");
      socket.emit("create room", { selectedColor, userId });
      clicked.current = true;
    }
  }
  // to handle the copy url
  function handleCopy() {
    copy(gameUrl);
  }
  // set the selected color.
  function handleChange(color) {
    setSelectedColor(color);
  }

  return (
    <div className="initiator container-fluid">
      <h1 className="branding pt-4 pb-1">
        {/* <img src="assets/pieces/queen.png" alt="logo" className="logo" /> */}
        Chess with Friends
      </h1>
      <h2 className="description">
        Generate game URL and share with friend to Start game
      </h2>

      <HorizontalToggleBtn
        handleChange={handleChange}
        selectedColor={selectedColor}
      />

      <CustomButton
        onClick={handleClick}
        text="Generate Game URL"
        // width="25%"
      />

      <div className="url">
        <input value={gameUrl} placeholder="Get Game URL here"></input>
        <IconButton aria-label="copy" onClick={handleCopy}>
          <ContentCopyIcon style={{ color: "white" }} />
        </IconButton>
      </div>

      {gameUrl && <ShareButtons gameUrl={gameUrl} />}
      <p className="waiting">
        {gameUrl && "Waiting for your Friend to join..."}
      </p>
      <Footer />
    </div>
  );
}

export default InitiatorScreen;
