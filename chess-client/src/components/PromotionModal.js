/*
Copyright 2023 PRADUMN

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
import React, { useState } from "react";
import { Modal, Grid, Button, Typography, Box } from "@mui/material";

const promotionOptions = ["Queen", "Rook", "Bishop", "Knight"];

const style = {
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
        // disableBackdropClick
      >
        <Box sx={style} className="modal-style">
          <Typography id="title" variant="h6" component="h2">
            Select a piece:
          </Typography>
          <Grid container spacing={2}>
            {promotionOptions.map((option) => (
              <Grid item xs={6} key={option}>
                <Button
                  style={{
                    marginTop: "10%",
                    backgroundColor: "#40e667",
                    border:
                      selectedOption === givePiece(option)
                        ? "4px solid #edf21d"
                        : "4px solid #40e667",
                  }}
                  variant="outlined"
                  onClick={() => handleOptionSelect(option)}
                  // disabled={selectedOption === givePiece(option)}
                >
                  <img
                    src={`assets/pieces/${givePiece(option)}_b.png`}
                    alt={option}
                  />
                </Button>
              </Grid>
            ))}
          </Grid>
          <Button
            style={{
              marginTop: "45px",
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
