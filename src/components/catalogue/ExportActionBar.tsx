import { Box, Typography, Stack } from "@mui/material";
import { MdFileDownload, MdPrint } from "react-icons/md";
import { SecondaryButton } from "../common/SecondaryButton";
import { useTheme } from "../../contexts/ThemeContext";

interface ExportActionBarProps {
  onExportCSV: () => void;
  onExportJSON: () => void;
  onExportExcel?: () => void;
  onExportPDF?: () => void;
  onPrint?: () => void;
}

export const ExportActionBar = ({
  onExportCSV,
  onExportJSON,
  onExportExcel,
  onExportPDF,
  onPrint,
}: ExportActionBarProps) => {
  const { colors } = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: colors.background.card,
        borderRadius: 2,
        border: `1px solid ${colors.border.primary}`,
        boxShadow: colors.shadow.sm,
        p: 2,
        mb: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, color: colors.text.primary }}>
        Export / Print
      </Typography>
      
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <SecondaryButton
          size="small"
          startIcon={<MdFileDownload />}
          onClick={onExportCSV}
          sx={{ py: 0.5, px: 3 }}
        >
          CSV
        </SecondaryButton>
        <SecondaryButton
          size="small"
          startIcon={<MdFileDownload />}
          onClick={onExportJSON}
          sx={{ py: 0.5, px: 3 }}
        >
          JSON
        </SecondaryButton>
        <SecondaryButton 
          size="small" 
          startIcon={<MdPrint />}
          onClick={onPrint || (() => window.print())}
          sx={{ py: 0.5, px: 3 }}
        >
          Print
        </SecondaryButton>
        <SecondaryButton
          size="small"
          startIcon={<MdFileDownload />}
          onClick={onExportExcel || (() => console.log('Excel export'))}
          sx={{ py: 0.5, px: 3 }}
        >
          Excel
        </SecondaryButton>
        <SecondaryButton
          size="small"
          startIcon={<MdFileDownload />}
          onClick={onExportPDF || (() => console.log('PDF export'))}
          sx={{ py: 0.5, px: 3 }}
        >
          PDF
        </SecondaryButton>
      </Stack>
    </Box>
  );
};