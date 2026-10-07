// NotificationDialog.js
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

function NotificationDialog({ open, onClose, notification }) {
    if (!notification) return null;

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{notification.title}</DialogTitle>
            <DialogContent>
                <p>{notification.message}</p>
                {notification.claimData && (
                    <div>
                        <h4>Claim Details:</h4>
                        <p>{notification.claimData.description}</p>
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default NotificationDialog;