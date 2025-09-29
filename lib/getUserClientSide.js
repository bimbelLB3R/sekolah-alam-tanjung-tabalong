"use client"

import { useState, useEffect } from "react"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me")
        const data = await res.json()
        setUser(data.user)
      } catch (err) {
        console.error("useAuth error:", err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading }
}
