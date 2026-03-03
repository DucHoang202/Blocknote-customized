import { notifications } from "@mantine/notifications";

type ToastOptions = {
    title?: string;
    message: string;
    autoClose?: number;
};

const base = (color: string, { title, message, autoClose = 2000 }: ToastOptions) => {
    notifications.show({
        color,
        title,
        message,
        autoClose,
    });
};

export const toast = {
    success: (message: string, title = "Success") =>
        base("green", { title, message }),

    error: (message: string, title = "Error") =>
        base("red", { title, message, autoClose: 3000 }),

    info: (message: string, title = "Info") =>
        base("blue", { title, message }),

    warning: (message: string, title = "Warning") =>
        base("yellow", { title, message }),
};