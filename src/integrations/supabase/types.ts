export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      items: {
        Row: {
          class_restriction: string | null
          created_at: string
          description: string
          gold_price: number | null
          id: string
          image_url: string | null
          is_purchasable: boolean
          model_url: string | null
          name: string
          race_restriction: string | null
          rarity: string
          slot: string
        }
        Insert: {
          class_restriction?: string | null
          created_at?: string
          description: string
          gold_price?: number | null
          id?: string
          image_url?: string | null
          is_purchasable?: boolean
          model_url?: string | null
          name: string
          race_restriction?: string | null
          rarity?: string
          slot: string
        }
        Update: {
          class_restriction?: string | null
          created_at?: string
          description?: string
          gold_price?: number | null
          id?: string
          image_url?: string | null
          is_purchasable?: boolean
          model_url?: string | null
          name?: string
          race_restriction?: string | null
          rarity?: string
          slot?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          avg_pace: number | null
          created_at: string
          description: string | null
          distance_km: number | null
          duration_seconds: number | null
          entry_type: string
          gold_earned: number | null
          id: string
          route_data: Json | null
          title: string
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          avg_pace?: number | null
          created_at?: string
          description?: string | null
          distance_km?: number | null
          duration_seconds?: number | null
          entry_type?: string
          gold_earned?: number | null
          id?: string
          route_data?: Json | null
          title: string
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          avg_pace?: number | null
          created_at?: string
          description?: string | null
          distance_km?: number | null
          duration_seconds?: number | null
          entry_type?: string
          gold_earned?: number | null
          id?: string
          route_data?: Json | null
          title?: string
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active_title_id: string | null
          birthday: string | null
          character_name: string | null
          class: string | null
          created_at: string
          customization: Json | null
          email: string | null
          full_name: string | null
          gold: number
          has_created_character: boolean
          id: string
          level: number
          race: string | null
          subscription_tier: string
          updated_at: string
          xp: number
        }
        Insert: {
          active_title_id?: string | null
          birthday?: string | null
          character_name?: string | null
          class?: string | null
          created_at?: string
          customization?: Json | null
          email?: string | null
          full_name?: string | null
          gold?: number
          has_created_character?: boolean
          id: string
          level?: number
          race?: string | null
          subscription_tier?: string
          updated_at?: string
          xp?: number
        }
        Update: {
          active_title_id?: string | null
          birthday?: string | null
          character_name?: string | null
          class?: string | null
          created_at?: string
          customization?: Json | null
          email?: string | null
          full_name?: string | null
          gold?: number
          has_created_character?: boolean
          id?: string
          level?: number
          race?: string | null
          subscription_tier?: string
          updated_at?: string
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "profiles_active_title_id_fkey"
            columns: ["active_title_id"]
            isOneToOne: false
            referencedRelation: "titles"
            referencedColumns: ["id"]
          },
        ]
      }
      quest_completions: {
        Row: {
          auto_approved: boolean | null
          avg_speed: number | null
          challenge_confirmed: boolean | null
          completion_lat: number | null
          completion_lng: number | null
          created_at: string | null
          elevation_gain: number | null
          fraud_flags: string[] | null
          fraud_score: number | null
          gold_awarded: number | null
          id: string
          journey_data: Json | null
          manual_review_required: boolean | null
          quest_id: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          submitted_at: string | null
          total_distance: number | null
          total_duration: number | null
          user_id: string
          video_url: string | null
          xp_awarded: number | null
        }
        Insert: {
          auto_approved?: boolean | null
          avg_speed?: number | null
          challenge_confirmed?: boolean | null
          completion_lat?: number | null
          completion_lng?: number | null
          created_at?: string | null
          elevation_gain?: number | null
          fraud_flags?: string[] | null
          fraud_score?: number | null
          gold_awarded?: number | null
          id?: string
          journey_data?: Json | null
          manual_review_required?: boolean | null
          quest_id: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          total_distance?: number | null
          total_duration?: number | null
          user_id: string
          video_url?: string | null
          xp_awarded?: number | null
        }
        Update: {
          auto_approved?: boolean | null
          avg_speed?: number | null
          challenge_confirmed?: boolean | null
          completion_lat?: number | null
          completion_lng?: number | null
          created_at?: string | null
          elevation_gain?: number | null
          fraud_flags?: string[] | null
          fraud_score?: number | null
          gold_awarded?: number | null
          id?: string
          journey_data?: Json | null
          manual_review_required?: boolean | null
          quest_id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          total_distance?: number | null
          total_duration?: number | null
          user_id?: string
          video_url?: string | null
          xp_awarded?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quest_completions_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      quests: {
        Row: {
          class_affinity: string | null
          created_at: string
          description: string
          difficulty: string
          gold_reward: number
          id: string
          is_active: boolean
          is_funded_eligible: boolean | null
          location_type: string[] | null
          niche: string | null
          published_at: string | null
          quest_category: string
          quest_type: string
          requires_manual_review: boolean | null
          scheduled_for: string | null
          status: string | null
          tier: string | null
          title: string
          updated_at: string | null
          verification_config: Json | null
          xp_reward: number
        }
        Insert: {
          class_affinity?: string | null
          created_at?: string
          description: string
          difficulty?: string
          gold_reward?: number
          id?: string
          is_active?: boolean
          is_funded_eligible?: boolean | null
          location_type?: string[] | null
          niche?: string | null
          published_at?: string | null
          quest_category?: string
          quest_type: string
          requires_manual_review?: boolean | null
          scheduled_for?: string | null
          status?: string | null
          tier?: string | null
          title: string
          updated_at?: string | null
          verification_config?: Json | null
          xp_reward?: number
        }
        Update: {
          class_affinity?: string | null
          created_at?: string
          description?: string
          difficulty?: string
          gold_reward?: number
          id?: string
          is_active?: boolean
          is_funded_eligible?: boolean | null
          location_type?: string[] | null
          niche?: string | null
          published_at?: string | null
          quest_category?: string
          quest_type?: string
          requires_manual_review?: boolean | null
          scheduled_for?: string | null
          status?: string | null
          tier?: string | null
          title?: string
          updated_at?: string | null
          verification_config?: Json | null
          xp_reward?: number
        }
        Relationships: []
      }
      race_models: {
        Row: {
          created_at: string
          gender: string
          id: string
          model_url: string
          race_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          gender: string
          id?: string
          model_url: string
          race_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          gender?: string
          id?: string
          model_url?: string
          race_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      titles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          quest_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          quest_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          quest_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "titles_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_equipment: {
        Row: {
          equipped: boolean
          id: string
          item_id: string
          obtained_at: string
          obtained_via: string
          user_id: string
        }
        Insert: {
          equipped?: boolean
          id?: string
          item_id: string
          obtained_at?: string
          obtained_via?: string
          user_id: string
        }
        Update: {
          equipped?: boolean
          id?: string
          item_id?: string
          obtained_at?: string
          obtained_via?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_equipment_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_equipment_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_equipment_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quests: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          location_lat: number | null
          location_lng: number | null
          quest_id: string
          status: string
          user_id: string
          video_url: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          quest_id: string
          status?: string
          user_id: string
          video_url?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          quest_id?: string
          status?: string
          user_id?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_quests_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_quests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_quests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_rate_limits: {
        Row: {
          completions_last_day: number | null
          completions_last_hour: number | null
          created_at: string | null
          last_completion_at: string | null
          last_upload_at: string | null
          uploads_last_hour: number | null
          user_id: string
        }
        Insert: {
          completions_last_day?: number | null
          completions_last_hour?: number | null
          created_at?: string | null
          last_completion_at?: string | null
          last_upload_at?: string | null
          uploads_last_hour?: number | null
          user_id: string
        }
        Update: {
          completions_last_day?: number | null
          completions_last_hour?: number | null
          created_at?: string | null
          last_completion_at?: string | null
          last_upload_at?: string | null
          uploads_last_hour?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_titles: {
        Row: {
          earned_at: string
          id: string
          is_active: boolean
          title_id: string
          user_id: string
        }
        Insert: {
          earned_at?: string
          id?: string
          is_active?: boolean
          title_id: string
          user_id: string
        }
        Update: {
          earned_at?: string
          id?: string
          is_active?: boolean
          title_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_titles_title_id_fkey"
            columns: ["title_id"]
            isOneToOne: false
            referencedRelation: "titles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_titles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_titles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_profiles: {
        Row: {
          active_title: string | null
          character_name: string | null
          class: string | null
          created_at: string | null
          id: string | null
          level: number | null
          race: string | null
          xp: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_completion_rate_limit: {
        Args: { _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
