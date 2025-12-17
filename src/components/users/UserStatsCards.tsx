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
            flex: "1 1 calc(25% - 24px)",
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
            <CardContent sx={{ p: 2.5 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box
                    sx={{
                      bgcolor: card.bgColor,
                      borderRadius: "5px",
                      p: 2,
                      width: 50,
                      height: 50,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{ fontSize: 26, color: card.color }}
                    >
                      {card.icon}
                    </Box>
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: colors.text.primary,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontSize: 24
                    }}
                  >
                    {/* {card.title} */}
                    {card.value}
                    <Typography
                      variant="body2"
                      sx={{
                        color: card.change.startsWith("-")
                          ? colors.status.error
                          : colors.status.success,
                        fontWeight: 600,
                      }}
                    >
                      ({card.change})
                    </Typography>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    color: colors.text.tertiary,
                    "&:hover": {
                      backgroundColor: colors.background.tertiary,
                      color: colors.text.primary,
                    },
                  }}
                >
                  <BsThreeDots />
                </Box>
              </Box>

              {/* <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 400, color: colors.text.primary, mr: 1 }}
                >
                  {card.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: card.change.startsWith("-")
                      ? colors.status.error
                      : colors.status.success,
                    fontWeight: 600,
                  }}
                >
                  ({card.change})
                </Typography>
              </Box> */}

              <Typography
                variant="body2"
                sx={{
                  color: colors.text.secondary,
                  lineHeight: 1.5,
                  fontSize: 14,
                }}
              >
                {card.desc}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
};
