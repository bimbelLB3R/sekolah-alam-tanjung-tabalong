// app/teacher/[id]/page.js
import TeacherDetailPage from '../../components/teacherprofiles/TeacherProfiles';
import { notFound } from 'next/navigation';


async function getTeacher(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/teachers/${id}`, {
    cache: 'no-store'
  });
  
  if (!res.ok) {
    return null;
  }
  
  return res.json();
}

export async function generateMetadata({ params }) {
  const idGuru= await params.id;
  const data = await getTeacher(idGuru);
  
  if (!data?.success) {
    return {
      title: 'Guru Tidak Ditemukan'
    };
  }
  
  return {
    title: `${data.data.name} - Guru SD Alam`,
    description: data.data.profile?.bio || `Profil ${data.data.name}`
  };
}

export default async function TeacherPage({ params }) {
  const id=await params.id
  const data = await getTeacher(id);
  
  if (!data?.success) {
    notFound();
  }
  
  return <TeacherDetailPage data={data} />;
}