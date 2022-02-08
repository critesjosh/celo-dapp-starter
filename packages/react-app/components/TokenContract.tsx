import { useInput } from ".";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { truncateAddress } from "../utils";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import SvgIcon from "@mui/material/SvgIcon";
import { ethers } from "ethers";

function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

const iconStyle = {
  // backgroundColor: "#000000", // camel cased
  // height: "100px",
  // color: "yellow",
  marginLeft: "0px",
  marginRight: "0px",
  marginTop: "10px",
  marginBottom: "10px",
};

const buttonStyle = {
  // backgroundColor: "#000000", // camel cased
  // height: "100px",
  // color: "yellow",
  marginLeft: "0px",
  marginRight: "5px",
  marginTop: "20px",
  marginBottom: "20px",
};

export function TokenContract({ contractData }) {
  const { kit, address, network, performActions } = useContractKit();
  const [tokenValue, setTokenValue] = useState();
  const [tokenInput, setTokenInput] = useInput({ type: "text" });
  const [contractLink, setContractLink] = useState("");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  //   const [{ data, error, loading }, getSigner] = useSigner();
  const [tokenBalance, setTokenBalance] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState("");
  const [tokenInitialSupply, setTokenInitialSupply] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenTotal, setTokenTotal] = useState("");
  const [tokenBalanceOf, setTokenBalanceOf] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [tokenTransferValue, setTokenTransferValue] = useState("");

  const contract = contractData
    ? new kit.web3.eth.Contract(contractData.abi, contractData.address)
    : null;

  useEffect(() => {
    if (contractData) {
      setContractLink(`${network.explorer}/address/${contractData.address}`);
    }
  }, [network, contractData]);

  const setToken = async () => {
    try {
      await performActions(async (kit) => {
        const gasLimit = await contract.methods.store(tokenInput).estimateGas();

        const result = await contract.methods
          .store(tokenInput)
          .send({ from: address, gasLimit });

        console.log(result);

        const variant = result.status == true ? "success" : "error";
        const url = `${network.explorer}/tx/${result.transactionHash}`;
        const action = (key) => (
          <>
            <Link href={url} target="_blank" component="div">
              View in Explorer
            </Link>
            <Button
              onClick={() => {
                closeSnackbar(key);
              }}
            >
              X
            </Button>
          </>
        );
        enqueueSnackbar("Transaction sent", {
          variant,
          action,
        });
      });
    } catch (e) {
      console.log(e);
    }
  };

  //   const getStorage = async () => {
  //     try {
  //       const result = await contract.methods.retrieve().call();
  //       setTokenValue(result);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };

  const getTokenName = async () => {
    const tokenName = await contract.methods.name().call();
    setTokenName(tokenName);
  };

  const getTokenSymbol = async () => {
    const tokenSymbol = await contract.methods.symbol().call();
    setTokenSymbol(tokenSymbol);
  };

  const getTokenInitialSupply = async () => {
    const tokenInitialSupply = await contract.methods.initialSupply.call();
    console.log(tokenInitialSupply);
    // const convertedInitialSupply = ethers.utils.formatUnits(
    //   tokenInitialSupply.toString(),
    //   18
    // );
    // setTokenInitialSupply(convertedInitialSupply);
  };

  const getTokenDecimals = async () => {
    const tokenDecimals = await contract.methods.decimals().call();
    setTokenDecimals(tokenDecimals.toString());
  };

  const getTokenTotal = async () => {
    const tokenTotal = await contract.methods.totalSupply().call();
    const convertedTotal = ethers.utils.formatUnits(tokenTotal.toString(), 18);
    setTokenTotal(convertedTotal);
  };

  const getBalance = async () => {
    const tokenBalance = await contract.methods.balance.call();
    console.log(tokenBalance);
    // const convertedBalance = ethers.utils.formatUnits(
    //   tokenBalance.toString(),
    //   18
    // );
    // setTokenBalance(convertedBalance);
  };

  const getTokenBalanceOf = async (e) => {
    e.preventDefault();
    console.log(address);
    const tokenBalanceOf = await contract.methods.balanceOf.call(address);
    // const convertedTokenBalanceOf = ethers.utils.formatUnits(
    //   tokenBalanceOf.toString(),
    //   18
    // );
    // setTokenBalanceOf(convertedTokenBalanceOf);
  };

  const transferTokens = async (e) => {
    e.preventDefault();
    if (newAddress && tokenTransferValue) {
      console.log(newAddress, tokenTransferValue);
    }
    let tx = await contract.methods.call.transfer(
      newAddress,
      tokenTransferValue
    );
    let receipt = await tx.wait();
    console.log("receipt", receipt);
  };

  return (
    <Grid sx={{ m: 1 }} container justifyContent="center">
      <Grid item xs={6} sx={{ m: 2 }}>
        <Typography gutterBottom variant="h5" component="div">
          Token Contract
        </Typography>
        {/* <Typography variant="h5" component="div">
          Token Contract:
        </Typography> */}
        {contractData ? (
          <Link href={contractLink} target="_blank" component="div">
            {truncateAddress(contractData?.address)}
          </Link>
        ) : (
          <Typography component="div" variant="body2" color="text.secondary">
            No contract detected for {network.name}
          </Typography>
        )}

        {/* Token Name */}

        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <HomeIcon style={iconStyle} color="primary" />
            <Typography gutterBottom variant="h5" component="div">
              Token Name
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reads the name of the deployed token.
            </Typography>
            <Button
              style={buttonStyle}
              onClick={getTokenName}
              size="large"
              variant="contained"
            >
              Submit
            </Button>
            <Button
              style={buttonStyle}
              size="large"
              href="https://docs.celo.org/"
              target="_blank"
            >
              Learn More
            </Button>
            <Typography variant="body2" color="text.secondary">
              <b>Name:</b> {tokenName}
            </Typography>
          </CardContent>
        </Card>

        {/* Token Symbol */}

        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <HomeIcon style={iconStyle} color="primary" />
            <Typography gutterBottom variant="h5" component="div">
              Token Symbol
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reads the symbol of the deployed token.
            </Typography>
            <Button
              style={buttonStyle}
              variant="contained"
              onClick={getTokenSymbol}
              size="large"
            >
              Submit
            </Button>
            <Button
              href="https://docs.celo.org/"
              target="_blank"
              size="large"
              style={buttonStyle}
            >
              Learn More
            </Button>
            <Typography variant="body2" color="text.secondary">
              <b>Symbol:</b> {tokenSymbol}
            </Typography>
          </CardContent>
        </Card>

        {/* Total Tokens */}

        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <HomeIcon style={iconStyle} color="primary" />
            <Typography gutterBottom variant="h5" component="div">
              Total Tokens
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reads the total number of tokens in the supply.
            </Typography>
            <Button
              style={buttonStyle}
              onClick={getTokenTotal}
              size="large"
              variant="contained"
            >
              Submit
            </Button>
            <Button
              style={buttonStyle}
              size="small"
              href="https://docs.celo.org/"
              target="_blank"
            >
              Learn More
            </Button>
            <Typography variant="body2" color="text.secondary">
              <b>Total:</b> {tokenTotal}
            </Typography>
          </CardContent>
        </Card>

        {/* Token Decimals */}

        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <HomeIcon style={iconStyle} color="primary" />
            <Typography gutterBottom variant="h5" component="div">
              Token Decimals
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reads the number of decimals of the deployed token.
            </Typography>
            <Button
              style={buttonStyle}
              onClick={getTokenDecimals}
              size="large"
              variant="contained"
            >
              Submit
            </Button>
            <Button
              style={buttonStyle}
              size="large"
              href="https://docs.celo.org/"
              target="_blank"
            >
              Learn More
            </Button>
            <Typography variant="body2" color="text.secondary">
              <b>Decimals:</b> {tokenDecimals}
            </Typography>
          </CardContent>
        </Card>

        {/* Initial Supply */}

        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <HomeIcon style={iconStyle} color="primary" />
            <Typography gutterBottom variant="h5" component="div">
              Initial Supply
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reads the initial supply of the deployed token.
            </Typography>
            <Button
              onClick={getTokenInitialSupply}
              size="large"
              style={buttonStyle}
              variant="contained"
            >
              Submit
            </Button>
            <Button
              size="large"
              style={buttonStyle}
              href="https://docs.celo.org/"
              target="_blank"
            >
              Learn More
            </Button>
            <Typography variant="body2" color="text.secondary">
              <b>Initial Supply:</b> {tokenInitialSupply}
            </Typography>
          </CardContent>
        </Card>

        {/* Current Balance */}

        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <HomeIcon style={iconStyle} color="primary" />
            <Typography gutterBottom variant="h5" component="div">
              Current Balance
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reads the total balance of the calling address.
            </Typography>
            <Button
              style={buttonStyle}
              onClick={getBalance}
              size="large"
              variant="contained"
            >
              Submit
            </Button>
            <Button size="large" href="https://docs.celo.org/" target="_blank">
              Learn More
            </Button>
            <Typography variant="body2" color="text.secondary">
              <b>Current Balance:</b> {tokenBalance}
            </Typography>
          </CardContent>
        </Card>

        {/* Address Balance */}

        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <HomeIcon style={iconStyle} color="primary" />
            <Typography gutterBottom variant="h5" component="div">
              Address Balance
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reads the balance of the given address.
            </Typography>
            <form noValidate autoComplete="off" onSubmit={getTokenBalanceOf}>
              <TextField
                onChange={(e) => setNewAddress(e.target.value)}
                label="Address"
                fullWidth
                required
                margin="normal"
                variant="standard"
              />
              <Button
                style={buttonStyle}
                variant="contained"
                type="submit"
                size="large"
              >
                Submit
              </Button>
              <Button
                size="large"
                href="https://docs.celo.org/"
                target="_blank"
              >
                Learn More
              </Button>
            </form>
            <Typography variant="body2" color="text.secondary">
              <b>Address balance:</b> {tokenBalanceOf}
            </Typography>
          </CardContent>
        </Card>

        {/* Transfer */}

        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <HomeIcon style={iconStyle} color="primary" />
            <Typography gutterBottom variant="h5" component="div">
              Transfer Balance
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Transfers value from one address to another.
            </Typography>
            <form noValidate autoComplete="off" onSubmit={transferTokens}>
              <TextField
                onChange={(e) => setNewAddress(e.target.value)}
                label="Address"
                fullWidth
                required
                margin="normal"
                variant="standard"
              />
              <TextField
                onChange={(e) => setTokenTransferValue(e.target.value)}
                label="Value"
                fullWidth
                required
                margin="normal"
                variant="standard"
              />
              <Button
                style={buttonStyle}
                variant="contained"
                type="submit"
                size="large"
              >
                Submit
              </Button>
              <Button
                size="large"
                href="https://docs.celo.org/"
                target="_blank"
              >
                Learn More
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
