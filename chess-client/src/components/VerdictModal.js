import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  p: 6,
};

export default function VerdictModal({ open, onClose, verdict }) {
  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="modal-style">
          <IconButton
            aria-label="close"
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
          <Typography id="modal-title" variant="h6" component="h2">
            {verdict}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
