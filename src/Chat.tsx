import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  Paper,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import { mainColor } from "./Style";

const API_URL = process.env.REACT_APP_API_URL!;

interface ChatProps {
  userA: string;
  userB: string;
}

const Chat: React.FC<ChatProps> = ({ userA, userB }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('Token is missing. Please log in.');
      return;
    }  

    const websocket = new WebSocket(`${API_URL}/ws/chat/${userA}/${userB}/${token}`);

    websocket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    websocket.onclose = () => console.log("WebSocket disconnected");

    setWs(websocket);

    return () => websocket.close();
  }, [userA, userB]);

  const sendMessage = () => {
    if (ws && input.trim() !== "") {
      ws.send(input);
      setInput("");
    }
  };

  return (
    <Box sx={{marginTop: 2, position: "relative" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsVisible((prev) => !prev)}
        sx={{
          backgroundColor: "black",
          border: "1px solid white",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <ChatIcon sx={{ color: "white" }} />
        {isVisible ? "Cerrar" : ""}
      </Button>

      {isVisible && (
        <Box
          sx={{
            p: 2,
            width: "98%",
            mx: "auto",
            bgcolor: mainColor,
            borderRadius: 2,
            marginTop: 2,
            color: "#ffffff",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Typography variant="h5" gutterBottom align="center" sx={{ color: "white" }}>
            Chat 🗪
          </Typography>
          <Paper
            sx={{
              maxHeight: 300,
              overflow: "auto",
              mb: 2,
              bgcolor: mainColor,
              border: "1px solid #444",
              color: "#ffffff",
            }}
            elevation={3}
          >
            <List>
              {messages.map((msg, index) => (
                <ListItem key={index}>
                  <Typography variant="body2" sx={{ color: "#ffffff" }}>
                    {msg}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
          <TextField
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribí..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            sx={{
              input: { color: "#ffffff" },
              bgcolor: mainColor,
              border: "1px solid #444",
              borderRadius: 1,
              mb: 2,
            }}
            InputProps={{
              style: { color: "#ffffff" },
            }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={sendMessage}
            sx={{
              border: "1px solid white",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "black",
              color: "white",
              "&:hover": { bgcolor: "#333333" },
            }}
          >
            <SendIcon sx={{ color: "white" }} />
            Enviar
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Chat;
