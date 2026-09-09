import { createContext, useContext, useState, useEffect } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ type = "success", message, duration = 5000 }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      <div className="toast-container position-fixed top-0 end-0 p-3">
        {toasts.map(({ id, type, message, duration }) => (
          <ToastItem
            key={id}
            message={message}
            type={type}
            duration={duration}
            onClose={() => removeToast(id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

function ToastItem({ message, type = "success", duration = 5000, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fade IN inmediato (next tick)
    const enter = setTimeout(() => setVisible(true), 10);

    // Fade OUT después de duration
    const exit = setTimeout(() => setVisible(false), duration);

    // Remover del estado después de la animación (300ms)
    const remove = setTimeout(() => onClose(), duration + 300);

    return () => {
      clearTimeout(enter);
      clearTimeout(exit);
      clearTimeout(remove);
    };
  }, [duration, onClose]);

  return (
    <div
      className={`toast show text-bg-${type} border-0 mb-2`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-10px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      <div className="toast-body">{message}</div>
    </div>
  );
}