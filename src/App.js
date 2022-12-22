import React, { useEffect, useState, useRef } from "react";

import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import NetworkChange from "./switch";
import 'bootstrap/dist/css/bootstrap.min.css';




















const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  padding: 20px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px soild var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;
export const StyledTeam = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  width: 40px;
  border-radius: 50%;
  @media (min-width: 900px) {
    width: 40px;
  }
  @media (min-width: 1000px) {
    width: 40px;
  }
`;
export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,

    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 5) {
      newMintAmount = 5;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    
    <s.Screen>
      
      <s.Container>
      <nav class="navbar navbarfont  navbar-expand bg-transperant mb-2  border:'1';  box-shadow: 0px 1px 10px #750303;
  padding: 5px 10px;" style={{ fontSize: '40px', borderRadius: '14px', color: "#f7f7f7", fontWeight: "400" }} >        
            <div class="container-fluid" style={{ fontFamily: "SF Pro Display" }}>
              <a class="navbar-link active" aria-current="page" href="./"><img src="Bullsc.png" alt="Bullsc.png"     width="15%"  /></a>
            </div>
             <div class="collapse navbar-collapse" id="navbarCollapse">
             <ul class="navbar-nav me-auto mb-3 px-4 mb-md-0" style={{ fontSize: "20px" }}>
                  <li class="nav-item">
                    <a class="nav-link active"  style={{ fontSize: '22px', borderRadius: '14px', color: "#000000", fontWeight: "700" }} aria-current="page" href="https://bullsclub.space/">HOME</a>
                  </li> 

                   
                </ul>        
                <ul class="navbar-nav me-auto mb-2 px-3 mb-md-0" style={{ fontSize: "20px" }}>
                  <li class="nav-item">
                    <a class="nav-link active"  style={{ fontSize: '22px', borderRadius: '14px', color: "#000000", fontWeight: "700" }} aria-current="page" href="https://bullsclub.space/bullsclub-polygon-bnb-nft-utility-vault/">NFT</a>
                  </li>  
                </ul>  
                
                <ul class="navbar-nav me-auto mb-2 px-3 mb-md-0" style={{ fontSize: "20px" }}>
                  <li class="nav-item">
                    <a class="nav-link active" style={{ fontSize: '22px', borderRadius: '14px', color: "#000000", fontWeight: "700" }} aria-current="page" href="https://explorer.bullsclub.space/">EXPLORER </a>
                  </li>  
                </ul>
               
                <ul class="navbar-nav me-auto mb-2 px-3 mb-md-0" style={{ fontSize: "16px" }}>
                  <li class="nav-item">
                    <a class="nav-link active"  style={{ fontSize: '22px', borderRadius: '14px', color: "#000000", fontWeight: "700" }} aria-current="page" href="https://bullsverse.bullsclub.space">BULLSVERSE</a>
                  </li>  
                  </ul>
                  <ul class="navbar-nav me-auto mb-2 px-3 mb-md-0" style={{ fontSize: "16px" }}>
                  <li class="nav-item">
                    <a class="nav-link active"  style={{ fontSize: '22px', borderRadius: '14px', color: "#000000", fontWeight: "700" }} aria-current="page" href="https://game.bullsclub.space">GAME</a>
                  </li>  
                  </ul>
                <ul class="navbar-nav me-auto mb-3 px-4 mb-md-1" style={{ fontSize: "12px" }}>
                  <li class="nav-item">
                    <a class="nav-link active" style={{ fontSize: '22px', borderRadius: '14px', color: "#000000", fontWeight: "700" }} aria-current="page" href="https://bullsclub.space/crypto-blog/">BLOG</a>
                  </li> 
                </ul>   
              </div>              
           
          </nav>
          </s.Container>
         







      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        
      >
        <NetworkChange></NetworkChange>
        
         
         <h1 className="pt-5"  style={{ fontSize: '45px', borderRadius: '14px', color: "#0000000", fontWeight: "800" }}>BULLs MINTER</h1>
    
        <s.Container flex={1} jc={"center"} ai={"center"}>
       
        <img src="binance.png" Alt="Rarity" width="15%" />
     
        <span
                    style={{
                      color: "var(--secondary)",
                    }}
                  >
                    
                   BULLS Are Unstakable, Reward without Stake by just owning BULL NFT 
                    <br />
                  </span>
                  <br />
                    Go to club Explorer to transfer your owned NFTs
                    <br />
        </s.Container>
        













        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 0,
              border: "4px soild var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <img src="14.png" Alt="Cow" width="15%" />
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  1{" "}
                  <span
                    style={{
                      color: "var(--phase-color)",
                    }}
                  >
                    {CONFIG.SYMBOL}
                  </span>{" "}
                  COST {CONFIG.DISPLAY_COST}{" "}
                  <span
                    style={{
                      color: "var(--fourth-color)",
                    }}
                  >
                    {CONFIG.NETWORK.SYMBOL}.
                  </span>
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Excluding gas fees.
                 
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT
                    </StyledButton>

                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "BUY"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
        </ResponsiveWrapper>
        <s.SpacerMedium />

        
        <br />
                     BRIDGE TOKENS CROSS-CHAINS
                    <br />
       
     
  <iframe title="Umbria" src="https://umbria.network/widgetv2/?ref=BrmtlnsSflLb3dim" width="960" height="425" scrolling="no"></iframe>
         
          <s.SpacerLarge />



          





          
        
      
      
      
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 0,
              border: "4px soild var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
              <s.TextDescription
                style={{
                  textAlign: "center",
                  color: "var(--primary-text)",
                }}
              >
               Please
                note: Once you make a purchase, you cannot undo this action.
              </s.TextDescription>
              <s.SpacerSmall />
              <s.TextDescription
                style={{
                  textAlign: "center",
                  color: "var(--primary-text)",
                }}
              >
                We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract
                to successfully mint your NFT. We recommend that you don't lower
                the gas limit.
              </s.TextDescription>
            </s.Container>
          </s.Container>
        </ResponsiveWrapper>

        
      </s.Container>
      
    </s.Screen>
    
  );
}

export default App;
