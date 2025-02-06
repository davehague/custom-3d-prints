import { ref, computed } from "vue";

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

const toasts = ref<Toast[]>([]);
let nextId = 0;

export function useToasts() {
  const addToast = (message: string, type: "success" | "error") => {
    const id = nextId++;
    toasts.value.push({ id, message, type });
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, 6000); // 6 seconds
  };

  return {
    toasts: computed(() => toasts.value),
    addToast,
  };
}
