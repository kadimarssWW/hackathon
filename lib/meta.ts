import { assess } from "./engine";
import {
  DeriveResult,
  DocumentSeries,
  OpenQuestion,
  RecordMeta,
  SignalItem,
} from "./types";

const SERIES_WITH_BIZ_SECRET: DocumentSeries[] = ["lepingud", "hanked"];
const SERIES_PERSONAL: DocumentSeries[] = ["personal", "kaebused"];
const SERIES_SOCIAL: DocumentSeries[] = ["sotsiaal"];
const SERIES_HEALTH: DocumentSeries[] = ["tervis"];
const SERIES_ECONOMIC: DocumentSeries[] = ["eelarve"];
const SERIES_INTERNAL_DRAFT: DocumentSeries[] = ["eelnoud"];
const SERIES_INTERNAL_AUDIT: DocumentSeries[] = ["audit"];

export function deriveFromMeta(meta: RecordMeta): DeriveResult {
  const answers: Record<string, unknown> = {};
  const signals: SignalItem[] = [];
  const openQuestions: OpenQuestion[] = [];

  if (SERIES_HEALTH.includes(meta.series)) {
    answers.specialData = true;
    signals.push({ label: "Dokumendisari", detail: `"${meta.series}" → p 11` });
  }

  if (SERIES_SOCIAL.includes(meta.series)) {
    answers.privateLife = "social";
    signals.push({ label: "Dokumendisari", detail: `"${meta.series}" → p 14` });
  }

  if (SERIES_PERSONAL.includes(meta.series)) {
    answers.personalData = "lots";
    signals.push({ label: "Dokumendisari", detail: `"${meta.series}" → p 12` });
  }

  if (SERIES_INTERNAL_DRAFT.includes(meta.series)) {
    answers.internal = "draft";
    signals.push({ label: "Dokumendisari", detail: `"${meta.series}" → § 35 lg 2` });
  }

  if (SERIES_INTERNAL_AUDIT.includes(meta.series)) {
    answers.internal = "audit";
    signals.push({ label: "Dokumendisari", detail: `"${meta.series}" → p 18` });
  }

  if (SERIES_ECONOMIC.includes(meta.series)) {
    answers.mandatoryPublic = true;
    signals.push({ label: "Dokumendisari", detail: `"${meta.series}" → § 36` });
  }

  if (meta.partnerType === "eraisik") {
    answers.personalData = answers.personalData || "some";
    signals.push({ label: "Partner", detail: "eraisik → p 12" });
  }

  const normalizedText = `${meta.contractTitle} ${meta.description}`.toLowerCase();

  if (/(isikukood|sünniaeg|sünniaasta|isik|sünni|perenimi)/.test(normalizedText)) {
    answers.personalData = answers.personalData || "some";
    signals.push({ label: "Tekstiskann", detail: "isikukood/sünniaeg → p 12" });
  }

  if (/(tervis|diagnoos|ravi|haigus|arst|perearst)/.test(normalizedText)) {
    answers.specialData = true;
    signals.push({ label: "Tekstiskann", detail: "terviseandmed → p 11" });
  }

  if (/(sotsiaaltoetus|hooldus|tugi|koduhoolekanne)/.test(normalizedText)) {
    answers.privateLife = answers.privateLife || "social";
    signals.push({ label: "Tekstiskann", detail: "sotsiaaltoetus → p 14" });
  }

  if (/(perekond|lahutus|abielu|laps|vanem)/.test(normalizedText)) {
    answers.privateLife = answers.privateLife || "family";
    signals.push({ label: "Tekstiskann", detail: "perekond → p 13" });
  }

  if (/(ärisaladus|konfidentsiaal|konfidentsiaalsus)/.test(normalizedText)) {
    answers.businessSecret = true;
    signals.push({ label: "Tekstiskann", detail: "ärisaladus → p 17" });
  }

  if (/(kriminaal|kuritegu|rikku|kohtulahend|kohtuekspertiis)/.test(normalizedText)) {
    answers.proceedings = "criminal";
    signals.push({ label: "Tekstiskann", detail: "kriminaal → p 1" });
  }

  if (meta.series === "lepingud" || meta.series === "hanked") {
    openQuestions.push({ key: "confirmBusinessSecret", question: "Kas dokument sisaldab ärisaladust?", answer: meta.confirmBusinessSecret });
  }

  if (typeof meta.confirmBusinessSecret === "boolean") {
    answers.businessSecret = meta.confirmBusinessSecret;
    openQuestions.find((item) => item.key === "confirmBusinessSecret")!.answer = meta.confirmBusinessSecret;
  }

  const result = assess(answers as any, openQuestions.filter((item) => item.answer === undefined).length);

  return { result, signals, openQuestions, answers };
}
