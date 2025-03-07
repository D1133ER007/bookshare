import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ToastProps {
  message: string;
  title?: string;
}

const ToastIcon = {
  success: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  error: <XCircle className="h-4 w-4 text-red-500" />,
  warning: <AlertCircle className="h-4 w-4 text-yellow-500" />,
  info: <Info className="h-4 w-4 text-blue-500" />,
};

const ToastStyle = {
  success: "bg-green-50 border-green-200",
  error: "bg-red-50 border-red-200",
  warning: "bg-yellow-50 border-yellow-200",
  info: "bg-blue-50 border-blue-200",
};

export const successToast = ({ message, title = "Success" }: ToastProps) => {
  toast({
    description: message,
    className: ToastStyle.success,
  });
};

export const errorToast = ({ message, title = "Error" }: ToastProps) => {
  toast({
    description: message,
    variant: "destructive",
  });
};

export const warningToast = ({ message, title = "Warning" }: ToastProps) => {
  toast({
    description: message,
    className: ToastStyle.warning,
  });
};

export const infoToast = ({ message, title = "Info" }: ToastProps) => {
  toast({
    description: message,
    className: ToastStyle.info,
  });
}; 