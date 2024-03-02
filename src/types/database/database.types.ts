export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ACA_Quotes: {
        Row: {
          "Coinsurance. % In-Network": string | null
          created_at: string
          "Deductibe Individual": string | null
          "Facility Copays (ER/Imaging/OP/IP)": string | null
          Funding: string | null
          id: number
          Insurer: string | null
          "Medical Plan": string | null
          "Office Copay (PCP/Specialist)": string | null
          "Out of Pocket Individual": string | null
          "Pharmacy Copay": string | null
          "Plan Type": string | null
        }
        Insert: {
          "Coinsurance. % In-Network"?: string | null
          created_at?: string
          "Deductibe Individual"?: string | null
          "Facility Copays (ER/Imaging/OP/IP)"?: string | null
          Funding?: string | null
          id?: number
          Insurer?: string | null
          "Medical Plan"?: string | null
          "Office Copay (PCP/Specialist)"?: string | null
          "Out of Pocket Individual"?: string | null
          "Pharmacy Copay"?: string | null
          "Plan Type"?: string | null
        }
        Update: {
          "Coinsurance. % In-Network"?: string | null
          created_at?: string
          "Deductibe Individual"?: string | null
          "Facility Copays (ER/Imaging/OP/IP)"?: string | null
          Funding?: string | null
          id?: number
          Insurer?: string | null
          "Medical Plan"?: string | null
          "Office Copay (PCP/Specialist)"?: string | null
          "Out of Pocket Individual"?: string | null
          "Pharmacy Copay"?: string | null
          "Plan Type"?: string | null
        }
        Relationships: []
      }
      carriers: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      carriers_users: {
        Row: {
          carrier: string | null
          carrier_id: number | null
          created_at: string
          id: number
          password: string | null
          username: string | null
        }
        Insert: {
          carrier?: string | null
          carrier_id?: number | null
          created_at?: string
          id?: number
          password?: string | null
          username?: string | null
        }
        Update: {
          carrier?: string | null
          carrier_id?: number | null
          created_at?: string
          id?: number
          password?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carriers_users_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          }
        ]
      }
      clients: {
        Row: {
          classes_contributions: Json[] | null
          comparison_created: boolean | null
          connected_plans: Json[] | null
          created_at: string
          icon: string | null
          id: number
          name: string | null
          num_lives: number | null
          public_id: string | null
          selected_quotes: string[] | null
          user_id: string | null
          zip_code: string | null
        }
        Insert: {
          classes_contributions?: Json[] | null
          comparison_created?: boolean | null
          connected_plans?: Json[] | null
          created_at?: string
          icon?: string | null
          id?: number
          name?: string | null
          num_lives?: number | null
          public_id?: string | null
          selected_quotes?: string[] | null
          user_id?: string | null
          zip_code?: string | null
        }
        Update: {
          classes_contributions?: Json[] | null
          comparison_created?: boolean | null
          connected_plans?: Json[] | null
          created_at?: string
          icon?: string | null
          id?: number
          name?: string | null
          num_lives?: number | null
          public_id?: string | null
          selected_quotes?: string[] | null
          user_id?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_clients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      clients_erin: {
        Row: {
          classes_contributions: Json[] | null
          created_at: string
          icon: string | null
          id: number
          name: string | null
          num_lives: number | null
          selected_quotes: string[] | null
        }
        Insert: {
          classes_contributions?: Json[] | null
          created_at?: string
          icon?: string | null
          id?: number
          name?: string | null
          num_lives?: number | null
          selected_quotes?: string[] | null
        }
        Update: {
          classes_contributions?: Json[] | null
          created_at?: string
          icon?: string | null
          id?: number
          name?: string | null
          num_lives?: number | null
          selected_quotes?: string[] | null
        }
        Relationships: []
      }
      graphs: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      links: {
        Row: {
          created_at: string
          id: number
          query_id: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          query_id?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          query_id?: string | null
          url?: string | null
        }
        Relationships: []
      }
      organizations: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      plans: {
        Row: {
          client_id: number | null
          created_at: string
          id: number
          plan_type: string | null
        }
        Insert: {
          client_id?: number | null
          created_at?: string
          id?: number
          plan_type?: string | null
        }
        Update: {
          client_id?: number | null
          created_at?: string
          id?: number
          plan_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_plans_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
      policies: {
        Row: {
          actual_ytd_revenue: number | null
          apr_payment: number | null
          aug_payment: number | null
          carrier: string | null
          carrier_id: number | null
          client: string | null
          client_id: number | null
          created_at: string
          dec_payment: number | null
          expected_annual_revenue: number | null
          expected_monthly_revenue: number | null
          feb_payment: number | null
          id: number
          jan_payment: number | null
          jul_payment: number | null
          jun_payment: number | null
          mar_payment: number | null
          may_payment: number | null
          monthly_payments: Json | null
          nov_payment: number | null
          oct_payment: number | null
          payments: number[] | null
          plan_type: string | null
          policy_id: string | null
          projected_yearly_revenue: number | null
          sep_payment: number | null
          status: Database["public"]["Enums"]["status"] | null
        }
        Insert: {
          actual_ytd_revenue?: number | null
          apr_payment?: number | null
          aug_payment?: number | null
          carrier?: string | null
          carrier_id?: number | null
          client?: string | null
          client_id?: number | null
          created_at?: string
          dec_payment?: number | null
          expected_annual_revenue?: number | null
          expected_monthly_revenue?: number | null
          feb_payment?: number | null
          id?: number
          jan_payment?: number | null
          jul_payment?: number | null
          jun_payment?: number | null
          mar_payment?: number | null
          may_payment?: number | null
          monthly_payments?: Json | null
          nov_payment?: number | null
          oct_payment?: number | null
          payments?: number[] | null
          plan_type?: string | null
          policy_id?: string | null
          projected_yearly_revenue?: number | null
          sep_payment?: number | null
          status?: Database["public"]["Enums"]["status"] | null
        }
        Update: {
          actual_ytd_revenue?: number | null
          apr_payment?: number | null
          aug_payment?: number | null
          carrier?: string | null
          carrier_id?: number | null
          client?: string | null
          client_id?: number | null
          created_at?: string
          dec_payment?: number | null
          expected_annual_revenue?: number | null
          expected_monthly_revenue?: number | null
          feb_payment?: number | null
          id?: number
          jan_payment?: number | null
          jul_payment?: number | null
          jun_payment?: number | null
          mar_payment?: number | null
          may_payment?: number | null
          monthly_payments?: Json | null
          nov_payment?: number | null
          oct_payment?: number | null
          payments?: number[] | null
          plan_type?: string | null
          policy_id?: string | null
          projected_yearly_revenue?: number | null
          sep_payment?: number | null
          status?: Database["public"]["Enums"]["status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "policies_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_policies_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_erin"
            referencedColumns: ["id"]
          }
        ]
      }
      policies_erin: {
        Row: {
          actual_ytd_revenue: number | null
          aor_date: string | null
          apr_payment: number | null
          aug_payment: number | null
          carrier: string | null
          carrier_id: number | null
          client: string | null
          client_id: number | null
          commission_rate: string | null
          created_at: string
          dec_payment: number | null
          expected_annual_revenue: number | null
          expected_monthly_revenue: number | null
          feb_payment: number | null
          id: number
          jan_payment: number | null
          jul_payment: number | null
          jun_payment: number | null
          mar_payment: number | null
          may_payment: number | null
          monthly_payments: Json | null
          nov_payment: number | null
          num_employees: string | null
          num_enrolled: string | null
          oct_payment: number | null
          payments: number[] | null
          plan_type: string | null
          policy_id: string | null
          projected_yearly_revenue: number | null
          renewal_date: string | null
          sep_payment: number | null
          status: Database["public"]["Enums"]["status"] | null
        }
        Insert: {
          actual_ytd_revenue?: number | null
          aor_date?: string | null
          apr_payment?: number | null
          aug_payment?: number | null
          carrier?: string | null
          carrier_id?: number | null
          client?: string | null
          client_id?: number | null
          commission_rate?: string | null
          created_at?: string
          dec_payment?: number | null
          expected_annual_revenue?: number | null
          expected_monthly_revenue?: number | null
          feb_payment?: number | null
          id?: number
          jan_payment?: number | null
          jul_payment?: number | null
          jun_payment?: number | null
          mar_payment?: number | null
          may_payment?: number | null
          monthly_payments?: Json | null
          nov_payment?: number | null
          num_employees?: string | null
          num_enrolled?: string | null
          oct_payment?: number | null
          payments?: number[] | null
          plan_type?: string | null
          policy_id?: string | null
          projected_yearly_revenue?: number | null
          renewal_date?: string | null
          sep_payment?: number | null
          status?: Database["public"]["Enums"]["status"] | null
        }
        Update: {
          actual_ytd_revenue?: number | null
          aor_date?: string | null
          apr_payment?: number | null
          aug_payment?: number | null
          carrier?: string | null
          carrier_id?: number | null
          client?: string | null
          client_id?: number | null
          commission_rate?: string | null
          created_at?: string
          dec_payment?: number | null
          expected_annual_revenue?: number | null
          expected_monthly_revenue?: number | null
          feb_payment?: number | null
          id?: number
          jan_payment?: number | null
          jul_payment?: number | null
          jun_payment?: number | null
          mar_payment?: number | null
          may_payment?: number | null
          monthly_payments?: Json | null
          nov_payment?: number | null
          num_employees?: string | null
          num_enrolled?: string | null
          oct_payment?: number | null
          payments?: number[] | null
          plan_type?: string | null
          policy_id?: string | null
          projected_yearly_revenue?: number | null
          renewal_date?: string | null
          sep_payment?: number | null
          status?: Database["public"]["Enums"]["status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "public_policies_erin_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_policies_erin_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_erin"
            referencedColumns: ["id"]
          }
        ]
      }
      quotes: {
        Row: {
          carrier: string | null
          client_id: number | null
          created_at: string
          data: Json | null
          deductibles: Json | null
          effective_date: string | null
          file_name: string | null
          file_url: string | null
          id: number
          logo_url: string | null
          metal_tier: string | null
          plan_category: string | null
          plan_name: string | null
          plan_type: string | null
          provider_network: string | null
          task_id: number | null
          website: string | null
        }
        Insert: {
          carrier?: string | null
          client_id?: number | null
          created_at?: string
          data?: Json | null
          deductibles?: Json | null
          effective_date?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: number
          logo_url?: string | null
          metal_tier?: string | null
          plan_category?: string | null
          plan_name?: string | null
          plan_type?: string | null
          provider_network?: string | null
          task_id?: number | null
          website?: string | null
        }
        Update: {
          carrier?: string | null
          client_id?: number | null
          created_at?: string
          data?: Json | null
          deductibles?: Json | null
          effective_date?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: number
          logo_url?: string | null
          metal_tier?: string | null
          plan_category?: string | null
          plan_name?: string | null
          plan_type?: string | null
          provider_network?: string | null
          task_id?: number | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          id: number
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      status: "Resolved" | "Unresolved"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
