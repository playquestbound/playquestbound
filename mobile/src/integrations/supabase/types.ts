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
      items: {
        Row: {
          class_restriction: string | null;
          created_at: string;
          description: string | null;
          gold_price: number | null;
          id: string;
          image_url: string | null;
          is_purchasable: boolean | null;
          model_url: string | null;
          name: string;
          race_restriction: string | null;
          rarity: string | null;
          slot: string | null;
          updated_at: string;
        };
        Insert: {
          class_restriction?: string | null;
          created_at?: string;
          description?: string | null;
          gold_price?: number | null;
          id?: string;
          image_url?: string | null;
          is_purchasable?: boolean | null;
          model_url?: string | null;
          name: string;
          race_restriction?: string | null;
          rarity?: string | null;
          slot?: string | null;
          updated_at?: string;
        };
        Update: {
          class_restriction?: string | null;
          created_at?: string;
          description?: string | null;
          gold_price?: number | null;
          id?: string;
          image_url?: string | null;
          is_purchasable?: boolean | null;
          model_url?: string | null;
          name?: string;
          race_restriction?: string | null;
          rarity?: string | null;
          slot?: string | null;
          updated_at?: string;
        };
      };
      journal_entries: {
        Row: {
          avg_pace: number | null;
          created_at: string;
          description: string | null;
          distance_km: number | null;
          duration_seconds: number | null;
          entry_type: string;
          gold_earned: number | null;
          id: string;
          route_data: Json | null;
          title: string;
          user_id: string;
          xp_earned: number | null;
        };
        Insert: {
          avg_pace?: number | null;
          created_at?: string;
          description?: string | null;
          distance_km?: number | null;
          duration_seconds?: number | null;
          entry_type: string;
          gold_earned?: number | null;
          id?: string;
          route_data?: Json | null;
          title: string;
          user_id: string;
          xp_earned?: number | null;
        };
        Update: {
          avg_pace?: number | null;
          created_at?: string;
          description?: string | null;
          distance_km?: number | null;
          duration_seconds?: number | null;
          entry_type?: string;
          gold_earned?: number | null;
          id?: string;
          route_data?: Json | null;
          title?: string;
          user_id?: string;
          xp_earned?: number | null;
        };
      };
      profiles: {
        Row: {
          active_title_id: string | null;
          character_name: string | null;
          class: string | null;
          created_at: string;
          customization: Json | null;
          gold: number;
          has_created_character: boolean;
          id: string;
          level: number;
          race: string | null;
          subscription_tier: string;
          updated_at: string;
          xp: number;
        };
        Insert: {
          active_title_id?: string | null;
          character_name?: string | null;
          class?: string | null;
          created_at?: string;
          customization?: Json | null;
          gold?: number;
          has_created_character?: boolean;
          id: string;
          level?: number;
          race?: string | null;
          subscription_tier?: string;
          updated_at?: string;
          xp?: number;
        };
        Update: {
          active_title_id?: string | null;
          character_name?: string | null;
          class?: string | null;
          created_at?: string;
          customization?: Json | null;
          gold?: number;
          has_created_character?: boolean;
          id?: string;
          level?: number;
          race?: string | null;
          subscription_tier?: string;
          updated_at?: string;
          xp?: number;
        };
      };
      public_profiles: {
        Row: {
          character_name: string | null;
          class: string | null;
          id: string | null;
          level: number | null;
          race: string | null;
          xp: number | null;
        };
        Insert: {
          character_name?: string | null;
          class?: string | null;
          id?: string | null;
          level?: number | null;
          race?: string | null;
          xp?: number | null;
        };
        Update: {
          character_name?: string | null;
          class?: string | null;
          id?: string | null;
          level?: number | null;
          race?: string | null;
          xp?: number | null;
        };
      };
      quest_completions: {
        Row: {
          auto_approved: boolean | null;
          avg_speed: number | null;
          challenge_confirmed: boolean | null;
          completion_lat: number | null;
          completion_lng: number | null;
          created_at: string;
          elevation_gain: number | null;
          fraud_flags: string[] | null;
          fraud_score: number | null;
          gold_awarded: number | null;
          id: string;
          journey_data: Json | null;
          manual_review_required: boolean | null;
          quest_id: string;
          rejection_reason: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          route_data: Json | null;
          status: string;
          submitted_at: string | null;
          total_distance: number | null;
          total_duration: number | null;
          user_id: string;
          video_url: string | null;
          xp_awarded: number | null;
        };
        Insert: {
          auto_approved?: boolean | null;
          avg_speed?: number | null;
          challenge_confirmed?: boolean | null;
          completion_lat?: number | null;
          completion_lng?: number | null;
          created_at?: string;
          elevation_gain?: number | null;
          fraud_flags?: string[] | null;
          fraud_score?: number | null;
          gold_awarded?: number | null;
          id?: string;
          journey_data?: Json | null;
          manual_review_required?: boolean | null;
          quest_id: string;
          rejection_reason?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          route_data?: Json | null;
          status?: string;
          submitted_at?: string | null;
          total_distance?: number | null;
          total_duration?: number | null;
          user_id: string;
          video_url?: string | null;
          xp_awarded?: number | null;
        };
        Update: {
          auto_approved?: boolean | null;
          avg_speed?: number | null;
          challenge_confirmed?: boolean | null;
          completion_lat?: number | null;
          completion_lng?: number | null;
          created_at?: string;
          elevation_gain?: number | null;
          fraud_flags?: string[] | null;
          fraud_score?: number | null;
          gold_awarded?: number | null;
          id?: string;
          journey_data?: Json | null;
          manual_review_required?: boolean | null;
          quest_id?: string;
          rejection_reason?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          route_data?: Json | null;
          status?: string;
          submitted_at?: string | null;
          total_distance?: number | null;
          total_duration?: number | null;
          user_id?: string;
          video_url?: string | null;
          xp_awarded?: number | null;
        };
      };
      quests: {
        Row: {
          class_affinity: string | null;
          created_at: string;
          description: string;
          difficulty: string;
          gold_reward: number;
          id: string;
          is_active: boolean;
          is_funded_eligible: boolean | null;
          niche: string | null;
          published_at: string | null;
          quest_category: string;
          quest_type: string;
          requires_manual_review: boolean | null;
          scheduled_for: string | null;
          status: string | null;
          tier: string | null;
          title: string;
          updated_at: string;
          verification_config: Json | null;
          xp_reward: number;
        };
        Insert: {
          class_affinity?: string | null;
          created_at?: string;
          description: string;
          difficulty?: string;
          gold_reward?: number;
          id?: string;
          is_active?: boolean;
          is_funded_eligible?: boolean | null;
          niche?: string | null;
          published_at?: string | null;
          quest_category?: string;
          quest_type?: string;
          requires_manual_review?: boolean | null;
          scheduled_for?: string | null;
          status?: string | null;
          tier?: string | null;
          title: string;
          updated_at?: string;
          verification_config?: Json | null;
          xp_reward?: number;
        };
        Update: {
          class_affinity?: string | null;
          created_at?: string;
          description?: string;
          difficulty?: string;
          gold_reward?: number;
          id?: string;
          is_active?: boolean;
          is_funded_eligible?: boolean | null;
          niche?: string | null;
          published_at?: string | null;
          quest_category?: string;
          quest_type?: string;
          requires_manual_review?: boolean | null;
          scheduled_for?: string | null;
          status?: string | null;
          tier?: string | null;
          title?: string;
          updated_at?: string;
          verification_config?: Json | null;
          xp_reward?: number;
        };
      };
      race_models: {
        Row: {
          created_at: string;
          gender: string;
          id: string;
          model_url: string;
          race: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          gender: string;
          id?: string;
          model_url: string;
          race: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          gender?: string;
          id?: string;
          model_url?: string;
          race?: string;
          updated_at?: string;
        };
      };
      titles: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          quest_id: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          quest_id?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          quest_id?: string | null;
        };
      };
      user_quests: {
        Row: {
          completed_at: string | null;
          created_at: string;
          id: string;
          location_lat: number | null;
          location_lng: number | null;
          quest_id: string;
          status: string;
          user_id: string;
          video_url: string | null;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          location_lat?: number | null;
          location_lng?: number | null;
          quest_id: string;
          status?: string;
          user_id: string;
          video_url?: string | null;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          location_lat?: number | null;
          location_lng?: number | null;
          quest_id?: string;
          status?: string;
          user_id?: string;
          video_url?: string | null;
        };
      };
      user_titles: {
        Row: {
          earned_at: string;
          id: string;
          is_active: boolean;
          title_id: string;
          user_id: string;
        };
        Insert: {
          earned_at?: string;
          id?: string;
          is_active?: boolean;
          title_id: string;
          user_id: string;
        };
        Update: {
          earned_at?: string;
          id?: string;
          is_active?: boolean;
          title_id?: string;
          user_id?: string;
        };
      };
      waitlist_emails: {
        Row: {
          created_at: string;
          email: string;
          id: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
        };
      };
    };
    Views: {
      public_profiles: {
        Row: {
          character_name: string | null;
          class: string | null;
          id: string | null;
          level: number | null;
          race: string | null;
          xp: number | null;
        };
      };
    };
    Functions: {
      has_role: {
        Args: { _user_id: string; _role: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
