import { storage } from "#imports";
import { useState, useEffect, useMemo } from "react";
import SnackbarAlert from "./SnackbarAlert";
import useIsMobile from '@/hooks/useIsMobile';
// MUI
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Close from "@mui/icons-material/Close";
import LightMode from "@mui/icons-material/LightMode";
import DarkMode from "@mui/icons-material/DarkMode";
import Refresh from "@mui/icons-material/Refresh";
import Search from "@mui/icons-material/Search";
import VideogameAsset from "@mui/icons-material/VideogameAsset";
import Settings from "@mui/icons-material/Settings";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

interface Order {
  orderId: string;
  createdAtMillis: number;
  items: Array<{
    description: string;
    quantity: number;
    amount: number;
    currency: string;
  }>
}

interface OrderResponse {
  orders: Order[];
  nextPageToken?: string;
}

type OrderBy = "title" | "date";

interface Alert {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
  loadingIcon?: boolean;
}

function GamesDialog() {
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hasStoredData, setHasStoredData] = useState(false);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState<OrderBy>("date");
  const [darkMode, setDarkMode] = useState<boolean | null>(null);
  const [alert, setAlert] = useState<Alert>({
    open: false,
    message: '',
    severity: 'info',
  });

  const gamesList = storage.defineItem<Order[]>("local:gamesList");
  const isMobile = useIsMobile();

  // Initialize dark mode based on system preference
  useEffect(() => {
    if (darkMode === null) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
    }
  }, [darkMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode],
  );

  const fetchOrders = async (pageToken?: string) => {
    try {
      const url = new URL("https://www.epicgames.com/account/v2/payment/ajaxGetOrderHistory");
      url.searchParams.append("count", "10");
      url.searchParams.append("sortDir", "DESC");
      url.searchParams.append("sortBy", "DATE");
      url.searchParams.append("locale", "en-US");

      if (pageToken) {
        url.searchParams.append("nextPageToken", pageToken);
      }

      const response = await fetch(url.toString(), {
        credentials: "include",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.5",
          "x-requested-with": "XMLHttpRequest",
          "Content-Type": "application/json;charset=utf-8",
          "Sec-GPC": "1",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "Pragma": "no-cache",
          "Cache-Control": "no-cache",
        },
        referrer: "https://www.epicgames.com/",
        method: "GET",
        mode: "cors",
      });

      const data = await response.json();
      if (!data) {
        throw new Error("Invalid response from Epic Games API");
      }
      if (data.needLogin) {
        try {
          const loginResponseOk = await browser.runtime.sendMessage({ type: 'needLogin' });
          if (!loginResponseOk) {
            throw new Error("Session expired. Please re-login to access your library.");
          }

          // Retry fetching orders after login
          return fetchOrders(pageToken);
        }
        catch (loginError) {
          throw new Error("Session expired. Please re-login to access your library.");
        }
      }
      if (!data.orders) {
        throw new Error("No orders found in the response.");
      }

      return data as OrderResponse;
    }
    catch (error) {
      console.error("Failed to fetch orders:", error);
      throw error;
    }
  };

  const fetchAllGames = async () => {
    setLoading(true);
    try {
      let allOrders: Order[] = [];
      let nextPageToken: string | undefined = undefined;

      do {
        const data = await fetchOrders(nextPageToken);
        allOrders = [...allOrders, ...data.orders];
        nextPageToken = data.nextPageToken;
      }
      while (nextPageToken);

      await gamesList.setValue(allOrders);
      setOrders(allOrders);
      setHasStoredData(true);
      setAlert({
        open: true,
        message: `Successfully loaded ${allOrders.length} games from your library`,
        severity: "success",
      });
    }
    catch (error) {
      console.error("Failed to fetch all games:", error);
      setAlert({
        open: true,
        message: error instanceof Error ? error.message : "Failed to fetch games from Epic Games API",
        severity: "error",
      });
    }
    finally {
      setLoading(false);
    }
  };

  const loadStoredGames = async () => {
    try {
      const stored = await gamesList.getValue();
      if (stored && stored.length > 0) {
        setOrders(stored);
        setHasStoredData(true);
      }
    }
    catch (error) {
      console.error("Failed to load stored games:", error);
    }
  };

  const refreshGames = async () => {
    setAlert({
      open: true,
      message: "Refreshing games library...",
      severity: "info",
      loadingIcon: true,
    });
    setSearchTerm("");
    setPage(0);
    await fetchAllGames();
  };

  const handleRowClick = (gameTitle: string) => {
    const encodedTitle = encodeURIComponent(gameTitle);
    const searchUrl = `https://store.epicgames.com/en-US/browse?q=${encodedTitle}&sortBy=releaseDate&sortDir=DESC&category=Game&count=40&start=0`;

    window.open(searchUrl, '_blank');
  };

  const handleSettings = () => {
    browser.runtime.sendMessage({ type: "openSettings" });
  };

  const handleSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((orderItem) =>
      orderItem.items.some((item) => item.description.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [orders, searchTerm]);

  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (orderBy === "title") {
        aValue = a.items[0]?.description?.toLowerCase() || "";
        bValue = b.items[0]?.description?.toLowerCase() || "";
      }
      else if (orderBy === "date") {
        aValue = a.createdAtMillis;
        bValue = b.createdAtMillis;
      }

      if (order === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
      else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    })
  }, [filteredOrders, order, orderBy]);

  const paginatedOrders = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return sortedOrders.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedOrders, page, rowsPerPage]);

  const formatDate = (milliseconds: number) => {
    return new Date(milliseconds).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCloseAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Load stored games on component mount
  useEffect(() => {
    loadStoredGames();
  }, []);

  useEffect(() => {
    interface Message {
      type: string;
    };

    const messageListener = (message: Message) => {
      if (message.type === "toggleDialog") {
        setOpen((prevOpen: boolean) => !prevOpen);
      }
    };

    browser.runtime.onMessage.addListener(messageListener);

    return () => {
      browser.runtime.onMessage.removeListener(messageListener);
    }
  }, []);

  if (darkMode === null) {
    return null; // Don't render until we know the theme preference
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        slotProps={{
          paper: {
            sx: {
              height: isMobile ? "100vh" : "80vh",
              maxHeight: isMobile ? "100vh" : "80vh",
              position: "relative",
            }
          },
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            color: "text.primary",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Epic Games Library Extension
            </Typography>
            {hasStoredData && (
              <IconButton color="inherit" onClick={refreshGames} disabled={loading}>
                <Refresh />
              </IconButton>
            )}

            <IconButton color="inherit" onClick={handleSettings}>
              <Settings />
            </IconButton>

            <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>

            <IconButton color="inherit" onClick={handleClose}>
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>

        <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column", height: "100%" }}>
          {!hasStoredData ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              flex={1}
              gap={3}
              p={3}
            >
              <Typography variant="h5" gutterBottom>
                No games data found
              </Typography>

              <Typography variant="body1" color="text.secondary" textAlign="center" maxWidth={400}>
                Click the button below to fetch your Epic Games library. This may take a few seconds depending on how
                many games you have.
              </Typography>
              <Button
                variant="contained"
                onClick={fetchAllGames}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <VideogameAsset />}
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                {loading ? "Loading..." : "FETCH GAMES LIST"}
              </Button>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" height="100%">
              <Box sx={{ p: 2, position: "sticky", top: 0, bgcolor: "background.paper", zIndex: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Search games..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setPage(0)
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }
                  }}
                />
              </Box>

              <TableContainer component={Paper} sx={{ flex: 1, overflow: "auto" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell width="80px">#</TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === "title"}
                          direction={orderBy === "title" ? order : "asc"}
                          onClick={() => handleSort("title")}
                        >
                          Game Title
                        </TableSortLabel>
                      </TableCell>
                      <TableCell width="200px">
                        <TableSortLabel
                          active={orderBy === "date"}
                          direction={orderBy === "date" ? order : "asc"}
                          onClick={() => handleSort("date")}
                        >
                          Purchase Date
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedOrders.map((orderItem, index) => (
                      <TableRow
                        key={orderItem.orderId}
                        hover
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleRowClick(orderItem.items[0]?.description || "")}
                      >
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{orderItem.items.map((item) => item.description).join(", ")}</TableCell>
                        <TableCell>{formatDate(orderItem.createdAtMillis)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box
                sx={{
                  position: "sticky",
                  bottom: 0,
                  bgcolor: "background.paper",
                  borderTop: 1,
                  borderColor: "divider",
                }}
              >
                <TablePagination
                  component="div"
                  count={sortedOrders.length}
                  page={page}
                  onPageChange={(_, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(Number.parseInt(e.target.value, 10))
                    setPage(0)
                  }}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                />
              </Box>
            </Box>
          )}
          <SnackbarAlert
            open={alert.open}
            severity={alert.severity}
            message={alert.message}
            loadingIcon={alert.loadingIcon}
            onClose={handleCloseAlert}
          />
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  )
}

export default GamesDialog
