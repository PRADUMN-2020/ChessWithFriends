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
    fontSize: "0.9rem",
    textShadow: "2px 2px 2px #474747",
    // textShadow: "2px 2px 2px black",
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
          height="30px"
          width="30px"
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
          height="30px"
          width="30px"
          alt="white pawn"
        />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
