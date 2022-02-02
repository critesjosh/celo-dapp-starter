import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useConnect } from "wagmi";
import Grid from '@mui/material/Grid';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function WalletModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [{ data: connectData, error: connectError, connectLoading }, connect] =
    useConnect();

  return (
    <Grid sx={{m:1}} container justifyContent="center">
      <Button variant="contained" onClick={handleOpen}>
        Connect Wallet
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Connect a Wallet
            </Typography>
            {connectData.connectors.map((x) => (
              <Button
                sx={{ m: 1 }}
                variant="contained"
                key={x.id}
                onClick={() => connect(x)}
              >
                {x.name}
                {!x.ready && " (unsupported)"}
              </Button>
            ))}
            {connectError && (
              <div>{connectError?.message ?? "Failed to connect"}</div>
            )}
          </Box>
      </Modal>
    </Grid>
  );
}
