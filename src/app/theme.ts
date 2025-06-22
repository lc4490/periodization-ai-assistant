// light/dark themes
import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#e0f7fa", // Bright blue for primary elements
    },
    secondary: {
      main: "#00bfff", // Slightly darker blue for contrast
    },
    background: {
      default: "#f0f5fb", // Light grayish-blue background
      paper: "#ffffff", // White for paper elements
    },
    text: {
      primary: "#212121", // Dark gray text for readability
      secondary: "#607d8b", // Medium gray text for secondary elements
    },
    action: {
      active: "#00bfff", // Bright blue for active elements
    },
  },
  typography: {
    fontFamily: "Roboto Mono, Arial, sans-serif", // Monospaced font for a techy look
    h1: {
      fontFamily: "Roboto Mono, Arial, sans-serif",
      fontWeight: 700,
      color: "#00bfff",
    },
    h2: {
      fontFamily: "Roboto Mono, Arial, sans-serif",
      fontWeight: 700,
      color: "#00bfff",
    },
    h3: {
      fontFamily: "Roboto Mono, Arial, sans-serif",
      fontWeight: 700,
      color: "#00bfff",
    },
    button: { fontFamily: "Roboto Mono, Arial, sans-serif", fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0px 0px 8px rgba(0, 191, 255, 0.6)", // Glowing effect
          backgroundColor: "#00bfff",
          color: "#f0f5fb",
          "&:hover": {
            backgroundColor: "#00a3cc",
            boxShadow: "0px 0px 12px rgba(0, 191, 255, 0.9)", // More intense glow on hover
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff", // White background for paper
          boxShadow: "0px 0px 10px rgba(0, 191, 255, 0.4)", // Subtle glow effect
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderColor: "#00bfff",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#00bfff",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#00bfff",
              boxShadow: "0px 0px 8px rgba(0, 191, 255, 0.6)", // Glowing effect
            },
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1e1e1e", // Neon cyan blue for primary elements
    },
    secondary: {
      main: "#00ffff", // Bright blue for contrasting elements
    },
    background: {
      default: "#0b0f19", // Very dark background, almost black
      paper: "#121212", // Dark gray for paper elements
    },
    text: {
      primary: "#ffffff", // Bright white text for contrast
      secondary: "#b0bec5", // Light gray text for secondary elements
    },
    action: {
      active: "#00ffff", // Neon cyan blue for active elements
    },
  },
  typography: {
    fontFamily: "Roboto Mono, Arial, sans-serif", // Monospaced font for a techy look
    h1: {
      fontFamily: "Roboto Mono, Arial, sans-serif",
      fontWeight: 700,
      color: "#00ffff",
    },
    h2: {
      fontFamily: "Roboto Mono, Arial, sans-serif",
      fontWeight: 700,
      color: "#00ffff",
    },
    h3: {
      fontFamily: "Roboto Mono, Arial, sans-serif",
      fontWeight: 700,
      color: "#00ffff",
    },
    button: { fontFamily: "Roboto Mono, Arial, sans-serif", fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0px 0px 12px rgba(0, 255, 255, 0.6)", // Glowing effect
          backgroundColor: "#00ffff",
          color: "#0b0f19",
          "&:hover": {
            backgroundColor: "#00e5e5",
            boxShadow: "0px 0px 18px rgba(0, 255, 255, 0.9)", // More intense glow on hover
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#121212", // Dark gray background for paper
          boxShadow: "0px 0px 10px rgba(0, 255, 255, 0.4)", // Subtle glow effect
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderColor: "#00ffff",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#00ffff",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#00ffff",
              boxShadow: "0px 0px 8px rgba(0, 255, 255, 0.6)", // Glowing effect
            },
          },
        },
      },
    },
  },
});
