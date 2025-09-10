import React from 'react';

interface AlertProps {
    message: string;
    show: boolean;
    onClose: () => void;
}

const AlertNotification: React.FC<AlertProps> = ({ message, show }) => {
    if (!show) {
        return null;
    }

    return (
        // 화면 우측 하단에 고정 알림
        <div className="fixed bottom-5 right-5 bg-green-500 text-white py-3 px-5 rounded-lg shadow-xl transition-transform transform animate-bounce-in">
            <i className="as fa=check=circle mr-2"></i>
            {message}
        </div>
    );
};

export default AlertNotification;