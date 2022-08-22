import { styled } from "@stitches/react";
import standIcon from "./standIcon.svg";

const Button = styled("button", {
  border: "none",
  borderRadius: "0px 44px 44px 0px",

  width: "139px",
  height: "70px",

 
  background: "#0F962B",
  fontSize: "22px",

  transition: "background-color 200ms ease-in-out",

  cursor: "pointer",
  color: "white",

  "&:hover": {
    backgroundColor: "rgba(15, 150, 43, 0.8)",
  },

  
});

function StandButton(props) {
  return (
    <Button disabled={props.disabled} onClick={props.onClick}>
      Stand
    </Button>
  );
}

export default StandButton;
