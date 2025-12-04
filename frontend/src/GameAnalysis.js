import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';
import {
  Box,
  Typography,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Tooltip,
  IconButton,
  CssBaseline,
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ShareIcon from '@mui/icons-material/Share';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

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

function GameAnalysis({ username }) {
  const { analysisId } = useParams();
  const navigate = useNavigate();
  const [pgn, setPgn] = useState('');
  const [analysis, setAnalysis] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [selectedFEN, setSelectedFEN] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showArrows, setShowArrows] = useState(true);
  const [showBestMove, setShowBestMove] = useState(true);
  const [expandedMove, setExpandedMove] = useState(null);

  useEffect(() => {
    if (analysisId && analysisId !== 'new') {
      setIsLoading(true);
      fetch(`http://localhost:5000/api/analysis-history/${username}`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          const entry = data.history.find((h) => h.id === analysisId);
          if (entry) {
            setPgn(entry.pgn);
            if (entry.analysis.length > 0) {
              const validatedAnalysis = entry.analysis.map((move) => ({
                ...move,
                evaluation: sanitizeEvaluation(move.evaluation, move.player),
                classification: move.classification || inferClassification(move),
                coach_commentary: sanitizeCommentary(move.coach_commentary),
              }));
              setAnalysis(validatedAnalysis);
              const lastMove = entry.last_viewed_move || 0;
              setCurrentMove(lastMove);
              setSelectedFEN(validatedAnalysis[lastMove]?.board_fen || null);
            } else {
              handleAnalyze(null, entry.pgn);
            }
          } else {
            setError('Analysis not found');
          }
        })
        .catch((err) => setError('Failed to load analysis history: ' + err.message))
        .finally(() => setIsLoading(false));
    }
  }, [analysisId, username]);

  const sanitizeEvaluation = (evaluation, player) => {
    if (typeof evaluation === 'object' && evaluation !== null && '$numberDouble' in evaluation) {
      if (evaluation['$numberDouble'] === 'NaN' || evaluation['$numberDouble'] === 'Infinity') {
        return player === 'white' ? 1000 : -1000;
      }
      return parseFloat(evaluation['$numberDouble']) || 0;
    }
    if (!isFinite(evaluation) || evaluation === null || evaluation === undefined) {
      return player === 'white' ? 1000 : -1000;
    }
    return Math.max(-1000, Math.min(1000, evaluation));
  };

  const inferClassification = (move) => {
    if (move.evaluation >= 1000) return 'Checkmate';
    if (move.evaluation <= -1000) return 'Checkmate';
    const evalDiff = Math.abs(move.evaluation - move.predicted_evaluation);
    if (evalDiff > 3) return 'Blunder';
    if (evalDiff > 1.5) return 'Mistake';
    if (evalDiff > 0.75) return 'Inaccuracy';
    if (evalDiff < -1) return 'Brilliant';
    if (evalDiff < -0.5) return 'Excellent';
    return 'Standard';
  };

  const sanitizeCommentary = (commentary) => {
    if (typeof commentary === 'string' && commentary.includes('429 You exceeded your current quota')) {
      return 'Coach commentary unavailable due to API limits. Please try again later.';
    }
    return commentary || 'No coach commentary available';
  };

  const handleAnalyze = async (e, pgnToAnalyze = pgn) => {
    if (e) e.preventDefault();
    if (!pgnToAnalyze) {
      setError('Please enter a PGN.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/analyze_game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pgn: pgnToAnalyze }),
      });
      if (!response.ok) throw new Error('Analysis failed');
      const data = await response.json();
      if (data.analysis) {
        const validatedAnalysis = data.analysis.map((move) => ({
          ...move,
          evaluation: sanitizeEvaluation(move.evaluation, move.player),
          classification: move.classification || inferClassification(move),
          coach_commentary: sanitizeCommentary(move.coach_commentary),
        }));
        setAnalysis(validatedAnalysis);
        setCurrentMove(0);
        setSelectedFEN(validatedAnalysis[0]?.board_fen || 'start');
        setError('');

        if (!analysisId || analysisId === 'new') {
          const saveResponse = await fetch('http://localhost:5000/api/save-analysis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username,
              pgn: pgnToAnalyze,
              analysis: validatedAnalysis,
              last_viewed_move: 0,
              comments: [],
            }),
          });
          const saveData = await saveResponse.json();
          navigate(`/analysis/${saveData.id}`);
        } else {
          await fetch(`http://localhost:5000/api/update-last-viewed/${analysisId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ last_viewed_move: 0, analysis: validatedAnalysis }),
          });
        }
      } else {
        setError('Analysis failed.');
      }
    } catch (error) {
      setError('Click Analyze to start analysis: ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveClick = (moveIndex) => {
    setCurrentMove(moveIndex);
    setSelectedFEN(analysis[moveIndex].board_fen);
    if (analysisId && analysisId !== 'new') {
      fetch(`http://localhost:5000/api/update-last-viewed/${analysisId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ last_viewed_move: moveIndex }),
      }).catch((err) => console.error('Failed to update last viewed:', err));
    }
  };

  const handleMoveChange = (direction) => {
    const newMove = direction === 'next' ? currentMove + 1 : currentMove - 1;
    if (newMove >= 0 && newMove < analysis.length) {
      setCurrentMove(newMove);
      setSelectedFEN(analysis[newMove].board_fen);
      if (analysisId && analysisId !== 'new') {
        fetch(`http://localhost:5000/api/update-last-viewed/${analysisId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ last_viewed_move: newMove }),
        }).catch((err) => console.error('Failed to update last viewed:', err));
      }
    }
  };

  const getMoveAnnotation = (moveIndex) => {
    if (!analysis[moveIndex]) return { symbol: '', color: 'black', message: '', severity: 1 };
    
    const move = analysis[moveIndex];
    const classification = move.classification || inferClassification(move);
    
    const annotations = {
      'Checkmate': { symbol: '#', color: '#00C851', message: 'Checkmate', severity: 0 },
      'Blunder': { symbol: '??', color: '#ff4444', message: 'Blunder', severity: 4 },
      'Mistake': { symbol: '?', color: '#ff8800', message: 'Mistake', severity: 3 },
      'Inaccuracy': { symbol: '?!', color: '#ffbb33', message: 'Inaccuracy', severity: 2 },
      'Brilliant': { symbol: '!!', color: '#00C851', message: 'Brilliant', severity: 0 },
      'Excellent': { symbol: '!', color: '#5cb85c', message: 'Excellent', severity: 1 },
      'Standard': { symbol: '', color: '#33b5e5', message: 'Standard', severity: 1 },
    };

    return annotations[classification] || annotations['Standard'];
  };

  const getCoachFeedback = (moveIndex) => {
    if (!analysis[moveIndex]) return { message: '', showFollowUp: false, suggestions: [] };
    
    const move = analysis[moveIndex];
    const annotation = getMoveAnnotation(moveIndex);
    
    let feedback = {
      message: move.coach_commentary,
      showFollowUp: annotation.severity >= 2,
      suggestions: []
    };

    if (annotation.severity >= 2) {
      feedback.suggestions = [
        `Consider ${move.predicted_best_move} instead`,
        'Control the center more effectively',
        'Develop your pieces toward the king',
        'Look for tactical opportunities'
      ];
    }

    return feedback;
  };

  const customSquareStyles = () => {
    if (!analysis[currentMove]) return {};
    
    const styles = {};
    const move = analysis[currentMove].played_move;
    const bestMove = analysis[currentMove].predicted_best_move;
    
    if (move) {
      const fromSquare = move.slice(0, 2);
      const toSquare = move.slice(2, 4);
      styles[fromSquare] = { backgroundColor: 'rgba(0, 255, 0, 0.4)' };
      styles[toSquare] = { backgroundColor: getMoveAnnotation(currentMove).color + '80' };
    }
  
    if (showBestMove && bestMove && bestMove !== move) {
      const bestFrom = bestMove.slice(0, 2);
      const bestTo = bestMove.slice(2, 4);
      styles[bestFrom] = { ...styles[bestFrom], backgroundColor: 'rgba(255, 255, 0, 0.4)' };
      styles[bestTo] = { ...styles[bestTo], backgroundColor: 'rgba(255, 255, 0, 0.4)' };
    }
    
    return styles;
  };

  const customArrows = () => {
    if (!analysis[currentMove] || !showArrows) return [];
    
    const arrows = [];
    const move = analysis[currentMove].played_move;
    const bestMove = analysis[currentMove].predicted_best_move;
    
    if (move) {
      arrows.push({
        start: move.slice(0, 2),
        end: move.slice(2, 4),
        color: getMoveAnnotation(currentMove).color
      });
    }
    
    if (showBestMove && bestMove && bestMove !== move) {
      arrows.push({
        start: bestMove.slice(0, 2),
        end: bestMove.slice(2, 4),
        color: '#ffff00'
      });
    }
    
    return arrows;
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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, position: "relative", zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <GlowingText variant="h4" glowcolor="#9c27b0">
              Game Analysis
            </GlowingText>
            <Box>
              <Tooltip title="Toggle move arrows">
                <IconButton onClick={() => setShowArrows(!showArrows)} sx={{ color: showArrows ? '#9c27b0' : '#b3b3b3' }}>
                  <ArrowForwardIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Toggle best move highlights">
                <IconButton onClick={() => setShowBestMove(!showBestMove)} sx={{ color: showBestMove ? '#9c27b0' : '#b3b3b3' }}>
                  <LightbulbIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share analysis">
                <IconButton sx={{ color: '#2196f3' }}>
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {error && (
            <Typography variant="body2" sx={{ color: '#f44336', mb: 2 }}>
              {error}
            </Typography>
          )}
          {isLoading && (
            <Typography variant="body2" sx={{ color: '#b3b3b3', textAlign: 'center' }}>
              Loading...
            </Typography>
          )}

          {!isLoading && (
            <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
              <Box sx={{ flex: 1, minWidth: 300 }}>
                <GameCard sx={{ p: 2 }}>
                  <GradientButton
                    onClick={handleAnalyze}
                    startIcon={<SportsEsportsIcon />}
                    sx={{ mb: 2, width: '400px' }}
                  >
                    Analyze
                  </GradientButton>
                  <Chessboard
                    position={selectedFEN || (analysis[0]?.board_fen || 'start')}
                    boardWidth={400}
                    customBoardStyle={{
                      borderRadius: '4px',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                    }}
                    customSquareStyles={customSquareStyles()}
                    customArrows={customArrows()}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <GradientButton
                      startIcon={<ArrowBackIcon />}
                      onClick={() => handleMoveChange('prev')}
                      disabled={currentMove === 0}
                    >
                      Previous
                    </GradientButton>
                    <GradientButton
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => handleMoveChange('next')}
                      disabled={currentMove === analysis.length - 1}
                    >
                      Next
                    </GradientButton>
                  </Box>
                  {analysis[currentMove] && (
                    <Box sx={{ mt: 2, p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
                      <Typography variant="h6" sx={{ mb: 1, color: '#fff' }}>
                        Move {Math.floor(currentMove / 2) + 1} ({analysis[currentMove].player})
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                        <Chip 
                          label={`Played: ${analysis[currentMove].played_move}`} 
                          sx={{ 
                            background: getMoveAnnotation(currentMove).severity >= 2 ? '#f44336' : '#2196f3',
                            color: '#fff',
                          }} 
                        />
                        <Chip 
                          label={`Best: ${analysis[currentMove].predicted_best_move}`} 
                          sx={{ 
                            background: '#4caf50',
                            color: '#fff',
                            opacity: showBestMove ? 1 : 0.5,
                          }} 
                        />
                      </Box>
                      {/* <Typography sx={{ color: '#b3b3b3' }}>
                        Evaluation: {analysis[currentMove].evaluation.toFixed(2)}
                      </Typography>
                      <Typography sx={{ color: '#b3b3b3' }}>
                        Difference: {(analysis[currentMove].evaluation - analysis[currentMove].predicted_evaluation).toFixed(2)}
                      </Typography> */}
                      <Chip 
                        label={getMoveAnnotation(currentMove).message} 
                        sx={{ 
                          mt: 1,
                          backgroundColor: getMoveAnnotation(currentMove).color,
                          color: '#fff',
                        }} 
                      />
                    </Box>
                  )}
                </GameCard>
              </Box>

              <Box sx={{ flex: 1 }}>
                <GameCard sx={{ p: 2, mb: 3, minHeight: 200 }}>
                  <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', color: '#fff' }}>
                    <LightbulbIcon sx={{ color: '#9c27b0', mr: 1 }} />
                    Coach's Analysis
                  </Typography>
                  <Typography sx={{ color: '#b3b3b3' }}>
                    {getCoachFeedback(currentMove).message}
                  </Typography>
                  {getCoachFeedback(currentMove).suggestions.length > 0 && (
                    <>
                      <Divider sx={{ my: 2, borderColor: 'rgba(156, 39, 176, 0.3)' }} />
                      <Typography variant="subtitle1" sx={{ mb: 1, color: '#fff' }}>
                        Suggested Improvements:
                      </Typography>
                      <Box component="ul" sx={{ pl: 3 }}>
                        {getCoachFeedback(currentMove).suggestions.map((suggestion, i) => (
                          <Box component="li" key={i}>
                            <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
                              {suggestion}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </>
                  )}
                  {getCoachFeedback(currentMove).showFollowUp && (
                    <GradientButton 
                      sx={{ mt: 2 }}
                      onClick={() => {
                        alert('Showing deeper analysis for this position...');
                      }}
                    >
                      Show Detailed Analysis
                    </GradientButton>
                  )}
                </GameCard>

                <GameCard sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1, color: '#fff' }}>
                    Move List
                  </Typography>
                  <List sx={{ maxHeight: 400, overflow: 'auto', bgcolor: 'background.paper', borderRadius: 1 }}>
                    {analysis.map((moveInfo, index) => {
                      const annotation = getMoveAnnotation(index);
                      return (
                        <Accordion 
                          key={index} 
                          expanded={expandedMove === index}
                          onChange={() => setExpandedMove(expandedMove === index ? null : index)}
                          sx={{ 
                            boxShadow: 'none',
                            borderBottom: '1px solid',
                            borderColor: 'rgba(156, 39, 176, 0.3)',
                            '&:before': { display: 'none' },
                            backgroundColor: 'background.paper',
                          }}
                        >
                          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#9c27b0' }} />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                              <Box sx={{ 
                                width: 8, 
                                height: 8, 
                                borderRadius: '50%', 
                                bgcolor: annotation.color,
                                mr: 1 
                              }} />
                              <Typography sx={{ flex: 1, color: '#fff' }}>
                                {Math.floor(index / 2) + 1}.{moveInfo.player === 'white' ? ' ' : '..'} {moveInfo.played_move} {annotation.symbol}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                                {moveInfo.evaluation.toFixed(2)}
                              </Typography>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography variant="body2" sx={{ mb: 1, color: '#b3b3b3' }}>
                              <strong>Best move:</strong> {moveInfo.predicted_best_move} ({moveInfo.predicted_evaluation.toFixed(2)})
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                              <strong>Coach:</strong> {getCoachFeedback(index).message}
                            </Typography>
                            {getCoachFeedback(index).suggestions.length > 0 && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="subtitle2" sx={{ color: '#fff' }}>
                                  Suggestions:
                                </Typography>
                                <ul style={{ marginTop: 4, paddingLeft: 20 }}>
                                  {getCoachFeedback(index).suggestions.map((suggestion, i) => (
                                    <li key={i}>
                                      <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                                        {suggestion}
                                      </Typography>
                                    </li>
                                  ))}
                                </ul>
                              </Box>
                            )}
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}
                  </List>
                </GameCard>
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default GameAnalysis;