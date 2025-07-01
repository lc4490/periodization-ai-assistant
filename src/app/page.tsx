"use client";
import {
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  FormControl,
  MenuItem,
  NativeSelect,
  Select,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState, useEffect } from "react";
import { lightTheme, darkTheme } from "./theme";
import { customComponents } from "./customComponents";
import ReactMarkdown from "react-markdown";

// icon imports
import PersonIcon from "@mui/icons-material/Person";
import AssistantIcon from "@mui/icons-material/Assistant";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import SettingsVoiceIcon from "@mui/icons-material/SettingsVoice";
import StopIcon from "@mui/icons-material/Stop";

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

  const getInitialGreeting = (selectedLanguage: string) => {
    console.log(selectedLanguage);
    switch (selectedLanguage) {
      case "zh":
        return "👋 你好！我是你的多語言訓練助理。歡迎用中文提問關於肌力訓練、增肌、週期訓練等問題！";
      case "es":
        return "👋 ¡Hola! Soy tu asistente multilingüe de entrenamiento. Pregúntame sobre entrenamiento de fuerza, hipertrofia, periodización, o rendimiento atlético.";
      case "fr":
        return "👋 Salut ! Je suis ton assistant d'entraînement multilingue. Pose-moi des questions sur l'entraînement de force, l'hypertrophie, la périodisation ou la performance.";
      case "de":
        return "👋 Hallo! Ich bin dein mehrsprachiger Trainingsassistent. Stell mir Fragen zu Krafttraining, Muskelaufbau, Periodisierung oder sportlicher Leistung.";
      case "ja":
        return "👋 こんにちは！多言語対応のトレーニングアシスタントです。筋力トレーニング、筋肥大、ピリオダイゼーション、アスリートのパフォーマンスについて何でも聞いてください。";
      case "ko":
        return "👋 안녕하세요! 저는 다국어 트레이닝 도우미입니다. 근력 운동, 근비대, 주기화 훈련 또는 운동 능력 향상에 대해 무엇이든 물어보세요.";
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
      content: getInitialGreeting(selectedLanguage),
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
    console.log(selectedLanguage);
    setMessages([
      {
        role: "assistant",
        content: getInitialGreeting(selectedLanguage),
      },
    ]);
  };

  // text to speech
  const [isListening, setIsListening] = useState(false); // Track whether speech recognition is in progress
  const [isSpeaking, setIsSpeaking] = useState(false); // Track whether speech synthesis is in progress
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = selectedLanguage;

      recognitionInstance.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setMessage(finalTranscript + interimTranscript); // Update the message input field with both final and interim results
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        setMessage("");
      };

      setRecognition(recognitionInstance);
    } else {
      alert("Your browser does not support speech recognition.");
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      const audio = new Audio("/start-sound.mp3"); // Use a small audio file for the cue
      audio.play();
      recognition.lang = selectedLanguage;
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  // speech to text
  const correctPronunciation = (text: string) => {
    // Replace specific names with phonetic spellings
    return text.replace(/Kacey Lee/gi, "Casey Lee");
  };
  const speakText = async (text: string) => {
    try {
      const modifiedText = correctPronunciation(text);

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: modifiedText }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch TTS audio");
      }

      const arrayBuffer = await res.arrayBuffer();

      const audioContext = new ((window as any).AudioContext ||
        (window as any).webkitAudioContext)();
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);

      source.onended = () => setIsSpeaking(false);

      setIsSpeaking(true);
      source.start(0);
    } catch (error) {
      console.error("Error playing speech:", error);
      alert("There was an issue playing the TTS. Please try again.");
    }
  };

  const handleMicrophoneClick = () => {
    if (isSpeaking) {
      // Stop the speech
      window.speechSynthesis.cancel(); // Stop speech synthesis completely
      setIsSpeaking(false);
    } else if (!isListening) {
      // Start listening for speech input
      startListening();
    } else {
      // Stop listening
      stopListening();
      sendMessage();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        width="100vw"
        height={useMediaQuery("(max-width:600px)") ? "90vh" : "100vh"}
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
            <FormControl
              id="language-button"
              sx={{
                width: "100px", // Fixed width for language selector
                borderRadius: "12px",
                boxShadow: "0px 0px 12px rgba(0, 255, 255, 0.6)", // Glowing effect
                backgroundColor: "action.active",
                color: "background.default",
              }}
            >
              <Select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                // disableunderline="true"
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return <span>{"English"}</span>;
                  }
                  const selectedItem = {
                    en: "English",
                    zh: "中文",
                    es: "Español",
                    fr: "Français",
                    de: "Deutsch",
                    ja: "日本語",
                    ko: "한국어",
                  }[selected];
                  return <span>{selectedItem}</span>;
                }}
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: "700",
                  fontFamily: "Roboto Mono, Arial, sans-serif",
                  color: "background.default",
                  borderColor: "background.default",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none", // Remove the border
                  },
                  "& .MuiSelect-select": {
                    paddingTop: "10px",
                    paddingBottom: "10px",
                  },
                  "& .MuiSelect-icon": {
                    color: "background.default",
                  },
                }}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="zh">中文</MenuItem>
                <MenuItem value="es">Español</MenuItem>
                <MenuItem value="fr">Français</MenuItem>
                <MenuItem value="de">Deutsch</MenuItem>
                <MenuItem value="ja">日本語</MenuItem>
                <MenuItem value="ko">한국어</MenuItem>
              </Select>
            </FormControl>
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
                  color={message.role == "assistant" ? "text.primary" : "black"}
                  borderRadius={2.5}
                  p={2}
                >
                  <ReactMarkdown components={customComponents}>
                    {message.content}
                  </ReactMarkdown>
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
              placeholder={"Message"}
              autoFocus
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              aria-label={"Message input field"}
              sx={{
                borderRadius: "9999px", // Circular shape
                "& .MuiInputBase-root": {
                  borderRadius: "9999px", // Circular input field
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "9999px", // Circular outline
                },
                height: "48px", // Adjust the height to make it more circular
              }}
            />
            {/* microphone button */}
            <Button
              onClick={handleMicrophoneClick} // Single click handler for all states
              variant="outlined"
              disabled={isLoading} // Disable while loading
              sx={{
                color: "background.default",
                borderColor: "text.primary",
                borderRadius: "9999px",
                height: "48px",
                width: "48px",
                minWidth: "48px",
                "&:hover": {
                  backgroundColor: "text.primary",
                  color: "background.default",
                  borderColor: "text.primary",
                },
              }}
            >
              {isSpeaking ? (
                <StopIcon />
              ) : isListening ? (
                <SettingsVoiceIcon />
              ) : (
                <KeyboardVoiceIcon />
              )}
            </Button>
            {/* send button */}
            <Button
              variant="outlined"
              onClick={sendMessage}
              disabled={isLoading}
              sx={{
                color: "background.default",
                borderColor: "text.primary",
                borderRadius: "9999px", // Circular shape
                height: "48px", // Match height with TextField
                width: "48px", // Make it circular
                minWidth: "48px", // Ensure button stays circular
                "&:hover": {
                  backgroundColor: "text.primary",
                  color: "background.default",
                  borderColor: "text.primary",
                },
              }}
            >
              {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
            </Button>
            {/* clear history */}
            <Button
              onClick={clearChatLog}
              variant="outlined"
              disabled={isLoading}
              sx={{
                color: "background.default",
                borderColor: "text.primary",
                borderRadius: "9999px", // Circular shape
                height: "48px", // Match height with TextField
                width: "48px", // Make it circular
                minWidth: "48px", // Ensure button stays circular
                "&:hover": {
                  backgroundColor: "text.primary",
                  color: "background.default",
                  borderColor: "text.primary",
                },
              }}
            >
              <DeleteIcon />
            </Button>
          </Stack>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}
