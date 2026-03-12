"use client";

import type { CallSheetDetail } from "@/lib/production-types";

interface PrintableCallSheetProps {
  callSheet: CallSheetDetail;
}

function formatDateLong(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function PrintableCallSheet({
  callSheet,
}: PrintableCallSheetProps) {
  return (
    <>
      {/* Print-only styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .printable-call-sheet, .printable-call-sheet * { visibility: visible; }
          .printable-call-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: #111 !important;
            font-size: 11pt;
          }
          .print-no-break { page-break-inside: avoid; }
          @page { margin: 0.5in; }
        }
        @media screen {
          .printable-call-sheet {
            background: white;
            color: #111;
            max-width: 850px;
            margin: 0 auto;
            padding: 40px;
            font-size: 11pt;
          }
        }
      `}</style>

      <div className="printable-call-sheet">
        {/* Company Header */}
        <div
          style={{
            borderBottom: "3px solid #111",
            paddingBottom: "12px",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "24pt",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              GEARED LIKE A MACHINE
            </h1>
            <p
              style={{
                fontSize: "9pt",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#666",
                margin: "4px 0 0 0",
              }}
            >
              Production Call Sheet
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontSize: "11pt",
                fontWeight: 600,
                margin: 0,
              }}
            >
              {formatDateLong(callSheet.shootDate)}
            </p>
          </div>
        </div>

        {/* Project Title */}
        <div
          className="print-no-break"
          style={{
            backgroundColor: "#111",
            color: "#fff",
            padding: "10px 16px",
            marginBottom: "16px",
          }}
        >
          <h2
            style={{
              fontSize: "14pt",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {callSheet.project.title}
          </h2>
        </div>

        {/* Call & Wrap Times */}
        <div
          className="print-no-break"
          style={{
            display: "flex",
            gap: "32px",
            marginBottom: "16px",
            padding: "12px 16px",
            border: "2px solid #111",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "8pt",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#666",
                display: "block",
              }}
            >
              General Call Time
            </span>
            <span
              style={{ fontSize: "18pt", fontWeight: 700, display: "block" }}
            >
              {callSheet.callTime}
            </span>
          </div>
          {callSheet.wrapTime && (
            <div>
              <span
                style={{
                  fontSize: "8pt",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "#666",
                  display: "block",
                }}
              >
                Estimated Wrap
              </span>
              <span
                style={{ fontSize: "18pt", fontWeight: 700, display: "block" }}
              >
                {callSheet.wrapTime}
              </span>
            </div>
          )}
          {(callSheet.sunrise || callSheet.sunset) && (
            <div style={{ marginLeft: "auto", display: "flex", gap: "24px" }}>
              {callSheet.sunrise && (
                <div>
                  <span
                    style={{
                      fontSize: "8pt",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      color: "#666",
                      display: "block",
                    }}
                  >
                    Sunrise
                  </span>
                  <span
                    style={{
                      fontSize: "14pt",
                      fontWeight: 600,
                      display: "block",
                    }}
                  >
                    {callSheet.sunrise}
                  </span>
                </div>
              )}
              {callSheet.sunset && (
                <div>
                  <span
                    style={{
                      fontSize: "8pt",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      color: "#666",
                      display: "block",
                    }}
                  >
                    Sunset
                  </span>
                  <span
                    style={{
                      fontSize: "14pt",
                      fontWeight: 600,
                      display: "block",
                    }}
                  >
                    {callSheet.sunset}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Weather + Location Grid */}
        <div
          className="print-no-break"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          {/* Location */}
          <div
            style={{
              border: "1px solid #ccc",
              padding: "12px 16px",
            }}
          >
            <h3
              style={{
                fontSize: "8pt",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#666",
                margin: "0 0 8px 0",
                borderBottom: "1px solid #eee",
                paddingBottom: "4px",
              }}
            >
              Location
            </h3>
            {callSheet.locationName && (
              <p style={{ margin: "0 0 4px 0", fontWeight: 600 }}>
                {callSheet.locationName}
              </p>
            )}
            {callSheet.locationAddress && (
              <p style={{ margin: "0 0 4px 0", color: "#444" }}>
                {callSheet.locationAddress}
              </p>
            )}
            {callSheet.parkingNotes && (
              <p style={{ margin: "8px 0 0 0", fontSize: "10pt" }}>
                <strong>Parking:</strong> {callSheet.parkingNotes}
              </p>
            )}
          </div>

          {/* Safety + Weather */}
          <div
            style={{
              border: "1px solid #ccc",
              padding: "12px 16px",
            }}
          >
            <h3
              style={{
                fontSize: "8pt",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#666",
                margin: "0 0 8px 0",
                borderBottom: "1px solid #eee",
                paddingBottom: "4px",
              }}
            >
              Weather &amp; Safety
            </h3>
            {callSheet.weatherSummary && (
              <p style={{ margin: "0 0 4px 0" }}>
                {callSheet.weatherSummary}
                {callSheet.weatherTemp ? ` — ${callSheet.weatherTemp}` : ""}
              </p>
            )}
            {callSheet.nearestHospital && (
              <p style={{ margin: "8px 0 0 0", fontSize: "10pt" }}>
                <strong>Nearest Hospital:</strong> {callSheet.nearestHospital}
              </p>
            )}
          </div>
        </div>

        {/* Crew Table */}
        <div className="print-no-break" style={{ marginBottom: "16px" }}>
          <h3
            style={{
              fontSize: "8pt",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#666",
              margin: "0 0 8px 0",
              borderBottom: "2px solid #111",
              paddingBottom: "4px",
            }}
          >
            Crew
          </h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "10pt",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid #333",
                  textAlign: "left",
                }}
              >
                <th
                  style={{
                    padding: "6px 8px",
                    fontSize: "8pt",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#666",
                    fontWeight: 600,
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    padding: "6px 8px",
                    fontSize: "8pt",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#666",
                    fontWeight: 600,
                  }}
                >
                  Role
                </th>
                <th
                  style={{
                    padding: "6px 8px",
                    fontSize: "8pt",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#666",
                    fontWeight: 600,
                  }}
                >
                  Call Time
                </th>
                <th
                  style={{
                    padding: "6px 8px",
                    fontSize: "8pt",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#666",
                    fontWeight: 600,
                  }}
                >
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {callSheet.crewCalls.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      padding: "12px 8px",
                      color: "#999",
                      textAlign: "center",
                    }}
                  >
                    No crew assigned
                  </td>
                </tr>
              ) : (
                callSheet.crewCalls.map((crew, i) => (
                  <tr
                    key={crew.id}
                    style={{
                      borderBottom: "1px solid #eee",
                      backgroundColor: i % 2 === 0 ? "#fafafa" : "#fff",
                    }}
                  >
                    <td
                      style={{
                        padding: "8px",
                        fontWeight: 600,
                      }}
                    >
                      {crew.name}
                    </td>
                    <td style={{ padding: "8px" }}>{crew.role}</td>
                    <td
                      style={{
                        padding: "8px",
                        fontWeight: 600,
                      }}
                    >
                      {crew.callTime}
                    </td>
                    <td style={{ padding: "8px", color: "#666" }}>
                      {crew.notes || ""}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Notes Section */}
        {(callSheet.generalNotes || callSheet.specialInstructions) && (
          <div
            className="print-no-break"
            style={{
              display: "grid",
              gridTemplateColumns:
                callSheet.generalNotes && callSheet.specialInstructions
                  ? "1fr 1fr"
                  : "1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            {callSheet.generalNotes && (
              <div
                style={{
                  border: "1px solid #ccc",
                  padding: "12px 16px",
                }}
              >
                <h3
                  style={{
                    fontSize: "8pt",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "#666",
                    margin: "0 0 8px 0",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "4px",
                  }}
                >
                  General Notes
                </h3>
                <p
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    fontSize: "10pt",
                    lineHeight: 1.5,
                  }}
                >
                  {callSheet.generalNotes}
                </p>
              </div>
            )}
            {callSheet.specialInstructions && (
              <div
                style={{
                  border: "1px solid #ccc",
                  padding: "12px 16px",
                }}
              >
                <h3
                  style={{
                    fontSize: "8pt",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "#666",
                    margin: "0 0 8px 0",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "4px",
                  }}
                >
                  Special Instructions
                </h3>
                <p
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    fontSize: "10pt",
                    lineHeight: 1.5,
                  }}
                >
                  {callSheet.specialInstructions}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid #ccc",
            paddingTop: "8px",
            marginTop: "24px",
            textAlign: "center",
            fontSize: "8pt",
            color: "#999",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
          }}
        >
          Geared Like A Machine LLC — Confidential
        </div>
      </div>
    </>
  );
}
