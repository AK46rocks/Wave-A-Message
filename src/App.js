import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import Wave from "./utils/Wave.sol/Wave.json";
import { useState } from "react";

export default function App() {

  const [details, setDetails] = React.useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [userMsg, setUserMsg] = useState("")

  const {ethereum} = window;
  const contractAddress = "0xbca1bdb9d1030d722080d0314ae272e049ca9d00";
  const contractAbi = Wave.abi;

  const isWalletConnected = async() => {
    try {
          
          if(!ethereum){
            console.log("Please connect through Metamask !!");

          }
          else{
            console.log("Ethereum Object:",ethereum);
          }

          const accounts = await ethereum.request({ method : "eth_accounts"})
          
          if(accounts.length !== 0){
            const account = await accounts[0];
            console.log('Account Address:',account);
            setDetails(account);
          }else{
            console.log("NO Authorised Account found");
          }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async() =>{
      try {
        if(!ethereum){
          console.log("Get Mstamask !");
        }

        const accounts = await ethereum.request({method : "eth_requestAccounts" });
        setDetails(accounts[0]);
      } catch (error) {
        console.log(error);
      }
  }

  const wave = async() => {
    if(userMsg == ""){
      alert("Your Input Field is Empty !");
    }else
  {

    try {

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract =  new ethers.Contract(contractAddress, contractAbi, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        try{
        const waveTxn = await wavePortalContract.wave(userMsg, {gasLimit: 300000});
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        }catch(error){
          alert("slow mode is active (Wait 30sec to message)");
        }

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        setUserMsg("");
        // window.location.reload();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }  
}

   const getAllWaves = async() => {
        try{
          if(ethereum){
           const provider = new ethers.providers.Web3Provider(ethereum);
           const signer = provider.getSigner();
           const wavePortalContract = new ethers.Contract(contractAddress, contractAbi, signer);

           const waves = await wavePortalContract.getAllWaves();

           const wavesHere = [];
           waves.forEach(wave => {
             wavesHere.push({
               address: wave.waver,
               timestamp : new Date(wave.timestamp * 1000),
               message : wave.message,
             })
            })
           
           setAllWaves(wavesHere);

           wavePortalContract.on("NewWave", (from, timestamp, message) => {
            console.log("NewWave", from, timestamp, message);
  
            setAllWaves(prevState => [...prevState, {
              address: from,
              timestamp: new Date(timestamp * 1000),
              message: message
            }]);
          });
           } else {
          console.log("Ethereum object doesn't exist!")
          }

        }catch(error){
          console.log(error);
        }
   }

    React.useEffect(() => {
      isWalletConnected();
      getAllWaves();
    }, [])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Eyy Bidda, Mera Adda!
        </div>

        <div className="bio">
        I am <span style={{fontSize:'24px',color:'blueviolet'}}>AK46ROCKS</span> and I working on Blockchain development so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <input className="waveButton" type="text" name="msg" id="msg" placeholder="Type..." 
        onChange={(event) => {
          setUserMsg(event.target.value);
          console.log(userMsg);
        }} 
        value={userMsg}
        />
        
        {details && (
        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
        )}
        {!details && (
          <button className="waveButton" onClick={connectWallet}>
          Connect Wallet
          </button>
        )}
        
        <div  style={{marginTop:"30px",marginBottom:"30px"}}>
          <p>Waves:</p>
        {allWaves.map((wave, index) => {
          return (
            <div className="message_sec" key={index} style={{ marginTop: "16px" }}>
              <div> 
                 <span className="address">{wave.address}</span>
                 <i className="far fa-check-circle" style={{color:"green"}}></i>
              </div>
              <div className="msg">{wave.message}</div>
              <div className="time">{wave.timestamp.toString()}</div>
            </div>)
        })}
        </div>

      </div>
    </div>
  );
}
