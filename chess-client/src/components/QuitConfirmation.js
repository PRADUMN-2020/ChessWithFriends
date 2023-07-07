import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  display: "flex",
  justifyContent: "center",
  textAlign: "center",
  flexDirection: "column",
  p: 4,
};

export default function QuitConfirmation({ open, onClose, handleQuit }) {
  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="Are you sure, you want to quit?"
        aria-describedby="No or Yes"
        disableBackdropClick
      >
        <Box sx={style} className="modal-style">
          <Typography id="title" variant="h6" component="h2">
            Are you sure, that you want to quit?
          </Typography>
          <Typography id="description" sx={{ mt: 2 }}>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#1da818",
                margin: "0 5%",
              }}
              onClick={onClose}
            >
              No
            </Button>

            <Button
              variant="contained"
              style={{
                backgroundColor: "#434544",
                margin: "0 5%",
              }}
              onClick={handleQuit}
            >
              Yes
            </Button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
