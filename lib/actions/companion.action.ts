'use server'

import { auth } from "@clerk/nextjs/server"
import { createSupabaseClient } from "../supabase"
import { CreateCompanion } from "@/types" // Make sure this type is defined correctly

export const createCompanion = async (formData: CreateCompanion) => {
  const { userId: author } = await auth();
  if (!author) throw new Error("User not authenticated");

  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('companions')
    .insert({ ...formData, author })
    .select()
    .single(); // optional: `.single()` returns a single object instead of an array

  if (error || !data) {
    throw new Error(error?.message || "Failed to create companion");
  }

  return data;
}