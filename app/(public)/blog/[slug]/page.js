// app/(public)/blog/[slug]/page.js

export default function BlogDetail({ params }) {
  const { slug } = params

  // sementara hardcode (nanti bisa fetch dari DB atau markdown)
  const content = {
    "belajar-sekolah-alam": {
      title: "Belajar di Sekolah Alam",
      body: "Sekolah alam hadir dengan pendekatan berbasis alam dan pengalaman nyata...",
    },
    "digitalisasi-sekolah": {
      title: "Digitalisasi Sekolah",
      body: "Digitalisasi sekolah membantu manajemen guru, siswa, keuangan, dan sarpras...",
    },
    "peran-ortu":{
        title: "Peran Orang Tua Dalam Tumbuh Kembang Anak",
      body: `Orang tua memiliki peran penting dalam membentuk karakter, nilai, dan kepribadian anak.  Pendidikan yang diberikan orang tua sejak dini akan menjadi fondasi utama bagi perkembangan anak di masa depan. Beberapa peran penting orang tua antara lain: 1. **Memberikan Teladan** – Anak belajar terutama dari apa yang dilihat. Sikap, tutur kata, dan perilaku orang tua akan menjadi cerminan bagi anak. 2. **Menanamkan Nilai Moral dan Agama** – Sejak kecil, anak perlu dibiasakan dengan nilai kebaikan, kejujuran, tanggung jawab, dan spiritualitas. 3. **Mendukung Pendidikan Formal** – Orang tua sebaiknya aktif mendampingi anak dalam proses belajar di sekolah, membantu mengerjakan tugas, dan memberi semangat. 4. **Memberikan Kasih Sayang dan Perhatian** – Dukungan emosional dari orang tua membuat anak merasa aman, dicintai, dan percaya diri. 5. **Mengajarkan Kemandirian** – Melatih anak agar bisa mengambil keputusan dan bertanggung jawab terhadap pilihannya.  Dengan peran aktif orang tua, anak akan tumbuh menjadi pribadi yang seimbang antara kecerdasan intelektual, emosional, dan spiritual.`,
    },
    "apa-bba":{
        title:"Apa itu BBA (Belajar Bersama Alam)?",
        body:`Pengertian Sekolah Bersama Alam Sekolah bersama alam adalah sebuah konsep pendidikan alternatif yang menempatkan alam sebagai ruang belajar utama sekaligus sumber inspirasi bagi siswa. Berbeda dengan sekolah konvensional yang lebih banyak berfokus pada ruang kelas dan materi akademis, sekolah bersama alam mengajak anak untuk belajar melalui pengalaman langsung di lingkungan sekitar. Di sekolah ini, alam dipandang bukan sekadar objek studi, melainkan mitra belajar yang mampu menumbuhkan rasa ingin tahu, kepedulian, dan keterampilan hidup. Proses pembelajaran dilakukan dengan memanfaatkan ekosistem sekitar—seperti hutan, kebun, sungai, atau bahkan halaman sekolah—sebagai laboratorium terbuka. Beberapa ciri khas sekolah bersama alam antara lain:Belajar Kontekstual – Anak mempelajari sains, matematika, atau bahasa melalui aktivitas nyata, misalnya mengamati tanaman, menghitung hasil panen, atau menceritakan pengalaman menjelajah hutan. Keseimbangan Akademis dan Life Skill – Selain materi akademis, siswa juga dilatih keterampilan hidup, seperti bercocok tanam, merawat lingkungan, memasak, atau membuat kerajinan.Menumbuhkan Karakter – Dengan berinteraksi langsung dengan alam, anak belajar nilai tanggung jawab, kerja sama, kemandirian, dan rasa hormat terhadap lingkungan.Pembelajaran Holistik – Sekolah bersama alam tidak hanya fokus pada kecerdasan intelektual, tetapi juga mengembangkan aspek emosional, sosial, dan spiritual siswa.Dengan demikian, sekolah bersama alam bukan hanya tempat untuk memperoleh pengetahuan, tetapi juga sarana untuk membentuk generasi yang cerdas, peduli lingkungan, dan berkarakter kuat.`
    },
    "suka-duka":{
        title:"Suka Duka Menjadi Fasilitator Sekolah Alam",
        body:`Menjadi fasilitator di sekolah alam adalah pengalaman yang penuh warna. Tidak hanya sekadar menjadi pengajar, fasilitator juga berperan sebagai pendamping, sahabat, sekaligus inspirator bagi anak-anak dalam menjelajahi dunia nyata. Ada banyak suka dan duka yang dirasakan selama menjalani peran ini. Di sisi suka, bekerja di sekolah alam memberikan kesempatan untuk selalu dekat dengan alam. Setiap hari, fasilitator belajar dan bekerja di ruang terbuka, dikelilingi pepohonan, udara segar, dan lingkungan yang mendukung proses pembelajaran alami. Hal ini menghadirkan energi positif sekaligus menjadi sarana belajar yang tidak terbatas. Hubungan dengan anak-anak pun terasa lebih akrab karena proses pembelajaran bersifat interaktif dan menyenangkan. Melihat perkembangan anak dari hari ke hari, mulai dari kemandirian, kepedulian terhadap lingkungan, hingga tumbuhnya karakter yang kuat, memberikan kepuasan tersendiri. Selain itu, peran ini menuntut fasilitator untuk selalu kreatif dalam menyusun kegiatan berbasis pengalaman, sehingga kreativitas mereka terus terasah. Namun, di balik suka tersebut, tentu ada dukanya. Belajar di alam terbuka berarti harus siap menghadapi tantangan cuaca yang tidak menentu, seperti panas terik, hujan deras, atau gangguan serangga. Fasilitator juga sering dihadapkan pada keterbatasan sarana dan prasarana yang membuat mereka harus memanfaatkan apa yang ada dengan penuh kreativitas. Beban tanggung jawab pun tidak ringan, karena fasilitator tidak hanya mengajar, tetapi juga memastikan keamanan dan kenyamanan anak-anak selama beraktivitas. Selain itu, kesabaran ekstra dibutuhkan untuk mendampingi anak-anak dengan karakter dan ritme belajar yang berbeda-beda. Pada akhirnya, meskipun banyak tantangan yang dihadapi, menjadi fasilitator sekolah alam adalah sebuah perjalanan berharga. Suka dan duka yang dialami justru melahirkan pengalaman mendalam, yang selalu terbayar dengan kebahagiaan melihat anak-anak tumbuh dan berkembang secara alami sesuai potensinya.`
    }
  }

  const post = content[slug]

  if (!post) {
    return <p className="p-6 text-gray-500">Artikel tidak ditemukan</p>
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-700 leading-relaxed">{post.body}</p>
    </div>
  )
}
