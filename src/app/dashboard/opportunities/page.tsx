"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { opportunityTypes } from "@/server/db/schema";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashPage from "../_components/DashPage";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
export default function DashboardOpportunitiesPage() {
  const [type, setType] = useState<
    (typeof opportunityTypes)[number] | undefined
  >();
  const [q, setQ] = useState("");

  const {
    data: rows,
    refetch,
    isFetching,
  } = api.admin.listOpportunities.useQuery({ type, q });

  const createMutation = api.admin.createOpportunity.useMutation({
    onSuccess: () => refetch(),
  });
  const updateMutation = api.admin.updateOpportunity.useMutation({
    onSuccess: () => refetch(),
  });

  const [form, setForm] = useState({
    id: 0,
    title: "",
    description: "",
    longDescription: "",
    type: undefined as (typeof opportunityTypes)[number] | undefined,
    accessLevel: "PUBLIC",
  });

  const isEditing = form.id > 0;
  const [open, setOpen] = useState(false);

  return (
    <DashPage title="الفرص">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={type ?? undefined}
            onValueChange={(v) => setType(v as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="بحث حسب النوع" />
            </SelectTrigger>
            <SelectContent>
              {opportunityTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="بحث..."
            className="max-w-32"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Button onClick={() => refetch()} disabled={isFetching}>
            بحث
          </Button>
          <Sheet open={open} onOpenChange={(v) => setOpen(v)}>
            <SheetTrigger asChild>
              <Button
                onClick={() => {
                  setForm({
                    id: 0,
                    title: "",
                    description: "",
                    longDescription: "",
                    type: undefined,
                    accessLevel: "PUBLIC",
                  });
                }}
              >
                إضافة فرصة
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>
                  {isEditing ? "تعديل الفرصة" : "إضافة فرصة"}
                </SheetTitle>
              </SheetHeader>
              <form
                className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (isEditing) {
                    updateMutation.mutate(
                      {
                        id: form.id,
                        title: form.title || undefined,
                        description: form.description || undefined,
                        longDescription: form.longDescription || undefined,
                        type: form.type as any,
                        accessLevel: form.accessLevel || undefined,
                      },
                      {
                        onSuccess: () => {
                          setOpen(false);
                        },
                      },
                    );
                  } else {
                    if (!form.title || !form.type) return;
                    createMutation.mutate(
                      {
                        title: form.title,
                        description: form.description || undefined,
                        longDescription: form.longDescription || undefined,
                        type: form.type,
                        accessLevel: form.accessLevel || "PUBLIC",
                      },
                      {
                        onSuccess: () => {
                          setOpen(false);
                        },
                      },
                    );
                  }
                }}
              >
                <input
                  className="rounded border px-2 py-1"
                  placeholder="العنوان"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <Select
                  value={form.type ?? undefined}
                  onValueChange={(v) => setForm({ ...form, type: v as any })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="النوع..." />
                  </SelectTrigger>
                  <SelectContent>
                    {opportunityTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  className="rounded border px-2 py-1 md:col-span-2"
                  placeholder="وصف قصير"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
                <textarea
                  className="rounded border px-2 py-1 md:col-span-2"
                  placeholder="وصف مفصل"
                  value={form.longDescription}
                  onChange={(e) =>
                    setForm({ ...form, longDescription: e.target.value })
                  }
                />
                <Select
                  value={form.accessLevel}
                  onValueChange={(v) => setForm({ ...form, accessLevel: v })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLIC">عام</SelectItem>
                    <SelectItem value="PRIVATE">خاص</SelectItem>
                  </SelectContent>
                </Select>
                <SheetFooter className="md:col-span-2">
                  <Button
                    type="submit"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                  >
                    {isEditing ? "تحديث" : "إنشاء"}
                  </Button>
                </SheetFooter>
              </form>
            </SheetContent>
          </Sheet>
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-full border bg-white">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>#</TableHead>
                <TableHead>العنوان</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الوصول</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(rows ?? []).map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.title}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell>
                    {r.accessLevel === "PUBLIC" ? "عام" : "خاص"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setForm({
                          id: r.id,
                          title: r.title,
                          description: r.description ?? "",
                          longDescription: r.longDescription ?? "",
                          type: r.type as any,
                          accessLevel: r.accessLevel ?? "PUBLIC",
                        });
                        setOpen(true);
                      }}
                    >
                      تعديل
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashPage>
  );
}
