import { globalCss, keyframes } from "@stitches/react";

const moveFromRight = keyframes({
  "0%": { marginLeft: "40px", opacity: "0" },
  "100%": { marginLeft: "0", opacity: "1" },
});

const globalStyles = globalCss({
  "*": { margin: 0, padding: 0 },

  body: {
    position: "relative",
    backgroundColor: "#2FB04A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    height: "100vh",
  },

  // ".balloon": {
  //   position: "relative",
  //   width: "130px",
  //   height: "80px",

  //   display: "flex",
  //   alignItems: "center",
  //   justifyContent: "center",

  //   backgroundColor: "#FFEA7A",

  //   borderRadius: "15px",

  //   fontFamily: "Carter One",
  //   fontSize: "1.3em",
  //   lineHeight: "1em",
  //   textAlign: "center",

  //   transition: "background-color 200ms ease-in-out",

  //   cursor: "pointer",

  //   "&:hover": {
  //     backgroundColor: "#ffd07a",
  //     "&:before": {
  //       borderColor: "transparent #ffd07a transparent ",
  //     },
  //   },
  // },

  // ".balloon:before": {
  //   content: '""',
  //   borderStyle: "solid",
  //   borderWidth: "10px 15px 10px 0",
  //   borderColor: "transparent #FFEA7A transparent ",

  //   transition: "border-color 200ms ease-in-out",

  //   position: "absolute",
  //   left: "-10px",
  //   top: "35px",
  // },
});

export default globalStyles;
