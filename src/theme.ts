import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
      primary: {
        main: "#3A5A78", // A deep blue-gray
      },
      secondary: {
        main: "#7C9885", // A muted sage green
      },
      background: {
        default: "#F0F4F8", // A light grayish blue
      },
    },
    typography: {
      h1: {
        fontSize: "3rem",
        fontWeight: 600,
      },
      h2: {
        fontSize: "1.75rem",
        fontWeight: 600,
      },
      h3: {
        fontSize: "1.5rem",
        fontWeight: 600,
      },
      h4: {
        fontSize: "1.5rem",
        color: "#D4A373", // A warm tan color
      },
      h5: {
        fontSize: "1rem",
        color: "#E9DAC1" // A light wheat color
      },
      body1: {
        fontSize: "1.10rem",
        fontWeight: 400,
        color: "#333333" // Dark gray for body text
      }
    },
  });