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
      favorites: {
        Row: {
          created_at: string
          id: string
          user_id: string
          word_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          word_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          word_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "words"
            referencedColumns: ["id"]
          },
        ]
      }
      phrase_contributions: {
        Row: {
          approved_at: string | null
          created_at: string
          deleted_at: string | null
          id: string
          swardspeak_phrase: string
          translated_phrase: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          swardspeak_phrase: string
          translated_phrase: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          swardspeak_phrase?: string
          translated_phrase?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_phrase_contributions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      phrase_votes: {
        Row: {
          created_at: string
          id: string
          phrase_contribution_id: string
          user_id: string
          vote: Database["public"]["Enums"]["vote"]
        }
        Insert: {
          created_at?: string
          id?: string
          phrase_contribution_id: string
          user_id: string
          vote: Database["public"]["Enums"]["vote"]
        }
        Update: {
          created_at?: string
          id?: string
          phrase_contribution_id?: string
          user_id?: string
          vote?: Database["public"]["Enums"]["vote"]
        }
        Relationships: [
          {
            foreignKeyName: "public_phrase_votes_phrase_contribution_id_fkey"
            columns: ["phrase_contribution_id"]
            isOneToOne: false
            referencedRelation: "phrase_contributions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_phrase_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "phrase_contributions"
            referencedColumns: ["id"]
          },
        ]
      }
      phrases: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          swardspeak_phrase: string
          translated_phrase: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          swardspeak_phrase: string
          translated_phrase: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          swardspeak_phrase?: string
          translated_phrase?: string
          updated_at?: string
        }
        Relationships: []
      }
      translation_histories: {
        Row: {
          created_at: string
          id: string
          swardspeak: string | null
          tagalog: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          swardspeak?: string | null
          tagalog?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          swardspeak?: string | null
          tagalog?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "translation_histories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          pronouns: string[]
          sex: Database["public"]["Enums"]["sex"] | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          pronouns?: string[]
          sex?: Database["public"]["Enums"]["sex"] | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          pronouns?: string[]
          sex?: Database["public"]["Enums"]["sex"] | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      word_contributions: {
        Row: {
          approved_at: string | null
          created_at: string
          deleted_at: string | null
          id: string
          swardspeak_words: string[]
          translated_words: string[]
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          swardspeak_words: string[]
          translated_words: string[]
          user_id: string
        }
        Update: {
          approved_at?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          swardspeak_words?: string[]
          translated_words?: string[]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_contributions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      word_votes: {
        Row: {
          created_at: string
          id: string
          user_id: string
          vote: Database["public"]["Enums"]["vote"]
          word_contribution_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          vote: Database["public"]["Enums"]["vote"]
          word_contribution_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          vote?: Database["public"]["Enums"]["vote"]
          word_contribution_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_votes_contribution_id_fkey"
            columns: ["word_contribution_id"]
            isOneToOne: false
            referencedRelation: "word_contributions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_word_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      words: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          swardspeak_words: string[]
          translated_words: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          swardspeak_words: string[]
          translated_words: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          swardspeak_words?: string[]
          translated_words?: string[]
          updated_at?: string
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
      sex: "m" | "f"
      vote: "upvote" | "downvote"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

