import React, { createContext, useContext, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from "lucide-react";

export type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationStyles {
  containerClass: string;
  borderClass: string;
  textClass: string;
  icon: React.ReactNode;
}

interface NotificationMessage {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationContextType {
  notification: NotificationMessage | null;
  showNotification: (message: string, type: NotificationType) => void;
  hideNotification: () => void;
}

const notificationStyles: Record<NotificationType, NotificationStyles> = {
  success: {
    containerClass: "bg-green-100",
    borderClass: "border-green-500",
    textClass: "text-green-700",
    icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  },
  error: {
    containerClass: "bg-red-100",
    borderClass: "border-red-500",
    textClass: "text-red-700",
    icon: <XCircle className="h-5 w-5 text-red-500" />,
  },
  warning: {
    containerClass: "bg-yellow-100",
    borderClass: "border-yellow-500",
    textClass: "text-yellow-700",
    icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
  },
  info: {
    containerClass: "bg-blue-100",
    borderClass: "border-blue-500",
    textClass: "text-blue-700",
    icon: <Info className="h-5 w-5 text-blue-500" />,
  },
};

const NotificationContext = createContext<NotificationContextType>({
  notification: null,
  showNotification: () => {},
  hideNotification: () => {},
});

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notification, setNotification] = useState<NotificationMessage | null>(
    null,
  );

  const showNotification = (
    message: string,
    type: NotificationType = "info",
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotification({ id, type, message });

    setTimeout(() => {
      hideNotification();
    }, 5000);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider
      value={{ notification, showNotification, hideNotification }}
    >
      {children}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div
            className={`${notificationStyles[notification.type].containerClass}
                       border-l-4
                       ${notificationStyles[notification.type].borderClass}
                       ${notificationStyles[notification.type].textClass}
                       p-4 rounded shadow-lg flex items-center gap-3 min-w-[300px]`}
          >
            {notificationStyles[notification.type].icon}
            <p className="flex-1">{notification.message}</p>
            <button
              onClick={hideNotification}
              className={`${notificationStyles[notification.type].textClass} hover:opacity-70 transition-opacity`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};

const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .animate-slide-in {
    animation: slideIn 0.3s ease-out;
  }
`;
document.head.appendChild(style);
