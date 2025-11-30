// components/TeacherProfiles.js
import { useEffect, useState } from 'react';

export default function TeacherProfiles() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/teachers');
      if (!response.ok) throw new Error('Gagal mengambil data guru');
      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        setTeachers(result.data);
      } else {
        setTeachers([]);
      }
    } catch (err) {
      setError(err.message);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-purple-100 py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-green-600">Profil Guru</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.isArray(teachers) && teachers.length > 0 ? (
            teachers.map((teacher) => (
              <div key={teacher.id} className="flex gap-4">
                
                {/* Card 1 - Foto Besar */}
                <div className="relative w-2/5 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl group">
                  <img
                    src={teacher.profile?.photo || '/galeri/foto3.jpeg'}
                    alt={teacher.name}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  
                  {/* Text di bawah foto */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-green-600">
                    <h2 className="text-2xl font-bold mb-1">{teacher.name}</h2>
                    <p className="text-sm text-gray-300">
                      {teacher.profile?.specialization || 'Guru'}
                    </p>
                  </div>

                  {/* Arrow Button */}
                  <div className="absolute bottom-6 right-6">
                    <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Card 2 - Identitas Detail */}
                <div className="w-3/5 bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl p-6 flex flex-col justify-between border border-white/30">
                  
                  

                  {/* Photo Avatar */}
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/40 shadow-lg">
                      <img
                        src={teacher.profile?.photo || '/logo-sattnav.png'}
                        alt={teacher.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Name & Title */}
                  <div className="text-center mb-4 flex-grow">
                    <h3 className="text-xl font-bold text-green-600 mb-1">
                      {teacher.name}
                    </h3>
                    <p className="text-green-600/90 font-medium text-sm mb-2">
                      {teacher.profile?.specialization || 'Guru'}
                    </p>
                    
                    <p className="text-xs text-green-600/80 line-clamp-2 px-2">
                      {teacher.profile?.bio || `${teacher.profile?.education || ''}`}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-center gap-8 mb-4 pb-4 border-b border-white/30">
                    <div className="text-center">
                      <p className="text-xl font-bold text-green-600">
                        {teacher.profile?.experienceYears || 0}
                      </p>
                      <p className="text-xs text-green-600/70">Pengalaman</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-green-600">
                        {Math.floor(Math.random() * 500) + 100}
                      </p>
                      <p className="text-xs text-green-600/70">Siswa</p>
                    </div>
                  </div>

                  {/* Follow Button */}
                  <button className="w-full bg-white/30 hover:bg-white/40 backdrop-blur-sm text-green-600 font-semibold py-2.5 rounded-xl transition-colors shadow-lg text-sm border border-white/40">
                    Lihat Profil
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-green-600 py-12">
              <p className="text-xl">Belum ada data guru yang tersedia.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}