import { Breadcrumbs, Typography, Link, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { NavigateNext } from '@mui/icons-material';

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  users: 'System Users',
  'create-user': 'Create User',
  'edit': 'Edit',
  'business-control-center': 'Business Control Center',
  login: 'Login',
  'reset-password': 'Reset Password',
  catalogue: 'Catalogue Management',
  'customer-profiles': 'Customer Profiles',
  orders: 'Create Order',
};

export const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length <= 1 || (pathnames.length === 2 && pathnames[1] === 'overview')) return null;

  // Determine the page label
  let currentPageLabel = '';
  
  // Handle edit routes with IDs
  if (pathnames[pathnames.length - 2] === 'edit') {
    const parentSection = pathnames[pathnames.length - 3];
    if (parentSection === 'users') {
      currentPageLabel = 'Edit User';
    } else if (parentSection === 'customer-profiles') {
      currentPageLabel = 'Edit Customer';
    } else {
      currentPageLabel = 'Edit';
    }
  } else {
    currentPageLabel = routeLabels[pathnames[pathnames.length - 1]] || 
      pathnames[pathnames.length - 1].charAt(0).toUpperCase() + pathnames[pathnames.length - 1].slice(1);
  }

  // Generate breadcrumb items, filtering out UUIDs/IDs
  const breadcrumbItems = pathnames.filter((pathname) => {
    // Skip UUID/ID patterns (they look like hex strings)
    const isId = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(pathname) ||
                 /^[a-f0-9]+$/.test(pathname) && pathname.length > 10;
    return !isId;
  });

  return (
    <Box sx={{ mb: 3, display: 'flex',flexDirection: 'column', gap: 0.5, justifyContent: 'start' }}>
      <Typography variant="h5" sx={{ fontWeight: 600}}>
        {currentPageLabel}
      </Typography>
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
      >
        {breadcrumbItems.map((pathname, index) => {
          const routeTo = `/${breadcrumbItems.slice(0, index + 1).join('/')}`;
          const isLast = index === breadcrumbItems.length - 1;
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