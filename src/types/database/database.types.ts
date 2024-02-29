export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      notes: {
        Row: {
          combousername: string;
          created_at: string;
          email: string | null;
          notes: string | null;
          vendor: string | null;
        };
        Insert: {
          combousername: string;
          created_at?: string;
          email?: string | null;
          notes?: string | null;
          vendor?: string | null;
        };
        Update: {
          combousername?: string;
          created_at?: string;
          email?: string | null;
          notes?: string | null;
          vendor?: string | null;
        };
        Relationships: [];
      };
      pageopens: {
        Row: {
          company: string | null;
          created_at: string;
          email: string | null;
          id: number;
          Name: string | null;
        };
        Insert: {
          company?: string | null;
          created_at?: string;
          email?: string | null;
          id?: number;
          Name?: string | null;
        };
        Update: {
          company?: string | null;
          created_at?: string;
          email?: string | null;
          id?: number;
          Name?: string | null;
        };
        Relationships: [];
      };
      pastsearches: {
        Row: {
          benefitType: string | null;
          companyRegion: string | null;
          companySize: string | null;
          created_at: string;
          email: string | null;
          id: number;
          rfpDueDate: string | null;
        };
        Insert: {
          benefitType?: string | null;
          companyRegion?: string | null;
          companySize?: string | null;
          created_at?: string;
          email?: string | null;
          id?: number;
          rfpDueDate?: string | null;
        };
        Update: {
          benefitType?: string | null;
          companyRegion?: string | null;
          companySize?: string | null;
          created_at?: string;
          email?: string | null;
          id?: number;
          rfpDueDate?: string | null;
        };
        Relationships: [];
      };
      requests: {
        Row: {
          created_at: string;
          email: string | null;
          id: number;
          requesttype: string | null;
          submit: string | null;
          vendor: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: number;
          requesttype?: string | null;
          submit?: string | null;
          vendor?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: number;
          requesttype?: string | null;
          submit?: string | null;
          vendor?: string | null;
        };
        Relationships: [];
      };
      rfp_data: {
        Row: {
          blog: string | null;
          bookmarks: string[] | null;
          Categories: string | null;
          clicks: string | null;
          ClinicalProofPoints: string | null;
          confirmedemail: boolean | null;
          Customers: string | null;
          CustomerTestimonials: string | null;
          Description: string | null;
          Email: string | null;
          Facebook: string | null;
          fundingtype: string | null;
          headquarterslocation: string | null;
          LinkedIn: string | null;
          logo: string | null;
          LongSummary: string | null;
          Name: string;
          numofemployees: string | null;
          PricingDetails: string | null;
          Twitter: string | null;
          video: string | null;
          Website: string | null;
          YearFounded: string | null;
          YouTube: string | null;
        };
        Insert: {
          blog?: string | null;
          bookmarks?: string[] | null;
          Categories?: string | null;
          clicks?: string | null;
          ClinicalProofPoints?: string | null;
          confirmedemail?: boolean | null;
          Customers?: string | null;
          CustomerTestimonials?: string | null;
          Description?: string | null;
          Email?: string | null;
          Facebook?: string | null;
          fundingtype?: string | null;
          headquarterslocation?: string | null;
          LinkedIn?: string | null;
          logo?: string | null;
          LongSummary?: string | null;
          Name: string;
          numofemployees?: string | null;
          PricingDetails?: string | null;
          Twitter?: string | null;
          video?: string | null;
          Website?: string | null;
          YearFounded?: string | null;
          YouTube?: string | null;
        };
        Update: {
          blog?: string | null;
          bookmarks?: string[] | null;
          Categories?: string | null;
          clicks?: string | null;
          ClinicalProofPoints?: string | null;
          confirmedemail?: boolean | null;
          Customers?: string | null;
          CustomerTestimonials?: string | null;
          Description?: string | null;
          Email?: string | null;
          Facebook?: string | null;
          fundingtype?: string | null;
          headquarterslocation?: string | null;
          LinkedIn?: string | null;
          logo?: string | null;
          LongSummary?: string | null;
          Name?: string;
          numofemployees?: string | null;
          PricingDetails?: string | null;
          Twitter?: string | null;
          video?: string | null;
          Website?: string | null;
          YearFounded?: string | null;
          YouTube?: string | null;
        };
        Relationships: [];
      };
      "rfp_data_backup-jan-2": {
        Row: {
          Categories: string | null;
          ClinicalProofPoints: string | null;
          confirmedemail: string | null;
          Customers: string | null;
          CustomerTestimonials: string | null;
          Description: string | null;
          Email: string | null;
          fundingtype: string | null;
          headquarterslocation: string | null;
          logo: string | null;
          LongSummary: string | null;
          Name: string;
          PricingDetails: string | null;
          SVG: string | null;
          Website: string | null;
          YearFounded: number | null;
        };
        Insert: {
          Categories?: string | null;
          ClinicalProofPoints?: string | null;
          confirmedemail?: string | null;
          Customers?: string | null;
          CustomerTestimonials?: string | null;
          Description?: string | null;
          Email?: string | null;
          fundingtype?: string | null;
          headquarterslocation?: string | null;
          logo?: string | null;
          LongSummary?: string | null;
          Name: string;
          PricingDetails?: string | null;
          SVG?: string | null;
          Website?: string | null;
          YearFounded?: number | null;
        };
        Update: {
          Categories?: string | null;
          ClinicalProofPoints?: string | null;
          confirmedemail?: string | null;
          Customers?: string | null;
          CustomerTestimonials?: string | null;
          Description?: string | null;
          Email?: string | null;
          fundingtype?: string | null;
          headquarterslocation?: string | null;
          logo?: string | null;
          LongSummary?: string | null;
          Name?: string;
          PricingDetails?: string | null;
          SVG?: string | null;
          Website?: string | null;
          YearFounded?: number | null;
        };
        Relationships: [];
      };
      rfp_data_duplicate: {
        Row: {
          blog: string | null;
          bookmarks: string[] | null;
          Categories: string | null;
          ClinicalProofPoints: string | null;
          confirmedemail: boolean | null;
          Customers: string | null;
          CustomerTestimonials: string | null;
          Description: string | null;
          Email: string | null;
          Facebook: string | null;
          fundingtype: string | null;
          headquarterslocation: string | null;
          LinkedIn: string | null;
          logo: string | null;
          LongSummary: string | null;
          Name: string;
          numofemployees: string | null;
          PricingDetails: string | null;
          Twitter: string | null;
          video: string | null;
          Website: string | null;
          YearFounded: string | null;
          YouTube: string | null;
        };
        Insert: {
          blog?: string | null;
          bookmarks?: string[] | null;
          Categories?: string | null;
          ClinicalProofPoints?: string | null;
          confirmedemail?: boolean | null;
          Customers?: string | null;
          CustomerTestimonials?: string | null;
          Description?: string | null;
          Email?: string | null;
          Facebook?: string | null;
          fundingtype?: string | null;
          headquarterslocation?: string | null;
          LinkedIn?: string | null;
          logo?: string | null;
          LongSummary?: string | null;
          Name: string;
          numofemployees?: string | null;
          PricingDetails?: string | null;
          Twitter?: string | null;
          video?: string | null;
          Website?: string | null;
          YearFounded?: string | null;
          YouTube?: string | null;
        };
        Update: {
          blog?: string | null;
          bookmarks?: string[] | null;
          Categories?: string | null;
          ClinicalProofPoints?: string | null;
          confirmedemail?: boolean | null;
          Customers?: string | null;
          CustomerTestimonials?: string | null;
          Description?: string | null;
          Email?: string | null;
          Facebook?: string | null;
          fundingtype?: string | null;
          headquarterslocation?: string | null;
          LinkedIn?: string | null;
          logo?: string | null;
          LongSummary?: string | null;
          Name?: string;
          numofemployees?: string | null;
          PricingDetails?: string | null;
          Twitter?: string | null;
          video?: string | null;
          Website?: string | null;
          YearFounded?: string | null;
          YouTube?: string | null;
        };
        Relationships: [];
      };
      rfpgenerate: {
        Row: {
          benefitType: string | null;
          clientBusinessDescription: string | null;
          clientSize: string | null;
          created_at: string;
          email: string | null;
          fileURL: string | null;
          id: number;
          questionChanges: string | null;
          rfpDueDate: string | null;
          vendorName: string | null;
        };
        Insert: {
          benefitType?: string | null;
          clientBusinessDescription?: string | null;
          clientSize?: string | null;
          created_at?: string;
          email?: string | null;
          fileURL?: string | null;
          id?: number;
          questionChanges?: string | null;
          rfpDueDate?: string | null;
          vendorName?: string | null;
        };
        Update: {
          benefitType?: string | null;
          clientBusinessDescription?: string | null;
          clientSize?: string | null;
          created_at?: string;
          email?: string | null;
          fileURL?: string | null;
          id?: number;
          questionChanges?: string | null;
          rfpDueDate?: string | null;
          vendorName?: string | null;
        };
        Relationships: [];
      };
      rfps: {
        Row: {
          created_at: string;
          id: string;
          inferred_benefit_type: string | null;
          link: string | null;
          rfp_name: string | null;
          url: string | null;
          user: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          inferred_benefit_type?: string | null;
          link?: string | null;
          rfp_name?: string | null;
          url?: string | null;
          user?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          inferred_benefit_type?: string | null;
          link?: string | null;
          rfp_name?: string | null;
          url?: string | null;
          user?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "rfps_user_fkey";
            columns: ["user"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["email"];
          },
        ];
      };
      self_serve_documents: {
        Row: {
          content: string | null;
          embedding: string | null;
          id: number;
          metadata: Json | null;
        };
        Insert: {
          content?: string | null;
          embedding?: string | null;
          id?: number;
          metadata?: Json | null;
        };
        Update: {
          content?: string | null;
          embedding?: string | null;
          id?: number;
          metadata?: Json | null;
        };
        Relationships: [];
      };
      users: {
        Row: {
          created_at: string;
          email: string;
          name: string | null;
          password: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          name?: string | null;
          password?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          name?: string | null;
          password?: string | null;
        };
        Relationships: [];
      };
      vendors: {
        Row: {
          bookmarked: boolean | null;
          created_at: string;
          id: number;
        };
        Insert: {
          bookmarked?: boolean | null;
          created_at?: string;
          id?: number;
        };
        Update: {
          bookmarked?: boolean | null;
          created_at?: string;
          id?: number;
        };
        Relationships: [];
      };
      "vendors-rfps": {
        Row: {
          created_at: string;
          id: number;
          link: string | null;
          messages: string[] | null;
          rfp: string | null;
          vendor: number | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          link?: string | null;
          messages?: string[] | null;
          rfp?: string | null;
          vendor?: number | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          link?: string | null;
          messages?: string[] | null;
          rfp?: string | null;
          vendor?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "vendors-rfps_rfp_fkey";
            columns: ["rfp"];
            isOneToOne: false;
            referencedRelation: "rfps";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vendors-rfps_vendor_fkey";
            columns: ["vendor"];
            isOneToOne: false;
            referencedRelation: "vendors";
            referencedColumns: ["id"];
          },
        ];
      };
      waitlist: {
        Row: {
          created_at: string;
          emailio: string | null;
          id: number;
        };
        Insert: {
          created_at?: string;
          emailio?: string | null;
          id?: number;
        };
        Update: {
          created_at?: string;
          emailio?: string | null;
          id?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      hnswhandler: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      ivfflathandler: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      match_documents: {
        Args: {
          query_embedding: string;
          match_count?: number;
          filter?: Json;
        };
        Returns: {
          id: number;
          content: string;
          metadata: Json;
          embedding: Json;
          similarity: number;
        }[];
      };
      vector_avg: {
        Args: {
          "": number[];
        };
        Returns: string;
      };
      vector_dims: {
        Args: {
          "": string;
        };
        Returns: number;
      };
      vector_norm: {
        Args: {
          "": string;
        };
        Returns: number;
      };
      vector_out: {
        Args: {
          "": string;
        };
        Returns: unknown;
      };
      vector_send: {
        Args: {
          "": string;
        };
        Returns: string;
      };
      vector_typmod_in: {
        Args: {
          "": unknown[];
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never;
