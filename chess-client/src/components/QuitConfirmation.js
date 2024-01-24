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
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
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
        // disableBackdropClick
      >
        <Box sx={style} className="modal-style">
          <Typography id="title" variant="h6" component="h2">
            Are you sure, that you want to quit?
          </Typography>
          <Typography
            id="description"
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <Button
              variant="contained"
              style={{
                backgroundColor: "#1da818",
                margin: "2% 5%",
              }}
              onClick={onClose}
            >
              No
            </Button>

            <Button
              variant="contained"
              style={{
                backgroundColor: "#434544",
                margin: "2% 5%",
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
