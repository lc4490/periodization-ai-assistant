"use client";
import {
  Box,
  Button,
  createTheme,
  CssBaseline,
  NativeSelect,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import AssistantIcon from "@mui/icons-material/Assistant";
import { useEffect } from "react";

// light/dark themes
const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000",
    },
  },
});
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#121212",
    },
    text: {
      primary: "#ffffff",
    },
  },
});

export default function Home() {
  // loading state
  const [isLoading, setIsLoading] = useState(false);
  // multi-language
  const [selectedLanguage, setSelectedLanguage] = useState(
    "en"
    // navigator.language.split("-")[0]
  );
  console.log(selectedLanguage);

  const handleLanguageChange = (event: { target: { value: any } }) => {
    const newLang = event.target.value;
    setSelectedLanguage(newLang);
    setMessages([
      {
        role: "assistant",
        content: getInitialGreeting(newLang),
      },
    ]);
  };

  const getInitialGreeting = (lang = "en") => {
    switch (lang) {
      case "zh":
        return "👋 你好！我是你的多語言訓練助理。歡迎用中文提問關於肌力訓練、增肌、週期訓練等問題！";
      case "es":
        return "👋 ¡Hola! Soy tu asistente multilingüe de entrenamiento. Pregúntame sobre entrenamiento de fuerza, hipertrofia, periodización, o rendimiento atlético.";
      case "fr":
        return "👋 Salut ! Je suis ton assistant d'entraînement multilingue. Pose-moi des questions sur l'entraînement de force, l'hypertrophie, la périodisation ou la performance.";
      default:
        return "👋 Hi! I’m your multilingual training assistant. Ask me anything about strength training, hypertrophy, periodization, or athletic performance — in any language. I’ll respond in the same language you use.";
    }
  };

  // detect light/dark mode, set light dark mode
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);
  const theme = darkMode ? darkTheme : lightTheme;

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: getInitialGreeting(),
    },
  ]);
  const [message, setMessage] = useState("");
  const sendMessage = async () => {
    // when message is sending, set state to loading to prevent overloading
    if (!message.trim() || isLoading) return;
    setIsLoading(true);

    // send message
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    }).then(async (response) => {
      if (!response.body) {
        console.error("No response body returned from API.");
        return;
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";
      return reader
        .read()
        .then(function processText({ done, value }: any): Promise<string> {
          if (done) {
            return Promise.resolve(result);
          }
          const text = decoder.decode(value || new Uint8Array(), {
            stream: true,
          });
          setMessages((messages) => {
            let lastMessage = messages[messages.length - 1];
            let otherMessages = messages.slice(0, messages.length - 1);
            return [
              ...otherMessages,
              { ...lastMessage, content: lastMessage.content + text },
            ];
          });
          return reader.read().then(processText);
        });
    });
    // set loading to false after message is sent
    setIsLoading(false);
  };

  // qol changes
  // enter to submit
  const handleKeyPress = (event: {
    key: string;
    shiftKey: any;
    preventDefault: () => void;
  }) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };
  // scroll chat down as search
  useEffect(() => {
    const chatLog = document.querySelector(".chat-log");
    if (chatLog) {
      chatLog.scrollTop = chatLog.scrollHeight;
    }
  }, [messages]);
  const clearChatLog = () => {
    setMessages([
      {
        role: "assistant",
        content: getInitialGreeting(),
      },
    ]);
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          direction={"column"}
          width="100%"
          height="100%"
          p={2}
          spacing={3}
        >
          {/* header box */}
          <Box
            height="10%"
            // bgcolor="background.default"
            display="flex"
            justifyContent="space-between"
            paddingX={2.5}
            paddingY={2.5}
            alignItems="center"
            position="relative"
          >
            {/* language control  */}
            {/* <FormControl
          sx={{
            width: '85px', // Adjust the width value as needed
          }}
          >
            
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              {t('language')}
            </InputLabel>
            <NativeSelect
              defaultValue={'en'}
              onChange={handleLanguageChange}
              inputProps={{
                name: t('language'),
                id: 'uncontrolled-native',
              }}
              sx={{
                '& .MuiNativeSelect-select': {
                  '&:focus': {
                    backgroundColor: 'transparent',
                  },
                },
                '&::before': {
                  borderBottom: 'none',
                },
                '&::after': {
                  borderBottom: 'none',
                },
              }}
              disableUnderline
            >
              <option value="en">English</option>
              <option value="cn">中文（简体）</option>
              <option value="tc">中文（繁體）</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="jp">日本語</option>
              <option value="kr">한국어</option>
            </NativeSelect>
          </FormControl> */}
            <NativeSelect
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              <option value="en">English</option>
              <option value="zh">中文</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
            </NativeSelect>

            {/* <Button>Equipment</Button> */}
            {/* title */}
            <Box display="flex" flexDirection={"row"} alignItems={"center"}>
              <Typography variant="h6" textAlign="center">
                {"AI Trainer"}
              </Typography>
            </Box>
            {/* signIn/signOut Form */}
            <Box></Box>
            {/* <Box>
            {!user ? (
              <Button
                onClick={handleSignIn}
                sx={{
                  justifyContent: "end",
                  right: "2%",
                  backgroundColor: "background.default",
                  color: "text.primary",
                  borderColor: "text.primary",
                  "&:hover": {
                    backgroundColor: "text.primary",
                    color: "background.default",
                    borderColor: "text.primary",
                  },
                }}
              >
                {t("signIn")}
              </Button>
            ) : (
              <Button
                onClick={handleSignOut}
                sx={{
                  backgroundColor: "background.default",
                  color: "text.primary",
                  borderColor: "text.primary",
                  borderWidth: 2,
                  "&:hover": {
                    backgroundColor: "darkgray",
                    color: "text.primary",
                    borderColor: "text.primary",
                  },
                }}
              >
                {t("signOut")}
              </Button>
            )}
          </Box> */}
          </Box>
          <Stack
            direction={"column"}
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
            className="chat-log"
          >
            {/* message log */}
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === "assistant" ? "flex-start" : "flex-end"
                }
              >
                {message.role === "assistant" && (
                  <AssistantIcon sx={{ mr: 1, fontSize: "2.5rem" }} />
                )}
                <Box
                  bgcolor={
                    message.role === "assistant"
                      ? "primary.main"
                      : "secondary.main"
                  }
                  borderRadius={16}
                  p={3}
                >
                  {message.content}
                </Box>
                {message.role === "user" && (
                  <PersonIcon sx={{ ml: 1, fontSize: "2.5rem" }} />
                )}
              </Box>
            ))}
          </Stack>
          {/* input field */}
          <Stack
            direction="row"
            spacing={2}
            padding={2}
            sx={{ width: "100%", bottom: 0 }}
          >
            <TextField
              label={"Message"}
              fullWidth
              value={message}
              variant="outlined"
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              sx={{ borderRadius: "8px" }}
            ></TextField>
            {/* send button */}
            <Button
              variant="outlined"
              onClick={sendMessage}
              disabled={message == ""}
            >
              {"send"}
            </Button>
            {/* clear history */}
            <Button onClick={clearChatLog} variant="outlined">
              {"clear"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}
