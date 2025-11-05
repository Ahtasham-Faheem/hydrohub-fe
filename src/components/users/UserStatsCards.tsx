import { Box, Card, CardContent, Typography } from "@mui/material";
import { BsThreeDots } from "react-icons/bs";
import type { ReactNode } from "react";

interface StatsCard {
  title: string;
  value: string;
  change: string;
  desc: string;
  color: string;
  icon: ReactNode;
}

interface UserStatsCardsProps {
  cards: StatsCard[];
}

export const UserStatsCards = ({ cards }: UserStatsCardsProps) => {
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
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              border: "1px solid #f1f5f9",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
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
                      bgcolor: "#f9fafb",
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
                    sx={{ fontWeight: 600, color: "#374151" }}
                  >
                    {card.title}
                  </Typography>
                </Box>
                <BsThreeDots className="p-2 text-4xl rounded-lg hover:shadow" />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 400, color: "#111827", mr: 1 }}
                >
                  {card.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: card.change.startsWith("-")
                      ? "#ef4444"
                      : "#22c55e",
                    fontWeight: 600,
                  }}
                >
                  ({card.change})
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: "var(--color-text-600)",
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
