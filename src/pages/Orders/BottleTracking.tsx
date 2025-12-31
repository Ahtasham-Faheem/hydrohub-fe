import { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';

interface BottleRecord {
  id: string;
  customerId: string;
  customerName: string;
  bottleType: string;
  quantity: number;
  status: 'issued' | 'returned' | 'pending';
  issueDate: string;
  returnDate?: string;
}

export const BottleTracking = () => {
  const { colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [bottles] = useState<BottleRecord[]>([
    {
      id: 'BT001',
      customerId: 'C001',
      customerName: 'Ahmed Ali',
      bottleType: '19L Water Bottle',
      quantity: 2,
      status: 'issued',
      issueDate: '2024-01-15',
    },
    {
      id: 'BT002',
      customerId: 'C002',
      customerName: 'Sara Khan',
      bottleType: '19L Water Bottle',
      quantity: 1,
      status: 'returned',
      issueDate: '2024-01-10',
      returnDate: '2024-01-20',
    },
  ]);

  const filteredBottles = bottles.filter(bottle =>
    bottle.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bottle.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'issued': return 'warning';
      case 'returned': return 'success';
      case 'pending': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text.primary, mb: 3 }}>
        Bottle Tracking
      </Typography>

      <Card sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            placeholder="Search by customer name or bottle ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: colors.text.secondary }} />,
            }}
            sx={{ flex: 1 }}
          />
          <Button variant="outlined" startIcon={<RefreshIcon />}>
            Refresh
          </Button>
        </Stack>
      </Card>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Bottle ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Bottle Type</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Issue Date</TableCell>
                <TableCell>Return Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBottles.map((bottle) => (
                <TableRow key={bottle.id}>
                  <TableCell>{bottle.id}</TableCell>
                  <TableCell>{bottle.customerName}</TableCell>
                  <TableCell>{bottle.bottleType}</TableCell>
                  <TableCell>{bottle.quantity}</TableCell>
                  <TableCell>
                    <Chip
                      label={bottle.status.charAt(0).toUpperCase() + bottle.status.slice(1)}
                      color={getStatusColor(bottle.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{bottle.issueDate}</TableCell>
                  <TableCell>{bottle.returnDate || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};