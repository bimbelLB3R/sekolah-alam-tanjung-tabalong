import RegistrationForm from "@/app/(public)/components/events/mini-class/RegistrationForm";

export const metadata = {
  title: 'Pendaftaran Mini Class',
  description: 'Daftar mini class sekarang',
};

export default function MiniClassPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <RegistrationForm />
    </main>
  );
}