import { styled } from "@stitches/react";

const Button = styled("button", {
  border: "none",
  borderRadius: "44px 0px 0px 44px",

  width: "254px",
  height: "70px",

  background: "#082F0C",
  color: "#fff",

  fontSize: "22px",

  transition: "background-color 200ms ease-in-out",

  cursor: "pointer",

  paddingRight: "100px",

  "&:hover": {
    backgroundColor: "rgba(8, 47, 12, 0.8)",
  },
});

function HitButton(props) {
  return (
    <Button disabled={props.disabled} onClick={props.onClick}>
      Hit
    </Button>
  );
}

export default HitButton;
