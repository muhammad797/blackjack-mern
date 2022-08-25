import { useState, useContext, useEffect } from "react";
import {
  formatScore,
  generateCard,
  generateHand,
  generateLeftHand,
} from "../../../src/actions/generateHand";
import { useSelector } from "react-redux";
import SocketContext from "../../context/socketContext";
import { useNavigate } from "react-router-dom";

import Card from "../card";
import Computer from "../computer";
import HitButton from "../hitButton";
import StandButton from "../standButton";
// import Tutorial from "../tutorial";
import Wallet from "../wallet";
import WinnerCard from "../winnerCard";
import globalStyles from "../../../src/globalStyles";
import "./styles.scss";
import { io } from "socket.io-client";

globalStyles();

function BlackJack({ ids, room, loby, User }) {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const socket = useContext(SocketContext);
  const currentSocket = ids[0];
  const otherSocket = ids[1];
  const [tutorial, openTutorial] = useState(false);

  const [leftControls, setLeftControls] = useState(true);
  const [rightControls, setRightControls] = useState(true);
  const [leftHit, setLeftHit] = useState(false);
  const [turn, setTurn] = useState(true);
  const [RightHit, setRightHit] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [finalTurn, setFinalTurn] = useState(false);
  const [idsFromDisconnect, setIdsFromDisconnect] = useState(false);

  useEffect(() => {
    if (socket.id === otherSocket || socket.id === currentSocket) {
    } else {
      navigate(`/lobby`);
    }
  }, [socket]);

  const [player, setPlayer] = useState({
    name: "player",
    score: 0,
    deck: [],
  });
  const [leftPlayer, setleftPlayer] = useState({
    name: "LeftPlayer",
    score: 0,
    deck: [],
  });

  const [wallet, setWallet] = useState(200);

  const [pc, setPc] = useState({
    name: "dealer",
    score: 0,
    deck: [],
  });

  const [RightWinner, setRightWinner] = useState({
    winner: "",
    state: false,
  });
  const [LeftWinner, setLeftWinner] = useState({
    win: "",
    state: false,
  });

  useEffect(() => {
    socket.on("leftData", ({ player, turn }) => {
      setleftPlayer(player);
      setTurn(false);
    });
    socket.on("RightHit", ({ player, room, wallet, pc }) => {
      setPlayer(player);
      setPc(pc);
      setWallet(wallet);
    });
    socket.on("LeftWinner", ({ state, whowin }) => {
      setLeftWinner({
        win: whowin,
        state: state,
      });
    });
    for (let i = 0; i < room.length; i++) {
      if (i == 0) {
        setPlayer(room[i]);
      }
      if (i == 1) {
        setleftPlayer(room[i]);
      }
      if (i == 2) {
        setPc(room[i]);
      }
    }

    socket.on("playerLeave", (data) => {
      if (data === otherSocket || data === currentSocket) {
        setIdsFromDisconnect(true);
      }
    });
    return () => {
      socket.off("playerLeave", (data) => {});
    };
  }, []);

  useEffect(() => {
    if (leftHit) {
      socket.emit("leftHit", {
        player: leftPlayer,
        room: loby,
        turn: false,
      });
    }
  }, [leftHit]);
  useEffect(() => {
    if (RightHit) {
      socket.emit("RightHit", {
        player: player,
        room: loby,
        wallet: wallet,
        pc: pc,
        state: LeftWinner?.state,
        whowin: LeftWinner?.winner,
      });
    }
  }, [RightHit]);
  useEffect(() => {
    const newPcScore = pc.score;
    if (finalTurn) {
      calculateLeftScore(newPcScore);
    }
  }, [finalTurn]);
  useEffect(() => {
    if (LeftWinner.state) {
      socket.emit("LeftWinner", {
        state: LeftWinner?.state,
        whowin: LeftWinner?.win,
        room: loby,
      });
    }
  }, [LeftWinner]);
  const LeftHitButton = async () => {
    if (leftPlayer.deck.length == 2) {
      const prevPlayerDeck = leftPlayer.deck;
      const playerCard = generateCard();
      const newPlayerScore =
        leftPlayer.score + formatScore(Number(playerCard[1]));
      prevPlayerDeck.push(playerCard);
      setleftPlayer({
        ...leftPlayer,
        score: newPlayerScore,
      });
      setLeftHit(true);
      setLeftControls(false);
    }
  };

  const LeftStandbutton = async () => {
    setLeftHit(true);
    setLeftControls(false);
  };

  const calculateLeftScore = async (newPcScore = pc.score) => {
    let leftWon;
    if (leftPlayer.score > 21) {
      leftWon = "lost";
    } else if (+leftPlayer.score === 21) {
      leftWon = "Won";
    } else if (newPcScore > 21 && player.score > 21) {
      leftWon = "Won";
    } else if (newPcScore > 21 && leftPlayer.score >= player.score) {
      leftWon = "Won";
    } else if (newPcScore > 21 && leftPlayer.score < player.score) {
      leftWon = "lost";
    } else if (newPcScore <= 21 && leftPlayer.score < newPcScore) {
      leftWon = "lost";
    } else if (newPcScore <= 21 && leftPlayer.score >= newPcScore) {
      leftWon = "Won";
    } else if (newPcScore <= 21 && leftPlayer.score >= player.score) {
      leftWon = "Won";
    } else if (newPcScore <= 21 && leftPlayer.score < player.score) {
      leftWon = "lost";
    }

    ///
    else {
      leftWon = "Won";
    }

    setLeftWinner({
      win: leftWon,
      state: true,
    });
  };

  const RightHitButton = async () => {
    if (player.deck.length == 2) {
      const prevPcDeck = [...pc.deck];
      const pcCard = generateCard();
      prevPcDeck.push(pcCard);
      const newPcScore = pc.score + formatScore(Number(pcCard[1]));
      setPc({ ...pc, deck: prevPcDeck, score: newPcScore });

      const prevPlayerDeck = player.deck;
      const playerCard = generateCard();

      const newPlayerScore = player.score + formatScore(Number(playerCard[1]));

      prevPlayerDeck.push(playerCard);
      setPlayer({
        ...player,
        deck: prevPlayerDeck,
        score: newPlayerScore,
      });
      setRightHit(true);

      let whoWin;

      if (newPlayerScore > 21) {
        whoWin = "lost";
      } else if (newPlayerScore === 21) {
        whoWin = "Won";
      }

      //
      else if (newPcScore > 21 && leftPlayer.score > 21) {
        whoWin = "Won";
      } else if (newPcScore > 21 && newPlayerScore >= leftPlayer.score) {
        whoWin = "Won";
      } else if (newPcScore > 21 && newPlayerScore < leftPlayer.score) {
        whoWin = "lost";
      }
      //
      else if (newPcScore <= 21 && newPlayerScore < newPcScore) {
        whoWin = "lost";
      } else if (newPcScore <= 21 && newPlayerScore >= newPcScore) {
        whoWin = "Won";
      } else if (newPcScore <= 21 && newPlayerScore >= leftPlayer.score) {
        whoWin = "Won";
      } else if (newPcScore <= 21 && newPlayerScore < leftPlayer.score) {
        whoWin = "lost";
      }

      ///
      else {
        whoWin = "Won";
      }

      setRightWinner({
        winner: whoWin,
        state: true,
      });
      setRightControls(false);
      setFinalTurn(true);
    }
  };

  const RightStandButton = async () => {
    if (player.deck.length == 2) {
      const prevPcDeck = pc.deck;
      const pcCard = generateCard();
      prevPcDeck.push(pcCard);
      const newPcScore = pc.score + formatScore(Number(pcCard[1]));
      setPc({ ...pc, deck: prevPcDeck, score: newPcScore });
      let whoWin;
      if (player.score > 21) {
        whoWin = "lost";
      } else if (player.score === 21) {
        whoWin = "Won";
      } else if (newPcScore > 21 && leftPlayer.score > 21) {
        whoWin = "Won";
      } else if (newPcScore > 21 && player.score >= leftPlayer.score) {
        whoWin = "Won";
      } else if (newPcScore > 21 && player.score < leftPlayer.score) {
        whoWin = "lost";
      }
      //
      else if (newPcScore <= 21 && player.score < newPcScore) {
        whoWin = "lost";
      } else if (newPcScore <= 21 && player.score >= newPcScore) {
        whoWin = "Won";
      } else if (newPcScore <= 21 && player.score >= leftPlayer.score) {
        whoWin = "Won";
      } else if (newPcScore <= 21 && player.score < leftPlayer.score) {
        whoWin = "lost";
      }

      ///
      else {
        whoWin = "Won";
      }
      setRightWinner({
        winner: whoWin,
        state: true,
      });
      setRightHit(true);
      calculateLeftScore(leftPlayer, newPcScore);
      setRightControls(false);
    }
  };

  return (
    <>
      <div className="mainDiv">
        <div className="container  ">
          {idsFromDisconnect && (
            <WinnerCard winner={"player have left the game"}></WinnerCard>
          )}
          {socket.id == currentSocket ? (
            <div>
              {LeftWinner.state ? (
                <div className="flex">
                  <WinnerCard winner={LeftWinner.win}></WinnerCard>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          {socket.id == otherSocket ? (
            <div>
              {RightWinner.state && (
                <WinnerCard winner={RightWinner.winner}></WinnerCard>
              )}
            </div>
          ) : (
            ""
          )}
          <div>
            <h2>Dealer</h2>
            <div className="dealerDiv">
              {pc.deck.map((card) => {
                let cardHidden = true;
                pc.deck.length == 3
                  ? (cardHidden = false)
                  : (cardHidden = true);
                return <Card card={card} cardHidden={cardHidden}></Card>;
              })}
              <div className="scores">
                <h1>
                  {pc.deck.length == 2
                    ? formatScore(Number(pc.deck[0][1]))
                    : pc.score}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="playersDiv  ">
          {/* ----------- left player ------------ */}
          <div>
            <div className="playerID">
              <h3>Player 1</h3>
              <h4>id : {loby}</h4>
            </div>
            <div className="leftPlayer">
              <div
                className={`leftPlayerDeck ${turn === true ? "border" : ""}`}
              >
                {leftPlayer.deck.map((card) => {
                  return <Card card={card}></Card>;
                })}
                <div className="scores">
                  <h1>{leftPlayer.score}</h1>
                </div>
              </div>
              {leftControls &&
                (socket.id == currentSocket ? (
                  <div className="playButtons">
                    <HitButton
                      disabled={leftHit}
                      onClick={() => {
                        LeftHitButton();
                      }}
                    ></HitButton>
                    <StandButton
                      onClick={() => {
                        LeftStandbutton();
                      }}
                    ></StandButton>
                  </div>
                ) : (
                  ""
                ))}

              {socket.id == otherSocket &&
                LeftWinner.win == "" &&
                (turn == false ? (
                  <h2>Its your turn...</h2>
                ) : (
                  <h2>Wait for your turn...</h2>
                ))}
            </div>
          </div>
          {/* ------------ right player ----------- */}
          <div>
            <div className="playerID">
              <h3>Player 2</h3>
              <h4>id : {User}</h4>
            </div>
            <div className="rightPlayer">
              <div
                className={`rightPlayerDeck ${turn === false ? "border" : ""}`}
              >
                {player.deck.map((card) => {
                  return <Card card={card}></Card>;
                })}
                <div className="scores">
                  <h1>{player.score}</h1>
                </div>
              </div>
            </div>
            {rightControls &&
              (socket.id === otherSocket ? (
                <div className="playButtons">
                  <HitButton
                    disabled={turn}
                    onClick={() => RightHitButton()}
                  ></HitButton>
                  <StandButton
                    disabled={turn}
                    onClick={() => {
                      RightStandButton();
                    }}
                  ></StandButton>
                </div>
              ) : (
                ""
              ))}
            {socket.id == currentSocket &&
              LeftWinner.win == "" &&
              (turn == true ? (
                <h2>Its your turn...</h2>
              ) : (
                <h2>waiting for other player turn...</h2>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default BlackJack;
