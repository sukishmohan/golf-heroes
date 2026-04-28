export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string
          role: 'subscriber' | 'admin'
          stripe_customer_id: string | null
          subscription_status: 'active' | 'inactive' | 'cancelled' | 'past_due'
          subscription_plan: 'monthly' | 'yearly' | null
          subscription_end_date: string | null
          charity_id: string | null
          charity_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email: string
          role?: 'subscriber' | 'admin'
          stripe_customer_id?: string | null
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'past_due'
          subscription_plan?: 'monthly' | 'yearly' | null
          subscription_end_date?: string | null
          charity_id?: string | null
          charity_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string
          role?: 'subscriber' | 'admin'
          stripe_customer_id?: string | null
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'past_due'
          subscription_plan?: 'monthly' | 'yearly' | null
          subscription_end_date?: string | null
          charity_id?: string | null
          charity_percentage?: number
          created_at?: string
          updated_at?: string
        }
      }
      charities: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          website: string | null
          featured: boolean
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          website?: string | null
          featured?: boolean
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          website?: string | null
          featured?: boolean
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      golf_scores: {
        Row: {
          id: string
          user_id: string
          score: number
          score_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          score: number
          score_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          score?: number
          score_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      draws: {
        Row: {
          id: string
          draw_month: string
          draw_type: 'random' | 'algorithmic'
          winning_numbers: number[]
          status: 'draft' | 'simulated' | 'published'
          jackpot_amount: number
          pool_4match: number
          pool_3match: number
          total_subscribers: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          draw_month: string
          draw_type?: 'random' | 'algorithmic'
          winning_numbers: number[]
          status?: 'draft' | 'simulated' | 'published'
          jackpot_amount?: number
          pool_4match?: number
          pool_3match?: number
          total_subscribers?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          draw_month?: string
          draw_type?: 'random' | 'algorithmic'
          winning_numbers?: number[]
          status?: 'draft' | 'simulated' | 'published'
          jackpot_amount?: number
          pool_4match?: number
          pool_3match?: number
          total_subscribers?: number
          created_at?: string
          updated_at?: string
        }
      }
      draw_results: {
        Row: {
          id: string
          draw_id: string | null
          user_id: string | null
          match_count: number
          prize_amount: number
          payment_status: 'pending' | 'verified' | 'paid' | 'rejected'
          proof_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          draw_id?: string | null
          user_id?: string | null
          match_count: number
          prize_amount: number
          payment_status?: 'pending' | 'verified' | 'paid' | 'rejected'
          proof_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          draw_id?: string | null
          user_id?: string | null
          match_count?: number
          prize_amount?: number
          payment_status?: 'pending' | 'verified' | 'paid' | 'rejected'
          proof_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      prize_pool_config: {
        Row: {
          id: string
          subscription_fee_monthly: number
          subscription_fee_yearly: number
          pool_percentage_5match: number
          pool_percentage_4match: number
          pool_percentage_3match: number
          charity_min_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subscription_fee_monthly?: number
          subscription_fee_yearly?: number
          pool_percentage_5match?: number
          pool_percentage_4match?: number
          pool_percentage_3match?: number
          charity_min_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subscription_fee_monthly?: number
          subscription_fee_yearly?: number
          pool_percentage_5match?: number
          pool_percentage_4match?: number
          pool_percentage_3match?: number
          charity_min_percentage?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
