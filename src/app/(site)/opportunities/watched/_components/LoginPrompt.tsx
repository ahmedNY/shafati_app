"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { signIn } from "next-auth/react";

export default function LoginPrompt() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-cyan-700"
      >
        تسجيل الدخول لمشاهدة المتابعات
      </button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-xl focus:outline-none">
            <Dialog.Title className="mb-2 text-lg font-bold text-white">
              تحتاج لتسجيل الدخول
            </Dialog.Title>
            <Dialog.Description className="mb-6 text-sm text-gray-300">
              لمشاهدة الفرص التي تتابعها وإدارتها، يرجى تسجيل الدخول إلى حسابك.
            </Dialog.Description>
            <div className="flex justify-end gap-3">
              <button
                className="rounded-md border border-gray-600 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-700"
                onClick={() => setOpen(false)}
              >
                إلغاء
              </button>
              <button
                className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
                onClick={() => {
                  setOpen(false);
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
