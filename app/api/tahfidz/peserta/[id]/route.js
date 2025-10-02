import pool from "@/lib/db";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { nama_siswa, nama_rombel, pembimbing } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
      });
    }

    // Jalankan query update
    const [result] = await pool.execute(
      `UPDATE peserta_tahfidz 
       SET nama_siswa = ?, nama_rombel = ?, pembimbing = ? 
       WHERE id = ?`,
      [nama_siswa, nama_rombel, pembimbing, id]
    );

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Data not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Data updated successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("DB error:", error);
    return new Response(JSON.stringify({ error: "Failed to update data" }), {
      status: 500,
    });
  }
}
