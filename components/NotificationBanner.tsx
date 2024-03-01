import React from 'react';

interface Notification {
    message: string;
    isSuccess: boolean;
    isVisible: boolean;
}

interface NotificationBannerProps {
    notification: Notification;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ notification }) => {
    if (!notification.isVisible) return null;

    console.log(`Displaying ${notification.isSuccess ? 'success' : 'failure'} notification with message: ${notification.message}`);

    return (
        <div className={`fixed top-0 left-0 right-0 text-center py-3 ${notification.isSuccess ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {notification.message}
        </div>
    );
};

export default NotificationBanner;