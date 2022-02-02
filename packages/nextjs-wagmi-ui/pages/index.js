import { useEffect, useState } from "react";

import {
  Provider,
  chain,
  useAccount,
  useConnect,
  useNetwork,
  useBlockNumber,
  useContract,
  useContractRead,
  useContractWrite,
  useSigner,
} from "wagmi";

import {
  Card,
  Space,
  Input,
  notification,
  Form,
  Col,
  Row,
  Divider,
  Tabs,
} from "antd";
import "antd/dist/antd.css";

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import WalletModal from "../components/WalletModal"

const { TabPane } = Tabs;

import deployedContracts from "../../hardhat/deployments/hardhat_contracts.json";

import { useQuery, gql } from "@apollo/client";

// The Graph query endpoint is defined in ../apollo-client.js

// Example GraphQL query for the Storage contract updates
const QUERY = gql`
  query Updates {
    updates(orderBy: timestamp, orderDirection: desc, first: 5) {
      id
      number
      sender
      timestamp
    }
  }
`;

export default function App() {
  const [{ data: connectData, error: connectError, connectLoading }, connect] =
    useConnect();
  const [{ data: accountData }, disconnect] = useAccount();
  const [{ data: networkData, error: networkError, loading }, switchNetwork] =
    useNetwork();

  // Get the contract data for the appropriate network
  const contracts =
    deployedContracts[networkData?.chain?.id?.toString()]?.[
      networkData?.chain?.name?.toLocaleLowerCase()
    ].contracts;

  // Show the current connected Account and Network info
  if (accountData) {
    return (
      <Row justify="space-around" align="middle" style={{ height: "300px" }}>
        <Col span={16}>
          <Space wrap size="small">
            {/* Account info Card */}
            <Card title="Connection Info">
              <p>Account address: {accountData.address}</p>
              <p>Connected to {networkData.chain?.name}</p>
              <p>Connected via {accountData.connector.name}</p>
              <button onClick={disconnect}>Disconnect</button>
            </Card>

            {/* Contracts info Card */}
            {contracts && <Contracts contracts={contracts} />}
          </Space>
        </Col>
      </Row>
    );
  }

  // If no account data is detected, show the button to connect a wallet
  return (
    <WalletModal/>
  );
}

// A Card to show the Storage and Greeter Contracts from hardhat
const Contracts = (props) => {
  return (
    <Space direction="vertical">
      <Card title="Custom Contracts">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Storage" key="1">
            <StorageContract contract={props.contracts.Storage} />
          </TabPane>
          <TabPane tab="Greeter" key="2">
            <GreeterContract contract={props.contracts.Greeter} />
          </TabPane>
        </Tabs>
      </Card>
    </Space>
  );
};

// The Storage contract UI

const StorageContract = (props) => {
  
  // use the Signer to send transactions 
  const [{ data, error, loading }, getSigner] = useSigner();
  const [number, setNumber] = useState();

  // Query the Graph endpoing specified in ../apollo-client.js 
  const { data: queryData, error: queryError } = useQuery(QUERY, {
    pollInterval: 2500,
  });

  console.log(queryData, queryError);

  console.log("signer data", data?.provider?.provider.http);

  // useEffect(() => {
    // set the stored number to the latest Graph query result
    // setNumber(queryData?.updates[0].number);
  // }, [queryData]);

  // Init the storage contract with the props info and the Signer
  const contract = useContract({
    addressOrName: props.contract.address,
    contractInterface: props.contract.abi,
    signerOrProvider: data,
  });

  // This function is called with the "Retrieve number" button is clicked
  const retrieve = async () => {
    const number = (await contract.retrieve()).toString();
    setNumber(number);
    notification.open({
      message: "Retrieved value",
      description: `Contract storage retrieved: ${number}`,
    });
  };

  // This function is called with the "Set Storage" button is clicked
  const setStorage = async (values) => {
    let tx = await contract.store(values.number);

    notification.open({
      message: "Updating Storage",
      description: `Contract storage updating to: ${values.number}`,
    });

    let receipt = await tx.wait();
    console.log("receipt", receipt);

    notification.open({
      message: "Storage Updated",
      description: `Contract storage updated to: ${values.number}`,
    });

    setNumber(values.number);
  };

  return (
    <Space direction="vertical">
      <h2>Storage Contract</h2>
      <p>Contract Address: {contract.address}</p>
      <p>Contract number: {number}</p>
      <button onClick={retrieve}>Retrieve number</button>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={setStorage}
        autoComplete="off"
      >
        <Form.Item
          label="New storage value"
          name="number"
          rules={[
            { required: true, message: "Please input new storage value" },
          ]}
        >
          <Input placeholder="Set new storage value"></Input>
        </Form.Item>
        <Form.Item>
          <button type="primary" htmlType="submit">
            Set Storage
          </button>
        </Form.Item>
      </Form>
    </Space>
  );
};

const GreeterContract = (props) => {
  const [{ data, error, loading }, getSigner] = useSigner();
  const [greeting, setGreeting] = useState("");

  let config = {
    addressOrName: props.contract.address,
    contractInterface: props.contract.abi,
  };

  const contract = useContract({ ...config, signerOrProvider: data });

  const greet = async () => {
    const greeting = await contract.greet();
    setGreeting(greeting);
    notification.open({
      message: "Retrieved Greeting",
      description: `${greeting}`,
    });
  };

  const set = async (values) => {
    let tx = await contract.setGreeting(values.greeting);

    notification.open({
      message: "Updating Greeting",
      description: `Contract greeting updating to: ${values.greeting}`,
    });

    let receipt = await tx.wait();
    console.log("receipt", receipt);

    notification.open({
      message: "Greeting Updated",
      description: `Contract greeting updated to: ${values.greeting}`,
    });
  };

  return (
    <Space direction="vertical">
      <h2>Greeter Contract</h2>
      <p>Contract Address: {contract.address}</p>
      <p>Contract greeting: {greeting}</p>
      <button onClick={greet}>Retrieve greeting</button>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={set}
        autoComplete="off"
      >
        <Form.Item
          label="New greeting"
          name="greeting"
          rules={[{ required: true, message: "Please input new greeting" }]}
        >
          <Input placeholder="Set new greeting"></Input>
        </Form.Item>
        <Form.Item>
          <button type="primary" htmlType="submit">
            Set Greeting
          </button>
        </Form.Item>
      </Form>
    </Space>
  );
};
