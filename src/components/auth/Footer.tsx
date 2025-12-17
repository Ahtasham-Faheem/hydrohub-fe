import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import { useTheme } from "../../contexts/ThemeContext";

export const Footer = () => {
  const { colors } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLang, setSelectedLang] = useState("English (US)");
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (lang?: string) => {
    if (lang) setSelectedLang(lang);
    setAnchorEl(null);
  };

  const languages = [
    "English (US)",
    "English (UK)",
    "Arabic (SA)",
    "Urdu (PK)",
    "French (FR)",
    "German (DE)",
  ];

  return (
    <footer className="w-full">
      {/* Top section */}
      <div 
        className="relative w-full border-t border-opacity-50"
        style={{ borderColor: colors.border.primary }}
      >
        <nav className="w-full p-4 md:px-6 lg:px-14 xl:px-18">
          <div className="w-full mx-auto flex flex-wrap items-center justify-center gap-5 md:gap-7 lg:gap-10 xl:gap-12">
            {[
              "HYDROHUB",
              "Privacy Policy",
              "Updates",
              "Terms and Conditions",
              "Training Videos",
              "About",
              "Documentation",
              "Locations",
              "Supports",
            ].map((item) => (
              <a
                key={item}
                href="/"
                className="text-center text-sm font-normal whitespace-nowrap transition-colors"
                style={{ 
                  color: colors.text.secondary,
                  ':hover': { color: colors.primary[500] }
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.color = colors.primary[500]}
                onMouseLeave={(e) => (e.target as HTMLElement).style.color = colors.text.secondary}
              >
                {item}
              </a>
            ))}
          </div>
        </nav>
      </div>

      {/* Bottom section */}
      <div 
        className="w-full py-5 px-16"
        style={{ backgroundColor: colors.primary[500] }}
      >
        <div className="w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Language selector with dropdown */}
          <div>
            <button
              onClick={handleClick}
              className="flex items-center justify-between px-6 py-2 rounded border-2 border-white bg-transparent hover:bg-white/10 transition-colors"
            >
              <span className="text-white font-poppins text-sm font-medium mr-3">
                {selectedLang}
              </span>
              <svg
                width="14"
                height="8"
                viewBox="0 0 14 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-2 shrink-0"
              >
                <path
                  d="M13 1L7 7L1 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => handleClose()}
              PaperProps={{
                style: {
                  backgroundColor: colors.background.card,
                  color: colors.text.primary,
                  borderRadius: "8px",
                  padding: "4px",
                  border: `1px solid ${colors.border.primary}`,
                },
              }}
            >
              {languages.map((lang) => (
                <MenuItem
                  key={lang}
                  onClick={() => handleClose(lang)}
                  selected={lang === selectedLang}
                  sx={{
                    color: colors.text.primary,
                    '&:hover': {
                      backgroundColor: colors.background.tertiary,
                    },
                    '&.Mui-selected': {
                      backgroundColor: colors.primary[100],
                      '&:hover': {
                        backgroundColor: colors.primary[200],
                      },
                    },
                  }}
                >
                  {lang}
                </MenuItem>
              ))}
            </Menu>
          </div>

          {/* Copyright section */}
          <div className="flex items-center gap-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 shrink-0"
            >
              <path
                d="M18.5095 9.62264C17.7814 8.4067 16.6746 7.46315 15.3588 6.93671C14.043 6.41027 12.5908 6.33 11.225 6.70822C9.85916 7.08644 8.65512 7.90226 7.79752 9.03055C6.93992 10.1589 6.47613 11.5373 6.47727 12.9545C6.47613 14.3718 6.93992 15.7502 7.79752 16.8785C8.65512 18.0068 9.85916 18.8227 11.225 19.2009C12.5908 19.5791 14.043 19.4988 15.3588 18.9724C16.6746 18.4459 17.7814 17.5024 18.5095 16.2865L16.2877 14.9547C15.9381 15.5372 15.4419 16.0178 14.8486 16.3487C14.2553 16.6796 13.5856 16.8492 12.9063 16.8406C12.227 16.832 11.5618 16.6454 10.9771 16.2996C10.3924 15.9537 9.90852 15.4606 9.57378 14.8695C9.23904 14.2783 9.06511 13.6097 9.06933 12.9304C9.07355 12.2511 9.25577 11.5847 9.59782 10.9978C9.93988 10.4108 10.4298 9.92376 11.0188 9.5852C11.6078 9.24663 12.2752 9.06837 12.9545 9.06818C14.3705 9.06818 15.6102 9.82473 16.2877 10.9557L18.5095 9.62264ZM25.9091 12.9545C25.9091 5.80364 20.1055 0 12.9545 0C5.80364 0 0 5.80364 0 12.9545C0 20.1055 5.80364 25.9091 12.9545 25.9091C20.1055 25.9091 25.9091 20.1055 25.9091 12.9545ZM2.59091 12.9545C2.59091 7.22864 7.22864 2.59091 12.9545 2.59091C18.6805 2.59091 23.3182 7.22864 23.3182 12.9545C23.3182 18.6805 18.6805 23.3182 12.9545 23.3182C7.22864 23.3182 2.59091 18.6805 2.59091 12.9545Z"
                fill="white"
              />
            </svg>
            <span className="text-white text-center font-poppins text-sm font-medium">
              2025 HYDROHUB
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};