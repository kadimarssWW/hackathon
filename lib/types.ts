export type DocumentSeries =
  | "kiri"
  | "lepingud"
  | "hanked"
  | "personal"
  | "sotsiaal"
  | "tervis"
  | "kaebused"
  | "eelnoud"
  | "audit"
  | "eelarve"
  | "muu";

export type PartnerType = "eraisik" | "juriidiline" | "pole";

export type PrivateLifeType = "family" | "social" | "suffering";
export type ProceedingsType = "criminal" | "supervision";
export type SecurityType =
  | "foreign"
  | "defence"
  | "police"
  | "systems"
  | "infrastructure";
export type InternalType = "draft" | "audit";

export interface RecordMeta {
  status: "Registreeritud" | "Mustand" | "Kinnitatud";
  series: DocumentSeries;
  documentNumber: string;
  contractTitle: string;
  description: string;
  partnerType: PartnerType;
  contactEmail: string;
  ourContact: string;
  validity: "1 aasta" | "3 aastat" | "5 aastat" | "Püsiv";
  signedFile: boolean;
  confirmBusinessSecret?: boolean;
}

export interface RestrictionResult {
  piirang: "AK" | "AVALIK";
  partial: boolean;
  grounds: string[];
  primary: string;
  kehtivusaeg: string;
  kehtivusCite: string;
  kehtivusNote: string;
  pohjendus: string;
  kindlus: "Kõrge" | "Keskmine" | "Madal";
  marking: string;
}

export interface SignalItem {
  label: string;
  detail: string;
}

export interface OpenQuestion {
  key: string;
  question: string;
  answer?: boolean;
}

export interface DeriveResult {
  result: RestrictionResult;
  signals: SignalItem[];
  openQuestions: OpenQuestion[];
  answers: Record<string, unknown>;
}
