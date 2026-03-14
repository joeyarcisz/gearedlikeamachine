"use client";

import type { CallSheetDetail, CrewCallEntry } from "@/lib/production-types";

interface PrintableCallSheetProps {
  callSheet: CallSheetDetail;
}

// ── Department grouping ──
const DEPARTMENTS = [
  "Production",
  "Camera",
  "Grip & Electric",
  "Sound",
  "Art",
  "Wardrobe",
  "Hair & Makeup",
  "Transport",
  "Other",
] as const;

function getDepartment(role: string): string {
  const r = role.toLowerCase();
  if (/\b(director|producer|1st ad|2nd ad|ad\b|coordinator|supervisor|pa\b|production assistant)/i.test(r)) return "Production";
  if (/\b(dp|camera|cinematographer|1st ac|2nd ac|ac\b|dit|b-cam|steadicam|gimbal|drone|operator|focus)/i.test(r)) return "Camera";
  if (/\b(gaffer|grip|electric|bbe|bbg|best boy|dolly|rigg)/i.test(r)) return "Grip & Electric";
  if (/\b(sound|boom|mixer|audio|utility)/i.test(r)) return "Sound";
  if (/\b(design|art|dresser|props|scenic)/i.test(r)) return "Art";
  if (/\b(wardrobe|stylist|costume)/i.test(r)) return "Wardrobe";
  if (/\b(hmu|makeup|hair|grooming|mua)/i.test(r)) return "Hair & Makeup";
  if (/\b(transport|driver|captain)/i.test(r)) return "Transport";
  return "Other";
}

