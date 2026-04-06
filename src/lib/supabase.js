import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  }
})

export const trackPageView = (page = '/') => {
  try {
    const sid = sessionStorage.getItem('denty_sid') || (() => {
      const id = crypto.randomUUID()
      sessionStorage.setItem('denty_sid', id)
      return id
    })()
    
    supabase.from('page_views').insert({ 
      page, 
      session_id: sid, 
      created_at: new Date().toISOString() 
    }).then(() => {})
  } catch(_) {}
}

// Real-time presence — tracks active users for admin dashboard
export const presenceChannel = supabase.channel('online-users', {
  config: { presence: { key: sessionStorage.getItem('denty_sid') || 'anon' } }
})

export function trackPresence(page = '/') {
  try {
    presenceChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await presenceChannel.track({ page, online_at: new Date().toISOString() })
      }
    })
  } catch(_) {}
}
