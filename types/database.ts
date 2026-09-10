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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_name: string
          id: string
          metadata: Json
          page_path: string | null
        }
        Insert: {
          created_at?: string
          event_name: string
          id?: string
          metadata?: Json
          page_path?: string | null
        }
        Update: {
          created_at?: string
          event_name?: string
          id?: string
          metadata?: Json
          page_path?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean
          published_at: string | null
          slug: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          slug: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          order_index: number
          published: boolean
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          order_index?: number
          published?: boolean
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          order_index?: number
          published?: boolean
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      chatbot_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          order_index: number
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          order_index?: number
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          order_index?: number
          slug?: string
        }
        Relationships: []
      }
      chatbot_questions: {
        Row: {
          action_label: string | null
          action_url: string | null
          answer: string
          category_id: string | null
          created_at: string
          id: string
          is_active: boolean
          order_index: number
          question: string
          updated_at: string
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          answer: string
          category_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          order_index?: number
          question: string
          updated_at?: string
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          answer?: string
          category_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          order_index?: number
          question?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_questions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "chatbot_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_logs: {
        Row: {
          created_at: string
          deleted_at: string | null
          device_id: string | null
          habit_id: string
          id: string
          logged_on: string
          note: string | null
          sync_status: string
          updated_at: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          device_id?: string | null
          habit_id: string
          id?: string
          logged_on: string
          note?: string | null
          sync_status?: string
          updated_at?: string
          user_id: string
          value?: number
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          device_id?: string | null
          habit_id?: string
          id?: string
          logged_on?: string
          note?: string | null
          sync_status?: string
          updated_at?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "life_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "habit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      homepage_sections: {
        Row: {
          content: Json
          id: string
          is_enabled: boolean
          order_index: number
          section_key: string
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          content?: Json
          id?: string
          is_enabled?: boolean
          order_index?: number
          section_key: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: Json
          id?: string
          is_enabled?: boolean
          order_index?: number
          section_key?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          admin_notes: string | null
          budget_range: string | null
          created_at: string
          email: string
          event_date: string | null
          event_type: string
          expected_guests: number | null
          id: string
          is_archived: boolean | null
          location: string | null
          message: string | null
          name: string
          phone: string
          preferred_service: string | null
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          budget_range?: string | null
          created_at?: string
          email: string
          event_date?: string | null
          event_type: string
          expected_guests?: number | null
          id?: string
          is_archived?: boolean | null
          location?: string | null
          message?: string | null
          name: string
          phone: string
          preferred_service?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          budget_range?: string | null
          created_at?: string
          email?: string
          event_date?: string | null
          event_type?: string
          expected_guests?: number | null
          id?: string
          is_archived?: boolean | null
          location?: string | null
          message?: string | null
          name?: string
          phone?: string
          preferred_service?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      life_items: {
        Row: {
          body: string | null
          completed_at: string | null
          created_at: string
          deleted_at: string | null
          device_id: string | null
          id: string
          metadata: Json
          priority: string
          scheduled_for: string | null
          status: string
          sync_status: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body?: string | null
          completed_at?: string | null
          created_at?: string
          deleted_at?: string | null
          device_id?: string | null
          id?: string
          metadata?: Json
          priority?: string
          scheduled_for?: string | null
          status?: string
          sync_status?: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string | null
          completed_at?: string | null
          created_at?: string
          deleted_at?: string | null
          device_id?: string | null
          id?: string
          metadata?: Json
          priority?: string
          scheduled_for?: string | null
          status?: string
          sync_status?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "life_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          deleted_at: string | null
          device_id: string | null
          display_name: string
          email: string | null
          full_name: string | null
          id: string
          locale: string
          onboarding_completed: boolean
          role: string
          sync_status: string
          timezone: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          device_id?: string | null
          display_name?: string
          email?: string | null
          full_name?: string | null
          id: string
          locale?: string
          onboarding_completed?: boolean
          role?: string
          sync_status?: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          device_id?: string | null
          display_name?: string
          email?: string | null
          full_name?: string | null
          id?: string
          locale?: string
          onboarding_completed?: boolean
          role?: string
          sync_status?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_images: {
        Row: {
          alt_text: string | null
          blur_data_url: string | null
          caption: string | null
          created_at: string
          file_id: string | null
          height: number | null
          id: string
          image_url: string
          is_cover: boolean
          is_featured: boolean
          order_index: number
          project_id: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          blur_data_url?: string | null
          caption?: string | null
          created_at?: string
          file_id?: string | null
          height?: number | null
          id?: string
          image_url: string
          is_cover?: boolean
          is_featured?: boolean
          order_index?: number
          project_id: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          blur_data_url?: string | null
          caption?: string | null
          created_at?: string
          file_id?: string | null
          height?: number | null
          id?: string
          image_url?: string
          is_cover?: boolean
          is_featured?: boolean
          order_index?: number
          project_id?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category_id: string | null
          cover_image_url: string
          created_at: string
          description: string | null
          event_date: string | null
          featured: boolean
          id: string
          location: string | null
          order_index: number
          published: boolean
          seo_description: string | null
          seo_title: string | null
          slug: string
          story: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          cover_image_url: string
          created_at?: string
          description?: string | null
          event_date?: string | null
          featured?: boolean
          id?: string
          location?: string | null
          order_index?: number
          published?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          story?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          cover_image_url?: string
          created_at?: string
          description?: string | null
          event_date?: string | null
          featured?: boolean
          id?: string
          location?: string | null
          order_index?: number
          published?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          story?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string
          features: Json
          id: string
          is_active: boolean
          order_index: number
          slug: string
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description: string
          features?: Json
          id?: string
          is_active?: boolean
          order_index?: number
          slug: string
          summary: string
          title: string
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string
          features?: Json
          id?: string
          is_active?: boolean
          order_index?: number
          slug?: string
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          handle: string | null
          id: string
          is_active: boolean
          label: string
          order_index: number
          platform: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          handle?: string | null
          id?: string
          is_active?: boolean
          label: string
          order_index?: number
          platform: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          handle?: string | null
          id?: string
          is_active?: boolean
          label?: string
          order_index?: number
          platform?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      social_posts: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          is_featured: boolean
          order_index: number
          platform: string
          post_url: string
          thumbnail_url: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean
          order_index?: number
          platform: string
          post_url: string
          thumbnail_url?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean
          order_index?: number
          platform?: string
          post_url?: string
          thumbnail_url?: string | null
        }
        Relationships: []
      }
      sync_events: {
        Row: {
          client_mutation_id: string
          created_at: string
          error_message: string | null
          id: string
          operation: string
          payload: Json
          record_id: string
          status: string
          table_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_mutation_id: string
          created_at?: string
          error_message?: string | null
          id?: string
          operation: string
          payload?: Json
          record_id: string
          status?: string
          table_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_mutation_id?: string
          created_at?: string
          error_message?: string | null
          id?: string
          operation?: string
          payload?: Json
          record_id?: string
          status?: string
          table_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          avatar_image_url: string | null
          client_name: string
          created_at: string
          event_type: string | null
          featured: boolean
          id: string
          location: string | null
          order_index: number
          partner_name: string | null
          published: boolean
          quote: string
          rating: number
        }
        Insert: {
          avatar_image_url?: string | null
          client_name: string
          created_at?: string
          event_type?: string | null
          featured?: boolean
          id?: string
          location?: string | null
          order_index?: number
          partner_name?: string | null
          published?: boolean
          quote: string
          rating?: number
        }
        Update: {
          avatar_image_url?: string | null
          client_name?: string
          created_at?: string
          event_type?: string | null
          featured?: boolean
          id?: string
          location?: string | null
          order_index?: number
          partner_name?: string | null
          published?: boolean
          quote?: string
          rating?: number
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          appearance: Json
          created_at: string
          deleted_at: string | null
          device_id: string | null
          notification_preferences: Json
          sync_status: string
          units: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          appearance?: Json
          created_at?: string
          deleted_at?: string | null
          device_id?: string | null
          notification_preferences?: Json
          sync_status?: string
          units?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          appearance?: Json
          created_at?: string
          deleted_at?: string | null
          device_id?: string | null
          notification_preferences?: Json
          sync_status?: string
          units?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
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
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
