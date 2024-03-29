import { supabase } from "@/src/supabase";
import { QuoteType } from "@/src/types/custom/Quote";

export async function handleUpdateQuotes(
  updatedQuotes: number[],
  clientId: number,
  planId: number,
  fetchClientAndQuotes: any
) {
  console.log("here are updated quotes", updatedQuotes);
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select()
    .eq("id", clientId)
    .single();

  if (clientError) {
    console.error("Error fetching client from Supabase:", clientError);
    throw clientError;
  }

  const newConnectedPlans = client.connected_plans.map((plan: any) => {
    if (plan.id === planId) {
      return { ...plan, selectedQuotes: updatedQuotes };
    } else {
      return plan;
    }
  });

  const { data, error } = await supabase
    .from("clients") // Replace 'your_table_name' with your actual table name
    .update({ connected_plans: newConnectedPlans }) // 'plans' is the array to insert into the 'connected_plans' column
    .match({ id: clientId }); // Assuming 'selectedClient.id' is the primary key of the row you want to update

  if (error) {
    console.error("Error updating connected plans in Supabase:", error);
    return { success: false, error };
  }
  console.log("Connected plans updated successfully:", data);
  fetchClientAndQuotes(clientId);

  return { success: true, data };
}
