import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
  Avatar,
  CssBaseline,
  Container,
} from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { SportsEsports } from '@mui/icons-material';

// Dark game theme from Dashboard.js
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#9c27b0' }, // Purple
    secondary: { main: '#2196f3' }, // Blue
    error: { main: '#f44336' }, // Red
    warning: { main: '#ff9800' }, // Orange
    info: { main: '#00bcd4' }, // Cyan
    success: { main: '#4caf50' }, // Green
    background: { default: '#121212', paper: '#1e1e1e' },
    text: { primary: '#ffffff', secondary: '#b3b3b3' },
  },
  typography: {
    fontFamily: '"Orbitron", "Roboto", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '1px' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 600,
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          '&:hover': { transform: 'translateY(-5px)' },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          backgroundColor: '#1e1e1e',
          '&:hover': { backgroundColor: '#2a2a2a' },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(156, 39, 176, 0.3)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(156, 39, 176, 0.5)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#9c27b0',
          },
        },
        icon: { color: '#ffffff' },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          backgroundColor: '#1e1e1e',
          '&:hover': { backgroundColor: '#2a2a2a' },
        },
      },
    },
  },
});

// Glowing text component
const GlowingText = styled(Typography)(({ theme, glowcolor = '#9c27b0' }) => ({
  color: '#ffffff',
  textShadow: `0 0 10px ${glowcolor}, 0 0 20px rgba(156, 39, 176, 0.5)`,
  fontWeight: 700,
}));

// Gradient button component
const GradientButton = styled('button')(({ theme }) => ({
  background: 'linear-gradient(45deg, #9c27b0 30%, #2196f3 90%)',
  border: 0,
  color: 'white',
  padding: '8px 16px',
  boxShadow: '0 3px 5px rgba(156, 39, 176, 0.3)',
  borderRadius: '8px',
  fontFamily: '"Orbitron", "Roboto", sans-serif',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 6px 10px rgba(156, 39, 176, 0.4)',
    transform: 'translateY(-2px)',
  },
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
}));

// Styled card with animated border
const GameCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#1e1e1e',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #9c27b0, #2196f3)',
    animation: 'borderAnimation 3s linear infinite',
    backgroundSize: '200% 200%',
  },
  '@keyframes borderAnimation': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
}));

