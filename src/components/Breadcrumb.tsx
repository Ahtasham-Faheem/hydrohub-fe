import { Breadcrumbs, Typography, Link, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { NavigateNext } from '@mui/icons-material';

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  users: 'Users',
  'create-user': 'Create User',
  'business-control-center': 'Business Control Center',
  login: 'Login',
  'reset-password': 'Reset Password',
};

export const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length <= 1 || (pathnames.length === 2 && pathnames[1] === 'overview')) return null;

  const currentPageLabel = routeLabels[pathnames[pathnames.length - 1]] || 
    pathnames[pathnames.length - 1].charAt(0).toUpperCase() + pathnames[pathnames.length - 1].slice(1);

  return (
    <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
        {currentPageLabel}
      </Typography>
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
      >
        {pathnames.map((pathname, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const label = routeLabels[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);

          return isLast ? (
            <Typography key={pathname} color="text.primary" sx={{ fontWeight: 500 }}>
              {label}
            </Typography>
          ) : (
            <Link
              key={pathname}
              component={RouterLink}
              to={routeTo}
              underline="hover"
              color="inherit"
              sx={{ fontWeight: 400 }}
            >
              {label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};