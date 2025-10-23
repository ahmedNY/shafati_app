"use client";

import * as React from "react";
import {
  Users,
  Shield,
  Briefcase,
  FileText,
  Settings,
  PieChartIcon,
  InboxIcon,
} from "lucide-react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavLinks } from "./nav-links";

const mainMenuLinks = [
  {
    name: "الرئيسية",
    url: "/dashboard/stats",
    icon: PieChartIcon,
  },
  {
    name: "الفرص",
    url: "/dashboard/opportunities",
    icon: Briefcase,
  },
  {
    name: "الطلبات",
    url: "/dashboard/requests",
    icon: InboxIcon,
  },
  {
    name: "النماذج",
    url: "/dashboard/forms",
    icon: FileText,
  },
];

const platformLinks = [
  {
    name: "المستخدمون",
    url: "/dashboard/users",
    icon: Users,
  },
  {
    name: "الأدوار",
    url: "/dashboard/roles",
    icon: Shield,
  },
  {
    name: "الاعدادات",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar side="right" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <h1 className="p-1 text-2xl font-medium">أدارة النظام</h1>
      </SidebarHeader>
      <SidebarContent>
        <NavLinks title="القائمة الرئيسية" links={mainMenuLinks} />
        <NavLinks title="ادارة المنصة" links={platformLinks} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
