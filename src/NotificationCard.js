// NotificationCard.js
import React from 'react';
import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';
import './NotificationCard.css';

function NotificationCard({ notification }) {
  const handleClick = async () => {
    if (!notification.read) {
      await updateDoc(doc(db, 'notifications', notification.id), {
        read: true
      });
    }
    // You can add navigation logic here if needed
  };

  return (
    <div 
      className={`notificationCard ${notification.read ? '' : 'unread'}`}
      onClick={handleClick}
    >
      <div className="notificationCard__content">
        <h3>{notification.title}</h3>
        <p>{notification.message}</p>
        <small>{new Date(notification.timestamp?.toDate()).toLocaleString()}</small>
      </div>
      {!notification.read && <div className="notificationCard__unreadDot"></div>}
    </div>
  );
}

export default NotificationCard;