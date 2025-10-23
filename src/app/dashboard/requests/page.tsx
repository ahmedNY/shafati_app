"use client";

import React from "react";
import { useMemo, useState } from "react";
import { api, type RouterOutputs } from "@/trpc/react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import DashPage from "../_components/DashPage";
import FormPreview from "../_components/FormPreview";

type Opportunity = NonNullable<RouterOutputs["opportunity"]["getAll"]>[number];
type MyRequest = NonNullable<
  RouterOutputs["opportunityRequests"]["listMine"]
>[number];

export default function RequestsPage() {
  const [selectedOpportunityId, setSelectedOpportunityId] =
    useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const opportunityIdNum = useMemo(() => {
    if (selectedOpportunityId === "all") return undefined;
    const parsed = Number(selectedOpportunityId);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [selectedOpportunityId]);

  const { data: opportunities, isLoading: oppLoading } =
    api.opportunity.getAll.useQuery({});
  const {
    data: requests,
    isLoading,
    refetch,
    isFetching,
  } = api.opportunityRequests.listAll.useQuery(
    { opportunityId: opportunityIdNum },
    { refetchOnWindowFocus: false },
  );

  const opportunityIdToTitle = useMemo(() => {
    const map = new Map<number, string>();
    for (const o of (opportunities ?? []) as Opportunity[])
      map.set(o.id, o.title);
    return map;
  }, [opportunities]);

  const filtered = useMemo(() => {
    const base = (requests ?? []) as MyRequest[];
    return base.filter((r: MyRequest) => {
      const matchesStatus =
        selectedStatus === "all"
          ? true
          : (r.status ?? "PENDING") === selectedStatus;
      const title = opportunityIdToTitle.get(r.opportunityId) ?? "";
      const flat = `${title} ${JSON.stringify(r.formData ?? {})}`.toLowerCase();
      const matchesSearch =
        search.trim().length === 0 ? true : flat.includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [requests, search, selectedStatus, opportunityIdToTitle]);

  return (
    <DashPage title="الطلبات">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={selectedOpportunityId}
            onValueChange={setSelectedOpportunityId}
          >
            <SelectTrigger className="w-56">
              <SelectValue placeholder="تصفية حسب الفرصة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الفرص</SelectItem>
              {(opportunities ?? []).map((o: Opportunity) => (
                <SelectItem key={o.id} value={String(o.id)}>
                  {o.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="تصفية حسب الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="PENDING">معلق</SelectItem>
              <SelectItem value="REVIEWING">قيد المراجعة</SelectItem>
              <SelectItem value="APPROVED">موافق عليه</SelectItem>
              <SelectItem value="REJECTED">مرفوض</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            placeholder="البحث في العنوان أو بيانات النموذج..."
            className="w-72"
          />
          <Button
            variant="secondary"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? "جاري التحديث..." : "تحديث"}
          </Button>
        </div>
        <Card className="p-2">
          {isLoading || oppLoading ? (
            <div className="text-muted-foreground flex items-center gap-2 p-6 text-sm">
              <Spinner className="h-4 w-4" />
              جاري تحميل الطلبات...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[36px]">#</TableHead>
                  <TableHead>الفرصة</TableHead>
                  <TableHead>مرسل الطلب</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الإرسال</TableHead>
                  <TableHead>معاينة البيانات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-muted-foreground py-6 text-center text-sm"
                    >
                      لا توجد طلبات
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r: MyRequest, idx: number) => {
                    const title =
                      opportunityIdToTitle.get(r.opportunityId) ??
                      `#${r.opportunityId}`;
                    const date = r.createdAt
                      ? new Date(r.createdAt as unknown as string)
                      : null;

                    return (
                      <TableRow key={r.id}>
                        <TableCell className="text-muted-foreground">
                          #{r.id}
                        </TableCell>
                        <TableCell className="font-medium">{title}</TableCell>
                        <TableCell className="font-medium">
                          {r.user?.name}
                        </TableCell>
                        <TableCell>
                          {r.status === "PENDING"
                            ? "معلق"
                            : r.status === "REVIEWING"
                              ? "قيد المراجعة"
                              : r.status === "APPROVED"
                                ? "موافق عليه"
                                : r.status === "REJECTED"
                                  ? "مرفوض"
                                  : (r.status ?? "معلق")}
                        </TableCell>
                        <TableCell>
                          {date ? date.toLocaleString() : "-"}
                        </TableCell>
                        <TableCell className="max-w-[420px] truncate">
                          <FormPreview
                            formSchema={r.opportunity.jsonSchema}
                            formData={r.formData}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </DashPage>
  );
}
