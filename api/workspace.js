export default async function handler(req, res) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const WORKSPACE_PIN = process.env.WORKSPACE_PIN || "";

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: "Supabase env vars fehlen." });
  }

  const providedPin = req.headers["x-workspace-pin"] || "";
  if (WORKSPACE_PIN && providedPin !== WORKSPACE_PIN) {
    return res.status(401).json({ error: "Ungültige PIN." });
  }

  const base = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/workspaces`;

  try {
    if (req.method === "GET") {
      const slug = req.query.slug || "lieferanten-rma";
      const url = `${base}?slug=eq.${encodeURIComponent(slug)}&select=slug,data,updated_at&limit=1`;
      const r = await fetch(url, {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
      });
      const data = await r.json();
      if (!r.ok) {
        return res.status(r.status).json({ error: data.message || "GET fehlgeschlagen", details: data });
      }
      if (!Array.isArray(data) || data.length === 0) {
        return res.status(200).json({ data: null });
      }
      return res.status(200).json({ data: data[0].data, updated_at: data[0].updated_at });
    }

    if (req.method === "POST") {
      const { slug = "lieferanten-rma", data } = req.body || {};
      const r = await fetch(base, {
        method: "POST",
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates,return=representation",
        },
        body: JSON.stringify([{ slug, data }]),
      });
      const payload = await r.json();
      if (!r.ok) {
        return res.status(r.status).json({ error: payload.message || "POST fehlgeschlagen", details: payload });
      }
      return res.status(200).json({ ok: true, row: payload[0] || null });
    }

    return res.status(405).json({ error: "Methode nicht erlaubt" });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Unbekannter Fehler" });
  }
}