const PlayAndLearn = ({ username }) => {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [elo, setElo] = useState(100);
  const [status, setStatus] = useState('Select an engine and make your move!');
  const [isLoading, setIsLoading] = useState(false);
  const [playerColor, setPlayerColor] = useState('w');
  const [gameStarted, setGameStarted] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [botProfile, setBotProfile] = useState(null);
  const [botCommentary, setBotCommentary] = useState('');

  const elos = [100, 400, 600, 800, 1000, 1200];

  useEffect(() => {
    const fetchBotProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bot-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ elo }),
        });
        const data = await response.json();
        setBotProfile(data);
      } catch (error) {
        console.error('Error fetching bot profile:', error);
      }
    };
    fetchBotProfile();
  }, [elo]);

  useEffect(() => {
    if (gameStarted && playerColor === 'b' && game.turn() === 'w' && moveHistory.length === 0) {
      makeEngineMove(game.fen());
    }
  }, [gameStarted, playerColor, moveHistory]);

  const startGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setMoveHistory([]);
    setStatus(`Playing as ${playerColor === 'w' ? 'White' : 'Black'} against ${botProfile?.name || 'Bot'} (ELO ${elo})`);
    setGameStarted(true);
    setBotCommentary('');
  };

  const makeEngineMove = async (currentFen) => {
    setIsLoading(true);
    try {
      const moveResponse = await fetch('http://localhost:5000/api/play/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fen: currentFen, elo }),
      });
      const moveData = await moveResponse.json();
      if (moveData.move) {
        const move = game.move({
          from: moveData.move.substring(0, 2),
          to: moveData.move.substring(2, 4),
          promotion: moveData.move.length > 4 ? moveData.move[4] : undefined,
        });
        if (move) {
          setFen(game.fen());
          setMoveHistory(game.history());
          checkGameStatus();
        } else {
          setStatus('Error: Invalid engine move.');
        }
      } else {
        setStatus('Error: Engine failed to respond.');
      }
    } catch (error) {
      setStatus('Error communicating with the server.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMove = async (sourceSquare, targetSquare, piece) => {
    if (!gameStarted) {
      setStatus('Please start the game!');
      return;
    }
    if (game.turn() !== playerColor) {
      setStatus("It's not your turn!");
      return;
    }
    try {
      const promotion = piece.toLowerCase().includes('p') && (targetSquare[1] === '8' || targetSquare[1] === '1') ? 'q' : undefined;
      const move = game.move({ from: sourceSquare, to: targetSquare, promotion });
      if (move) {
        const newFen = game.fen();
        setFen(newFen);
        setMoveHistory(game.history());
        checkGameStatus();

        try {
          const commentaryResponse = await fetch('http://localhost:5000/api/bot-commentary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fen: newFen,
              move: move.san,
              elo,
              botName: botProfile?.name || 'Bot',
              botStyle: botProfile?.style || 'Unknown',
              playerMove: true,
            }),
          });
          const commentaryData = await commentaryResponse.json();
          setBotCommentary(commentaryData.commentary);
        } catch (error) {
          console.error('Error fetching bot commentary:', error);
          setBotCommentary(`${botProfile?.name || 'Bot'}: Nice try with ${move.san}!`);
        }

        if (!game.isGameOver() && game.turn() !== playerColor) {
          makeEngineMove(newFen);
        }
      } else {
        setStatus('Illegal move. Try again.');
      }
    } catch (error) {
      setStatus('Illegal move. Try again.');
      console.error(error);
    }
  };

  const checkGameStatus = () => {
    if (game.isCheckmate()) {
      setStatus(game.turn() === 'w' ? `${botProfile?.name || 'Bot'} wins by checkmate!` : 'You win by checkmate!');
      setGameStarted(false);
      saveGame();
    } else if (game.isStalemate()) {
      setStatus('Game drawn by stalemate!');
      setGameStarted(false);
      saveGame();
    } else if (game.isDraw()) {
      setStatus('Game drawn!');
      setGameStarted(false);
      saveGame();
    } else {
      setStatus(`Playing as ${playerColor === 'w' ? 'White' : 'Black'} against ${botProfile?.name || 'Bot'} (ELO ${elo})`);
    }
  };

  const saveGame = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/save-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          pgn: game.pgn(),
          elo,
          result: game.isGameOver() ? (game.isCheckmate() ? (game.turn() === 'w' ? '0-1' : '1-0') : '1/2-1/2') : '*',
          botName: botProfile?.name || 'Bot',
        }),
      });
      if (!response.ok) {
        console.error('Error saving game:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setMoveHistory([]);
    setGameStarted(false);
    setBotCommentary('');
    setStatus('Select an engine and start a new game!');
  };

  const formattedMoveHistory = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    const moveNumber = Math.floor(i / 2) + 1;
    const whiteMove = moveHistory[i];
    const blackMove = moveHistory[i + 1] || '';
    formattedMoveHistory.push(`${moveNumber}. ${whiteMove} ${blackMove}`);
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'radial-gradient(circle at center, #1a1a2e 0%, #121212 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&:before': {
            content: '""',
            position: 'absolute',
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
        {/* Floating game icon animation */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            animation: 'float 6s ease-in-out infinite',
            opacity: 0.1,
            zIndex: 0,
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-20px)' },
            },
          }}
        >
          <SportsEsports sx={{ fontSize: 120 }} />
        </Box>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6, textAlign: 'center' }}>
            <GlowingText variant="h4" glowcolor="#9c27b0">
              Play & Learn
            </GlowingText>
            <Typography variant="subtitle1" sx={{ color: '#b3b3b3', mt: 1, textShadow: '0 0 5px rgba(255, 255, 255, 0.2)' }}>
              Challenge AI opponents and learn with interactive commentary
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Chessboard Section */}
            <Box sx={{ flexShrink: 0 }}>
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <GameCard sx={{ p: 2 }}>
                  <Chessboard
                    position={fen}
                    onPieceDrop={handleMove}
                    orientation={playerColor === 'w' ? 'white' : 'black'}
                    boardWidth={400}
                  />
                </GameCard>
              </motion.div>
            </Box>

            {/* Game Controls and Bot Profile */}
            <Box sx={{ flex: 1 }}>
              <GameCard sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <SportsEsports sx={{ color: '#9c27b0' }} />
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                    Game Controls
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Select
                    value={elo}
                    onChange={(e) => setElo(e.target.value)}
                    sx={{ width: '200px' }}
                    disabled={gameStarted}
                  >
                    {elos.map((eloLevel) => (
                      <MenuItem key={eloLevel} value={eloLevel}>
                        ELO {eloLevel}
                      </MenuItem>
                    ))}
                  </Select>
                  <Select
                    value={playerColor}
                    onChange={(e) => setPlayerColor(e.target.value)}
                    sx={{ width: '200px' }}
                    disabled={gameStarted}
                  >
                    <MenuItem value="w">Play as White</MenuItem>
                    <MenuItem value="b">Play as Black</MenuItem>
                  </Select>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <GradientButton onClick={startGame} disabled={gameStarted}>
                    Start Game
                  </GradientButton>
                  <GradientButton onClick={resetGame}>
                    Reset Game
                  </GradientButton>
                </Box>
                {isLoading && <CircularProgress size={24} sx={{ color: '#9c27b0' }} />}
                <Typography variant="body1" sx={{ mt: 2, color: '#b3b3b3' }}>
                  Status: {status}
                </Typography>
              </GameCard>

              {botProfile && (
                <GameCard sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${botProfile.name}`}
                      sx={{
                        width: 48,
                        height: 48,
                        background: 'linear-gradient(45deg, #9c27b0 30%, #2196f3 90%)',
                        boxShadow: '0 0 10px rgba(156, 39, 176, 0.5)',
                      }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ color: '#ffffff' }}>
                        {botProfile.name} (ELO {botProfile.elo})
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                        {botProfile.description}
                      </Typography>
                    </Box>
                  </Box>
                  {botCommentary && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Typography variant="body1" sx={{ mt: 2, color: '#ffffff' }}>
                        {botProfile.name}: "{botCommentary}"
                      </Typography>
                    </motion.div>
                  )}
                </GameCard>
              )}
            </Box>

            {/* Move History */}
            <Box sx={{ width: { xs: '100%', md: '200px' } }}>
              <GameCard sx={{ p: 2, maxHeight: '400px', overflowY: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <SportsEsports sx={{ color: '#2196f3' }} />
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                    Move History
                  </Typography>
                </Box>
                {formattedMoveHistory.length > 0 ? (
                  formattedMoveHistory.map((movePair, index) => (
                    <Typography key={index} variant="body2" sx={{ color: '#b3b3b3', mb: 0.5 }}>
                      {movePair}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: '#b3b3b3', textAlign: 'center' }}>
                    No moves yet.
                  </Typography>
                )}
              </GameCard>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default PlayAndLearn;