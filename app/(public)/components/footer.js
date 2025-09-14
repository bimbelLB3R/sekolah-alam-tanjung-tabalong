"use client"

import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa"

export default function Footer() {
  return (
    <footer className="text-center py-8 border-t bg-gradient-to-r from-blue-500 to-indigo-600 ">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition"
          >
            <FaFacebook className="w-6 h-6 text-white hover:text-blue-500 transition-colors" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition"
          >
            <FaInstagram className="w-6 h-6 text-white hover:text-blue-500 transition-colors" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition"
          >
            <FaYoutube className="w-6 h-6 text-gray-50 hover:text-blue-500 transition-colors" />
          </a>
        </div>

        <p className="text-sm  text-white">
          © {new Date().getFullYear()} SATT. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
