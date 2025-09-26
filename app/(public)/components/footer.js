"use client"

import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa"

export default function Footer() {
  return (
    <footer className="text-center py-8 border-t bg-gradient-to-r from-green-500 to-emerald-600 ">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-6">
          <a
            href="https://facebook.com/SATanjungTabalong"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition"
          >
            <FaFacebook className="w-6 h-6 text-white hover:text-green-500 transition-colors" />
          </a>
          <a
            href="https://instagram.com/sekolahalam.tanjungtabalong"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition"
          >
            <FaInstagram className="w-6 h-6 text-white hover:text-green-500 transition-colors" />
          </a>
          <a
            href="https://youtube.com/@sekolahalamtanjungtabalong3094"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition"
          >
            <FaYoutube className="w-6 h-6 text-gray-50 hover:text-green-500 transition-colors" />
          </a>
        </div>

        <p className="text-lg  text-white">
          © {new Date().getFullYear()} SATT. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
