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
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  p: 6,
};

export default function QuitModal({ open, onClose, looser }) {
  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="show winner"
        aria-describedby="winner"
        // disableBackdropClick
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
          <Typography id="description" variant="h6" component="h2">
            {looser} quits and {looser === "White" ? "Black" : "White"} wins.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
