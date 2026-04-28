import type { Database } from './database.types'

export type { Database }

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Charity = Database['public']['Tables']['charities']['Row']
export type GolfScore = Database['public']['Tables']['golf_scores']['Row']
export type Draw = Database['public']['Tables']['draws']['Row']
export type DrawResult = Database['public']['Tables']['draw_results']['Row']
export type PrizePoolConfig = Database['public']['Tables']['prize_pool_config']['Row']

export interface AuthUser {
  id: string
  email: string
  role: 'subscriber' | 'admin'
}

export interface SubscriptionDetails {
  status: 'active' | 'inactive' | 'cancelled' | 'past_due'
  plan: 'monthly' | 'yearly' | null
  endDate: Date | null
  isActive: boolean
}
