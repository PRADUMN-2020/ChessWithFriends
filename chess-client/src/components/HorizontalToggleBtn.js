import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function HorizontalToggleBtn({ selectedColor, handleChange }) {
  const change = (event, nextColor) => {
    if (nextColor !== null) handleChange(nextColor);
  };
  const btnStyle = {
    fontFamily: "Montserrat",
    margin: "0",
    textShadow: "2px 2px 2px #474747",
  };
  const onSelectStyle = {
    border: "4px solid #262626",
    backgroundColor: "#0c7508",
    fontSize: "0.8rem",
  };
  return (
    <ToggleButtonGroup
      value={selectedColor}
      exclusive
      onChange={change}
      style={{
        background: "#1da818",
        margin: "2%",
      }}
    >
      <ToggleButton
        value="black"
        aria-label="black"
        style={{
          ...btnStyle,
          color: "black",
          ...(selectedColor === "black" && { ...onSelectStyle }),
        }}
      >
        <img
          src="/assets/pieces/p_b.png"
          height="25px"
          width="25px"
          alt="black pawn"
        />
        {"  "}
        Black
      </ToggleButton>
      <ToggleButton
        value="white"
        aria-label="white"
        style={{
          ...btnStyle,
          color: "white",
          ...(selectedColor === "white" && {
            ...onSelectStyle,
          }),
        }}
      >
        White{"  "}
        <img
          src="/assets/pieces/p_w.png"
          height="25px"
          width="25px"
          alt="white pawn"
        />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
