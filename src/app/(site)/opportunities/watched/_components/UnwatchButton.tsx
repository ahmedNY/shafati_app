"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function UnwatchButton({
  opportunityId,
}: {
  opportunityId: number;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const { mutate: setWatch } = api.opportunity.setWatch.useMutation({
    onSettled: async () => {
      setPending(false);
      router.refresh();
    },
  });

  return (
    <button
      aria-label="إزالة من المتابعة"
      title="إزالة من المتابعة"
      disabled={pending}
      onClick={() => {
        setPending(true);
        setWatch({ opportunityId, watch: false });
      }}
      className="rounded-lg border border-red-600 p-2 text-red-300 transition-colors hover:bg-red-900/30 hover:text-red-200 disabled:opacity-60"
    >
      {pending ? (
        <svg
          className="h-5 w-5 animate-spin"
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
      ) : (
        <TrashIcon className="h-5 w-5" />
      )}
    </button>
  );
}
