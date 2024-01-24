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
import CustomButton from "./CustomButton";
import Lottie from "lottie-react";
import Astronaut from "../assets/astronaut2.json";
import { useNavigate } from "react-router-dom";

function RoomFull() {
  const navigate = useNavigate();
  function handleClick() {
    // navigate to home
    navigate("/");
  }
  return (
    <div className="room-full">
      <div className="animation">
        {/* show animation */}
        <Lottie animationData={Astronaut} />
      </div>
      <p>Room is full, create new room url at home.</p>
      <CustomButton text="Go to Home" onClick={handleClick} 
      // width="20%"
       />
    </div>
  );
}

export default RoomFull;
