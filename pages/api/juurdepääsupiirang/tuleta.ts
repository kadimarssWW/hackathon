import type { NextApiRequest, NextApiResponse } from "next";
import { deriveFromMeta } from "../../../lib/meta";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Metoodika pole toetatud" });
  }

  const meta = req.body;
  if (!meta) {
    return res.status(400).json({ error: "Puudub metaandmete objekt" });
  }

  try {
    const result = deriveFromMeta(meta);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Hindamine ebaõnnestus" });
  }
}
