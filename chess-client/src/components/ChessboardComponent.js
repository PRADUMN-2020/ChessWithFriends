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
import { Chessboard } from "react-chessboard";
import socket from "../socketLogic";
import moveSound from "../assets/ChessMove.mp3";
import PromotionModal from "./PromotionModal";
import Timer from "./Timer";

// chess pices can be customised

// const pieceTheme = {
//   bP: ({ piece }) => <img src="/assets/pieces/p_b.png" alt={piece} />,
//   bR: ({ piece }) => <img src="/assets/pieces/r_b.png" alt={piece} />,
//   bK: ({ piece }) => <img src="/assets/pieces/k_b.png" alt={piece} />,
//   bQ: ({ piece }) => <img src="/assets/pieces/q_b.png" alt={piece} />,
//   bB: ({ piece }) => <img src="/assets/pieces/b_b.png" alt={piece} />,
//   bN: ({ piece }) => <img src="/assets/pieces/n_b.png" alt={piece} />,
//   wP: ({ piece }) => <img src="/assets/pieces/p_w.png" alt={piece} />,
//   wR: ({ piece }) => <img src="/assets/pieces/r_w.png" alt={piece} />,
//   wK: ({ piece }) => <img src="/assets/pieces/k_w.png" alt={piece} />,
//   wQ: ({ piece }) => <img src="/assets/pieces/q_w.png" alt={piece} />,
//   wB: ({ piece }) => <img src="/assets/pieces/b_w.png" alt={piece} />,
//   wN: ({ piece }) => <img src="/assets/pieces/n_w.png" alt={piece} />,
// };

