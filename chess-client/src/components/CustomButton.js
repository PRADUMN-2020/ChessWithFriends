import React from "react";
import Button from "@mui/material/Button";

const CustomButton = ({ text, onClick, width }) => {
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
        width: width,
        padding: "1% 0",
        fontSize: "1.1rem",
        fontFamily: "Montserrat",
        margin: "2% auto",
        textShadow: "1px 1px 1px #474747",
        letterSpacing: "1px",
      }}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
