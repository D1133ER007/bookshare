import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const PaymentFailure = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Payment Failed",
      description: "Your payment was not successful. Please try again.",
      variant: "destructive",
    });

    // Navigate back to books page after a short delay
    const timer = setTimeout(() => {
      navigate("/books");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 mb-4">
          <svg
            className="h-12 w-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <p className="text-lg">Payment failed. Redirecting...</p>
      </div>
    </div>
  );
};

export default PaymentFailure; 