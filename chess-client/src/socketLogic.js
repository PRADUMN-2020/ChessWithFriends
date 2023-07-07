import io from "socket.io-client";
const socket = io(process.env.REACT_APP_SERVER_URI, {
  transports: ["websocket"],
  upgrade: false,
  debug: true,
});
export default socket;
