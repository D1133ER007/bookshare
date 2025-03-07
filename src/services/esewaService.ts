import { supabase } from "@/lib/supabaseClient";

interface CreatePaymentParams {
  amount: number;
  bookId: string;
  borrowerId: string;
  lenderId: string;
  startDate: string;
  endDate: string;
}

interface VerifyPaymentParams {
  paymentId: string;
  refId: string;
  amount: number;
}

export const esewaService = {
  async initiatePayment({
    amount,
    bookId,
    borrowerId,
    lenderId,
    startDate,
    endDate,
  }: CreatePaymentParams) {
    try {
      // Create a payment record in our database
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .insert({
          amount,
          book_id: bookId,
          borrower_id: borrowerId,
          lender_id: lenderId,
          start_date: startDate,
          end_date: endDate,
          status: "pending",
          payment_method: "esewa",
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Return eSewa payment parameters
      return {
        success: true,
        data: {
          paymentId: payment.id,
          amount: amount,
          tAmt: amount, // Total Amount
          amt: amount, // Actual Amount
          txAmt: 0, // Tax Amount
          psc: 0, // Service Charge
          pdc: 0, // Delivery Charge
          scd: import.meta.env.VITE_ESEWA_MERCHANT_CODE, // Merchant Code
          pid: `BOOKSHARE_${payment.id}`, // Unique Product ID
          su: `${import.meta.env.VITE_APP_URL}/payment/success`, // Success URL
          fu: `${import.meta.env.VITE_APP_URL}/payment/failure`, // Failure URL
        },
      };
    } catch (error) {
      console.error("Error initiating payment:", error);
      throw error;
    }
  },

  async verifyPayment({ paymentId, refId, amount }: VerifyPaymentParams) {
    try {
      // Verify with eSewa
      const verifyUrl = "https://uat.esewa.com.np/epay/transrec";
      const params = new URLSearchParams({
        amt: amount.toString(),
        rid: refId,
        pid: `BOOKSHARE_${paymentId}`,
        scd: import.meta.env.VITE_ESEWA_MERCHANT_CODE,
      });

      const response = await fetch(`${verifyUrl}?${params}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Payment verification failed");
      }

      const responseText = await response.text();
      const isSuccess = responseText.toLowerCase().includes("success");

      if (!isSuccess) {
        throw new Error("Payment verification failed");
      }

      // Update payment status in database
      const { error: updateError } = await supabase
        .from("payments")
        .update({ status: "completed", ref_id: refId })
        .eq("id", paymentId);

      if (updateError) throw updateError;

      return { success: true };
    } catch (error) {
      // Update payment status to failed
      await supabase
        .from("payments")
        .update({
          status: "failed",
          error_message: "Payment verification failed",
        })
        .eq("id", paymentId);

      throw error;
    }
  },
}; 