// app/dashboard/settings/page.js
import GPSSettingToggle from "../components/setting/GpsSettingToogle";
import JamBatasSettings from "../components/setting/JamBatasSetting";

export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pengaturan Sistem</h1>
      
      <div className="space-y-4">
        <GPSSettingToggle  />
        <JamBatasSettings/>
        {/* Setting lainnya */}
      </div>
    </div>
  );
}