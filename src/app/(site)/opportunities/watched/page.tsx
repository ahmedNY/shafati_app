import Link from "next/link";
import { ArrowRightIcon, HomeIcon } from "@heroicons/react/24/outline";
import { api } from "@/trpc/server";
import { auth } from "@/server/auth";
import UnwatchButton from "./_components/UnwatchButton";
import LoginPrompt from "./_components/LoginPrompt";

export default async function WatchedOpportunitiesPage() {
  const session = await auth();
  const watched = session?.user ? await api.opportunity.getWatchedByMe() : [];

  const opportunityTypeLabels: Record<string, string> = {
    CONSTRUCTION: "أعمال مقاولة",
    SERVICE_PROVIDER: "مزود خدمة",
    INVESTMENT: "استثمار",
    SUPPLY: "توريد",
  };

  return (
    <main className="min-h-screen bg-gray-900 pt-24 text-white">
      <div className="mx-auto w-full max-w-5xl px-4">
        <div className="mb-6 flex items-center gap-6">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 text-cyan-400 transition-colors hover:text-cyan-300"
          >
            <ArrowRightIcon className="h-5 w-5" />
            <span>العودة إلى كل الفرص</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-cyan-400 transition-colors hover:text-cyan-300"
          >
            <HomeIcon className="h-5 w-5" />
            <span>العودة إلى الصفحة الرئيسية</span>
          </Link>
        </div>
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">
            الفرص التي أتابعها
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
            قائمة الفرص التي قمت بمتابعتها لتصلك التحديثات.
          </p>
        </div>

        {!session?.user ? (
          <div className="mt-8 flex justify-center">
            <LoginPrompt />
          </div>
        ) : watched.length === 0 ? (
          <p className="text-center text-gray-400">
            لا توجد فرص قيد المتابعة حالياً.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {watched.map((opp) => (
              <div
                key={opp.id}
                className="flex flex-col rounded-lg border border-gray-700 bg-gray-800/50 p-5 transition-colors hover:border-cyan-500"
              >
                <div className="flex-grow">
                  <span className="mb-3 inline-block rounded-full bg-cyan-900/50 px-3 py-1 text-xs font-medium text-cyan-300">
                    {opportunityTypeLabels[opp.type] ?? opp.type}
                  </span>
                  <h3 className="mb-2 text-xl font-bold text-white">
                    {opp.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-400">
                    {opp.description?.substring(0, 120)}...
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <Link
                    href={`/opportunities/${opp.id}`}
                    className="flex-1 rounded-lg bg-gray-700 px-4 py-2 text-center font-bold text-white transition-colors hover:bg-cyan-600"
                  >
                    عرض التفاصيل
                  </Link>
                  <UnwatchButton opportunityId={opp.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
