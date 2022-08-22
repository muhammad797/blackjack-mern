import { keyframes, styled } from "@stitches/react";
import Chips from "../chips";
import Confetti from "react-confetti";
import "./styles.scss";
import { useNavigate } from "react-router-dom";

const moveFromRight = keyframes({
  "0%": { marginLeft: "130px", opacity: "0" },
  "100%": { marginLeft: "0", opacity: "1" },
});

const Card = styled("div", {
  width: "100%",
  height: "100%",
  top: "0",
  left: "0",

  position: "absolute",
  background: "rgba(15, 150, 43, 0.4)",

  zIndex: "20",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",

  animation: `${moveFromRight} 200ms forwards`,

  fontSize: "2em",
  fontFamily: "Carter One",
  fontWeight: "600",

  color: "white",

  "& > div": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

function WinnerCard(props) {
  const navigate = useNavigate();
  return (
    <Card>
      {props.winner == "Won" ? (
        <Confetti
          width={window.innerWidth || 300}
          height={window.innerHeight || 100}
        />
      ) : (
        ""
      )}
      {props.winner}
      <button className="playagainBtn" onClick={() => navigate(`/lobby`)}>
        <p>Play again</p>
      </button>
    </Card>
  );
}

export default WinnerCard;
