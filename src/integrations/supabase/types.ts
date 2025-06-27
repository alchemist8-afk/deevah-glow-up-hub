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
      artist_availability: {
        Row: {
          allows_group_sessions: boolean | null
          artist_id: string
          hourly_rate: number | null
          id: string
          max_group_size: number | null
          status: string
          updated_at: string | null
        }
        Insert: {
          allows_group_sessions?: boolean | null
          artist_id: string
          hourly_rate?: number | null
          id?: string
          max_group_size?: number | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          allows_group_sessions?: boolean | null
          artist_id?: string
          hourly_rate?: number | null
          id?: string
          max_group_size?: number | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artist_availability_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_portfolio: {
        Row: {
          artist_id: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string
          is_featured: boolean | null
          service_category: string | null
          title: string | null
        }
        Insert: {
          artist_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url: string
          is_featured?: boolean | null
          service_category?: string | null
          title?: string | null
        }
        Update: {
          artist_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string
          is_featured?: boolean | null
          service_category?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artist_portfolio_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          artist_id: string | null
          booking_date: string
          client_id: string | null
          created_at: string | null
          escrow_held: boolean | null
          id: string
          is_group_session: boolean | null
          location: string | null
          location_details: string | null
          location_type: string | null
          max_guests: number | null
          mood: string | null
          notes: string | null
          price: number | null
          provider_id: string | null
          service_id: string | null
          status: string | null
          total_amount: number
        }
        Insert: {
          artist_id?: string | null
          booking_date: string
          client_id?: string | null
          created_at?: string | null
          escrow_held?: boolean | null
          id?: string
          is_group_session?: boolean | null
          location?: string | null
          location_details?: string | null
          location_type?: string | null
          max_guests?: number | null
          mood?: string | null
          notes?: string | null
          price?: number | null
          provider_id?: string | null
          service_id?: string | null
          status?: string | null
          total_amount: number
        }
        Update: {
          artist_id?: string | null
          booking_date?: string
          client_id?: string | null
          created_at?: string | null
          escrow_held?: boolean | null
          id?: string
          is_group_session?: boolean | null
          location?: string | null
          location_details?: string | null
          location_type?: string | null
          max_guests?: number | null
          mood?: string | null
          notes?: string | null
          price?: number | null
          provider_id?: string | null
          service_id?: string | null
          status?: string | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "bookings_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      business_teams: {
        Row: {
          business_id: string
          created_at: string | null
          id: string
          member_id: string
          permissions: Json | null
          role: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          id?: string
          member_id: string
          permissions?: Json | null
          role?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          id?: string
          member_id?: string
          permissions?: Json | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_teams_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_teams_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      glow_posts: {
        Row: {
          artist_id: string | null
          artist_name: string | null
          caption: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string
          is_group_session: boolean | null
          likes_count: number | null
          mood_tags: string[] | null
          service_used: string | null
          user_id: string | null
        }
        Insert: {
          artist_id?: string | null
          artist_name?: string | null
          caption?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url: string
          is_group_session?: boolean | null
          likes_count?: number | null
          mood_tags?: string[] | null
          service_used?: string | null
          user_id?: string | null
        }
        Update: {
          artist_id?: string | null
          artist_name?: string | null
          caption?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string
          is_group_session?: boolean | null
          likes_count?: number | null
          mood_tags?: string[] | null
          service_used?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "glow_posts_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "glow_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_session_guests: {
        Row: {
          guest_id: string | null
          id: string
          joined_at: string | null
          session_id: string | null
        }
        Insert: {
          guest_id?: string | null
          id?: string
          joined_at?: string | null
          session_id?: string | null
        }
        Update: {
          guest_id?: string | null
          id?: string
          joined_at?: string | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_session_guests_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_session_guests_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "group_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      group_sessions: {
        Row: {
          artist_id: string | null
          created_at: string | null
          current_guests: number | null
          description: string | null
          host_id: string | null
          id: string
          location: string
          max_guests: number
          mood_vibe: string | null
          price_per_person: number
          service_type: string
          session_date: string
          status: string | null
          title: string
        }
        Insert: {
          artist_id?: string | null
          created_at?: string | null
          current_guests?: number | null
          description?: string | null
          host_id?: string | null
          id?: string
          location: string
          max_guests: number
          mood_vibe?: string | null
          price_per_person: number
          service_type: string
          session_date: string
          status?: string | null
          title: string
        }
        Update: {
          artist_id?: string | null
          created_at?: string | null
          current_guests?: number | null
          description?: string | null
          host_id?: string | null
          id?: string
          location?: string
          max_guests?: number
          mood_vibe?: string | null
          price_per_person?: number
          service_type?: string
          session_date?: string
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_sessions_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_sessions_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          mood_tags: string[] | null
          name: string
          prep_time: number | null
          price: number
          restaurant_id: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          mood_tags?: string[] | null
          name: string
          prep_time?: number | null
          price: number
          restaurant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          mood_tags?: string[] | null
          name?: string
          prep_time?: number | null
          price?: number
          restaurant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meals_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          account_name: string | null
          account_number: string | null
          bank_name: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          method_type: string
          user_id: string
        }
        Insert: {
          account_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          method_type: string
          user_id: string
        }
        Update: {
          account_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          method_type?: string
          user_id?: string
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          comment_text: string
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          comment_text: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          comment_text?: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "glow_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "glow_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          mood_tags: string[] | null
          name: string
          price: number
          provider_id: string | null
          seller_id: string | null
          stock_quantity: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          mood_tags?: string[] | null
          name: string
          price: number
          provider_id?: string | null
          seller_id?: string | null
          stock_quantity?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          mood_tags?: string[] | null
          name?: string
          price?: number
          provider_id?: string | null
          seller_id?: string | null
          stock_quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string
          glowcoins_balance: number | null
          id: string
          location: string | null
          phone: string | null
          referral_code: string | null
          referred_by: string | null
          updated_at: string | null
          user_role: string
          wallet_balance: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name: string
          glowcoins_balance?: number | null
          id: string
          location?: string | null
          phone?: string | null
          referral_code?: string | null
          referred_by?: string | null
          updated_at?: string | null
          user_role: string
          wallet_balance?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string
          glowcoins_balance?: number | null
          id?: string
          location?: string | null
          phone?: string | null
          referral_code?: string | null
          referred_by?: string | null
          updated_at?: string | null
          user_role?: string
          wallet_balance?: number | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          referred_id: string | null
          referrer_id: string | null
          reward_amount: number | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referred_id?: string | null
          referrer_id?: string | null
          reward_amount?: number | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referred_id?: string | null
          referrer_id?: string | null
          reward_amount?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rides: {
        Row: {
          booking_id: string | null
          created_at: string | null
          dropoff_location: string
          estimated_duration: number | null
          fare: number
          id: string
          passenger_id: string | null
          pickup_location: string
          rider_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          dropoff_location: string
          estimated_duration?: number | null
          fare: number
          id?: string
          passenger_id?: string | null
          pickup_location: string
          rider_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          dropoff_location?: string
          estimated_duration?: number | null
          fare?: number
          id?: string
          passenger_id?: string | null
          pickup_location?: string
          rider_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rides_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rides_passenger_id_fkey"
            columns: ["passenger_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rides_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          duration: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          mood_tags: string[] | null
          name: string
          price: number
          provider_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          mood_tags?: string[] | null
          name: string
          price: number
          provider_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          mood_tags?: string[] | null
          name?: string
          price?: number
          provider_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_tasks: {
        Row: {
          actual_earnings: number | null
          booking_id: string | null
          created_at: string | null
          delivery_location: string | null
          driver_id: string | null
          estimated_earnings: number | null
          id: string
          pickup_location: string | null
          status: string | null
          task_type: string | null
        }
        Insert: {
          actual_earnings?: number | null
          booking_id?: string | null
          created_at?: string | null
          delivery_location?: string | null
          driver_id?: string | null
          estimated_earnings?: number | null
          id?: string
          pickup_location?: string | null
          status?: string | null
          task_type?: string | null
        }
        Update: {
          actual_earnings?: number | null
          booking_id?: string | null
          created_at?: string | null
          delivery_location?: string | null
          driver_id?: string | null
          estimated_earnings?: number | null
          id?: string
          pickup_location?: string | null
          status?: string | null
          task_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transport_tasks_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transport_tasks_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_balances: {
        Row: {
          balance_ksh: number | null
          created_at: string | null
          glow_coins: number | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance_ksh?: number | null
          created_at?: string | null
          glow_coins?: number | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance_ksh?: number | null
          created_at?: string | null
          glow_coins?: number | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          method: string | null
          payment_method_id: string | null
          reference_id: string | null
          status: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          method?: string | null
          payment_method_id?: string | null
          reference_id?: string | null
          status?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          method?: string | null
          payment_method_id?: string | null
          reference_id?: string | null
          status?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_likes: {
        Args: { post_id: string }
        Returns: undefined
      }
      increment_likes: {
        Args: { post_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
