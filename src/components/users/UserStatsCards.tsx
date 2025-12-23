import { Box, Card, CardContent, Typography } from "@mui/material";
import { BsThreeDots } from "react-icons/bs";
import type { ReactNode } from "react";
import { useTheme } from "../../contexts/ThemeContext";

interface StatsCard {
  title: string;
  value: string;
  change: string;
  desc: string;
  color: string;
  bgColor: string;
  icon: ReactNode;
}

interface UserStatsCardsProps {
  cards: StatsCard[];
}

export const UserStatsCards = ({ cards }: UserStatsCardsProps) => {
  const { colors } = useTheme();

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
      {cards.map((card: StatsCard, idx: number) => (
        <Box
          key={idx}
          sx={{
            flex: "1 1 calc(25% - 25px)",
            minWidth: "250px",
          }}
        >
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: colors.shadow.sm,
              border: `1px solid ${colors.border.primary}`,
              backgroundColor: colors.background.card,
              transition: "transform 0.2s, box-shadow 0.2s",
              height: "100%",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: colors.shadow.md,
              },
            }}
          >
            <CardContent sx={{ p: 2, px: 3, position: "relative" }}>
              {/* Header with title and icon */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: colors.text.primary,
                    fontSize: 18,
                  }}
                >
                  {card.title}
                </Typography>
                <Box
                  sx={{
                    bgcolor: card.bgColor,
                    borderRadius: 2,
                    p: 1.5,
                    width: 38,
                    height: 38,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    component="span"
                    sx={{ fontSize: 18, color: card.color }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </Box>

              {/* Value and change */}
              <Box
                sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 1 }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: colors.text.primary,
                    fontSize: 28,
                    lineHeight: 1,
                  }}
                >
                  {card.value}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: card.change.startsWith("-")
                      ? colors.status.error
                      : colors.status.success,
                    fontWeight: 600,
                    fontSize: 16,
                  }}
                >
                  ({card.change})
                </Typography>
              </Box>

              {/* Description */}
              <Typography
                variant="body2"
                sx={{
                  color: colors.text.secondary,
                  lineHeight: 1.4,
                  fontSize: 14,
                  mb: 1,
                  whiteSpace: "nowrap",
                  maxWidth: "max-content",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {card.desc}
              </Typography>

              {/* Three dots menu - bottom right */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 10,
                  right: 16,
                  p: 0.5,
                  borderRadius: 1,
                  color: colors.text.tertiary,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: colors.background.tertiary,
                    color: colors.text.primary,
                  },
                }}
              >
                <BsThreeDots size={16} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
};
