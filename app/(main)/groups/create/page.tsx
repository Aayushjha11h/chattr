"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGroups } from "@/hooks/use-groups";
import { groupCreateSchema } from "@/lib/utils/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Users, Lock } from "lucide-react";
import Link from "next/link";

export default function CreateGroupPage() {
  const router = useRouter();
  const { createGroup } = useGroups();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    visibility: "public" as "public" | "private",
    password: "",
    maxMembers: 500,
    onlyAdminsSend: false,
    onlyAdminsEdit: false,
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = groupCreateSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const group = await createGroup(form);
      router.push(`/groups/${group.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-2xl mx-auto p-6">
        <Link
          href="/groups"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to groups
        </Link>

        <Card className="border-0 shadow-lg glass-strong">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="w-6 h-6" />
              Create New Group
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  placeholder="Enter group name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What's this group about?"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxMembers">Max Members</Label>
                <Input
                  id="maxMembers"
                  type="number"
                  min={2}
                  max={5000}
                  value={form.maxMembers}
                  onChange={(e) => handleChange("maxMembers", parseInt(e.target.value))}
                  className="h-11"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Private Group</p>
                    <p className="text-sm text-muted-foreground">Require password to join</p>
                  </div>
                </div>
                <Switch
                  checked={form.visibility === "private"}
                  onCheckedChange={(checked) =>
                    handleChange("visibility", checked ? "private" : "public")
                  }
                />
              </div>

              {form.visibility === "private" && (
                <div className="space-y-2">
                  <Label htmlFor="password">Group Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min 4 characters"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className="h-11"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Only admins can send messages</p>
                    <p className="text-sm text-muted-foreground">Restrict messaging to admins only</p>
                  </div>
                  <Switch
                    checked={form.onlyAdminsSend}
                    onCheckedChange={(checked) => handleChange("onlyAdminsSend", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Only admins can edit info</p>
                    <p className="text-sm text-muted-foreground">Restrict group settings to admins</p>
                  </div>
                  <Switch
                    checked={form.onlyAdminsEdit}
                    onCheckedChange={(checked) => handleChange("onlyAdminsEdit", checked)}
                  />
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Group"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}