// src/@chakra-ui/gatsby-plugin/theme.js
import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
const colors = {
  primary: "rebeccapurple",
};

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({ config, colors });

export default theme;
