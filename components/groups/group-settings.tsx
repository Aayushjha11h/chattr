"use client";

import { useState } from "react";
import { useGroups } from "@/hooks/use-groups";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, Loader2 } from "lucide-react";

export function GroupSettings({
  group,
  myRole,
}: {
  group: any;
  myRole: string;
}) {
  const { updateGroup, leaveGroup } = useGroups();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    name: group.name,
    description: group.description,
    maxMembers: group.max_members,
    onlyAdminsSend: group.only_admins_send,
    onlyAdminsEdit: group.only_admins_edit,
  });

  const canEdit = myRole === "owner" || (myRole === "admin" && !group.only_admins_edit);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateGroup(group.id, {
        name: form.name,
        description: form.description,
        max_members: form.maxMembers,
        only_admins_send: form.onlyAdminsSend,
        only_admins_edit: form.onlyAdminsEdit,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/groups/join?code=${group.invite_link}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-none bg-accent/30">
        <CardHeader>
          <CardTitle className="text-base">Group Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              disabled={!canEdit}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              disabled={!canEdit}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Max Members</Label>
            <Input
              type="number"
              value={form.maxMembers}
              onChange={(e) => setForm((prev) => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
              disabled={!canEdit}
            />
          </div>

          {canEdit && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Only admins can send</p>
                  <p className="text-xs text-muted-foreground">Restrict messaging</p>
                </div>
                <Switch
                  checked={form.onlyAdminsSend}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, onlyAdminsSend: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Only admins can edit</p>
                  <p className="text-xs text-muted-foreground">Restrict settings</p>
                </div>
                <Switch
                  checked={form.onlyAdminsEdit}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, onlyAdminsEdit: checked }))
                  }
                />
              </div>
            </div>
          )}

          {canEdit && (
            <Button onClick={handleSave} disabled={loading} className="w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-none bg-accent/30">
        <CardHeader>
          <CardTitle className="text-base">Invite Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input
              value={`${typeof window !== "undefined" ? window.location.origin : ""}/groups/join?code=${group.invite_link}`}
              readOnly
              className="flex-1"
            />
            <Button variant="outline" size="icon" onClick={handleCopyLink}>
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {myRole !== "owner" && (
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => leaveGroup(group.id)}
        >
          Leave Group
        </Button>
      )}
    </div>
  );
}