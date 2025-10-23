import { api as serverApi } from "@/trpc/server";
import FollowButton from "./_components/FollowButton";
import ApplyForm from "./_components/ApplyForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarIcon,
  TagIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

// Helper for Arabic labels
const opportunityTypeLabels = {
  CONSTRUCTION: "أعمال مقاولة",
  SERVICE_PROVIDER: "مزود خدمة",
  INVESTMENT: "استثمار",
  SUPPLY: "توريد",
};

// This tells Next.js what to do when it encounters an invalid ID
type Props = {
  params: Promise<{ id: string }>;
};

export default async function OpportunityDetailPage({ params }: Props) {
  const opportunityId = parseInt((await params).id, 10);
  if (isNaN(opportunityId)) {
    notFound();
  }

  // Fetch data on the server using our tRPC server helper
  const opportunity = await serverApi.opportunity.getById({
    id: opportunityId,
  });

  // If no opportunity is found, show the 404 page
  if (!opportunity) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-900 pt-24 pb-12 text-white">
      <div className="mx-auto max-w-4xl px-4">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 text-cyan-400 transition-colors hover:text-cyan-300"
          >
            <ArrowRightIcon className="h-5 w-5" />
            <span>العودة إلى كل الفرص</span>
          </Link>
        </div>

        {/* Header */}
        <header className="mb-8 border-b border-gray-700 pb-6">
          <h1 className="mb-3 text-3xl font-extrabold md:text-5xl">
            {opportunity.title}
          </h1>
          <p className="text-lg text-gray-400">{opportunity.description}</p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content: Long Description */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-2xl font-bold text-cyan-400">
              تفاصيل المشروع
            </h2>
            <div className="prose prose-invert prose-lg leading-relaxed text-gray-300">
              {/* Using a placeholder if longDescription is null */}
              {opportunity.longDescription ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: opportunity.longDescription ?? "",
                  }}
                />
              ) : (
                <p>لا توجد تفاصيل إضافية متوفرة حالياً لهذه الفرصة.</p>
              )}
            </div>
          </div>

          {/* Sidebar: Key Info */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg border border-gray-700 bg-gray-800/50 p-6">
              <h3 className="mb-6 text-xl font-bold">بطاقة المعلومات</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <TagIcon className="h-6 w-6 text-cyan-400" />
                  <div>
                    <span className="text-sm text-gray-400">نوع الفرصة</span>
                    <p className="font-semibold">
                      {
                        opportunityTypeLabels[
                          opportunity.type as keyof typeof opportunityTypeLabels
                        ]
                      }
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheckIcon className="h-6 w-6 text-cyan-400" />
                  <div>
                    <span className="text-sm text-gray-400">مستوى الوصول</span>
                    <p className="font-semibold">{opportunity.accessLevel}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <CalendarIcon className="h-6 w-6 text-cyan-400" />
                  <div>
                    <span className="text-sm text-gray-400">تاريخ النشر</span>
                    <p className="font-semibold">
                      {new Date(opportunity.createdAt).toLocaleDateString(
                        "ar-EG",
                      )}
                    </p>
                  </div>
                </li>
              </ul>
              <div className="mt-8 space-y-4">
                <ApplyForm opportunity={opportunity} />
                <FollowButton opportunityId={opportunity.id} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
