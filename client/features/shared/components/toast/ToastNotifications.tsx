"use client";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast, type ToastOptions, Slide } from "react-toastify";
import type { CSSProperties } from "react";

const baseToastStyle: CSSProperties = {
  borderRadius: "14px",
  background:
    "radial-gradient(circle at top left, rgba(249,115,22,0.28), rgba(15,23,42,0.95) 45%)",
  border: "1px solid rgba(251, 146, 60, 0.35)",
  color: "#f8fafc",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  fontSize: "14px",
  fontWeight: 500,
  padding: "14px 14px 14px 12px",
  boxShadow: "0 12px 34px rgba(0,0,0,0.5)",
};

const successStyle: CSSProperties = {
  ...baseToastStyle,
  borderLeft: "4px solid #22c55e",
  boxShadow:
    "0 0 20px rgba(34,197,94,0.18), 0 12px 34px rgba(0,0,0,0.5)",
};

const errorStyle: CSSProperties = {
  ...baseToastStyle,
  borderLeft: "4px solid #f97316",
  boxShadow:
    "0 0 22px rgba(249,115,22,0.2), 0 12px 34px rgba(0,0,0,0.5)",
};

const infoStyle: CSSProperties = {
  ...baseToastStyle,
  borderLeft: "4px solid #38bdf8",
  boxShadow:
    "0 0 20px rgba(56,189,248,0.18), 0 12px 34px rgba(0,0,0,0.5)",
};

const toastOptions: ToastOptions = {
  position: "top-right",
  autoClose: 2800,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  transition: Slide,
};

export const showErrorToast = (message: string) =>
  toast.error(message, {
    ...toastOptions,
    style: errorStyle,
    icon: () => <span>⚠️</span>,
  });

export const showSuccessToast = (message: string) =>
  toast.success(message, {
    ...toastOptions,
    style: successStyle,
    icon: () => <span>✅</span>,
  });

export const showInfoToast = (message: string) =>
  toast.info(message, {
    ...toastOptions,
    style: infoStyle,
    icon: () => <span>ℹ️</span>,
  });

export default function ToastNotification() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2800}
      hideProgressBar
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      limit={4}
      toastStyle={{ backgroundColor: "transparent" }}
    />
  );
}
