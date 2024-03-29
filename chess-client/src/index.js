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
