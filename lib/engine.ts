import { RestrictionResult } from "./types";

interface AssessAnswers {
  specialData?: boolean;
  privateLife?: string;
  personalData?: "some" | "lots";
  tax?: boolean;
  businessSecret?: boolean;
  tech?: boolean;
  proceedings?: "criminal" | "supervision";
  securityType?: string;
  internal?: "draft" | "audit";
  mandatoryPublic?: boolean;
}

const priority = [
  "specialData",
  "personalData",
  "privateLife",
  "tax",
  "businessSecret",
  "tech",
  "proceedings",
  "securityType",
  "internal",
];

export function assess(answers: AssessAnswers, openQuestionsCount = 0): RestrictionResult {
  const grounds: string[] = [];
  const flags = answers;

  if (flags.specialData) {
    grounds.push("p 11: eriliik/terviseandmed");
  }

  if (flags.privateLife === "family") {
    grounds.push("p 13: eraelu puutumatus (perekond)");
  }

  if (flags.privateLife === "social") {
    grounds.push("p 14: eraelu puutumatus (sotsiaal)");
  }

  if (flags.privateLife === "suffering") {
    grounds.push("p 15: eraelu puutumatus (kannatus)");
  }

  if (flags.personalData) {
    grounds.push("p 12: eraelu puutumatus (isikuandmed)");
  }

  if (flags.tax) {
    grounds.push("p 16: maksudega seotud teave");
  }

  if (flags.businessSecret) {
    grounds.push("p 17: ärisaladus");
  }

  if (flags.tech) {
    grounds.push("p 10: tehniline teave");
  }

  if (flags.proceedings === "criminal") {
    grounds.push("p 1: kriminaalmenetlus");
  }

  if (flags.proceedings === "supervision") {
    grounds.push("p 2: järelevalve otsuseni");
  }

  if (flags.securityType) {
    grounds.push(`p 3/4/5/9/18: turvalisusega seotud teave (${flags.securityType})`);
  }

  if (flags.internal === "draft") {
    grounds.push("§ 35 lg 2: sisemine projektijuhend (kuni vastuvõtmiseni)");
  }

  if (flags.internal === "audit") {
    grounds.push("p 18: siseaudit (kuni kinnitamiseni)");
  }

  const piirang = grounds.length > 0 ? "AK" : "AVALIK";
  const partial = flags.mandatoryPublic === true && piirang === "AK";

  const primaryCandidate = priority.find((key) => {
    if (key === "specialData") return flags.specialData;
    if (key === "privateLife") return Boolean(flags.privateLife);
    if (key === "personalData") return Boolean(flags.personalData);
    if (key === "tax") return flags.tax;
    if (key === "businessSecret") return flags.businessSecret;
    if (key === "tech") return flags.tech;
    if (key === "proceedings") return Boolean(flags.proceedings);
    if (key === "securityType") return Boolean(flags.securityType);
    if (key === "internal") return Boolean(flags.internal);
    return false;
  });

  const primary = primaryCandidate
    ? grounds.find((ground) => ground.includes(primaryCandidate === "personalData" ? "p 12" : primaryCandidate === "businessSecret" ? "p 17" : primaryCandidate === "specialData" ? "p 11" : primaryCandidate === "privateLife" ? "p 13" : primaryCandidate === "tax" ? "p 16" : primaryCandidate === "tech" ? "p 10" : primaryCandidate === "proceedings" ? "p 1" : primaryCandidate === "securityType" ? "turvalisusega" : "sise") ?? grounds[0]
    : grounds[0]) || grounds[0] || "Avalikustamise alust ei tuvastatud";

  let kehtivusaeg = "kuni 5 a";
  let kehtivusCite = "AvTS § 40 lg 1";
  let kehtivusNote = "Vaikimisi kuni 5 aastat, vajadusel pikendatav";

  if (flags.specialData || flags.personalData || flags.privateLife) {
    kehtivusaeg = "kuni 75 a";
    kehtivusCite = "AvTS § 40 lg 3";
  }

  if (flags.proceedings === "supervision") {
    kehtivusaeg = "kuni otsuse jõustumiseni";
    kehtivusCite = "AvTS § 40 lg 2";
  }

  if (flags.internal === "draft") {
    kehtivusaeg = "kuni vastuvõtmiseni";
    kehtivusCite = "AvTS § 35 lg 2";
  }

  if (flags.internal === "audit") {
    kehtivusaeg = "kuni kinnitamiseni";
    kehtivusCite = "AvTS p 18";
  }

  const kindlus = openQuestionsCount > 0 ? "Keskmine" : piirang === "AK" ? "Kõrge" : "Madal";

  return {
    piirang,
    partial,
    grounds,
    primary,
    kehtivusaeg,
    kehtivusCite,
    kehtivusNote,
    pohjendus: piirang === "AK" ? `Põhineb ${primary}` : "Dokument on avatud teave.",
    kindlus,
    marking: piirang === "AK" ? "ASUTUSESISESEKS KASUTAMISEKS" : "AVALIK"
  };
}
