import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socketLogic";
import VideoChat from "./VideoChat";
import ChessboardComponent from "./ChessboardComponent";
import QuitConfirmation from "./QuitConfirmation";
import QuitModal from "./QuitModal";
import VerdictModal from "./VerdictModal";
import InvalidRoomModal from "./InvalidRoomModal";
import CustomButton from "./CustomButton";

function GameUI({ user }) {
  // imported user from app to forward to ChessboardComp
  const navigate = useNavigate();
  const { id } = useParams(); // taken the Room id form the url parameter
  const [quitCnf, setQuitCnf] = useState(false); // to hold the state weather to show or not the quit confirmation modal
  const [quit, setQuit] = useState(false); // to hold weather to show or not quit modal
  const [showVerdict, setShowVerdict] = useState(false); // to hold weather to show or not verdict modal
  const [isRoomExpired, setIsRoomExpired] = useState(false); // to hold weather to show or not Invalid room modal
  const verdictRef = useRef(""); // to store the final verdict of game
  const roomId = useRef(id); // to store the rooId
  const looser = useRef(""); // to store who is looser colour

  const handleClose = () => setQuitCnf(false); // to close the quit confirmation modal

  function handleQuit() {
    // to close quit cnf modal and sed quit event to finally quit to game.
    handleClose();
    const rmId = roomId.current;
    socket.emit("quit", { rmId, user });
  }

  function onCloseQuit() {
    // to navigate to home when the quit modal is closed.
    setQuit(false);
    navigate("/");
  }

  function closeVerdict() {
    // to move home when the verdict modal is closed.
    setShowVerdict(false);
    navigate("/");
  }

  function closeRoomExpired() {
    // to navigate to home when when the Invalid room modal is closed.
    setIsRoomExpired(false);
    navigate("/");
  }

  useEffect(() => {
    // join cooresponding room if guest
    if (user === "guest") {
      socket.emit("join game", roomId.current);
    }
    // emit start game once both host and guest are redircted to game ui.
    if (user === "host") {
      socket.emit("start game", roomId);
    }
    // to show the room expired modal when room expired event comes.
    socket.on("room expired", () => {
      setIsRoomExpired(true);
    });

    // to show the quit modal when show quit modal event comes.
    socket.on("show quit modal", (lsr) => {
      looser.current = lsr;
      setQuit(true);
    });

    // to show the verdict when the verdict event comes.
    socket.on("verdict", (verdict) => {
      verdictRef.current = verdict;
      setShowVerdict(true);
    });
    return () => {
      socket.off("verdict");
      socket.off("show quit modal");
      socket.off("room expired");
    };
  }, []);

  return (
    <div
      className="container"
      style={{ width: "100%", height: "100%", padding: "0" }}
    >
      <div className="game-ui row">
        {/* pass the room id and user type to chessboard comp */}
        <ChessboardComponent user={user} roomId={roomId.current} />
        <div className="chat-section col-lg-6 px-lg-5 py-5">
          <div className="chat-content">
            {/* pass user type and room id to VideoChat comp */}

            <VideoChat user={user} roomId={roomId.current} />
            <CustomButton
              className="quit-btn"
              onClick={() => {
                // how quit confirmation modal once quit button is clicked.
                setQuitCnf(true);
              }}
              text="Quit"
              // width="40%"
            />
          </div>
        </div>
      </div>

      <QuitConfirmation
        open={quitCnf}
        onClose={handleClose}
        handleQuit={handleQuit}
      />

      <QuitModal open={quit} onClose={onCloseQuit} looser={looser.current} />

      <VerdictModal
        open={showVerdict}
        onClose={closeVerdict}
        verdict={verdictRef.current}
      />
      <InvalidRoomModal open={isRoomExpired} onClose={closeRoomExpired} />
    </div>
  );
}

export default GameUI;
