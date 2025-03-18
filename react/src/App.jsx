import { useState, useMemo, useEffect } from 'react'
import './App.css'
import { 
  Box, 
  Button, 
  CircularProgress, 
  Container, 
  Divider,
  FormControl, 
  IconButton,
  InputLabel, 
  MenuItem, 
  Paper,
  Select, 
  TextField, 
  Typography,
  createTheme,
  ThemeProvider,
  Tooltip,
  Fade,
  Stack
} from '@mui/material';
import axios from 'axios';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import EmailIcon from '@mui/icons-material/Email';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import GitHubIcon from '@mui/icons-material/GitHub';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('theme-mode');
    return savedMode || 'light';
  });
  const [copied, setCopied] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#2563eb' : '#60a5fa',
          },
          secondary: {
            main: mode === 'light' ? '#4f46e5' : '#818cf8',
          },
          background: {
            default: mode === 'light' ? '#f8fafc' : '#0f172a',
            paper: mode === 'light' ? '#ffffff' : '#1e293b',
          },
          text: {
            primary: mode === 'light' ? '#334155' : '#e2e8f0',
            secondary: mode === 'light' ? '#64748b' : '#94a3b8',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h3: {
            fontWeight: 600,
            fontSize: '2rem',
            '@media (min-width:600px)': {
              fontSize: '2.5rem',
            },
          },
          h6: {
            fontWeight: 600,
          },
          button: {
            fontWeight: 500,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: mode === 'light' 
                  ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
                  : '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 16,
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
        },
      }),
    [mode],
  );

  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
       emailContent,
       tone 
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('Failed to generate email reply. Please try again');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box 
        className={mode === 'dark' ? 'dark-mode' : ''}
        sx={{ 
          minHeight: '100vh', 
          bgcolor: 'background.default', 
          transition: 'all 0.3s ease',
          display: 'flex',
          flexDirection: 'column'
        }}>
        <Container maxWidth="md" sx={{ py: 4, flexGrow: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: '#fff', 
                  p: 1.5, 
                  borderRadius: 2,
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                }}
              >
                <EmailIcon fontSize="large" />
              </Box>
              <Typography variant='h3' component="h1" className="app-title">
                Email Reply Generator
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="View on GitHub">
                <IconButton 
                  color="inherit" 
                  sx={{ 
                    color: 'text.secondary',
                    bgcolor: mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
                    '&:hover': {
                      bgcolor: mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                    }
                  }}
                  onClick={() => window.open('https://github.com/manmohak07/email-writer-extension', '_blank')}
                >
                  <GitHubIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`} arrow>
                <IconButton 
                  onClick={toggleColorMode} 
                  color="primary" 
                  sx={{ 
                    p: 1.5,
                    bgcolor: mode === 'light' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(96, 165, 250, 0.1)',
                    '&:hover': {
                      bgcolor: mode === 'light' ? 'rgba(37, 99, 235, 0.2)' : 'rgba(96, 165, 250, 0.2)',
                    }
                  }}
                >
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Paper 
            elevation={mode === 'light' ? 1 : 4} 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              mb: 4, 
              boxShadow: mode === 'dark' 
                ? '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.5)' 
                : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
              border: mode === 'light' ? '1px solid rgba(0, 0, 0, 0.05)' : 'none'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmailIcon sx={{ mr: 1 }} /> Original Email
            </Typography>
            
            <TextField 
              fullWidth
              multiline
              rows={6}
              variant='outlined'
              placeholder="Paste the email you want to reply to here..."
              value={emailContent || ''}
              onChange={(e) => setEmailContent(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FormatColorTextIcon sx={{ mr: 1 }} /> Tone Selection
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select Tone (Optional)</InputLabel>
              <Select
                value={tone || ''}
                label="Select Tone (Optional)"
                onChange={(e) => setTone(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant='contained'
              onClick={handleSubmit}
              disabled={!emailContent || loading}
              fullWidth
              size="large"
              startIcon={loading ? null : <SendIcon />}
              sx={{ 
                py: 1.5,
                mt: 1,
                background: 'linear-gradient(45deg, #2563eb 30%, #4f46e5 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1d4ed8 30%, #4338ca 90%)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit"/> : "Generate Reply"}
            </Button>
          </Paper>

          {error && (
            <Fade in={!!error}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 3, 
                  mb: 4, 
                  bgcolor: 'error.light', 
                  boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.2), 0 2px 4px -2px rgba(220, 38, 38, 0.2)',
                  border: '1px solid rgba(220, 38, 38, 0.3)'
                }}
              >
                <Typography color='error.dark' fontWeight="500">
                  {error}
                </Typography>
              </Paper>
            </Fade>
          )}

          {generatedReply && (
            <Fade in={!!generatedReply}>
              <Paper 
                elevation={mode === 'light' ? 1 : 4} 
                sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  boxShadow: mode === 'dark' 
                    ? '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.5)' 
                    : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                  border: mode === 'light' ? '1px solid rgba(0, 0, 0, 0.05)' : 'none'
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SendIcon sx={{ mr: 1 }} /> Generated Reply
                </Typography>
                
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  variant='outlined'
                  value={generatedReply || ''}
                  inputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
                />
              
                <Button
                  variant='contained'
                  startIcon={<ContentCopyIcon />}
                  sx={{ 
                    mt: 1,
                    background: 'linear-gradient(45deg, #2563eb 30%, #4f46e5 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1d4ed8 30%, #4338ca 90%)',
                    }
                  }}
                  className={copied ? 'copy-success' : ''}
                  onClick={handleCopy}
                >
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </Button>
              </Paper>
            </Fade>
          )}
        </Container>
        
        <Box 
          component="footer" 
          sx={{ 
            py: 3, 
            bgcolor: mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0.2)',
            borderTop: mode === 'light' ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
            mt: 'auto'
          }}
        >
          <Container maxWidth="md">
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
