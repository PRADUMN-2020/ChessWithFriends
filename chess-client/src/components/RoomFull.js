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
      <CustomButton text="Go to Home" onClick={handleClick} width="20%" />
    </div>
  );
}

export default RoomFull;
