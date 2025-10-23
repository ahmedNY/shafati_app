import React from "react";
import DashPage from "../_components/DashPage";
import { api, HydrateClient } from "@/trpc/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Eye } from "lucide-react";
import { RecentRequestsTable } from "./_components/RecentRequestsTable";
import { ChartsCard } from "./_components/ChartsCard";

const StatsPage = async () => {
  const stats = await api.admin.stats();
  return (
    <DashPage title="الرئيسية" subTitle="الإحصائيات">
      <HydrateClient>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* STATS */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="gap-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">
                  المستخدمون
                </CardTitle>
                <Users className="text-muted-foreground size-6" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.users}</div>
              </CardContent>
            </Card>

            <Card className="gap-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">الفرص</CardTitle>
                <Briefcase className="text-muted-foreground size-6" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.opportunities}</div>
              </CardContent>
            </Card>

            <Card className="gap-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">المشاهدات</CardTitle>
                <Eye className="text-muted-foreground size-6" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.watches}</div>
              </CardContent>
            </Card>
          </div>

          {/* RECENT REQUESTS */}
          <ChartsCard />

          {/* CHARTS */}
          <RecentRequestsTable />
        </div>
      </HydrateClient>
    </DashPage>
  );
};

export default StatsPage;
