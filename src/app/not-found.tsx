import React from "react";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <main className="grid min-h-[70vh] place-items-center px-4 py-16">
      <section dir="rtl" className="max-w-md space-y-6 text-center">
        {/* Simple inline illustration: person lost on a mountain */}
        <svg
          className="mx-auto h-32 w-32 text-gray-400"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Mountain */}
          <path d="M10 170 L70 80 L100 120 L130 70 L190 170 Z" fill="#E5E7EB" />
          <path
            d="M70 80 L85 100 L100 120 L110 105 L130 70"
            stroke="#D1D5DB"
            strokeWidth="3"
            fill="none"
          />
          {/* Snow caps */}
          <path d="M126 72 L130 70 L134 72 L130 60 Z" fill="#FFFFFF" />
          <path d="M66 82 L70 80 L74 82 L70 70 Z" fill="#FFFFFF" />
          {/* Person */}
          <circle cx="90" cy="125" r="6" fill="#6B7280" />
          <path
            d="M90 131 L90 150"
            stroke="#6B7280"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M90 138 L75 148"
            stroke="#6B7280"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M90 138 L105 148"
            stroke="#6B7280"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Question mark */}
          <path
            d="M115 115 C115 105 130 105 130 95 C130 85 118 85 113 90"
            stroke="#9CA3AF"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="130" cy="125" r="3" fill="#9CA3AF" />
        </svg>

        <h1 className="text-3xl font-bold">الصفحة غير موجودة</h1>
        <p className="text-muted-foreground">
          يبدو أنك تائه أثناء تسلق الجبل. تحقَّق من الرابط أو عُد إلى الصفحة
          الرئيسية.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/30 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow focus:ring-2 focus:outline-none"
          >
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </section>
    </main>
  );
};

export default NotFoundPage;
