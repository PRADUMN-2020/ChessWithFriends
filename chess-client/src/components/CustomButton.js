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
import Button from "@mui/material/Button";

const CustomButton = ({ text, onClick }) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        bgcolor: "#1da818",
        color: "white", // Set the text color
        "&:hover": {
          bgcolor: "#69b304", // Set the hover background color
        },
        borderBottom: "4px solid green",
        padding: "1% 3%",
        fontSize: "1.1rem",
        fontFamily: "Montserrat",
        margin: "2% auto",
        textShadow: "1px 1px 1px #474747",
        // boxShadow: "0px 5px 15px black",
        letterSpacing: "1px",
      }}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
