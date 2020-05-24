import React from "react";
import theme from "./theme";
import { ThemeProvider } from "@material-ui/core";
import { NowMenuContext } from "./contexts";
import { mockMenu } from "./mock";

export default (props: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <NowMenuContext.Provider value={mockMenu}>
        {props.children}
      </NowMenuContext.Provider>
    </ThemeProvider>
  );
};
