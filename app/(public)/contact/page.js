import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div>
    <div className="container mx-auto p-6 grid gap-6 md:grid-cols-2">
      {/* Contact Info */}
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle>Kontak Kami</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary" />
            <span>Jl.Guru Danau, Maburai</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-primary" />
            <span>sekolahalam.tanjungtabalong@gmail.com</span>
          </div>
          <div >
            <Link href="https://wa.me/6285752112725" className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-primary" />
            <p>+62 857-5211-2725</p>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <span>Senin - Jumat: 08.00 - 15.00</span>
          </div>
        </CardContent>
      </Card>
      <div className="rounded-2xl overflow-hidden shadow-lg">        
        {/* Contact Form */}
      <Card className="md:col-span-2 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle>Hubungi Kami</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4 text-lg">
            <Input type="text" placeholder="Nama Anda" required />
            <Input type="email" placeholder="Email Anda" required />
            <Textarea placeholder="Pesan Anda" rows={5} required />
            <Button type="submit" className="w-full">Kirim Pesan</Button>
          </form>
        </CardContent>
      </Card>
      </div>
           
    </div>
    <div className="container mx-auto p-6 grid gap-6 grid-cols-1">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3986.9480969625347!2d115.43305520000001!3d-2.1734264999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dfab38b754d5195%3A0x2f2648da005655!2sSATT%20Sekolah%20Alam%20Tanjung%20Tabalong!5e0!3m2!1sid!2sid!4v1757771340794!5m2!1sid!2sid"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      </div>
  )
}
