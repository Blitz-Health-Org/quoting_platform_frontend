import { supabase } from "@/src/supabase";
import { QuoteType } from "@/src/types/custom/Quote";

export async function handleUpdateQuotes(
  updatedQuotes: QuoteType[],
  clientId: number,
  planId: number,
  fetchClientAndQuotes: any,
) {
  // const { data: client, error: clientError } = await supabase
  //   .from("clients")
  //   .select()
  //   .eq("id", clientId)
  //   .single();

  // if (clientError) {
  //   console.error("Error fetching client from Supabase:", clientError);
  //   throw clientError;
  // }

  // const newConnectedPlans = client.connected_plans.map((plan: any) => {
  //   if (plan.id === planId) {
  //     return { ...plan, selectedQuotes: updatedQuotes };
  //   } else {
  //     return plan;
  //   }
  // });

  const { data, error } = await supabase
    .from("quotes") // Replace 'your_table_name' with your actual table name
    .upsert(updatedQuotes); // 'plans' is the array to insert into the 'connected_plans' column

  if (error) {
    console.error("Error updating connected plans in Supabase:", error);
    return { success: false, error };
  }
  console.log("Connected plans updated successfully:", data);
  fetchClientAndQuotes(clientId);

  return { success: true, data };
}
