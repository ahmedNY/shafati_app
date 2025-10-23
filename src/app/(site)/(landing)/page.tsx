import {
  ArrowLeftIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  SparklesIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import { auth } from "@/server/auth";
import Link from "next/link";
import { HydrateClient } from "@/trpc/server";
import MountainScene from "./_components/MountainScene";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon } from "lucide-react";
// Stakeholder list for easy mapping
const stakeholders = [
  "أعمال مقاولة",
  "مزود خدمة",
  "طالب خدمة",
  "صحافة وإعلام",
  "رائد أعمال",
  "مستثمر",
  "مسؤول حكومي",
  "مورد",
];

export default async function HomePage() {
  const session = await auth();
  return (
    <HydrateClient>
      <div className="bg-gray-900 text-white">
        {/* Header */}
        <header className="sticky top-0 left-0 z-30 flex w-full items-center justify-between p-4 md:p-6">
          <h1 className="text-xl font-bold">مشروع قاسيون</h1>
          <DropdownMenu>
            <DropdownMenuTrigger className="md:hidden">
              <MenuIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {session && (
                <>
                  <DropdownMenuLabel>
                    مرحبا {session.user.name}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem asChild>
                <a href="#about">عن المشروع</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="#stakeholders">المستفيدون</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="#opportunities">الفرص</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
                  {session ? "تسجيل الخروج" : "تسجيل الدخول"}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <nav className="hidden items-center gap-4 md:flex md:gap-6">
            <a
              href="#opportunities"
              className="transition-colors hover:text-cyan-400"
            >
              الفرص
            </a>
            <a
              href="#stakeholders"
              className="transition-colors hover:text-cyan-400"
            >
              المستفيدون
            </a>
            <a href="#about" className="transition-colors hover:text-cyan-400">
              عن المشروع
            </a>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className={cn(buttonVariants({ size: "sm" }))}
            >
              {session ? "تسجيل الخروج" : "تسجيل الدخول"}
            </Link>
          </nav>
        </header>
        {/* Hero Section */}
        <section className="relative flex h-screen items-center justify-center overflow-hidden">
          <MountainScene />
          <div className="relative z-10 p-4 text-center">
            <h2
              className="text-4xl leading-tight font-extrabold text-white md:text-6xl"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}
            >
              قاسيون: استثمر في رؤية المستقبل
            </h2>
            <p
              className="mx-auto mt-4 max-w-2xl text-lg text-gray-200 md:text-xl"
              style={{ textShadow: "0 2px 5px rgba(0,0,0,0.7)" }}
            >
              منصة رقمية متكاملة لتنظيم وإدارة وتطوير المشاريع السياحية في جبل
              قاسيون.
            </p>
            <Link
              href="/opportunities"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:from-cyan-600 hover:to-blue-700",
              )}
            >
              <span>اكتشف الفرص المتاحة</span>
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
          </div>
          {/* Gradient Overlay */}
          <div className="absolute bottom-0 left-0 z-10 h-1/3 w-full bg-gradient-to-t from-gray-900 to-transparent"></div>
        </section>
        {/* About Section */}
        <section id="about" className="px-4 py-20 md:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h3 className="mb-4 text-3xl font-bold text-cyan-400">
              رؤيتنا للمستقبل
            </h3>
            <p className="text-lg leading-relaxed text-gray-300">
              يهدف مشروع قاسيون إلى إنشاء منظومة رقمية شاملة تنظم عملية بناء
              وتطوير وإدارة المواقع السياحية، مما يحقق التنمية المستدامة ويخلق
              فرصاً فريدة للمستثمرين، رواد الأعمال، ومزودي الخدمات ضمن بيئة عمل
              شفافة وفعالة.
            </p>
          </div>
        </section>
        {/* Features Section */}
        <section id="features" className="bg-gray-800/50 px-4 py-20 md:px-8">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 text-center md:grid-cols-3">
            <div className="p-6">
              <SparklesIcon className="mx-auto mb-4 h-12 w-12 text-cyan-400" />
              <h4 className="mb-2 text-xl font-bold">فرص استثمارية متنوعة</h4>
              <p className="text-gray-400">
                نقدم مجموعة واسعة من الفرص في قطاعات البناء، الخدمات، والتشغيل.
              </p>
            </div>
            <div className="p-6">
              <BuildingOffice2Icon className="mx-auto mb-4 h-12 w-12 text-cyan-400" />
              <h4 className="mb-2 text-xl font-bold">منصة قابلة للتخصيص</h4>
              <p className="text-gray-400">
                نظام مرن يمكن تكييفه لخدمة مشاريع سياحية أخرى بنماذج عمل
                ديناميكية.
              </p>
            </div>
            <div className="p-6">
              <UserGroupIcon className="mx-auto mb-4 h-12 w-12 text-cyan-400" />
              <h4 className="mb-2 text-xl font-bold">نظام أدوار متكامل</h4>
              <p className="text-gray-400">
                صلاحيات وأدوار متعددة تضمن وصول كل مستخدم للمعلومات التي
                يحتاجها.
              </p>
            </div>
          </div>
        </section>
        {/* Stakeholders Section */}
        <section id="stakeholders" className="px-4 py-20 md:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <h3 className="mb-12 text-3xl font-bold text-cyan-400">
              منصة للجميع
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {stakeholders.map((stakeholder) => (
                <span
                  key={stakeholder}
                  className="text-md rounded-full bg-gray-700 px-5 py-2 font-medium text-gray-200"
                >
                  {stakeholder}
                </span>
              ))}
            </div>
          </div>
        </section>
        {/* Opportunities Section CTA */}
        <section
          id="opportunities"
          className="bg-cover bg-center py-24"
          style={{ backgroundImage: "url('/mountain-bg.jpg')" }}
        >
          <div className="bg-black/60 py-20">
            <div className="mx-auto max-w-4xl px-4 text-center">
              <BriefcaseIcon className="mx-auto mb-6 h-16 w-16 text-cyan-400" />
              <h3 className="mb-4 text-4xl font-bold">فرص واعدة بانتظارك</h3>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
                اطلع على قائمة المشاريع والمناقصات المتاحة حالياً. سجل حسابك
                الآن للوصول إلى البيانات الحصرية وتقديم عروضك.
              </p>
              <Link
                href={"/opportunities"}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:from-cyan-600 hover:to-blue-700",
                )}
              >
                استعراض الفرص المتاحة
              </Link>
            </div>
          </div>
        </section>
        {/* Footer */}
        <footer className="border-t border-gray-700 bg-gray-900 px-4 py-8 md:px-8">
          <div className="mx-auto max-w-6xl text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} مشروع قاسيون. جميع الحقوق
              محفوظة.
            </p>
            <div className="mt-4 flex justify-center gap-6">
              <a href="#" className="hover:text-cyan-400">
                سياسة الخصوصية
              </a>
              <a href="#" className="hover:text-cyan-400">
                شروط الاستخدام
              </a>
              <a href="#" className="hover:text-cyan-400">
                تواصل معنا
              </a>
            </div>
          </div>
        </footer>
      </div>
    </HydrateClient>
  );
}
