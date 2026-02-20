export default class ToastHelper {
    showToast(message, isError = false, timeout = 3000) {
        const toast = document.createElement("div");
        toast.className = "toast-notification";
        if (isError) toast.style.borderLeft = "4px solid #f87171";
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("fade-out");
            setTimeout(() => toast.remove(), 500);
        }, timeout);
    }
}