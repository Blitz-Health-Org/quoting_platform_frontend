// "use client"

// import { useState, useEffect } from "react";
// import { createClient, Session } from "@supabase/supabase-js";
// import { Auth } from "@supabase/auth-ui-react";
// import { ThemeSupa } from "@supabase/auth-ui-shared";

// const supabase = createClient(
//   "https://<project>.supabase.co",
//   "<your-anon-key>",
// );

// export default function App() {
//   const [session, setSession] = useState<Session | null>(null);

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//     });

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   if (!session) {
//     return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
//   } else {
//     return <div>Logged in!</div>;
//   }
// }
