import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { esewaService } from "@/services/esewaService";
import { useToast } from "@/components/ui/use-toast";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const refId = searchParams.get("refId");
        const amt = searchParams.get("amt");
        const pid = searchParams.get("pid");

        if (!refId || !amt || !pid) {
          throw new Error("Missing payment parameters");
        }

        // Extract payment ID from pid (format: BOOKSHARE_paymentId)
        const paymentId = pid.replace("BOOKSHARE_", "");

        await esewaService.verifyPayment({
          paymentId,
          refId,
          amount: parseFloat(amt),
        });

        toast({
          title: "Payment Successful",
          description: "Your rental payment has been processed successfully",
        });

        // Navigate back to books page
        navigate("/books");
      } catch (error) {
        console.error("Payment verification error:", error);
        toast({
          title: "Payment Verification Failed",
          description: "Failed to verify your payment. Please try again.",
          variant: "destructive",
        });
        navigate("/books");
      }
    };

    verifyPayment();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg">Verifying your payment...</p>
      </div>
    </div>
  );
};

export default PaymentSuccess; 