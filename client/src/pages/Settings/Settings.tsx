import DashboardLayout from "../../components/layout/DashboardLayout";

export default function Settings() {
  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl mx-auto space-y-6 pb-10">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-2">Preferences</h2>
          <p className="text-sm text-gray-500">
            App preferences (dark mode, notifications, language, etc.) coming soon.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}