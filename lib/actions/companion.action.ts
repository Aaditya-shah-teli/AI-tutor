'use server'

import { auth } from "@clerk/nextjs/server"
import { createSupabaseClient } from "../supabase"
import { CreateCompanion, GetAllCompanions } from "@/types"


export const createCompanion = async (formData: CreateCompanion) => {
  const { userId: author } = await auth();
  if (!author) throw new Error("User not authenticated");

  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('companions')
    .insert({ ...formData, author })
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create companion");
  }

  return data;
};

export const getAllCompanions = async ({ limit = 10, page = 1, subject, topic }: GetAllCompanions) => {
  const supabase = createSupabaseClient();
  
  let query = supabase.from('companions').select();

  if (subject && topic) {
    query = query
      .ilike("subject", `%${subject}%`)
      .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  } else if (subject) {
    query = query.ilike("subject", `%${subject}%`);
  } else if (topic) {
    query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data: companions, error } = await query;
  if (error) throw new Error(error.message);
  return companions;
};

export const getCompanion = async (id: string) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('companions')
    .select('*')
    .eq('id', id);

  if (error) {
    console.error(error);
    return null;
  }

  return data?.[0] || null;
};

// ✅ Corrected: addToSessionHistory
export const addToSessionHistory = async (companionId: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('session_history')
    .insert({
      companion_id: companionId,
      user_id: userId
    });

  if (error) throw new Error(error.message);
  return data;
};

// ✅ Corrected: getRecentSessions
export const getRecentSessions = async (limit = 10) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('session_history')
    .select('companions:companion_id(*)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return data.map(({ companions }) => companions);
};

// ✅ Corrected: getUserSessions
export const getUserSessions = async (userId: string, limit = 10) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('session_history')
    .select('companions:companion_id(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return data.map(({ companions }) => companions);
};

// ✅ Corrected: getUserSessions
export const getUserCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('companions')
    .select()
    .eq('author', userId)

  if (error) throw new Error(error.message);

  return data;
};
export const newCompanionPermissions = async () => {
  const { userId, has } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const supabase = createSupabaseClient();
  let limit = 0;

  if (has({ plan: 'pro' })) {
    return true;
  } else if (has({ feature: '3_companion_limit' })) {
    limit = 3;
  } else if (has({ feature: '10_companion_limit' })) {
    limit = 10;
  } else {
    // Default limit if no matching plan/feature found
    return false;
  }

  const { count, error } = await supabase
    .from('companions')
    .select('id', { count: 'exact', head: true }) // head:true makes it return only count, no data
    .eq('author', userId);

  if (error) throw new Error(error.message);

  // Supabase returns count in `count` when using head: true
  if ((count ?? 0) >= limit) {
    return false;
  } else {
    return true;
  }
};