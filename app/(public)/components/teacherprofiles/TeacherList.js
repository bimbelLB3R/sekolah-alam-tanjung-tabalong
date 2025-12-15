"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Phone, Mail, MapPin, Award, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function TeachersListPage({ data }) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Extract teachers from API response
  const teachers = data?.data || [];

  // Filter berdasarkan search
  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.profile?.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Header */}
      <div className="bg-linear-to-r from-green-600 via-emerald-500 to-teal-500 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8" />
              <h1 className="text-3xl sm:text-4xl font-bold">
                Guru SD Alam
              </h1>
            </div>
            <p className="text-lg text-green-100">
              Pendidik berdedikasi untuk pembelajaran alam dan karakter anak
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-white/70 border border-white/50 rounded-2xl p-4 mb-8 shadow-lg"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Cari nama guru atau spesialisasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/90 border-white/50 text-lg h-12"
            />
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600">
          Menampilkan <span className="font-semibold text-gray-900">{filteredTeachers.length}</span> guru
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher, idx) => (
            <TeacherCard key={teacher.id} teacher={teacher} index={idx} />
          ))}
        </div>

        {/* No Results */}
        {filteredTeachers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-linear-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Guru tidak ditemukan</h3>
            <p className="text-gray-600">Coba gunakan kata kunci lain</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Teacher Card Component
function TeacherCard({ teacher, index }) {
  // Destructure data from API response structure
  const { profile, role } = teacher;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
    >
      <Link href={`/profile-guru/${teacher.id}`}>
        <Card className="backdrop-blur-xl bg-white/70 border-white/50 hover:shadow-2xl transition-all duration-300 group h-full">
          <CardContent className="p-6">
            {/* Avatar & Name */}
            <div className="text-center mb-4">
              <Avatar className="w-24 h-24 mx-auto mb-3 border-4 border-white shadow-lg">
                <AvatarImage src={profile?.photo} alt={teacher.name} />
                <AvatarFallback className="text-2xl bg-linear-to-br from-green-500 to-emerald-500 text-white">
                  {teacher.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-green-600 transition-colors mb-1">
                {teacher.name}
              </h3>
              
              {profile?.specialization && (
                <Badge className="bg-linear-to-r from-green-100 to-emerald-100 text-green-700 border-0">
                  {profile.specialization}
                </Badge>
              )}
            </div>

            {/* Bio */}
            {profile?.bio && (
              <p className="text-sm text-gray-700 text-center mb-4 line-clamp-2">
                {profile.bio}
              </p>
            )}

            {/* Info */}
            <div className="space-y-2 text-sm">
              {profile?.education && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Award className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="truncate">{profile.education}</span>
                </div>
              )}
              
              {profile?.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{profile.phone}</span>
                </div>
              )}
              
              {teacher.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4 text-teal-500 shrink-0" />
                  <span className="truncate">{teacher.email}</span>
                </div>
              )}
              
              {profile?.city && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>{profile.city}</span>
                </div>
              )}
            </div>

            {/* Experience Badge */}
            {profile?.experienceYears > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <span className="text-xs text-gray-500">Pengalaman Mengajar</span>
                <div className="text-lg font-bold text-green-600">
                  {profile.experienceYears} Tahun
                </div>
              </div>
            )}

            {/* Button */}
            <Button 
              className="w-full mt-4 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              onClick={(e) => e.preventDefault()}
            >
              Lihat Profil
            </Button>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}