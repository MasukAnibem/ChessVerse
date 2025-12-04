import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

// Dark game theme with vibrant accents
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#9c27b0' },
    secondary: { main: '#2196f3' },
    error: { main: '#f44336' },
    warning: { main: '#ff9800' },
    info: { main: '#00bcd4' },
    success: { main: '#4caf50' },
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
          color: 'white',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          transition: 'all 0.3s ease',
          '&:hover': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
});

// Glowing text component
const GlowingText = styled(Typography)(({ theme, glowcolor = '#ff9800' }) => ({
  color: '#ffffff',
  textShadow: `0 0 10px ${glowcolor}, 0 0 20px rgba(156, 39, 176, 0.5)`,
  fontWeight: 700,
}));

// Styled card with animated border
const CardContent = styled(Box)(({ theme }) => ({
  backgroundColor: '#1e1e1e',
  borderRadius: 16,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
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
    background: 'linear-gradient(to right, #9c27b0, #2196f3)',
    animation: 'borderAnimation 3s linear infinite',
    backgroundSize: '200% 200%',
  },
  '@keyframes borderAnimation': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
}));

function GrandmasterGames({ username }) {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [gameState, setGameState] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/grandmaster-games');
      const data = await response.json();
      console.log('Fetched games response:', data);
      if (response.ok && Array.isArray(data.games)) {
        const uniqueGames = [];
        const seen = new Set();
        data.games.forEach((game) => {
          const key = `${game.event}|${game.date}|${game.white}|${game.black}`;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueGames.push({
              ...game,
              id: game.id || `${game.player}_${game.event}_${game.date}`.replace(/[\s.]/g, '_'),
              moves: game.moves || '',
            });
          }
        });
        console.log('Processed games:', uniqueGames);
        setGames(uniqueGames);
        setGameState(uniqueGames);
        setError(uniqueGames.length === 0 ? 'No valid games found in JSON' : '');
      } else {
        setError(data.error || 'Failed to fetch grandmaster games');
        setGameState([]);
        console.warn('Invalid response:', data);
      }
    } catch (err) {
      setError('Error fetching games: ' + err.message);
      setGameState([]);
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    if (!Array.isArray(games)) {
      setGameState([]);
      return;
    }
    const filtered = games.filter((game) => {
      try {
        return (
          (game.white?.toLowerCase() || '').includes(term) ||
          (game.black?.toLowerCase() || '').includes(term) ||
          (game.event?.toLowerCase() || '').includes(term) ||
          (game.date || '').includes(term) ||
          (game.player?.toLowerCase() || '').includes(term)
        );
      } catch (e) {
        console.error('Error filtering game:', game, e);
        return false;
      }
    });
    console.log('Filtered games:', filtered);
    setGameState(filtered);
  };

  const handleGameClick = async (game) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/analyze_grandmaster_game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pgn: game.moves }),
      });
      const data = await response.json();
      if (response.ok && data.analysis) {
        const saveResponse = await fetch('http://localhost:5000/api/save-grandmaster-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            pgn: game.moves,
            game_id: game.id,
            analysis: data.analysis,
            last_viewed_move: 0,
            comments: [],
          }),
        });
        const saveData = await saveResponse.json();
        if (saveResponse.ok) {
          navigate(`/analysis/${saveData.id}`);
        } else {
          setError(saveData.error || 'Failed to save analysis');
        }
      } else {
        setError(data.error || 'Failed to analyze game');
      }
    } catch (err) {
      setError('Error analyzing game: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="lg" sx={{ mt: '2rem', mb: '6rem', position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>
          <GlowingText variant="h4" glowcolor="#ff9800">
            Learn from Grandmasters
          </GlowingText>
          <Typography
            variant="subtitle1"
            sx={{ color: '#b3b3b3', mt: 1, textShadow: '0 0 5px rgba(255, 255, 255, 0.2)' }}
          >
            Study legendary chess games from the world's greatest players
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="Search Games"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#b3b3b3' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(156, 39, 176, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(156, 39, 176, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#9c27b0' },
              },
            }}
          />

          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress sx={{ color: '#9c27b0' }} />
            </Box>
          )}

          {error && (
            <Typography variant="body2" sx={{ color: '#f44336', mb: 2 }}>
              {error}
            </Typography>
          )}

          {!isLoading && (
            <List
              sx={{
                maxHeight: 500,
                overflowY: 'auto',
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(156, 39, 176, 0.5)',
                  borderRadius: '10px',
                },
              }}
            >
              {Array.isArray(gameState) && gameState.length > 0 ? (
                gameState.map((game) => (
                  <ListItem key={game.id} disablePadding>
                    <ListItemButton
                      onClick={() => handleGameClick(game)}
                      sx={{
                        borderRadius: '8px',
                        mb: 1,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: 'rgba(156, 39, 176, 0.2)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemText
                        primary={`${game.white || 'Unknown'} vs ${game.black || 'Unknown'} (${
                          game.result || '?'
                        })`}
                        secondary={`${game.event || 'Unknown Event'} - ${game.date || 'Unknown Date'} (${
                          game.player || 'Unknown Player'
                        })`}
                        primaryTypographyProps={{ fontWeight: 500, color: '#fff' }}
                        secondaryTypographyProps={{ color: '#b3b3b3', fontSize: '0.8rem' }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))
              ) : (
                <Typography sx={{ color: '#b3b3b3', textAlign: 'center' }}>
                  No games found
                </Typography>
              )}
            </List>
          )}
        </CardContent>
      </Container>
    </ThemeProvider>
  );
}

export default GrandmasterGames;