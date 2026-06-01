import { useEffect, useMemo, useState } from "react";
import { deriveFromMeta } from "../lib/meta";
import { AccessRestrictionPanel } from "../components/AccessRestrictionPanel";
import { RecordMeta } from "../lib/types";

const initialMeta: RecordMeta = {
  status: "Registreeritud",
  series: "lepingud",
  documentNumber: "",
  contractTitle: "",
  description: "",
  partnerType: "pole",
  contactEmail: "",
  ourContact: "",
  validity: "5 aastat",
  signedFile: false,
};

export default function Home() {
  const [meta, setMeta] = useState<RecordMeta>(initialMeta);
  const [confirmBusinessSecret, setConfirmBusinessSecret] = useState<boolean | undefined>(undefined);
  const [resultState, setResultState] = useState(() => deriveFromMeta(initialMeta));
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setResultState(deriveFromMeta({ ...meta, confirmBusinessSecret }));
    }, 200);
    return () => window.clearTimeout(timer);
  }, [meta, confirmBusinessSecret]);

  const handleConfirm = async () => {
    setIsSaving(true);
    setSaveMessage(undefined);

    try {
      const response = await fetch("/api/juurdepääsupiirang/tuleta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meta: { ...meta, confirmBusinessSecret }, save: true }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Salvestamine ebaõnnestus");
      }

      setSaveMessage("Piirang salvestatud Supabase'i.");
    } catch (error) {
      setSaveMessage(`Salvestamine ebaõnnestus: ${error instanceof Error ? error.message : "tundmatu viga"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const contractSeriesLabel = useMemo(() => {
    const labelMap: Record<string, string> = {
      kiri: "Kiri",
      lepingud: "Lepingud",
      hanked: "Hanked",
      personal: "Personal",
      sotsiaal: "Sotsiaal",
      tervis: "Tervis",
      kaebused: "Kaebused",
      eelnoud: "Eelnõud",
      audit: "Audit",
      eelarve: "Eelarve",
      muu: "Muu",
    };
    return labelMap[meta.series] ?? "Muu";
  }, [meta.series]);

  const updateMeta = <K extends keyof RecordMeta>(key: K, value: RecordMeta[K]) => {
    setMeta((current) => ({ ...current, [key]: value }));
  };

  const handleQuestionAnswer = (key: string, value: boolean) => {
    if (key === "confirmBusinessSecret") {
      setConfirmBusinessSecret(value);
    }
  };

  return (
    <main className="page-shell">
      <header className="header-row">
        <div>
          <div className="page-title">Lepingu kande lisamine</div>
          <div style={{ color: "#6C757D", marginTop: 6 }}>Uus kanne</div>
        </div>
        <button className="primary">Uus kanne</button>
      </header>

      <div className="panel-grid">
        <section className="card form-card">
          <div className="field-group">
            <label className="label">Staatus</label>
            <select className="select" value={meta.status} onChange={(event) => updateMeta("status", event.target.value as RecordMeta["status"])}>
              <option>Registreeritud</option>
              <option>Mustand</option>
              <option>Kinnitatud</option>
            </select>
          </div>

          <div className="field-group">
            <label className="label">Reg nr</label>
            <div style={{ display: "grid", gap: 12 }}>
              <input className="input" placeholder="Dokumendisari" value={contractSeriesLabel} disabled />
              <select className="select" value={meta.series} onChange={(event) => updateMeta("series", event.target.value as RecordMeta["series"])}>
                <option value="kiri">Kiri</option>
                <option value="lepingud">Lepingud</option>
                <option value="hanked">Hanked</option>
                <option value="personal">Personal</option>
                <option value="sotsiaal">Sotsiaal</option>
                <option value="tervis">Tervis</option>
                <option value="kaebused">Kaebused</option>
                <option value="eelnoud">Eelnõud</option>
                <option value="audit">Audit</option>
                <option value="eelarve">Eelarve</option>
                <option value="muu">Muu</option>
              </select>
              <input className="input" placeholder="Number" value={meta.documentNumber} onChange={(event) => updateMeta("documentNumber", event.target.value)} />
            </div>
          </div>

          <div className="field-group">
            <label className="label">Reg kuupäev</label>
            <input className="input" type="date" value={new Date().toISOString().slice(0, 10)} disabled />
          </div>

          <div className="field-group">
            <label className="label">Lepingu nimetus <span>*</span></label>
            <input className="input required" value={meta.contractTitle} onChange={(event) => updateMeta("contractTitle", event.target.value)} placeholder="Sisesta lepingu nimetus" />
          </div>

          <div className="field-group">
            <label className="label">Lühisisu</label>
            <textarea className="textarea" value={meta.description} onChange={(event) => updateMeta("description", event.target.value)} placeholder="Kirjeldus" />
          </div>

          <div className="field-group">
            <label className="label">Lepingupartner <span>*</span></label>
            <div className="chip-row">
              <button className="secondary" onClick={() => updateMeta("partnerType", "eraisik")}>Eraisik</button>
              <button className="secondary" onClick={() => updateMeta("partnerType", "juriidiline")}>Juriidiline isik</button>
              <span className="chip">{meta.partnerType === "pole" ? "Pole valitud" : meta.partnerType}</span>
            </div>
          </div>

          <div className="field-group">
            <label className="label">Kontakti e-post</label>
            <input className="input" type="email" value={meta.contactEmail} onChange={(event) => updateMeta("contactEmail", event.target.value)} placeholder="kontakt@domain.ee" />
          </div>

          <div className="field-group">
            <label className="label">Meie kontaktisik <span>*</span></label>
            <select className="select required" value={meta.ourContact} onChange={(event) => updateMeta("ourContact", event.target.value)}>
              <option value="">Vali kontaktisik</option>
              <option value="Anneli">Anneli</option>
              <option value="Marek">Marek</option>
              <option value="Kati">Kati</option>
            </select>
          </div>

          <div className="field-group">
            <label className="label">Tähtajalisus <span>*</span></label>
            <select className="select required" value={meta.validity} onChange={(event) => updateMeta("validity", event.target.value as RecordMeta["validity"])}>
              <option value="1 aasta">1 aasta</option>
              <option value="3 aastat">3 aastat</option>
              <option value="5 aastat">5 aastat</option>
              <option value="Püsiv">Püsiv</option>
            </select>
          </div>

          <div className="field-group">
            <label className="label">Allkirjastatud fail</label>
            <button className="secondary" onClick={() => updateMeta("signedFile", !meta.signedFile)}>{meta.signedFile ? "Laetud" : "Lisa"}</button>
          </div>
        </section>

        <AccessRestrictionPanel
          result={resultState.result}
          signals={resultState.signals}
          openQuestions={resultState.openQuestions}
          onQuestionAnswer={handleQuestionAnswer}
          onConfirm={handleConfirm}
          isSaving={isSaving}
          lastSaved={saveMessage}
        />
      </div>
    </main>
  );
}
