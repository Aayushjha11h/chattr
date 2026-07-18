import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MainLayout } from "@/components/layout/main-layout";

export default async function MainLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return <MainLayout profile={profile}>{children}</MainLayout>;
}