function groupCrewByDepartment(crew: CrewCallEntry[]) {
  const grouped: Record<string, CrewCallEntry[]> = {};
  for (const dept of DEPARTMENTS) grouped[dept] = [];
  for (const member of crew) {
    const dept = getDepartment(member.role);
    grouped[dept].push(member);
  }
  return DEPARTMENTS.filter((d) => grouped[d].length > 0).map((dept) => ({
    department: dept,
    members: grouped[dept],
  }));
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

export default function PrintableCallSheet({ callSheet }: PrintableCallSheetProps) {
  const crewGroups = groupCrewByDepartment(callSheet.crewCalls);

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .glm-printable-callsheet, .glm-printable-callsheet * { visibility: visible; }
          .glm-printable-callsheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
          }
          @page { size: letter; margin: 0.4in; }
          .glm-printable-callsheet th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .glm-printable-callsheet .dept-hdr td { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .glm-printable-callsheet .general-call-bar { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .glm-printable-callsheet .footer-notice { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .pba { page-break-inside: avoid; }
          .section-hd { page-break-after: avoid; }
        }
        @media screen {
          .glm-printable-callsheet {
            max-width: 850px;
            margin: 0 auto;
            padding: 0.4in;
          }
        }
        .glm-printable-callsheet {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 400;
          line-height: 1.4;
          color: #111;
          background: #fff;
        }
        .glm-printable-callsheet h1,.glm-printable-callsheet h2,.glm-printable-callsheet h3,.glm-printable-callsheet h4 {
          font-family: 'Rajdhani', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
          color: #000;
        }
        .glm-printable-callsheet table { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
        .glm-printable-callsheet th {
          font-family: 'Rajdhani', sans-serif;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          text-align: left;
          padding: 3px 5px;
          background: #f0f0f0;
          border: 1px solid #ccc;
          color: #333;
        }
        .glm-printable-callsheet td {
          padding: 3px 5px;
          border: 1px solid #ddd;
          vertical-align: top;
          font-size: 11px;
        }
        .glm-printable-callsheet .section-hd {
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #000;
          border-bottom: 1.5px solid #000;
          padding-bottom: 3px;
          margin-top: 16px;
          margin-bottom: 6px;
        }
        .glm-printable-callsheet .section-hd:first-of-type { margin-top: 10px; }
        .glm-printable-callsheet .dept-hdr td {
          background: #e8e8e8;
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #000;
          padding: 3px 5px;
        }
        .glm-printable-callsheet .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 0;
          border: 1px solid #ccc;
          margin-bottom: 4px;
        }
        .glm-printable-callsheet .meta-cell {
          padding: 4px 8px;
          border-right: 1px solid #ccc;
        }
        .glm-printable-callsheet .meta-cell:last-child { border-right: none; }
        .glm-printable-callsheet .meta-label {
          font-family: 'Rajdhani', sans-serif;
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #666;
          margin-bottom: 1px;
        }
        .glm-printable-callsheet .meta-value { font-size: 12px; font-weight: 500; }
        .glm-printable-callsheet .general-call-bar {
          display: flex;
          align-items: center;
          gap: 24px;
          background: #000;
          color: #fff;
          padding: 8px 14px;
          margin-bottom: 4px;
        }
        .glm-printable-callsheet .gc-label {
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #aaa;
          white-space: nowrap;
        }
        .glm-printable-callsheet .gc-time {
          font-family: 'Rajdhani', sans-serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #fff;
        }
        .glm-printable-callsheet .gc-details { display: flex; gap: 20px; flex-wrap: wrap; }
        .glm-printable-callsheet .gc-item { display: flex; align-items: baseline; gap: 4px; }
        .glm-printable-callsheet .gc-item-label {
          font-family: 'Rajdhani', sans-serif;
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #999;
        }
        .glm-printable-callsheet .gc-item-value { font-size: 12px; font-weight: 600; color: #fff; }
        .glm-printable-callsheet .weather-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0;
          border: 1px solid #ccc;
          margin-bottom: 4px;
        }
        .glm-printable-callsheet .weather-col { padding: 5px 8px; border-right: 1px solid #ccc; }
        .glm-printable-callsheet .weather-col:last-child { border-right: none; }
        .glm-printable-callsheet .weather-period {
          font-family: 'Rajdhani', sans-serif;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 3px;
          color: #000;
        }
        .glm-printable-callsheet .weather-row { display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 1px; }
        .glm-printable-callsheet .weather-label { color: #666; font-weight: 500; }
        .glm-printable-callsheet .hospital-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 0;
          border: 1px solid #ccc;
          margin-bottom: 4px;
        }
        .glm-printable-callsheet .hospital-cell { padding: 4px 8px; border-right: 1px solid #ccc; }
        .glm-printable-callsheet .hospital-cell:last-child { border-right: none; }
        .glm-printable-callsheet .location-block { border: 1px solid #ccc; padding: 6px 8px; margin-bottom: 6px; }
        .glm-printable-callsheet .location-title {
          font-family: 'Rajdhani', sans-serif;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 4px;
          color: #000;
        }
        .glm-printable-callsheet .location-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 16px; }
        .glm-printable-callsheet .location-field { display: flex; gap: 4px; font-size: 10px; margin-bottom: 1px; }
        .glm-printable-callsheet .location-field-label { font-weight: 600; color: #555; white-space: nowrap; }
        .glm-printable-callsheet .footer-notice {
          background: #f5f5f5;
          border: 1px solid #ccc;
          padding: 6px 10px;
          font-size: 10px;
          font-weight: 600;
          line-height: 1.4;
          margin-top: 12px;
          margin-bottom: 8px;
          color: #111;
        }
        .glm-printable-callsheet .doc-footer {
          text-align: center;
          font-size: 9px;
          color: #888;
          padding-top: 6px;
          border-top: 1px solid #ddd;
        }
      `}</style>

      <div className="glm-printable-callsheet">
        {/* ── HEADER ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #000", paddingBottom: 6, marginBottom: 4 }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 16, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#000" }}>
            Geared Like A Machine
          </div>
          <div style={{ textAlign: "right", fontSize: 10, color: "#444", lineHeight: 1.5 }}>
            joey@gearedlikeamachine.com<br />
            (682) 229-7699<br />
            gearedlikeamachine.com
          </div>
        </div>

        {/* ── DOC TITLE ── */}
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 28, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#000", textAlign: "center", margin: "6px 0 8px" }}>
          Call Sheet
        </div>

        {/* ── META GRID ── */}
        <div className="meta-grid pba">
          <div className="meta-cell">
            <div className="meta-label">Production</div>
            <div className="meta-value">{callSheet.project.title}</div>
          </div>
          <div className="meta-cell">
            <div className="meta-label">Client</div>
            <div className="meta-value">{callSheet.project.clientName || "\u00A0"}</div>
          </div>
          <div className="meta-cell">
            <div className="meta-label">Date</div>
            <div className="meta-value">{formatDateLong(callSheet.shootDate)}</div>
          </div>
          <div className="meta-cell">
            <div className="meta-label">Status</div>
            <div className="meta-value" style={{ textTransform: "capitalize" }}>{callSheet.status}</div>
          </div>
        </div>

        {/* ── GENERAL CREW CALL ── */}
        <div className="general-call-bar pba">
          <div>
            <div className="gc-label">General Crew Call</div>
            <div className="gc-time">{callSheet.callTime}</div>
          </div>
          <div className="gc-details">
            {callSheet.sunrise && (
              <div className="gc-item">
                <span className="gc-item-label">Sunrise</span>
                <span className="gc-item-value">{callSheet.sunrise}</span>
              </div>
            )}
            {callSheet.sunset && (
              <div className="gc-item">
                <span className="gc-item-label">Sunset</span>
                <span className="gc-item-value">{callSheet.sunset}</span>
              </div>
            )}
            {callSheet.wrapTime && (
              <div className="gc-item">
                <span className="gc-item-label">Est. Wrap</span>
                <span className="gc-item-value">{callSheet.wrapTime}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── KEY CONTACTS ── */}
        <div className="section-hd">Key Contacts</div>
        <table className="pba">
          <thead>
            <tr>
              <th style={{ width: "18%" }}>Role</th>
              <th style={{ width: "22%" }}>Name</th>
              <th style={{ width: "20%" }}>Phone</th>
              <th style={{ width: "40%" }}>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>DP</td>
              <td>Joey Arcisz</td>
              <td>(682) 229-7699</td>
              <td>joey@gearedlikeamachine.com</td>
            </tr>
            {callSheet.crewCalls
              .filter((c) => /director|producer|1st ad|coordinator/i.test(c.role))
              .map((c) => (
                <tr key={c.id}>
                  <td>{c.role}</td>
                  <td>{c.name}</td>
                  <td>{c.phone || "\u00A0"}</td>
                  <td>{c.email || "\u00A0"}</td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* ── WEATHER FORECAST ── */}
        <div className="section-hd">Weather Forecast</div>
        <div className="weather-grid pba">
          {["Morning", "Afternoon", "Evening"].map((period) => (
            <div className="weather-col" key={period}>
              <div className="weather-period">{period}</div>
              {callSheet.weatherSummary ? (
                <>
                  <div className="weather-row">
                    <span className="weather-label">Temp:</span>
                    <span>{callSheet.weatherTemp || "\u00A0"}</span>
                  </div>
                  <div className="weather-row">
                    <span className="weather-label">Conditions:</span>
                    <span>{callSheet.weatherSummary}</span>
                  </div>
                </>
              ) : (
                <div className="weather-row">
                  <span className="weather-label" style={{ color: "#bbb" }}>No data</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── NEAREST HOSPITAL ── */}
        <div className="section-hd">Nearest Hospital</div>
        <div className="hospital-grid pba">
          <div className="hospital-cell">
            <div className="meta-label">Hospital</div>
            <div>{callSheet.nearestHospital || "\u00A0"}</div>
          </div>
          <div className="hospital-cell">
            <div className="meta-label">Address</div>
            <div>{"\u00A0"}</div>
          </div>
          <div className="hospital-cell">
            <div className="meta-label">Phone</div>
            <div>{"\u00A0"}</div>
          </div>
          <div className="hospital-cell">
            <div className="meta-label">Distance</div>
            <div>{"\u00A0"}</div>
          </div>
        </div>

        {/* ── CREW LIST BY DEPARTMENT ── */}
        <div className="section-hd">Crew List</div>
        {crewGroups.map((group) => (
          <table key={group.department} className="pba" style={{ marginBottom: 4 }}>
            <thead>
              <tr>
                <th style={{ width: "28%" }}>Name</th>
                <th style={{ width: "22%" }}>Role</th>
                <th style={{ width: "15%" }}>Call Time</th>
                <th style={{ width: "35%" }}>Phone</th>
              </tr>
            </thead>
            <tbody>
              <tr className="dept-hdr">
                <td colSpan={4}>{group.department}</td>
              </tr>
              {group.members.map((crew) => (
                <tr key={crew.id}>
                  <td style={{ fontWeight: 500 }}>{crew.name}</td>
                  <td>{crew.role}</td>
                  <td style={{ fontWeight: 600 }}>{crew.callTime}</td>
                  <td>{crew.phone || "\u00A0"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}

        {/* ── LOCATIONS ── */}
        {callSheet.locationName && (
          <>
            <div className="section-hd">Locations</div>
            <div className="location-block pba">
              <div className="location-title">{callSheet.locationName}</div>
              <div className="location-grid">
                <div className="location-field">
                  <span className="location-field-label">Address:</span>
                  <span>{callSheet.locationAddress || "\u00A0"}</span>
                </div>
                <div className="location-field">
                  <span className="location-field-label">Parking:</span>
                  <span>{callSheet.parkingNotes || "\u00A0"}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── EQUIPMENT NOTES ── */}
        <div className="section-hd">Equipment Notes</div>
        <table className="pba">
          <tbody>
            {["Camera Package", "Lighting", "Grip", "Specialty", "Rentals Arriving", "Rentals Returning", "Notes"].map((label) => (
              <tr key={label}>
                <td style={{ width: "20%", fontWeight: 600, background: "#f0f0f0" }}>{label}</td>
                <td>{"\u00A0"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── CATERING ── */}
        <div className="section-hd">Catering</div>
        <table className="pba">
          <thead>
            <tr>
              <th style={{ width: "22%" }}>Meal</th>
              <th style={{ width: "15%" }}>Time</th>
              <th style={{ width: "25%" }}>Location</th>
              <th style={{ width: "38%" }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {["Breakfast / Coffee", "Lunch", "Craft Services", "2nd Meal"].map((meal) => (
              <tr key={meal}>
                <td>{meal}</td>
                <td>{"\u00A0"}</td>
                <td>{"\u00A0"}</td>
                <td>{"\u00A0"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── NOTES ── */}
        {(callSheet.generalNotes || callSheet.specialInstructions) && (
          <>
            <div className="section-hd">Notes</div>
            <div className="pba" style={{ fontSize: 11, lineHeight: 1.5, marginBottom: 4 }}>
              {callSheet.generalNotes && (
                <div style={{ whiteSpace: "pre-wrap", marginBottom: callSheet.specialInstructions ? 8 : 0 }}>
                  {callSheet.generalNotes}
                </div>
              )}
              {callSheet.specialInstructions && (
                <div style={{ whiteSpace: "pre-wrap" }}>
                  <strong style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Special Instructions:
                  </strong>{" "}
                  {callSheet.specialInstructions}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── EMERGENCY CONTACTS ── */}
        <div className="section-hd">Emergency Contacts</div>
        <table className="pba">
          <thead>
            <tr>
              <th style={{ width: "30%" }}>Contact</th>
              <th style={{ width: "70%" }}>Number / Info</th>
            </tr>
          </thead>
          <tbody>
            {["Production Office", "Producer Cell", "1st AD Cell", "Location Contact", "Nearest Hospital", "Police Non-Emergency", "Fire Department"].map((contact) => (
              <tr key={contact}>
                <td style={{ fontWeight: 600 }}>{contact}</td>
                <td>{contact === "Nearest Hospital" ? (callSheet.nearestHospital || "\u00A0") : "\u00A0"}</td>
              </tr>
            ))}
            <tr>
              <td style={{ fontWeight: 600 }}>Emergency</td>
              <td>911</td>
            </tr>
          </tbody>
        </table>

        {/* ── FOOTER NOTICE ── */}
        <div className="footer-notice pba">
          Call times are CREW CALL. Report ready to work at your department. No forced calls without prior arrangement. If you are going to be late, contact the 1st AD or Production Coordinator immediately.
        </div>

        {/* ── FOOTER ── */}
        <div className="doc-footer">
          Geared Like A Machine &nbsp;|&nbsp; joey@gearedlikeamachine.com &nbsp;|&nbsp; (682) 229-7699
        </div>
      </div>
    </>
  );
}
