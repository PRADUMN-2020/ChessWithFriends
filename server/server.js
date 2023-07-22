const express = require("express");
const http = require("http");
const Server = require("socket.io");
const { Chess } = require("chess.js");
const { v4: uuidv4 } = require("uuid");
const { kMaxLength } = require("buffer");
require("dotenv").config();

const app = express(); // create express app
const server = http.createServer(app); // create http server using express app
const io = Server(server); // create socket io server using http server

function findKing(color, game) {
  // to give the position of king
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const square = String.fromCharCode(97 + file) + (rank + 1);
      const boardPiece = game.get(square);
      if (boardPiece && boardPiece.type === "k" && boardPiece.color === color) {
        return square;
      }
    }
  }
  return null;
}

const rooms = new Map();
const activePlayers = new Map();

// route to redirect guest to the created game room.

app.get("/:id", (req, res) => {
  const roomId = req.params.id;
  if (rooms.has(roomId) && !rooms.get(roomId).guest.id) {
    // if room with the given id exist and is not occuptied by any other guest the redirect guest to the game room
    const url = process.env.CLIENT_URI + "/" + roomId;
    res.redirect(url);
  } else {
    // if the room with given id is full redirect guest to the room full page
    const roomFull = process.env.CLIENT_URI + "/" + "full";
    res.redirect(roomFull);
  }
});

// test route

app.get("/", (req, res) => {
  res.send("server started");
});

// to handle a socket connection event

