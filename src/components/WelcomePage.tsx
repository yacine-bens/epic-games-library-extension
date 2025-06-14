import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import StoreIcon from '@mui/icons-material/Store';
import LoginIcon from '@mui/icons-material/Login';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SettingsIcon from '@mui/icons-material/Settings';
import GitHubIcon from '@mui/icons-material/GitHub';
import StarIcon from '@mui/icons-material/Star';
import Link from '@mui/material/Link';

const darkGamingTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00d4ff",
      dark: "#0099cc",
    },
    secondary: {
      main: "#ff6b35",
      dark: "#cc5529",
    },
    background: {
      default: "#0a0e1a",
      paper: "#1a1f2e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b8c4",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
      color: "#00d4ff",
      WebkitBackgroundClip: "text",
    },
    h5: {
      fontWeight: 600,
      color: "#00d4ff",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "linear-gradient(145deg, #1a1f2e 0%, #252b3d 100%)",
          border: "1px solid #2a3441",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

const GITHUB_REPO = "https://github.com/yacine-bens/epic-games-library-extension";
const CWS_LINK = "https://chromewebstore.google.com/detail/hfhellofkjebbchcdffmicekjdomkcmc?utm_source=item-share-cb";
const AMO_LINK = "https://addons.mozilla.org/en-US/firefox/addon/epic-games-library-extension/";

export default function WelcomePage() {
  const handleGitHubClick = () => {
    window.open(GITHUB_REPO, "_blank")
  }

  const handleRateClick = () => {
    const url = import.meta.env.FIREFOX ? AMO_LINK : CWS_LINK;
    window.open(url, "_blank");
  }

  return (
    <ThemeProvider theme={darkGamingTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 50%, #252b3d 100%)",
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center" mb={4}>
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              <Box
                component="img"
                src="/svg-icon.svg"
                alt="Epic Games Library Extension Icon"
                sx={{
                  width: 48,
                  height: 48,
                  mr: 2,
                }}
              />
              <Typography variant="h3" component="h1">
                Epic Games Library Extension
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary">
              Quick access to your Epic Games library with a simple keyboard shortcut
            </Typography>
            
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                mt: 3, 
                backgroundColor: "#fff3cd", 
                border: "1px solid #ffeaa7",
                borderRadius: 2
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "#d19e08", 
                  textAlign: "center",
                  fontWeight: 500
                }}
              >
                ⚠️ <strong>Disclaimer:</strong> This extension is not officially affiliated with, endorsed by, or sponsored by Epic Games, Inc.
              </Typography>
            </Paper>
          </Box>

          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" component="h2" mb={3} textAlign="center">
              How to Use the Extension
            </Typography>            <List>
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      backgroundColor: "#00d4ff20",
                      border: "2px solid #00d4ff",
                      mr: 1,
                    }}
                  >
                    <StoreIcon />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6" component="div" sx={{ mb: 0.5 }}>
                      Go to Epic Games Store
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1" color="text.secondary">
                      Navigate to <Link href="https://store.epicgames.com" underline="hover" target="_blank" rel="noopener noreferrer">store.epicgames.com</Link> in your browser
                    </Typography>
                  }
                />
                <Chip
                  label="Step 1"
                  size="small"
                  sx={{
                    backgroundColor: "#00d4ff20",
                    color: "#00d4ff",
                    border: "1px solid #00d4ff",
                  }}
                />
              </ListItem>
              <Divider sx={{ my: 1 }} />

              <ListItem sx={{ py: 1 }}>
                <ListItemIcon>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      backgroundColor: "#4caf5020",
                      border: "2px solid #4caf50",
                      mr: 1,
                    }}
                  >
                    <LoginIcon />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6" component="div" sx={{ mb: 0.5 }}>
                      Make sure you're logged in
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1" color="text.secondary">
                      Sign in to your Epic Games account to access your library
                    </Typography>
                  }
                />
                <Chip
                  label="Step 2"
                  size="small"
                  sx={{
                    backgroundColor: "#4caf5020",
                    color: "#4caf50",
                    border: "1px solid #4caf50",
                  }}
                />
              </ListItem>
              <Divider sx={{ my: 1 }} />

              <ListItem sx={{ py: 1 }}>
                <ListItemIcon>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      backgroundColor: "#ff6b3520",
                      border: "2px solid #ff6b35",
                      mr: 1,
                    }}
                  >
                    <KeyboardIcon />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6" component="div" sx={{ mb: 0.5 }}>
                      Press Alt + G
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1" color="text.secondary">
                      Use the keyboard shortcut to open your games library dialog
                    </Typography>
                  }
                />
                <Chip
                  label="Step 3"
                  size="small"
                  sx={{
                    backgroundColor: "#ff6b3520",
                    color: "#ff6b35",
                    border: "1px solid #ff6b35",
                  }}
                />
              </ListItem>
              <Divider sx={{ my: 1 }} />

              <ListItem sx={{ py: 1 }}>
                <ListItemIcon>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      backgroundColor: "#9c27b020",
                      border: "2px solid #9c27b0",
                      mr: 1,
                    }}
                  >
                    <SettingsIcon />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6" component="div" sx={{ mb: 0.5 }}>
                      Customize keyboard shortcuts
                    </Typography>
                  }
                  secondary={
                    (import.meta.env.FIREFOX ?
                      <Typography variant="body1" color="text.secondary">
                        Follow <Link href="https://support.mozilla.org/en-US/kb/manage-extension-shortcuts-firefox" underline="hover" target="_blank" rel="noopener noreferrer">Mozilla's instructions</Link> to change the hotkey
                      </Typography> :
                      <Typography variant="body1" color="text.secondary">
                        Open <Box component="span" sx={{ fontFamily: 'monospace', backgroundColor: '#2a3441', px: 0.5, py: 0.25, borderRadius: '4px' }}>chrome://extensions/shortcuts</Box>
                        {" "}in a new tab to change the hotkey
                      </Typography>
                    )
                  }
                />
                <Chip
                  label="Step 4"
                  size="small"
                  sx={{
                    backgroundColor: "#9c27b020",
                    color: "#9c27b0",
                    border: "1px solid #9c27b0",
                  }}
                />
              </ListItem>
            </List>
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" component="h3" mb={3} textAlign="center">
              Support & Feedback
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="outlined"
                startIcon={<GitHubIcon />}
                onClick={handleGitHubClick}
                sx={{
                  borderColor: "#00d4ff",
                  color: "#00d4ff",
                  "&:hover": {
                    borderColor: "#0099cc",
                    backgroundColor: "#00d4ff20",
                  },
                }}
              >
                View on GitHub
              </Button>

              <Button
                variant="outlined"
                startIcon={<StarIcon />}
                onClick={handleRateClick}
                sx={{
                  borderColor: "#ff6b35",
                  color: "yellow",
                  "&:hover": {
                    backgroundColor: "#ff6b3521",
                  },
                }}
              >
                Rate Extension
              </Button>
            </Stack>

            <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
              Found a bug or have a feature request? Let us know on GitHub!
            </Typography>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  )
}
