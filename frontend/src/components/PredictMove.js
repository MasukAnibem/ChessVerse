// src/PredictMove.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  Paper,
  TextField,
  CircularProgress,
  styled,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  ArrowBack as ArrowBackIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Define dark theme locally
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

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const PreviewImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '400px',
  borderRadius: '8px',
  marginTop: '16px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
});

function PredictMove() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fen, setFen] = useState('');
  const [bestMove, setBestMove] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError('');
      setFen('');
      setBestMove('');
      console.log('File selected:', selectedFile.name);
    }
  };

  const handlePredict = async () => {
    if (!file) {
      setError('Please upload a chessboard image.');
      console.error('No file uploaded');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      console.log('Sending image to backend...');
      const response = await fetch('http://localhost:5000/api/predict-move', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log('Backend response:', data);
      if (response.ok) {
        setFen(data.fen);
        setBestMove(data.move);
        setError('');
      } else {
        setError(data.error || 'Failed to process the image.');
        console.error('Backend error:', data.error);
      }
    } catch (err) {
      setError('Error connecting to the server.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2, color: '#9c27b0' }}
        >
          Back to Dashboard
        </Button>
        <Paper
          sx={{
            p: 4,
            background: 'linear-gradient(135deg, #1e1e1e 0%, #121212 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(156, 39, 176, 0.3)',
            boxShadow: '0 0 20px rgba(156, 39, 176, 0.5)',
          }}
        >
          <GlowingText variant="h4" glowcolor="#00bcd4">
            Predict Next Move
          </GlowingText>
          <Typography variant="body1" sx={{ color: '#b3b3b3', mt: 1, mb: 3 }}>
            Upload a chessboard image to detect the position and predict the best move.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{
                background: 'linear-gradient(45deg, #9c27b0 30%, #2196f3 90%)',
                mb: 2,
              }}
            >
              Upload Image
              <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
            </Button>

            {previewUrl && (
              <PreviewImage src={previewUrl} alt="Chessboard Preview" />
            )}

            {error && (
              <Typography variant="body2" sx={{ color: '#f44336', mt: 2 }}>
                {error}
              </Typography>
            )}

            {loading && <CircularProgress sx={{ mt: 2, color: '#9c27b0' }} />}

            {fen && (
              <Box sx={{ mt: 2, width: '100%' }}>
                <TextField
                  label="Detected FEN"
                  value={fen}
                  fullWidth
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(156, 39, 176, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(156, 39, 176, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#9c27b0' },
                    },
                  }}
                />
              </Box>
            )}

            {bestMove && (
              <Typography variant="h6" sx={{ color: '#00bcd4', mt: 2 }}>
                Best Move: {bestMove}
              </Typography>
            )}

            <GradientButton
              onClick={handlePredict}
              disabled={loading || !file}
              startIcon={<PsychologyIcon />}
              sx={{ mt: 3 }}
            >
              Predict Move
            </GradientButton>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default PredictMove;