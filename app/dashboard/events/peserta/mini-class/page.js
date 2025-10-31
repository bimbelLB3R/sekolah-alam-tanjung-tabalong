import ParticipantList from "@/app/dashboard/components/mini-class/ParticipantList";

export const metadata = {
  title: 'Peserta - Mini Class',
  description: 'Kelola peserta mini class',
};

export default function PesertaMiniClass() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Peserta Mini Class
              </h1>
              <p className="text-gray-600 mt-1">
                Kelola dan verifikasi peserta mini class
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ParticipantList />
      </div>
    </main>
  );
}