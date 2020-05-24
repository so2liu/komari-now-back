import { createMuiTheme } from "@material-ui/core/styles";
import { red, orange, indigo, green } from "@material-ui/core/colors";

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#000000",
      light: orange[300],
      dark: orange[700],
    },
    secondary: {
      main: indigo[500],
      light: indigo[300],
      dark: indigo[700],
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#ebebeb",
    },
  },
  overrides: {
    MuiTableCell: {
      root: {
        padding: 4,
        paddingTop: 8,
        paddingBottom: 8,
      },
    },
  },
});

export default theme;
