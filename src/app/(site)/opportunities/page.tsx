import OpportunitiesList from "./_components/OpportunitiesList";

export default function OpportunitiesPage() {
  return (
    <main className="min-h-screen bg-gray-900 pt-24 text-white">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-white md:text-5xl">
          الفرص الاستثمارية المتاحة
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
          تصفح قائمة المشاريع والمناقصات المتاحة. استخدم الفلاتر للعثور على ما
          يناسبك.
        </p>
      </div>

      <OpportunitiesList />
    </main>
  );
}
