"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import * as Dialog from "@radix-ui/react-dialog";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

// Define the opportunity types and their Arabic labels directly in the component
const opportunityFilters = [
  { value: "CONSTRUCTION", label: "أعمال مقاولة" },
  { value: "SERVICE_PROVIDER", label: "مزود خدمة" },
  { value: "INVESTMENT", label: "استثمار" },
  { value: "SUPPLY", label: "توريد" },
] as const; // `as const` helps with TypeScript type inference

// For quick lookups of labels on the opportunity cards
const opportunityLabels = Object.fromEntries(
  opportunityFilters.map((f) => [f.value, f.label]),
) as Record<(typeof opportunityFilters)[number]["value"], string>;

export default function OpportunitiesList() {
  // The state now holds a string or an empty string
  const [filter, setFilter] = useState<
    (typeof opportunityFilters)[number]["value"] | ""
  >("");
  const { status } = useSession();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [pendingId, setPendingId] = useState<number | null>(null);

  const {
    data: opportunities,
    isLoading,
    isError,
  } = api.opportunity.getAll.useQuery({
    type: filter || undefined,
  });

  // Watched list for current user (only when authenticated)
  const { data: watchedList } = api.opportunity.getWatchedByMe.useQuery(
    undefined,
    { enabled: status === "authenticated", staleTime: 10_000 },
  );

  const utils = api.useUtils();

  const { mutate: setWatch, isPending } = api.opportunity.setWatch.useMutation({
    onSettled: async () => {
      await utils.opportunity.getWatchedByMe.invalidate();
      setPendingId(null);
    },
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-4 text-left">
        <Link
          href="/opportunities/watched"
          className="inline-flex items-center gap-2 text-cyan-400 transition-colors hover:text-cyan-300"
        >
          <EyeIcon className="h-5 w-5" />
          <span>الفرص التي أتابعها</span>
        </Link>
      </div>
      {/* Filter Buttons */}
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => setFilter("")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
            filter === ""
              ? "bg-cyan-500 text-white"
              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
        >
          كل الفرص
        </button>
        {opportunityFilters.map((type) => (
          <button
            key={type.value}
            onClick={() => setFilter(type.value)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              filter === type.value
                ? "bg-cyan-500 text-white"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Data Display */}
      <div>
        {isLoading && (
          <p className="text-center text-gray-400">جاري تحميل الفرص...</p>
        )}
        {isError && (
          <p className="text-center text-red-400">
            حدث خطأ أثناء تحميل البيانات.
          </p>
        )}
        {opportunities && opportunities.length === 0 && (
          <p className="text-center text-gray-500">
            لا توجد فرص متاحة تطابق هذا الفلتر حالياً.
          </p>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {opportunities?.map((opp) => (
            <div
              key={opp.id}
              className="flex flex-col rounded-lg border border-gray-700 bg-gray-800/50 p-5 transition-colors hover:border-cyan-500"
            >
              <div className="flex-grow">
                <span className="mb-3 inline-block rounded-full bg-cyan-900/50 px-3 py-1 text-xs font-medium text-cyan-300">
                  {/* Use the label map for display */}
                  {
                    opportunityLabels[
                      opp.type as keyof typeof opportunityLabels
                    ]
                  }
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
                <button
                  aria-label="متابعة"
                  title="متابعة"
                  disabled={isPending && pendingId === opp.id}
                  onClick={() => {
                    if (status !== "authenticated") {
                      setLoginDialogOpen(true);
                      return;
                    }
                    const currentlyWatched = watchedList?.some(
                      (o) => o.id === opp.id,
                    );
                    setPendingId(opp.id);
                    setWatch({
                      opportunityId: opp.id,
                      watch: !currentlyWatched,
                    });
                  }}
                  className="rounded-md border border-gray-600 p-2 text-cyan-300 hover:bg-gray-700 hover:text-cyan-200"
                >
                  {isPending && pendingId === opp.id ? (
                    <svg
                      className="h-5 w-5 animate-spin text-cyan-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  ) : watchedList?.some((o) => o.id === opp.id) ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </div>
  );
}

// Login dialog
function LoginDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-xl focus:outline-none">
          <Dialog.Title className="mb-2 text-lg font-bold text-white">
            يلزم تسجيل الدخول
          </Dialog.Title>
          <Dialog.Description className="mb-6 text-sm text-gray-300">
            لتتمكن من متابعة الفرص واستلام التحديثات، يرجى تسجيل الدخول أولاً.
          </Dialog.Description>
          <div className="flex justify-end gap-3">
            <button
              className="rounded-md border border-gray-600 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-700"
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </button>
            <button
              className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
              onClick={() => {
                onOpenChange(false);
                void signIn();
              }}
            >
              تسجيل الدخول
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
