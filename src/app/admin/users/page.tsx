import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Profile } from "@/types";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin", admin: "Admin",
  content_manager: "Content Manager", travel_executive: "Travel Executive",
};

async function getData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [profileRes, usersRes] = await Promise.all([
    supabase.from("profiles").select("role").eq("id", user.id).single(),
    supabase.from("profiles").select("*").order("created_at"),
  ]);

  if (!["super_admin","admin"].includes(profileRes.data?.role ?? "")) redirect("/admin");
  return (usersRes.data ?? []) as Profile[];
}

export default async function AdminUsersPage() {
  const users = await getData();
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Users</h1>
        <p className="text-sm text-charcoal-400 mt-1">{users.length} staff members. Manage access via Supabase Auth.</p>
      </div>
      <div className="bg-white rounded-2xl border border-charcoal-100 shadow-card overflow-hidden">
        <div className="divide-y divide-charcoal-100">
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-4 px-6 py-4 hover:bg-off-white transition-colors">
              <div className="w-9 h-9 rounded-full bg-vayu-100 flex items-center justify-center text-vayu-700 font-semibold text-sm shrink-0">
                {u.full_name?.charAt(0)?.toUpperCase() ?? "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-charcoal text-sm">{u.full_name ?? "—"}</p>
                <p className="text-xs text-charcoal-400">{u.email}</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-vayu-50 text-vayu-700 font-medium">
                {ROLE_LABELS[u.role] ?? u.role}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${u.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {u.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-charcoal-400">To invite new users or change roles, use the Supabase dashboard → Authentication → Users.</p>
    </div>
  );
}
