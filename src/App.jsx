import Web3 from "web3";
import { useState } from "react";
import abi from "./ContractABI.json";
import "./App.css";


let contract;
let contractAddress;
const provider = new Web3(window.ethereum); //provider
let accounts;

function App() {
  const [account, setAccount] = useState("");
  const [contracts, setContracts] = useState("");

  const [gData, setgData] = useState("");

  const [formData, setFormData] = useState({ to: "", uri: "" });
  const [txHash, setTxhash] = useState("");

  const [balanceAddress, setbalanceAddress] = useState("");
  const [finding, setfinding] = useState(false);
  const [findData, setfindData] = useState("");

  const [tfrData, setTfrData] = useState({from: "",to: "",tokenIdd: "",});

  const [burnData, setburnData] = useState({tokenIdd: ""});


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleTfr = (e) => {
    setTfrData({
      ...tfrData,
      [e.target.id]: e.target.value,
    });
  };
  const handleBurn = (e) => {
    setburnData({
      ...burnData,
      [e.target.id]: e.target.value,
    });
  };

  const connectMetamask = async (e) => {
    try {
      e.preventDefault();
      if (window.ethereum) {
        //provider
        accounts = await provider.eth.requestAccounts();

        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          console.error("No Ethereum accounts available.");
        }
      } else {
        console.error("MetaMask is not installed.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connect = (e) => {
    e.preventDefault();
    try {
      contractAddress = "0x97d8205B352f76A1F98188290fBC3133915f3572";
      contract = new provider.eth.Contract(abi, contractAddress);
      setContracts(`Connected with (${contractAddress}) contract Address`);
    } catch (error) {}
  };

  const getData = async (e) => {
    e.preventDefault();

    try {
      const name = await contract.methods.name().call();
      const symbol = await contract.methods.symbol().call();
      const owner = await contract.methods.owner().call();
      setgData(`Name : ${name} and Symbol : ${symbol} and Owner : ${owner}`);
    } catch (error) {}
  };

  const mintingToken = async (e) => {
    e.preventDefault();

    if (!formData.to || !formData.uri) {
      console.error("Invalid input: Account and uri are required.");
      return;
    }

    console.log("Minting Token Input:", { to: formData.to, uri: formData.uri });

    try {
      const gasPrice = await provider.eth.getGasPrice();
      let dataa = await contract.methods
        .safeMint(formData.to, formData.uri)
        .encodeABI();

      const rawTransaction = {
        from: accounts[0],
        gasPrice: gasPrice,
        gas: 650000,
        to: contractAddress,
        data: dataa,
        chainId: 11155111,
      };
      const signedTx = await provider.eth.sendTransaction(rawTransaction);

      setTxhash(
        `Token minted successfully with txn hash(${signedTx.transactionHash})`
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const transferToken = async (e) => {
    e.preventDefault();
  
    if (!tfrData.from || !tfrData.to || !tfrData.tokenIdd) {
      console.error("Invalid input: From, To, and Token ID are required.");
      return;
    }
  
    const tokenIdd = parseInt(tfrData.tokenIdd);
    
    if (isNaN(tokenIdd) || tokenIdd <= 0) {
      console.error("Invalid input: Token ID must be a positive integer.");
      return;
    }
  
    try {
      const gasPrice = await provider.eth.getGasPrice();
      let dataa = await contract.methods
        .transferToken(tfrData.from, tfrData.to, tokenIdd)
        .encodeABI();
  
      const rawTransaction = {
        from: accounts[0],
        gasPrice: gasPrice,
        gas: 650000,
        to: contractAddress,
        data: dataa,
        chainId: 11155111,
      };
      const signedTx = await provider.eth.sendTransaction(rawTransaction);
  
      setTxhash(
        `Token transfer successfully with txn hash(${signedTx.transactionHash})`
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const burnToken = async (e) => {
    e.preventDefault();
  
    const tokenIdd = parseInt(burnData.tokenIdd);
    
    if (isNaN(tokenIdd) || tokenIdd <= 0) {
      console.error("Invalid input: Token ID must be a positive integer.");
      return;
    }
  
    try {
      const gasPrice = await provider.eth.getGasPrice();
      let dataa = await contract.methods
        .burnn(tokenIdd)
        .encodeABI();
  
      const rawTransaction = {
        from: accounts[0],
        gasPrice: gasPrice,
        gas: 650000,
        to: contractAddress,
        data: dataa,
        chainId: 11155111,
      };
      const signedTx = await provider.eth.sendTransaction(rawTransaction);
  
      setTxhash(
        `Token transfer successfully with txn hash(${signedTx.transactionHash})`
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  const findToken = async (e) => {
    e.preventDefault();
    setfinding(true);

    try {
      const balance = await contract.methods.balanceOf(balanceAddress).call();
      setfindData(`Balance of ${balanceAddress} is ${balance} NFT`);
      setbalanceAddress("");
      setfinding(false);
    } catch (error) {
      setfinding(false);
    }
  };

  return (
    <div className="App">
      <button onClick={connectMetamask}>CONNECT TO METAMASK</button>
      <p>{account}</p>

      <button onClick={connect}>CONNECT TO CONTRACT</button>
      <p>{contracts}</p>

      <button onClick={getData}>READ FROM CONTRACT</button>
      <p>{gData}</p>
      <div>
        <div className="mint">
          <div>
            <label>Address:</label>
            <input type="text" id="to" onChange={handleChange} />
          </div>
          <div>
            <label>SetUri:</label>
            <input type="text" id="uri" onChange={handleChange} />
          </div>
          <button onClick={mintingToken}>Mint</button>
          <div>
            <p>{txHash}</p>
          </div>
        </div>
        <div className="tokenFind">
          <form onSubmit={findToken}>
            <input
              type="text"
              placeholder="Balance Of Address"
              value={balanceAddress}
              onChange={(e) => setbalanceAddress(e.target.value)}
            />
            {!finding ? (
              <button type="submit">Find</button>
            ) : (
              <button type="button">Finding...</button>
            )}
            <p>{findData}</p>
          </form>
        </div>
        <div className="transfer">
          <div>
            <label>Address:</label>
            <input type="text" id="from" onChange={handleTfr} />
          </div>
          <div>
            <label>To Address:</label>
            <input type="text" id="to" onChange={handleTfr} />
          </div>
          <div>
            <label>SetId:</label>
            <input type="text" id="tokenIdd" onChange={handleTfr} />
          </div>
          <div>
            <h3>
              <button onClick={transferToken}>Transfer</button>
            </h3>
            <p>{txHash}</p>
          </div>
        </div>
        <div className="burnToken">
          <div>
            <label>SetId:</label>
            <input type="text" id="tokenIdd" onChange={handleBurn} />
          </div>
          <div>
            <h3>
              <button onClick={burnToken}>Burn Nft</button>
            </h3>
            <p>{txHash}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
