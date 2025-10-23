"use client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type RecentRequest = {
  id: string;
  requesterName: string;
  opportunityTitle: string;
  status: "جديد" | "قيد المراجعة" | "مقبول" | "مرفوض";
  submittedAt: string; // ISO date
};

const mockedRequests: RecentRequest[] = [
  {
    id: "RQ-1001",
    requesterName: "أحمد خالد",
    opportunityTitle: "منحة تدريبية في تطوير الويب",
    status: "جديد",
    submittedAt: "2025-10-12T10:24:00Z",
  },
  {
    id: "RQ-1002",
    requesterName: "سارة محمد",
    opportunityTitle: "فرصة تطوع مجتمعي",
    status: "قيد المراجعة",
    submittedAt: "2025-10-13T14:05:00Z",
  },
  {
    id: "RQ-1003",
    requesterName: "ليث العلي",
    opportunityTitle: "برنامج تدريب صيفي",
    status: "مقبول",
    submittedAt: "2025-10-14T09:10:00Z",
  },
  {
    id: "RQ-1004",
    requesterName: "نور الهدى",
    opportunityTitle: "مسابقة ابتكار",
    status: "مرفوض",
    submittedAt: "2025-10-15T08:45:00Z",
  },
];

export function RecentRequestsTable() {
  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>أحدث الطلبات</CardTitle>
          <CardDescription>طلبات حديثة على الفرص</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">المعرّف</TableHead>
              <TableHead className="text-right">المتقدّم</TableHead>
              <TableHead className="text-right">الفرصة</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">تاريخ التقديم</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockedRequests.map((r) => {
              const date = new Date(r.submittedAt);
              const formatted = date.toLocaleString("ar-EG", {
                dateStyle: "medium",
                timeStyle: "short",
              });
              return (
                <TableRow key={r.id}>
                  <TableCell className="text-right font-medium">
                    {r.id}
                  </TableCell>
                  <TableCell className="text-right">
                    {r.requesterName}
                  </TableCell>
                  <TableCell className="text-right">
                    {r.opportunityTitle}
                  </TableCell>
                  <TableCell className="text-right">{r.status}</TableCell>
                  <TableCell className="text-right">{formatted}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
