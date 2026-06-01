import { RestrictionResult, SignalItem, OpenQuestion } from "../lib/types";

interface PanelProps {
  result: RestrictionResult;
  signals: SignalItem[];
  openQuestions: OpenQuestion[];
  onQuestionAnswer: (key: string, value: boolean) => void;
}

export function AccessRestrictionPanel({ result, signals, openQuestions, onQuestionAnswer }: PanelProps) {
  return (
    <div className="card restriction-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#495057" }}>
            Juurdepääsupiirang
          </div>
          <span className="badge auto">automaatne</span>
        </div>
      </div>

      <div className="status-card">
        <h3>Soovituslik piirang</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
          <span style={{ width: 12, height: 12, borderRadius: 9999, background: result.piirang === "AK" ? "#D7BB0C" : "#058757" }} />
          <strong>{result.piirang === "AK" ? "AK" : "Avalik"}</strong>
        </div>
      </div>

      <dl className="output-row">
        <div>
          <dt>Seaduslik alus</dt>
          <dd>{result.primary}</dd>
        </div>
        <div>
          <dt>Kehtivusaeg</dt>
          <dd>{result.kehtivusaeg}</dd>
        </div>
        <div>
          <dt>Põhjendus</dt>
          <dd>{result.pohjendus}</dd>
        </div>
        <div>
          <dt>Kindluse tase</dt>
          <dd>{result.kindlus}</dd>
        </div>
      </dl>

      <div className="signal-card" style={{ marginTop: 24 }}>
        <h3>Tuvastatud metaandmetest</h3>
        {signals.length === 0 ? (
          <p style={{ margin: 0, color: "#6C757D" }}>Signaale ei tuvastatud.</p>
        ) : (
          signals.map((signal) => (
            <div key={`${signal.label}-${signal.detail}`} className="signal-item">
              <span>{signal.label}</span>
              <span className="signal-key">{signal.detail}</span>
            </div>
          ))
        )}
      </div>

      {openQuestions.length > 0 && (
        <div className="question-card open-questions">
          <h3>Vajab kinnitamist</h3>
          {openQuestions.map((question) => (
            <div key={question.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 12 }}>
              <span>{question.question}</span>
              <div>
                <button className="secondary" onClick={() => onQuestionAnswer(question.key, true)}>
                  Jah
                </button>
                <button className="secondary" onClick={() => onQuestionAnswer(question.key, false)}>
                  Ei
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 24, textAlign: "right" }}>
        <button className="primary">
          {result.piirang === "AK" ? "Kinnita AK piirang" : "Salvesta avalikuna"}
        </button>
      </div>
    </div>
  );
}
