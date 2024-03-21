import { supabase } from "@/src/supabase";
import { QuoteType } from "@/src/types/custom/Quote";

export async function handleUpdateQuotes(
  updatedQuotes: QuoteType[],
  clientId: number,
) {
  try {
    console.log("EHLOOOO???", updatedQuotes);
    // Map each updatedQuote to a promise that performs the update operation
    const updatePromises = updatedQuotes.map((quote) =>
      supabase
        .from("quotes")
        .update({ data: quote.data }) // Ensure quote.data contains the updated data
        .eq("id", quote.id) // Ensure quote.id is the unique identifier for the quote
        .select(),
    );

    // Wait for all update operations to complete
    const results = await Promise.all(updatePromises);

    // Check for any errors in the results
    const errors = results.filter((result) => result.error);

    const { error } = await supabase
      .from("clients")
      .update({ connected_plans: updatedQuotes })
      .eq("id", clientId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (errors.length > 0) {
      // Handle the case where one or more updates failed
      throw new Error(`Failed to update ${errors.length} quotes.`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating quotes:", error);
    return { success: false, error: error };
  }
}
