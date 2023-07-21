import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App";
import { v4 as uuidv4 } from "uuid";

const generateUniqueID = () => {
  return uuidv4();
};

const userId = localStorage.getItem("chessWithFriendsId");

// Generate a new unique ID if it doesn't exist
if (!userId) {
  const newId = generateUniqueID();

  // Store the new unique ID in local storage
  localStorage.setItem("chessWithFriendsId", newId);
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<App />);
