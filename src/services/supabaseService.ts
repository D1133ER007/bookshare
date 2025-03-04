import { supabase } from "@/lib/supabase";

// Books services
export const getBooks = async (filters = {}) => {
  let query = supabase.from("books").select("*");

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      query = query.eq(key, value);
    }
  });

  return await query;
};

export const getBookById = async (id: string) => {
  return await supabase
    .from("books")
    .select("*, owner:profiles(*)")
    .eq("id", id)
    .single();
};

export const createBook = async (bookData: any) => {
  return await supabase.from("books").insert(bookData);
};

export const updateBook = async (id: string, bookData: any) => {
  return await supabase.from("books").update(bookData).eq("id", id);
};

export const deleteBook = async (id: string) => {
  return await supabase.from("books").delete().eq("id", id);
};

// User profile services
export const getUserProfile = async (userId: string) => {
  return await supabase.from("profiles").select("*").eq("id", userId).single();
};

export const updateUserProfile = async (userId: string, profileData: any) => {
  return await supabase.from("profiles").update(profileData).eq("id", userId);
};

// Transaction services
export const createRentalRequest = async (rentalData: any) => {
  return await supabase.from("rental_requests").insert(rentalData);
};

export const getRentalRequests = async (
  userId: string,
  type: "incoming" | "outgoing",
) => {
  if (type === "incoming") {
    return await supabase
      .from("rental_requests")
      .select("*, book:books(*), requester:profiles(*)")
      .eq("owner_id", userId);
  } else {
    return await supabase
      .from("rental_requests")
      .select("*, book:books(*), owner:profiles(*)")
      .eq("requester_id", userId);
  }
};

export const updateRentalRequest = async (id: string, status: string) => {
  return await supabase.from("rental_requests").update({ status }).eq("id", id);
};

export const createExchangeProposal = async (exchangeData: any) => {
  return await supabase.from("exchange_proposals").insert(exchangeData);
};

export const getExchangeProposals = async (
  userId: string,
  type: "incoming" | "outgoing",
) => {
  if (type === "incoming") {
    return await supabase
      .from("exchange_proposals")
      .select(
        "*, book_requested:books(*), book_offered:books(*), requester:profiles(*)",
      )
      .eq("owner_id", userId);
  } else {
    return await supabase
      .from("exchange_proposals")
      .select(
        "*, book_requested:books(*), book_offered:books(*), owner:profiles(*)",
      )
      .eq("requester_id", userId);
  }
};

export const updateExchangeProposal = async (id: string, status: string) => {
  return await supabase
    .from("exchange_proposals")
    .update({ status })
    .eq("id", id);
};
