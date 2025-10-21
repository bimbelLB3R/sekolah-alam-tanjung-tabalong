// app/dashboard/settings/page.js
import GPSSettingToggle from "../components/setting/GpsSettingToogle";

export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pengaturan Sistem</h1>
      
      <div className="space-y-4">
        <GPSSettingToggle  />
        {/* Setting lainnya */}
      </div>
    </div>
  );
}