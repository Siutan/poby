import { toast, type ExternalToast } from "svelte-sonner";

interface ToastOptions extends Partial<ExternalToast> {
  description?: string;
}

const defaultOptions: ToastOptions = {
  duration: 3000,
  position: "top-center",
};

export const toasts = {
  success: (message: string, options: ToastOptions = {}) => {
    toast.success(message, { ...defaultOptions, ...options });
  },
  error: (message: string, options: ToastOptions = {}) => {
    toast.error(message, { ...defaultOptions, ...options });
  },
};