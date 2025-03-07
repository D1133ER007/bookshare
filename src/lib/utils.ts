import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { useToast } from "@/components/ui/use-toast"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type ToastType = "default" | "success" | "error" | "warning" | "info"

interface ToastOptions {
  title?: string
  description: string
  type?: ToastType
  duration?: number
}

export function showToast(options: ToastOptions) {
  const { toast } = useToast()
  const { title, description, type = "default", duration = 3000 } = options

  return toast({
    title: title,
    description: description,
    variant: type === "default" ? "default" : "destructive",
    duration: duration,
  })
}
