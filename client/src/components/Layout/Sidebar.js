import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Toolbar,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  LocalHospital as LocalHospitalIcon,
  Description as DescriptionIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Patients', icon: <PeopleIcon />, path: '/patients' },
  { text: 'Rendez-vous', icon: <EventNoteIcon />, path: '/appointments' },
  { text: 'Traitements', icon: <LocalHospitalIcon />, path: '/treatments' },
  { text: 'Diagnostics', icon: <DescriptionIcon />, path: '/diagnostics' },
  { text: 'Rapports', icon: <AssessmentIcon />, path: '/reports' },
];

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [selectedIndex, setSelectedIndex] = useState(() => {
    const currentPath = location.pathname;
    const index = menuItems.findIndex(item => item.path === currentPath);
    return index >= 0 ? index : 0;
  });

  const handleListItemClick = (path, index) => {
    setSelectedIndex(index);
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={selectedIndex === index}
              onClick={() => handleListItemClick(item.path, index)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={isMobile ? open : false}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar; 