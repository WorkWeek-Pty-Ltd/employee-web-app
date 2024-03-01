import React from 'react';

interface NotificationBannerProps {
    message: string;
    isSuccess: boolean;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ message, isSuccess }) => {
    console.log(`Displaying ${isSuccess ? 'success' : 'failure'} notification with message: ${message}`);
    return (
        <div className={`fixed top-0 left-0 right-0 text-center py-3 ${isSuccess ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {message}
        </div>
    );
};

export default NotificationBanner;