import React, { useState } from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

export function useSimpleNotification() {
  const [notification, setNotification] = useState(null);
  const [open, setOpen] = useState(false);

  const show = (message, severity = 'info', duration = 6000) => {
    setNotification({ message, severity, duration });
    setOpen(true);
  };

  const MuiNotification = () => (
    <Snackbar
      open={open}
      autoHideDuration={notification?.duration || 6000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      {notification && (
        <Alert
          onClose={() => setOpen(false)}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setOpen(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {notification.message}
        </Alert>
      )}
    </Snackbar>
  );

  return { show, MuiNotification };
}