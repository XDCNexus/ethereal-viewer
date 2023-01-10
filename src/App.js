import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import CountDown from "./countdown";
import Web3 from "web3";
import { FaTelegramPlane, FaDiscord, FaTwitter } from "react-icons/fa";
// import mainLogo from './songbird-flare.png';
import loop from './bg.mp4'

import ScrollTop from "react-scrolltop-button";
import { nexusPoints } from './NexusPointsList'

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

  export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 10px;
  border: 2px solid;
  background: rgb(209,170,41);
  background: linear-gradient(90deg, rgba(75,3,156,1) 0%, rgba(95,95,172,1) 43%, rgba(0,212,255,1) 100%);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 150px;
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
  border-radius: 10px;
  border: 2px solid;
  background: rgb(209,170,41);
  background: linear-gradient(90deg, rgba(75,3,156,1) 0%, rgba(95,95,172,1) 43%, rgba(0,212,255,1) 100%);
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
  justify-content: center;
  align-items: center;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: column;
  }
`;

export const RoundButtonWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  @media (min-width: 767px) {
    flex-direction: row;
    width: 50%;

  }
`;

export const StyledLogo = styled.img`
  width: 75px;
  @media (min-width: 767px) {
    width: 75px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  // box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  // border: 4px dashed var(--secondary);
  // background-color: var(--accent);
  // border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [nexusBalance, setNexusBalance] = useState();
  const [nexusNfts, setNexusNfts] = useState();
  const [oTotalPoints, setoTotalPoints] = useState();
  const [fetched, setFetched] = useState(false);



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
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });




  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }

  };

  const getWalletTokens = async () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      const nftBalance = await blockchain.smartContract.methods.balanceOf(blockchain.account).call();
      // console.log(nftBalance);
      setNexusBalance(nftBalance);


      const walletNfts = await blockchain.smartContract.methods.walletOfOwner(blockchain.account).call();
      // console.log(walletNfts);
      setNexusNfts(walletNfts);
      console.log(walletNfts)

      let totalPoints = 0;
      for (const id of walletNfts) {
        console.log(id)
        let oPoint = nexusPoints.at(id - 1);
        totalPoints += oPoint;
        console.log(oPoint)
      }
      setoTotalPoints(totalPoints)
      console.log(totalPoints);

      if (nftBalance > 0) {
        setFetched(true)
      }
    }

    // const tPoints = nexusNfts.map((id) => (
    //   totalPoints = nexusPoints.at(id - 1) + totalPoints
    // ));


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

      <ScrollTop
        text="TOP"
        distance={100}
        breakpoint={650}
        style={{ backgroundColor: "white" }}
        className="scroll-your-role"
        speed={500}
        target={10}
        icon={<h1>^</h1>}
      />

      <ResponsiveWrapper>
        <video
          autoPlay
          loop
          muted
          style={{
            position: "fixed",
            width: "100%",
            left: "50%",
            top: "50%",
            height: "100%",
            objectFit: "cover",
            transform: "translate(-50%, -50%)",
            zIndex: "-1",


          }}>

          <source src={loop} type="video/mp4" />

        </video>

        <s.Container
          flex={1}
          ai={"center"}
          style={{ padding: 24, backgroundColor: "var(--primary)", }}
        >
          <a rel="noopener noreferrer" href="https://xnexus.io">
            <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
          </a>

          <div className="social-container">

          <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/PoweredByNEXUS">
              <FaTwitter color="white" size={30} />
            </a>
            <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/pSVRKzyQvs">
              <FaDiscord color="white" size={30} />
            </a>


            {/* <a target="_blank" rel="noopener noreferrer" href="https://t.me/NexusOffical">
              <FaTelegramPlane color="gold" size={30} />
            </a> */}

          </div>

          <s.Container ai={"center"} jc={"center"}>

            {/* <s.TextDescription
              style={{
                textAlign: "center",
                color: "pink",
              }}
            >
              🚨 If you are having trouble fetching your NFTs on Bifrost please try the other seer app in any other browser like chrome and paste your address in manually.
            </s.TextDescription>
            <StyledLink target={"_blank"} href={"https://seer2.Nexus.io"}>
              {"SEER ALTERNATIVE"}
            </StyledLink> */}
            </s.Container>




          <s.SpacerLarge />
          <s.Container
            flex={2}

            style={{
              backgroundColor: "var(--gold-gradient-box)",
              padding: 1,
              // borderRadius: 24,
              // border: "4px solid var(--secondary)",
              // boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >

            {blockchain.account === "" ||
              blockchain.smartContract === null ? (
              <s.Container ai={"center"} jc={"center"}>
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
                <s.Container ai={"center"} jc={"center"}>

                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)",
                    }}
                  >

                    {blockchain.account.length > 0 ? (
                      String(blockchain.account).substring(0, 6) +
                      "..." +
                      String(blockchain.account).substring(36)
                    ) : (
                      <span>PLEASE CONNECT</span>
                    )}

                  </s.TextDescription>

                  <StyledButton
                    onClick={(e) => {
                      getWalletTokens();
                    }}
                  >
                    FETCH NFTs
                  </StyledButton>

                  <s.SpacerSmall />

                  {fetched ? (


                    <s.Container ai={"center"} jc={"center"}>
                      <StyledLink target={"_blank"} href={"https://mintethereals.xnexus.io"}>
                        {"MINT"}
                      </StyledLink>


                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        YOU HAVE {nexusBalance} ETHEREALS!
                      </s.TextDescription>

                      {/* <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        YOUR TOTAL NEXUS POINTS: {oTotalPoints}
                      </s.TextDescription> */}

                      {/* <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "pink",
                        }}
                      >
                        ⚠ Please keep in mind the points displayed here do not include any bonuses!
                      </s.TextDescription>
                      <StyledLink target={"_blank"} href={"https://seer2.Nexus.io"}>
                        {"SEER ALTERNATIVE"}
                      </StyledLink> */}

                      {/* <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        YOU HAVE {tPoints} NEXUS POINTS!
                      </s.TextDescription> */}


                      <div>
                        <div className="container">
                          <div className="row">
                            {nexusNfts.map((id) => (
                              <div key={id} className="col-sm">
                                <NFTDisplay tokenId={id} nftCount={nexusBalance} points={nexusPoints.at(id - 1)} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                    </s.Container>

                  ) : (

                    <>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        YOU DONT HAVE ANY ETHEREALS!
                      </s.TextDescription>

                      <StyledLink target={"_blank"} href={"https://mintethereals.xnexus.io"}>
                        {"MINT NOW!"}
                      </StyledLink>
                    </>
                  )}

                </s.Container>


              </>
            )}


          </s.Container>
        </s.Container>
      </ResponsiveWrapper>
    </s.Screen >
  );
}

export default App;

function NFTDisplay({ tokenId, nftCount, points }) {
  // const contentId = 'Qmdbpbpy7fA99UkgusTiLhMWzyd3aETeCFrz7NpYaNi6zY';
  // const metadataURI = `${contentId}/${tokenId}.json`;
  // const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;
  //   const imageURI = `img/${tokenId}.png`;
  const imageURI = `https://ethereals.fra1.cdn.digitaloceanspaces.com/images/${tokenId}.jpeg`;
  const metadataLink = `https://ethereals.fra1.cdn.digitaloceanspaces.com/metadata//${tokenId}.json`;

  return (
    <s.Container ai={"center"} jc={"center"}>
      <br /><br />
      <div className="card" >
        <div className="card-body" >
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--accent-text)",
            }}
          >
            Ethereal #{tokenId}
          </s.TextDescription>

          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--accent-text)",
            }}
          >
            {/* Points: {points} */}
          </s.TextDescription>
          <a href={metadataLink} target="_blank" >
            <img className="card-img-top" src={imageURI} style={{ width: '250px' }} ></img>
          </a>
        </div>

      </div>
    </s.Container>
  );
}

