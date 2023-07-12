import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import CustomButton from "./CustomButton";

const style = {
  p: 6,
};

export default function InvalidRoomModal({ open, onClose }) {
  return (
    <div>
      <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title">
        <Box sx={style} className="modal-style">
          <IconButton
            aria-label="delete"
            onClick={onClose}
            style={{
              color: "white",
              position: "absolute",
              right: "0%",
              top: "0%",
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <p style={{ margin: "0 0 2vh" }}>
              Room was deleted. Create new at Home.
            </p>
            <CustomButton onClick={onClose} text="Go to Home" />
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
