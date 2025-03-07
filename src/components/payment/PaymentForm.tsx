import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { paymentService } from "@/services/paymentService";
import { useToast } from "@/components/ui/use-toast";

interface PaymentFormProps {
  amount: number;
  paymentId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export const PaymentForm = ({
  amount,
  paymentId,
  onSuccess,
  onError,
}: PaymentFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = () => {
    setIsProcessing(true);

    try {
      // Create form and submit to eSewa
      const form = document.createElement("form");
      form.setAttribute("method", "POST");
      form.setAttribute("action", "https://uat.esewa.com.np/epay/main");

      // Add required fields
      const params = {
        amt: amount.toString(),
        psc: "0", // Service charge
        pdc: "0", // Delivery charge
        txAmt: "0", // Tax amount
        tAmt: amount.toString(), // Total amount
        pid: `BOOKSHARE_${paymentId}`,
        scd: import.meta.env.VITE_ESEWA_MERCHANT_ID,
        su: `${window.location.origin}/payment/success`,
        fu: `${window.location.origin}/payment/failure`,
      };

      // Create hidden input fields
      Object.entries(params).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", key);
        input.setAttribute("value", value);
        form.appendChild(input);
      });

      // Add form to body and submit
      document.body.appendChild(form);
      form.submit();

      // Remove form from body
      document.body.removeChild(form);
    } catch (error) {
      console.error("Error initializing eSewa:", error);
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
      onError("Failed to initialize payment");
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Complete Your Payment</h3>
        <p className="text-sm text-gray-500">
          Pay securely using eSewa
        </p>
        <p className="text-lg font-semibold mt-4">
          Amount: NPR {amount.toFixed(2)}
        </p>
      </div>
      <Button
        onClick={handlePayment}
        className="w-full"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Pay with eSewa"
        )}
      </Button>
    </Card>
  );
}; 