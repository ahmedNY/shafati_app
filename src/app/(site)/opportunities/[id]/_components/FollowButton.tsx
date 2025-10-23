"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { useSession, signIn } from "next-auth/react";
import * as Dialog from "@radix-ui/react-dialog";

export default function FollowButton({
  opportunityId,
}: {
  opportunityId: number;
}) {
  const utils = api.useUtils();
  const { status } = useSession();
  const [optimisticWatched, setOptimisticWatched] = useState<boolean | null>(
    null,
  );
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  // We don't have a direct "isWatched" query; a simple approach is to fetch the list and check
  const { data: watchedList } = api.opportunity.getWatchedByMe.useQuery(
    undefined,
    {
      staleTime: 10_000,
      enabled: status === "authenticated",
    },
  );
  const isWatched =
    optimisticWatched ??
    (status === "authenticated"
      ? watchedList?.some((o) => o.id === opportunityId)
      : false) ??
    false;

  const { mutate: setWatch, isPending } = api.opportunity.setWatch.useMutation({
    onMutate: async (vars) => {
      setOptimisticWatched(vars.watch);
    },
    onSettled: async () => {
      setOptimisticWatched(null);
      await utils.opportunity.getWatchedByMe.invalidate();
    },
  });

  return (
    <>
      <button
        disabled={isPending}
        onClick={() => {
          if (status !== "authenticated") {
            setLoginDialogOpen(true);
            return;
          }
          setWatch({ opportunityId, watch: !isWatched });
        }}
        className={
          "w-full rounded-lg px-6 py-3 font-bold text-white transition-all duration-300 " +
          (isWatched
            ? "bg-gray-700 hover:bg-gray-600"
            : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700")
        }
      >
        {isWatched ? "إلغاء المتابعة" : "متابعة الفرصة"}
      </button>

      <Dialog.Root open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
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
                onClick={() => setLoginDialogOpen(false)}
              >
                إلغاء
              </button>
              <button
                className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
                onClick={() => {
                  setLoginDialogOpen(false);
                  void signIn();
                }}
              >
                تسجيل الدخول
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