let promotionMove; // to store selected promotion.
const ChessboardComponent = ({ roomId, user }) => {
  const [game, setGame] = useState({}); // to store the game state.
  const [selectedPiece, setSelectedPiece] = useState(null); // to store the selected piece's square.
  const [validPlaceStyles, setValidPlaceStyles] = useState({}); // to store styles of the valid places for a selected piece.
  const [validMoves, setValidMoves] = useState({}); // to store the valid moves for a selcted piece.
  const [playerColor, setPlayerColor] = useState(""); // to store this clients color.
  const [squareData, setSquareData] = useState({}); // to store the Data of the clicked square as received from the server.
  const [checkStyle, setCheckStyle] = useState({}); // to store the style for when it is check.
  const [promotionOpen, setPromotionOpen] = useState(false); // weather or not to show promotion modal
  const [countdown, setCountdown] = useState(30); // to store countown to delete game room when another player disconnects.
  const [showTimer, setShowTimer] = useState(false); // weather or not to show the countdown for game room end.
  const [opponentTime, setOpponentTime] = useState(false); // set the start and stop of opponent chess clock.
  const [yourTime, setYourTime] = useState(false); // set the start and stop of your chess clock.
  const [yourSecs, setYourSecs] = useState(600); // to store the seconds left with this client
  const [opponentSecs, setOpponentSecs] = useState(600); // to store the seconds left with opponent.
  const latestSecs = useRef(600); // to store most recent secends left for this client.
  const disconnector = useRef(null); // to store who disconnected.
  const intervalId = useRef(null); // to store the interval id to the game end when opponent disconnects.
  const color = useRef(null); // to store this player's color.
  const userId = localStorage.getItem("chessWithFriendsId"); // to store this user's local stored user id (main id of the user.)
  const audio = new Audio(moveSound);

  function isPromotion(move) {
    // to return weather the promotion is possible for the given move.
    let ans = false;
    if (move.piece === "p") {
      if (move.color === "w") {
        if (move.from[1] === "7" && move.to[1] === "8") {
          ans = true;
        }
      } else {
        if (move.from[1] === "2" && move.to[1] === "1") {
          ans = true;
        }
      }
    }
    return ans;
  }

  function handleMySecs(sec) {
    latestSecs.current = sec;
  }

  function handleOpponentSecs(sec) {
    // setOpponentSecs(sec);
  }

  const handlePromotionClose = () => {
    // to close the promotion modal.
    setPromotionOpen(false);
  };

  function emitMove(move) {
    // emit the move event with the move data and roomId
    const date = new Date().getTime();
    socket.emit("move", {
      move: move,
      roomId: roomId,
      userId,
      lastMove: date,
      seconds: latestSecs.current,
    });
  }

  function promote(option) {
    // to set the promotion selected to promotioMove object and emit move
    promotionMove.promotion = option;
    emitMove(promotionMove);
  }

  function getSquareData(square) {
    // to fetch the data for the selected square form the server
    socket.emit("square data", { square: square, roomId });
  }

  useEffect(() => {
    // to run the countdown for ending game room when opponent disconnects.
    if (showTimer) {
      intervalId.current = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [showTimer]);

  useEffect(() => {
    // to remove the countdown if opponent reconnects.
    socket.on("reconnected", () => {
      setShowTimer(false);
      clearTimeout(intervalId.current);
      intervalId.current = null;
      disconnector.current = null;
      setCountdown(30);
    });
    // catch the player colors and game state given by server.
    socket.on("started game", (player) => {
      // console.log("1) started game", player);
      setPlayerColor(player.color);
      color.current = player.color;
      setGame(player.gameState);
      // chess clock logic to set the remaining seconds for the both players.
      const date = new Date().getTime();
      // console.log(date);
      if (player.turn === player.color[0]) {
        // console.log("2) you color match with turn");
        setYourSecs(() => {
          const secs =
            player.user === "host"
              ? player.hostSeconds -
                Math.floor((date - player.guestLastMove) / 1000)
              : player.guestSeconds -
                Math.floor((date - player.hostLastMove) / 1000);
          // console.log("your secs", secs);
          return secs;
        });
        setOpponentSecs(() => {
          const secs =
            player.user === "host" ? player.guestSeconds : player.hostSeconds;
          // console.log("opponenet secs", secs);
          return secs;
        });
      } else {
        // console.log("2) your color dont match with turn");
        setYourSecs(() => {
          const secs =
            player.user === "host" ? player.hostSeconds : player.guestSeconds;
          // console.log("your secs", secs);
          return secs;
        });
        setOpponentSecs(() => {
          const secs =
            player.user === "host"
              ? player.guestSeconds -
                Math.floor((date - player.hostLastMove) / 1000)
              : player.hostSeconds -
                Math.floor((date - player.guestLastMove) / 1000);
          // console.log("opponenet secs", secs);
          return secs;
        });
      }
      if (player.turn === player.color[0]) {
        // console.log("started white.");
        setYourTime(true);
      } else {
        setOpponentTime(true);
      }
    });
    // on getting the selected square data
    socket.on("square data", (Data) => {
      setSquareData(Data);
    });

    // catch the state of the game after a move by any client
    socket.on("state", (fen) => {
      // console.log("fen", fen);
      // console.log("player color", playerColor[0]);
      // chess clock logic to start and stop clock.
      if (fen.turn !== color.current[0]) {
        // console.log("mismatch");
        setYourTime(false);
        setOpponentTime(true);
      } else {
        // console.log("match");
        setOpponentTime(false);
        setYourTime(true);
      }

      setGame(fen.state); // set game state
      // set move styles
      if (fen.isCheck) {
        // set check styles if check
        setCheckStyle(fen.checkStyles);
        setValidPlaceStyles(() => {
          return { ...fen.checkStyles, ...fen.moveStyle };
        });
      } else {
        setValidPlaceStyles({ ...fen.moveStyle });
      }

      audio.play(); // play the audio
    });

    socket.on("show opponent disconnection", () => {
      // to handle opponent disconnection
      disconnector.current = "opponent";
      setShowTimer(true);
      // console.log("opponent disconnected");
    });

    socket.on("disconnect", () => {
      disconnector.current = "self";
      setShowTimer(true);
    });

    return () => {
      socket.off("started game");
      socket.off("square data");
      socket.off("state");
    };
  }, []);

  useEffect(() => {
    // only if we get the new square data (on a square click) and it is this client's turn execute
    if (squareData.turn === (playerColor === "white" ? "w" : "b")) {
      const piece = squareData.piece; // set piece from the square Data.
      const possibleMoves = squareData.moves; // set possible moves from the square Data.
      if (selectedPiece === squareData.square) {
        // if a perticuar piece is selected again (means deselcted)
        setSelectedPiece(null); // there is no selected piece
        setValidMoves({}); // there will be no valid moves.
        if (squareData.isCheck) {
          // if the square piece is in check then add check style else no styles.
          setValidPlaceStyles({ ...checkStyle });
        } else {
          setValidPlaceStyles({});
        }
      } else if (piece && piece.color === squareData.turn) {
        // if the clicked square is a piece then
        setSelectedPiece(squareData.square); // set this piece square to the selctedSquare.
        setValidMoves(possibleMoves); // set valid moves.
        if (squareData.isCheck) {
          // add styles for possible moves and check( if possible)
          setValidPlaceStyles({ ...checkStyle, ...squareData.styles });
        } else {
          setValidPlaceStyles({ ...squareData.styles });
        }
      } else if (selectedPiece) {
        // if the player clicks on a square check if it is a possible more for the selected piece.
        const move = validMoves.find((move) => move.to === squareData.square);
        if (move) {
          // if move is valid
          if (isPromotion(move)) {
            // check is promotion possible for the move
            promotionMove = move; // if possible set the move to promotiomMove
            setPromotionOpen(true); // show promotion modal.
          } else {
            emitMove(move); // else just emit the move to server.
          }
          setSelectedPiece(null); // set that there is no selected piece.
          setValidMoves({}); // and it dont have any valid moves.
        }
      }
    }
  }, [squareData]);

  return (
    <div className="board col-lg-6 px-lg-5">
      {/* to show the plays color */}
      <p className="show-user-disconnected">
        {countdown > 0 &&
          showTimer &&
          (disconnector.current === "self"
            ? "You are disconnected, Please reload to countinue, Game ends in " +
              countdown +
              " secs."
            : disconnector.current.toUpperCase() +
              " disconnected, Game ends in " +
              countdown +
              " secs.")}
      </p>
      <Timer
        player="Opponent"
        start={opponentTime}
        secs={opponentSecs}
        handleMySecs={handleOpponentSecs}
      />

      <Chessboard
        position={game}
        onSquareClick={(square) => {
          // on square click fetch the selected square data from the server and execute the use Effect callback.
          getSquareData(square);
        }}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 5px 15px black",
          fontFamily: "Montserrat",
        }}
        customDarkSquareStyle={{
          backgroundColor: " #649950",
        }}
        customLightSquareStyle={{ backgroundColor: "#e7edd1" }}
        // customPieces={pieceTheme}

        customSquareStyles={{ ...validPlaceStyles }}
        arePiecesDraggable={false}
        boardOrientation={playerColor}
        sparePieces={true}
      />
      <Timer
        player="You"
        start={yourTime}
        secs={yourSecs}
        handleMySecs={handleMySecs}
      />
      <PromotionModal
        open={promotionOpen}
        onClose={handlePromotionClose}
        promote={promote}
      />
    </div>
  );
};

export default ChessboardComponent;
