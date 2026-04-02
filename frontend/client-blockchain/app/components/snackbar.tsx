"use client";

import { useEffect } from "react";
import { SnackbarType } from "../definations/type";

export default function SnackbarWithAutoHide({
  message,
  showSnackbar,
  setShowSnackbar,
  type = "info",
  duration = 3000,
}: {
  message: string;
  showSnackbar: boolean;
  setShowSnackbar: (show: boolean) => void;
  type?: SnackbarType;
  duration?: number;
}) {
  useEffect(() => {
    if (showSnackbar) {
      const timer = setTimeout(() => {
        setShowSnackbar(false);
      }, duration);
      return () => clearTimeout(timer); 
    }
  }, [showSnackbar, duration, setShowSnackbar]);

  if (!showSnackbar) return null;

  // Xử lý màu sắc theo type
  const bgColors: Record<SnackbarType, string> = {
    success: "bg-green-600",
    error: "bg-red-600",
    warning: "bg-yellow-600",
    info: "bg-blue-600",
  };

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 ${bgColors[type]} text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center justify-between transform transition-all duration-300`}
    >
      <p>{message}</p>
      <button
        onClick={() => setShowSnackbar(false)}
        className="text-white/80 hover:text-white font-bold text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}
