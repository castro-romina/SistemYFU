import DashboardLayout from "../../components/layout/DashboardLayout";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <DashboardLayout title={title}>
      <div className="max-w-md mx-auto mt-16 text-center">
        <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🚧</span>
        </div>
        <h2 className="font-bold text-lg text-gray-900 mb-1">{title}</h2>
        <p className="text-sm text-gray-500">This section is under construction.</p>
      </div>
    </DashboardLayout>
  );
}