import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  CssBaseline,
  Container,
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import {
  SportsEsports as SportsEsportsIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';

// Dark game theme with vibrant accents
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#9c27b0", // Purple
    },
    secondary: {
      main: "#2196f3", // Blue
    },
    error: {
      main: "#f44336", // Red
    },
    warning: {
      main: "#ff9800", // Orange
    },
    info: {
      main: "#00bcd4", // Cyan
    },
    success: {
      main: "#4caf50", // Green
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b3b3b3",
    },
  },
  typography: {
    fontFamily: '"Orbitron", "Roboto", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: "1px",
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          padding: "8px 16px",
          fontWeight: 600,
          transition: "all 0.3s ease",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
          },
        },
      },
    },
  },
});

// Glowing text component
const GlowingText = styled(Typography)(({ theme, glowcolor = "#9c27b0" }) => ({
  color: "#ffffff",
  textShadow: `0 0 10px ${glowcolor}, 0 0 20px rgba(156, 39, 176, 0.5)`,
  fontWeight: 700,
}));

// Gradient button component
const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #9c27b0 30%, #2196f3 90%)",
  border: 0,
  color: "white",
  padding: "8px 16px",
  boxShadow: "0 3px 5px rgba(156, 39, 176, 0.3)",
  "&:hover": {
    boxShadow: "0 6px 10px rgba(156, 39, 176, 0.4)",
    transform: "translateY(-2px)",
  },
}));

// Styled card with animated border
const GameCard = styled(Box)(({ theme }) => ({
  backgroundColor: "#1e1e1e",
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  position: "relative",
  overflow: "hidden",
  padding: theme.spacing(4),
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #9c27b0, #2196f3)",
    animation: "borderAnimation 3s linear infinite",
    backgroundSize: "200% 200%",
  },
  "@keyframes borderAnimation": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
}));

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordError('');
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      setAuthMessage(data.message || 'Registration successful!');
    } catch (error) {
      setAuthMessage('Error during registration.');
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at center, #1a1a2e 0%, #121212 100%)",
          position: "relative",
          overflow: "hidden",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C27B0' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")",
            opacity: 0.3,
            zIndex: 0,
          },
        }}
      >
        {/* Floating chess piece animation */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            left: "5%",
            animation: "float 6s ease-in-out infinite",
            opacity: 0.1,
            zIndex: 0,
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-20px)" },
            },
          }}
        >
          <SportsEsportsIcon sx={{ fontSize: 120 }} />
        </Box>

        <Container maxWidth="sm" sx={{ mt: 8, mb: 4, position: "relative", zIndex: 1 }}>
          <GameCard>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <GlowingText variant="h4" glowcolor="#9c27b0">
                Join the Chess Verse
              </GlowingText>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#b3b3b3",
                  mt: 1,
                  textShadow: "0 0 5px rgba(255, 255, 255, 0.2)",
                }}
              >
                Register to start your chess journey
              </Typography>
            </Box>
            <Box component="form" onSubmit={handleRegister} sx={{ width: '100%' }}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(156, 39, 176, 0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(156, 39, 176, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#9c27b0",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#b3b3b3",
                  },
                  "& .MuiInputBase-input": {
                    color: "#ffffff",
                  },
                }}
              />
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(156, 39, 176, 0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(156, 39, 176, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#9c27b0",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#b3b3b3",
                  },
                  "& .MuiInputBase-input": {
                    color: "#ffffff",
                  },
                }}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(156, 39, 176, 0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(156, 39, 176, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#9c27b0",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#b3b3b3",
                  },
                  "& .MuiInputBase-input": {
                    color: "#ffffff",
                  },
                }}
              />
              <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                error={!!passwordError}
                helperText={passwordError}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(156, 39, 176, 0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(156, 39, 176, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#9c27b0",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#b3b3b3",
                  },
                  "& .MuiInputBase-input": {
                    color: "#ffffff",
                  },
                }}
              />
              <GradientButton
                type="submit"
                fullWidth
                sx={{ mt: 2 }}
                startIcon={<CloudUploadIcon />}
              >
                Register
              </GradientButton>
            </Box>
            {authMessage && (
              <Typography
                variant="body2"
                sx={{ color: "#f44336", mt: 2, textAlign: "center" }}
              >
                {authMessage}
              </Typography>
            )}
            <Typography
              variant="body2"
              sx={{ mt: 2, color: "#b3b3b3", textAlign: "center" }}
            >
              Already have an account?{' '}
              <Link to="/login" style={{ color: "#2196f3" }}>
                Login here
              </Link>
            </Typography>
          </GameCard>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Register;