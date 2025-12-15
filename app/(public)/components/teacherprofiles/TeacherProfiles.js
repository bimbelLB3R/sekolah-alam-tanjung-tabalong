"use client";

import { motion } from "framer-motion";
import { 
  Mail, Phone, MapPin, Calendar, Award, BookOpen, 
  GraduationCap, Heart, Sparkles, Home
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function TeacherDetailPage({ data }) {
  // Extract teacher from API response
  const teacher = data?.data?.[0] || data?.data || {};
  const { profile } = teacher;
  
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Back Button */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/profile-guru">
          <Button variant="ghost" className="gap-2">
            <Home className="w-4 h-4" />
            Kembali ke Daftar Guru
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="bg-linear-to-r from-green-600 via-emerald-500 to-teal-500 text-white py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            {/* Avatar */}
            <Avatar className="w-32 h-32 border-4 border-white shadow-2xl">
              <AvatarImage src={profile?.photo} alt={teacher.name} />
              <AvatarFallback className="text-4xl bg-linear-to-br from-green-700 to-emerald-700">
                {teacher.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold">{teacher.name}</h1>
                <Sparkles className="w-6 h-6" />
              </div>
              
              {profile?.specialization && (
                <Badge className="bg-white/20 text-white border-white/30 mb-3">
                  {profile.specialization}
                </Badge>
              )}

              <p className="text-green-100 text-lg">
                Guru SD Alam • {profile?.experienceYears > 0 ? `${profile.experienceYears} Tahun Pengalaman` : 'Pengajar Berdedikasi'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tentang */}
            {profile?.bio && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="backdrop-blur-xl bg-white/70 border-white/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <Heart className="w-5 h-5" />
                      Tentang Saya
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {profile.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Pendidikan & Latar Belakang */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="backdrop-blur-xl bg-white/70 border-white/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <GraduationCap className="w-5 h-5" />
                    Pendidikan & Latar Belakang
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile?.education && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600 mb-1 block">
                        Pendidikan Terakhir
                      </label>
                      <p className="text-gray-900">{profile.education}</p>
                    </div>
                  )}

                  {profile?.specialization && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600 mb-1 block">
                        Spesialisasi
                      </label>
                      <Badge className="bg-linear-to-r from-green-100 to-emerald-100 text-green-700 border-0">
                        {profile.specialization}
                      </Badge>
                    </div>
                  )}

                  {profile?.experienceYears > 0 && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600 mb-1 block">
                        Pengalaman Mengajar
                      </label>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-green-600" />
                        <span className="text-gray-900 font-semibold">
                          {profile.experienceYears} Tahun
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Kontak Informasi */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="backdrop-blur-xl bg-white/70 border-white/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-green-700">Informasi Kontak</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {teacher.email && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-100 to-emerald-100 flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-sm text-gray-900 wrap-break-words">{teacher.email}</p>
                      </div>
                    </div>
                  )}

                  {profile?.phone && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Telepon</p>
                        <p className="text-sm text-gray-900">{profile.phone}</p>
                      </div>
                    </div>
                  )}

                  {profile?.city && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-teal-100 to-blue-100 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Lokasi</p>
                        <p className="text-sm text-gray-900">{profile.city}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Data Pribadi */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="backdrop-blur-xl bg-white/70 border-white/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-green-700">Data Pribadi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {profile?.birthPlace && profile?.birthDate && (
                    <div>
                      <p className="text-gray-500 mb-1">Tempat, Tanggal Lahir</p>
                      <p className="text-gray-900">
                        {profile.birthPlace}, {new Date(profile.birthDate).toLocaleDateString('id-ID', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  )}

                  {profile?.gender && (
                    <div>
                      <p className="text-gray-500 mb-1">Jenis Kelamin</p>
                      <p className="text-gray-900">{profile.gender}</p>
                    </div>
                  )}

                  {profile?.address && (
                    <div>
                      <p className="text-gray-500 mb-1">Alamat</p>
                      <p className="text-gray-900">{profile.address}</p>
                    </div>
                  )}

                  {teacher.createdAt && (
                    <div className="pt-3 border-t">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-green-500" />
                        <span>
                          Bergabung sejak {new Date(teacher.createdAt).toLocaleDateString('id-ID', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}