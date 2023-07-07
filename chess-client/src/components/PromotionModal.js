import React, { useState } from "react";
import { Modal, Grid, Button, Typography, Box } from "@mui/material";

const promotionOptions = ["Queen", "Rook", "Bishop", "Knight"];

const style = {
  width: "35%",
  p: 4,
};

export default function PromotionModal({ open, onClose, promote }) {
  const [selectedOption, setSelectedOption] = useState(""); // to store the selected promotion option

  function givePiece(option) {
    // convert piece word to peice char
    option = option !== "Knight" ? option[0] : "N";
    option = option.toLowerCase();
    return option;
  }

  const handleOptionSelect = (option) => {
    // set selected option
    option = givePiece(option);
    setSelectedOption(option);
  };

  const handlePromotion = () => {
    // promote selected option
    promote(selectedOption);
    onClose();
  };

  return (
    <div>
      <Modal
        sx={{
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
        }}
        open={open}
        onClose={onClose}
        aria-labelledby="Promote to"
        aria-describedby="Queen Rook Bishop Knight"
        disableBackdropClick
      >
        <Box sx={style} className="modal-style">
          <Typography id="title" variant="h6" component="h2">
            Select a promotion piece:
          </Typography>
          <Grid container spacing={2}>
            {promotionOptions.map((option) => (
              <Grid item xs={6} key={option}>
                <Button
                  style={{
                    marginTop: "10%",
                    backgroundColor: "#baed91",
                    border:
                      selectedOption === givePiece(option)
                        ? "4px solid orange"
                        : "4px solid #baed91",
                  }}
                  variant="outlined"
                  onClick={() => handleOptionSelect(option)}
                  // disabled={selectedOption === givePiece(option)}
                >
                  <img
                    src={`assets/pieces/${givePiece(option)}_b.png`}
                    width="60px"
                    alt={option}
                  />
                </Button>
              </Grid>
            ))}
          </Grid>
          <Button
            style={{
              marginTop: "40px",
              width: "75%",
            }}
            variant="contained"
            color="success"
            fullWidth
            disabled={!selectedOption}
            onClick={handlePromotion}
          >
            Promote
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
