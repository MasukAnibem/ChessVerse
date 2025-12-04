import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ExpandMore as ExpandMoreIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { MenuBook as MenuBookIcon } from '@mui/icons-material';

// Reuse the dark theme from Dashboard
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9c27b0', // Purple
    },
    secondary: {
      main: '#2196f3', // Blue
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  typography: {
    fontFamily: '"Orbitron", "Roboto", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '1px',
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      lineHeight: 1.6,
    },
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          borderRadius: '8px',
          marginBottom: '16px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(156, 39, 176, 0.2)',
          '&:before': {
            display: 'none',
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, rgba(156, 39, 176, 0.1) 30%, rgba(33, 150, 243, 0.1) 90%)',
          borderRadius: '8px',
          '&:hover': {
            background: 'linear-gradient(45deg, rgba(156, 39, 176, 0.2) 30%, rgba(33, 150, 243, 0.2) 90%)',
          },
        },
        content: {
          alignItems: 'center',
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
const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #9c27b0 30%, #2196f3 90%)',
  border: 0,
  color: 'white',
  padding: '8px 16px',
  boxShadow: '0 3px 5px rgba(156, 39, 176, 0.3)',
  '&:hover': {
    boxShadow: '0 6px 10px rgba(156, 39, 176, 0.4)',
    transform: 'translateY(-2px)',
  },
}));

const ChessBooks = () => {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={darkTheme}>
      <Container
        maxWidth="lg"
        sx={{
          minHeight: '100vh',
          background: 'radial-gradient(circle at center, #1a1a2e 0%, #121212 100%)',
          py: 4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Back Button */}
        <Box sx={{ mb: 4 }}>
          <GradientButton
            onClick={() => navigate('/dashboard')}
            startIcon={<ArrowBackIcon />}
          >
            Back to Dashboard
          </GradientButton>
        </Box>

        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <GlowingText variant="h4" glowcolor="#9c27b0">
            Chess Knowledge Hub
          </GlowingText>
          <Typography variant="subtitle1" sx={{ color: '#b3b3b3', mt: 2, maxWidth: '800px', mx: 'auto' }}>
            Chess, a game of strategy and intellect, originated in India around the 6th century AD as "Chaturanga." It evolved over centuries, spreading to Persia, the Arab world, and Europe, becoming the modern game we know today. Below, explore essential rules, strategies, and tactics to elevate your game.
          </Typography>
        </Box>

        {/* Accordion Sections for Chess Topics */}
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#9c27b0' }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MenuBookIcon sx={{ color: '#9c27b0' }} />
                <Typography variant="h6">How to Play Chess</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                Chess is a two-player strategy game played on an 8x8 board. The objective is to checkmate your opponent's king, putting it under attack with no legal moves to escape. Each player starts with 16 pieces: 1 king, 1 queen, 2 rooks, 2 knights, 2 bishops, and 8 pawns.
                <br /><br />
                <strong>Basic Moves:</strong>
                <ul>
                  <li><strong>King:</strong> Moves one square in any direction.</li>
                  <li><strong>Queen:</strong> Moves any number of squares in any direction.</li>
                  <li><strong>Rook:</strong> Moves any number of squares horizontally or vertically.</li>
                  <li><strong>Bishop:</strong> Moves any number of squares diagonally.</li>
                  <li><strong>Knight:</strong> Moves in an L-shape (two squares in one direction, then one perpendicular).</li>
                  <li><strong>Pawn:</strong> Moves forward one square (or two from its starting position); captures diagonally.</li>
                </ul>
                Start by setting up the board with white pieces on ranks 1 and 2, black on 7 and 8. White moves first, and players alternate turns.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#9c27b0' }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MenuBookIcon sx={{ color: '#9c27b0' }} />
                <Typography variant="h6">Basic Rules</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                Understanding the rules is key to mastering chess. Here are the essentials:
                <ul>
                  <li><strong>Check:</strong> When a king is under direct attack, it must escape, block, or capture the attacking piece.</li>
                  <li><strong>Checkmate:</strong> When a king cannot escape check, the game ends.</li>
                  <li><strong>Stalemate:</strong> A draw occurs if a player has no legal moves and their king is not in check.</li>
                  <li><strong>Castling:</strong> A special move involving the king and rook, allowing the king to move two squares toward the rook, which then moves to the king's opposite side. Conditions: neither piece has moved, no pieces are between them, and the king isn't in check.</li>
                  <li><strong>En Passant:</strong> A pawn capturing move when an opponent's pawn advances two squares from its starting position, allowing capture as if it moved one square.</li>
                  <li><strong>Promotion:</strong> A pawn reaching the opponent's back rank can be promoted to a queen, rook, bishop, or knight.</li>
                </ul>
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#9c27b0' }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MenuBookIcon sx={{ color: '#9c27b0' }} />
                <Typography variant="h6">Opening Book Moves</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                The opening sets the tone for the game. Here are some popular openings:
                <ul>
                  <li><strong>Italian Game (1. e4 e5 2. Nf3 Nc6 3. Bc4):</strong> Aims for rapid development and control of the center.</li>
                  <li><strong>Sicilian Defense (1. e4 c5):</strong> Black plays asymmetrically to challenge White's center and prepare counterattacks.</li>
                  <li><strong>Queen's Gambit (1. d4 d5 2. c4):</strong> White offers a pawn to gain central control and open lines for pieces.</li>
                  <li><strong>Ruy Lopez (1. e4 e5 2. Nf3 Nc6 3. Bb5):</strong> Pressures Black's knight and prepares for castling.</li>
                </ul>
                <strong>Principles:</strong> Control the center (d4, d5, e4, e5), develop knights and bishops early, castle to protect your king, and avoid moving the same piece multiple times in the opening.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#9c27b0' }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MenuBookIcon sx={{ color: '#9c27b0' }} />
                <Typography variant="h6">Midgame Tactics</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                The midgame is where strategy and tactics shine. Key tactics include:
                <ul>
                  <li><strong>Fork:</strong> One piece attacks two or more enemy pieces simultaneously (e.g., a knight attacking a king and queen).</li>
                  <li><strong>Pin:</strong> A piece is pinned to a more valuable piece, preventing it from moving without exposing the valuable piece (e.g., bishop pinning a knight to a king).</li>
                  <li><strong>Discovered Attack:</strong> Moving one piece reveals an attack by another (e.g., moving a bishop to uncover a rook's attack).</li>
                  <li><strong>Skewer:</strong> An attack on a valuable piece forces it to move, exposing a less valuable piece behind it.</li>
                </ul>
                Focus on piece coordination, king safety, and creating threats while maintaining a solid pawn structure.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#9c27b0' }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MenuBookIcon sx={{ color: '#9c27b0' }} />
                <Typography variant="h6">Endgame Strategies</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                The endgame focuses on king activity and pawn promotion. Key strategies:
                <ul>
                  <li><strong>Activate Your King:</strong> In the endgame, the king becomes a fighting piece, moving toward the center to support pawns or attack.</li>
                  <li><strong>Pawn Promotion:</strong> Push pawns toward the opponent's back rank to promote them to queens.</li>
                  <li><strong>Opposition:</strong> A technique where your king faces the opponent's king with one square between them, forcing the opponent to give way.</li>
                  <li><strong>Zugzwang:</strong> Forcing your opponent into a position where any move worsens their position.</li>
                </ul>
                Study basic checkmates like king and queen vs. king or king and rook vs. king to ensure you can close out games effectively.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ChessBooks;