io.on("connection", (socket) => {
  // console.log("A user connected");
  // create a room when host emits create room with a selected color.
  socket.on("create room", ({ selectedColor, userId }) => {
    // console.log("create room");
    // console.log("host id", userId);
    const roomId = uuidv4(); // generate unique room Id
    const gameState = new Chess(); // create new instace of chess game
    // set the room data
    rooms.set(roomId, {
      host: {
        id: userId,
        socketId: socket.id,
        color: selectedColor,
        // active: true,
        timer: null,
        seconds: 600,
        lastMove: null,
      },
      guest: {
        id: "",
        socketId: "",
        color: selectedColor === "white" ? "black" : "white",
        // active: false,
        timer: null,
        seconds: 600,
        lastMove: null,
      },
      gameState: gameState,
    });

    // Join the room
    socket.join(roomId);
    // set as player with roomID
    activePlayers.set(socket.id, { roomId, user: "host" });

    // Emit room Created event to the host
    socket.emit("room created", roomId);
  });

  // handle join game event when a new guest joins

  function isValidUser(userId, roomId) {
    let room = rooms.get(roomId);
    let valid = room.host.id === userId || room.guest.id === userId;
    return valid;
  }

  socket.on("join game", ({ roomId, userId }) => {
    // if room exist and is not occupied by another guest then set guestId to the room data in rooms map.
    // console.log("guest id", userId);
    if (rooms.has(roomId)) {
      if (rooms.get(roomId).guest.id === "") {
        rooms.get(roomId).guest.id = userId;
        rooms.get(roomId).guest.socketId = socket.id;
        socket.join(roomId); // join room
        activePlayers.set(socket.id, { roomId, user: "guest" }); // set this guest as active player
        // emit event to redirect host to the corresponding game ui room
        socket.broadcast.to(roomId).emit("redirect host");
      } else if (isValidUser(userId, roomId)) {
        // to handle reconnection of players already in a game room.
        const room = rooms.get(roomId);
        const gameState = room.gameState;
        // console.log("from reconnect before ", rooms.get(roomId).host.timer);
        io.to(roomId).emit("reconnected");
        if (room.host.id === userId) {
          // if user is host then clear timer the timer for him as he has reconnected and set that he is host, update his socket id, join game room, set as active player, sent him his all the state to reconnect.
          const timerId = rooms.get(roomId).host.timer;
          clearTimeout(timerId);
          socket.emit("set host");

          rooms.get(roomId).host.timer = null;
          rooms.get(roomId).host.socketId = socket.id;
          socket.join(roomId); // join room
          activePlayers.set(socket.id, { roomId, user: "host" });

          const hostState = {
            color: room.host.color,
            gameState: room.gameState.fen(),
            hostSeconds: room.host.seconds,
            hostLastMove: room.host.lastMove,
            guestSeconds: room.guest.seconds,
            guestLastMove: room.guest.lastMove,
            turn: gameState.turn(),
            user: activePlayers.get(socket.id).user,
          };
          // console.log("reached host");
          socket.emit("started game", hostState);
        } else {
          // if user is guest then clear timer the timer for guest as he has reconnected and set that he is guest, update his socket id, join game room, set as active player, sent him his all the state to reconnect.
          const timerId = rooms.get(roomId).guest.timer;
          clearTimeout(timerId);
          rooms.get(roomId).guest.timer = null;
          rooms.get(roomId).guest.socketId = socket.id;
          socket.join(roomId); // join room
          activePlayers.set(socket.id, { roomId, user: "guest" });
          const guestState = {
            color: room.guest.color,
            gameState: room.gameState.fen(),
            hostSeconds: room.host.seconds,
            hostLastMove: room.host.lastMove,
            guestSeconds: room.guest.seconds,
            guestLastMove: room.guest.lastMove,
            turn: gameState.turn(),
            user: activePlayers.get(socket.id).user,
          };
          // console.log("reached guest");
          socket.emit("started game", guestState);
        }
        // console.log("from reconnect after", rooms.get(roomId).host.timer);
      } else {
        // if room is occupied by another guest emit room expired
        socket.emit("room expired");
      }
    } else {
      // when there is no room with given id then set it as expired
      socket.emit("room expired");
    }
  });

  // when start game event comes then send the initial game state to both guest and host in a room.

  socket.on("start game", (roomId) => {
    // fetch the game state data from the room
    const date = new Date().getTime();
    // console.log(date);
    rooms.get(roomId).host.lastMove = date;
    rooms.get(roomId).guest.lastMove = date;
    const host = rooms.get(roomId).host;
    const guest = rooms.get(roomId).guest;
    const gameState = rooms.get(roomId).gameState;
    const fen = gameState.fen();
    // set hostState
    const hostState = {
      color: host.color,
      gameState: fen,
      hostSeconds: host.seconds,
      hostLastMove: host.lastMove,
      guestSeconds: guest.seconds,
      guestLastMove: guest.lastMove,
      turn: gameState.turn(),
      user: activePlayers.get(socket.id).user,
    };
    // set guestState
    const guestState = {
      color: guest.color,
      gameState: fen,
      hostSeconds: host.seconds,
      hostLastMove: host.lastMove,
      guestSeconds: guest.seconds,
      guestLastMove: guest.lastMove,
      turn: gameState.turn(),
      user: activePlayers.get(socket.id).user,
    };
    // console.log("hostState", hostState);
    // console.log("guestState", guestState);
    // emit guest and host inital states respectively.
    socket.broadcast.to(roomId).emit("started game", guestState);
    socket.emit("started game", hostState);
  });

  //when square data event comes (when a square is selected) then fetch all the data of the square and send it to the corresponding client who emits the event.

  socket.on("square data", ({ square, roomId }) => {
    const room = rooms.get(roomId); // get the socket room
    const game = room.gameState; // get game state from the room
    const possibleMoves = game.moves({ square, verbose: true }); // get the possible moves of a selected piece (if piece is selected)
    const piece = game.get(square); // get the piece if selected
    const turn = game.turn(); // get who's turn
    const newStyles = {}; // to store the styles of squares which are possible moves.
    const isCheck = game.inCheck(); // check if check.
    possibleMoves.map((move) => {
      // generate styles for the possible move squares.
      newStyles[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });

    // hightlight the selected piece square
    newStyles[square] = {
      background: "#b6d91a",
    };
    // emit the square data
    socket.emit("square data", {
      piece: piece,
      moves: possibleMoves,
      turn: turn,
      styles: newStyles,
      square: square,
      isCheck: isCheck,
    });
  });

  // when move event comes (when a client moves) update the move on the game state.

  socket.on("move", ({ move, roomId, userId, lastMove, seconds }) => {
    rooms.get(roomId).gameState.move(move);
    // set the secs and last move (time stamp) for the respective client at which he moves.
    // console.log("from move", lastMove, seconds);
    if (activePlayers.get(socket.id).user === "host") {
      rooms.get(roomId).host.seconds = seconds;
      rooms.get(roomId).host.lastMove = lastMove;
    } else {
      rooms.get(roomId).guest.seconds = seconds;
      rooms.get(roomId).guest.lastMove = lastMove;
    }
    // console.log(activePlayers.get(socket.id).user, seconds, lastMove);
    // console.log("updated room", rooms.get(roomId));
    const game = rooms.get(roomId).gameState; // get updated game state
    let isCheck = false;
    let checkStyles = {};
    let moveStyle = {
      // set styles to high light the piece move
      [move.from]: { background: "#4de35a" },
      [move.to]: { background: "#b6d91a" },
    };

    const turn = game.turn(); // get who's turn

    let verdict = ""; // to store the game verdict
    if (game.inCheck() || game.isCheckmate()) {
      // if the game is in check or checkmate ste check styles
      isCheck = true;
      checkStyles = {
        [findKing(turn, game)]: { background: "#eb4034" },
      };
      if (game.isGameOver()) {
        // if game over by check mate then set verdict
        if (game.isCheckmate()) {
          if (turn === "w") {
            verdict = "0 - 1 White Checkmate Black Wins";
          } else {
            verdict = "1 - 0 Black Checkmate White Wins";
          }
        } else if (game.isDraw()) {
          if (game.isInsufficientMaterial())
            verdict = "1/2 - 1/2 Draw, Insufficient Material";
          else verdict = "1/2 - 1/2 Draw, 50 move rule";
        } else if (game.isStalemate()) {
          verdict = "1/2 - 1/2 Draw, Stale Mate";
        } else if (game.isThreefoldRepetition()) {
          verdict = "1/2 - 1/2 Draw, Threefold Repetition";
        } else {
          verdict = "1/2 - 1/2 Draw";
        }
      }
    }

    // boradcast game state to the corresponding room
    io.to(roomId).emit("state", {
      state: game.fen(),
      isCheck: isCheck,
      checkStyles: checkStyles,
      moveStyle: moveStyle,
      turn: turn,
    });
    // if game over then emit verdict and delete the correspoinding game room.
    if (game.isGameOver() && rooms.has(roomId)) {
      io.to(roomId).emit("verdict", verdict);
      if (activePlayers.has(socket.id)) {
        deleteRoom(socket.id);
        console.log(rooms);
        console.log(activePlayers);
      }
    }
  });

  // function to delete the inactive players and room.
  function deleteRoom(socketID) {
    const roomId = activePlayers.get(socketID).roomId;
    if (rooms.get(roomId).guest.id) {
      io.to(roomId).emit("delete peer");
      const guestSocket = rooms.get(roomId).guest.socketId;
      activePlayers.delete(guestSocket);
    } // emit to destroy the socket io peer.
    const hostSocket = rooms.get(roomId).host.socketId;
    activePlayers.delete(hostSocket);
    rooms.delete(roomId);
    console.log(rooms);
    console.log(activePlayers);
  }

  // listen to disconnect event when someone closes the tab or reloads and show the  quitter(looser) and delete the room and inactive players.

  // socket.on("disconnect", () => {
  //   console.log("socket disconnected");
  //   if (rooms.get(activePlayers.get(socket.id))) {
  //     const roomId = activePlayers.get(socket.id);
  //     const hostId = rooms.get(roomId).host.id;
  //     let looser =
  //       hostId === socket.id
  //         ? rooms.get(roomId).host.color
  //         : rooms.get(roomId).guest.color;
  //     if (looser === "white") looser = "White";
  //     else looser = "Black";
  //     io.to(roomId).emit("show quit modal", looser);
  //     deleteRoom(socket.id);
  //   }
  // });

  // fucntion to handle when a user disconnected and did not join after 30 sec of disconnection.

  function userDisconnected(userSocketId) {
    // send the disconnect player as looser and delete the game room.
    if (activePlayers.has(userSocketId)) {
      const roomId = activePlayers.get(userSocketId).roomId;
      const hostSocket = rooms.get(roomId).host.socketId;
      let looser =
        hostSocket === userSocketId
          ? rooms.get(roomId).host.color
          : rooms.get(roomId).guest.color;
      if (looser === "white") looser = "White";
      else looser = "Black";
      io.to(roomId).emit("show quit modal", looser);
      deleteRoom(userSocketId);
    }
  }

  // new disconnect
  socket.on("disconnect", () => {
    // console.log("socket disconnected");
    const userSocketId = socket.id;
    if (activePlayers.has(userSocketId)) {
      const activePlayer = activePlayers.get(userSocketId);
      const roomId = activePlayer.roomId;
      const room = rooms.get(roomId);
      const hostSocket = room.host.socketId;
      const opponentSocket =
        hostSocket === userSocketId ? room.guest.socketId : hostSocket;
      if (room.host.id && room.guest.id) {
        // if room is full then show user that his opponent disconnected.
        io.to(opponentSocket).emit("show opponent disconnection");
        rooms.get(activePlayer.roomId)[activePlayer.user].timer = setTimeout(
          () => {
            // If the user didn't reconnect, delete the game room and end the game
            userDisconnected(userSocketId);
          },
          30000
        );
      } else {
        // delete room if the room has only one
        deleteRoom(socket.id);
      }
    }
  });

  // listen to quit event when a client chosses to quit and emit the quitter(looser) and finally delete the room and inactive players.

  socket.on("quit", ({ rmId, user }) => {
    // console.log(user + " quits.");
    let looser = rooms.get(rmId)[user].color;
    if (looser === "white") looser = "White";
    else looser = "Black";
    io.to(rmId).emit("show quit modal", looser);
    deleteRoom(socket.id);
  });

  // to handle timer expiration.

  socket.on("time expired", () => {
    if (activePlayers.has(socket.id)) {
      const looserSocketId = socket.id;
      const roomId = activePlayers.get(looserSocketId).roomId;
      const looser = activePlayers.get(looserSocketId).user;
      const looserColor = rooms.get(roomId)[looser].color;
      let verdict =
        looserColor !== "white"
          ? "1 - 0 Black Timeout White Wins"
          : "0 - 1 White Timeout Black Wins";
      io.to(roomId).emit("verdict", verdict);
      deleteRoom(looserSocketId);
    }
  });

  // for handling the videochat intial signalling(before establishing a peer to peer connection).
  socket.on("signal", ({ data, roomId }) => {
    // Broadcast signaling data to appropriate recipient
    console.log(data);
    socket.broadcast.to(roomId).emit("signal", data);
  });
});

const port = process.env.PORT || 3001;

// listen to the port
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
