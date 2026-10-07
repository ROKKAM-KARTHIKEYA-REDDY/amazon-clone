import React, { useEffect, useState } from 'react'
import "./Notifications.css"
import { useStateValue } from './StateProvider';
import { db } from './firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import NotificationCard from './NotificationCard';

function Notifications() {
  const [{ user, notifications }, dispatch] = useStateValue();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'notifications'), where('userId', '==', user.uid));
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const notificationsData = [];
        querySnapshot.forEach((doc) => {
          notificationsData.push({ id: doc.id, ...doc.data() });
        });
        
        dispatch({
          type: 'SET_NOTIFICATIONS',
          notifications: notificationsData
        });
        
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user, dispatch]);

  const markAllAsRead = async () => {
    if (!user) return;
    
    const batch = [];
    notifications.forEach(notification => {
      if (!notification.read) {
        batch.push(
          updateDoc(doc(db, 'notifications', notification.id), {
            read: true
          })
        );
      }
    });
    
    try {
      await Promise.all(batch);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  if (loading) {
    return <div className='notifications'>Loading...</div>;
  }

  return (
    <div className='notifications'>
      <div className="notifications__header">
        <h1>Notifications</h1>
        {notifications.length > 0 && (
          <button onClick={markAllAsRead} className="notifications__markAll">
            Mark all as read
          </button>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <div className="notifications__empty">
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="notifications__list">
          {notifications.map(notification => (
            <NotificationCard 
              key={notification.id} 
              notification={notification} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;