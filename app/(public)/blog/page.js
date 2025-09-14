// app/(public)/blog/page.tsx
import Link from "next/link"

const posts = [
  { slug: "belajar-sekolah-alam", title: "Belajar di Sekolah Alam", date: "2025-09-14" },
  { slug: "digitalisasi-sekolah", title: "Digitalisasi Sekolah", date: "2025-09-10" },
  { slug: "peran-ortu", title: "Peran Orang Tua Dalam Tumbuh Kembang Anak", date: "2025-09-10" },
  { slug: "apa-bba", title: "Apa itu BBA (Belajar Bersama Alam)?", date: "2025-09-10" },
  { slug: "suka-duka", title: "Suka Duka Menjadi Fasilitator Sekolah Alam", date: "2025-09-10" },
]

export default function BlogPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Blog Sekolah</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="text-xl font-semibold hover:text-blue-600"
            >
              {post.title}
            </Link>
            <p className="text-sm text-gray-500">{post.date}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
