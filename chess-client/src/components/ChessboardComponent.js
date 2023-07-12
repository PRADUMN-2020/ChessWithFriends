import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import socket from "../socketLogic";
import moveSound from "../assets/ChessMove.mp3";
import PromotionModal from "./PromotionModal";

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

  const handlePromotionClose = () => {
    // to close the promotion modal.
    setPromotionOpen(false);
  };
  function emitMove(move) {
    // emit the move event with the move data and roomId
    socket.emit("move", { move: move, roomId: roomId });
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
    // catch the player colors and game state given by server.
    socket.on("started game", (player) => {
      setPlayerColor(player.color);
      setGame(player.gameState);
    });
    // on getting the selected square data
    socket.on("square data", (Data) => {
      setSquareData(Data);
    });

    // catch the state of the game after a move by any client
    socket.on("state", (fen) => {
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

      const audio = new Audio(moveSound); // play the audio
      audio.play();
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
      <h1>Your Color: {playerColor === "white" ? "White" : "Black"}</h1>
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
      <PromotionModal
        open={promotionOpen}
        onClose={handlePromotionClose}
        promote={promote}
      />
    </div>
  );
};

export default ChessboardComponent;
