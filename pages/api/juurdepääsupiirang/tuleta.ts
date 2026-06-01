import type { NextApiRequest, NextApiResponse } from "next";
import { deriveFromMeta } from "../../../lib/meta";
import { supabaseAdmin } from "../../../lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Metoodika pole toetatud" });
  }

  const { meta, save } = req.body as { meta?: unknown; save?: boolean };
  if (!meta || typeof meta !== "object") {
    return res.status(400).json({ error: "Puudub metaandmete objekt" });
  }

  try {
    const result = deriveFromMeta(meta as any);

    if (save) {
      if (!supabaseAdmin) {
        return res.status(500).json({ error: "Supabase'i teenusevõtme konfiguratsioon puudub" });
      }

      const documentData = {
        series: (meta as any).series ?? null,
        document_number: (meta as any).documentNumber ?? null,
        contract_title: (meta as any).contractTitle ?? null,
        description: (meta as any).description ?? null,
        partner_type: (meta as any).partnerType ?? null,
        contact_email: (meta as any).contactEmail ?? null,
        our_contact: (meta as any).ourContact ?? null,
        validity: (meta as any).validity ?? null,
        signed_file: (meta as any).signedFile ?? false,
        confirm_business_secret: (meta as any).confirmBusinessSecret ?? null,
      };

      const { data: documentRow, error: docError } = await supabaseAdmin
        .from("documents")
        .insert(documentData)
        .select("id")
        .single();

      if (docError || !documentRow) {
        return res.status(500).json({ error: "Dokumendi salvestamine ebaõnnestus", details: docError?.message });
      }

      const restrictionData = {
        document_id: documentRow.id,
        piirang: result.result.piirang,
        partial: result.result.partial,
        grounds: result.result.grounds,
        primary: result.result.primary,
        kehtivusaeg: result.result.kehtivusaeg,
        kehtivus_cite: result.result.kehtivusCite,
        kehtivus_note: result.result.kehtivusNote,
        pohjendus: result.result.pohjendus,
        kindlus: result.result.kindlus,
        marking: result.result.marking,
      };

      const { error: restrictionError } = await supabaseAdmin
        .from("access_restrictions")
        .insert(restrictionData);

      if (restrictionError) {
        return res.status(500).json({ error: "Piirangu salvestamine ebaõnnestus", details: restrictionError.message });
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Hindamine ebaõnnestus" });
  }
}
