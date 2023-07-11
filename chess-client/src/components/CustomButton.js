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
