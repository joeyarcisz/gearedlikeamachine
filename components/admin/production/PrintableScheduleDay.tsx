"use client";

import type { ScheduleCrewEntry, ScheduleEquipmentEntry } from "@/lib/production-types";

interface PrintableScheduleDayProps {
  date: string;
  projectTitle: string;
  locationName: string | null;
  locationAddress: string | null;
  startTime: string;
  wrapTime: string | null;
  notes: string | null;
  crewAssignments: ScheduleCrewEntry[];
  equipmentAssignments: ScheduleEquipmentEntry[];
}

function formatDateLong(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

// ── Department grouping ──
const DEPARTMENTS = [
  "Production", "Camera", "Grip & Electric", "Sound",
  "Art", "Wardrobe", "Hair & Makeup", "Transport", "Other",
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

function groupCrewByDepartment(crew: ScheduleCrewEntry[]) {
  const grouped: Record<string, ScheduleCrewEntry[]> = {};
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

// ── Equipment category grouping ──
function groupEquipmentByCategory(equipment: ScheduleEquipmentEntry[]) {
  const grouped: Record<string, ScheduleEquipmentEntry[]> = {};
  for (const item of equipment) {
    const cat = item.category || "Other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  }
  return Object.entries(grouped).map(([category, items]) => ({ category, items }));
}

export default function PrintableScheduleDay({
  date,
  projectTitle,
  locationName,
  locationAddress,
  startTime,
  wrapTime,
  notes,
  crewAssignments,
  equipmentAssignments,
}: PrintableScheduleDayProps) {
  const crewGroups = groupCrewByDepartment(crewAssignments);
  const equipmentGroups = groupEquipmentByCategory(equipmentAssignments);

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .glm-printable-schedule, .glm-printable-schedule * { visibility: visible; }
          .glm-printable-schedule {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
          }
          @page { size: letter; margin: 0.4in; }
          .glm-printable-schedule th {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .glm-printable-schedule .dept-hdr td {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .glm-printable-schedule .call-bar {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .pba { page-break-inside: avoid; }
          .glm-printable-schedule .section-hd { page-break-after: avoid; }
        }
        @media screen {
          .glm-printable-schedule {
            max-width: 850px;
            margin: 0 auto;
            padding: 0.4in;
          }
        }
        .glm-printable-schedule {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 400;
          line-height: 1.4;
          color: #111;
          background: #fff;
        }
        .glm-printable-schedule h1,.glm-printable-schedule h2,.glm-printable-schedule h3,.glm-printable-schedule h4 {
          font-family: 'Rajdhani', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
          color: #000;
        }
        .glm-printable-schedule table { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
        .glm-printable-schedule th {
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
        .glm-printable-schedule td {
          padding: 3px 5px;
          border: 1px solid #ddd;
          vertical-align: top;
          font-size: 11px;
        }
        .glm-printable-schedule .section-hd {
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
        .glm-printable-schedule .dept-hdr td {
          background: #e8e8e8;
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #000;
          padding: 3px 5px;
        }
        .glm-printable-schedule .cat-hdr td {
          background: #e8e8e8;
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #000;
          padding: 3px 5px;
        }
        .glm-printable-schedule .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0;
          border: 1px solid #ccc;
          margin-bottom: 4px;
        }
        .glm-printable-schedule .meta-cell { padding: 4px 8px; border-right: 1px solid #ccc; }
        .glm-printable-schedule .meta-cell:last-child { border-right: none; }
        .glm-printable-schedule .meta-label {
          font-family: 'Rajdhani', sans-serif;
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #666;
          margin-bottom: 1px;
        }
        .glm-printable-schedule .meta-value { font-size: 12px; font-weight: 500; }
        .glm-printable-schedule .call-bar {
          display: flex;
          align-items: center;
          gap: 24px;
          background: #000;
          color: #fff;
          padding: 8px 14px;
          margin-bottom: 4px;
        }
        .glm-printable-schedule .call-bar-label {
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #aaa;
        }
        .glm-printable-schedule .call-bar-time {
          font-family: 'Rajdhani', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #fff;
        }
        .glm-printable-schedule .call-bar-detail {
          font-family: 'Rajdhani', sans-serif;
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #999;
        }
        .glm-printable-schedule .call-bar-detail-val { font-size: 12px; font-weight: 600; color: #fff; }
        .glm-printable-schedule .doc-footer {
          text-align: center;
          font-size: 9px;
          color: #888;
          padding-top: 6px;
          border-top: 1px solid #ddd;
          margin-top: 16px;
        }
      `}</style>

      <div className="glm-printable-schedule">
        {/* ── HEADER ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #000", paddingBottom: 6, marginBottom: 4 }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 16, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#000" }}>
            Geared Like A Machine
          </div>
          <div style={{ textAlign: "right", fontSize: 10, color: "#444", lineHeight: 1.5 }}>
            joey@gearedlikeamachine.com<br />
            (682) 229-7699
          </div>
        </div>

        {/* ── DOC TITLE ── */}
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 28, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#000", textAlign: "center", margin: "6px 0 8px" }}>
          Shoot Day Schedule
        </div>

        {/* ── META GRID ── */}
        <div className="meta-grid pba">
          <div className="meta-cell">
            <div className="meta-label">Production</div>
            <div className="meta-value">{projectTitle}</div>
          </div>
          <div className="meta-cell">
            <div className="meta-label">Date</div>
            <div className="meta-value">{formatDateLong(date)}</div>
          </div>
          <div className="meta-cell">
            <div className="meta-label">Location</div>
            <div className="meta-value">{locationName || "TBD"}</div>
          </div>
        </div>

        {/* ── CALL TIME BAR ── */}
        <div className="call-bar pba">
          <div>
            <div className="call-bar-label">Start Time</div>
            <div className="call-bar-time">{startTime}</div>
          </div>
          {wrapTime && (
            <div>
              <div className="call-bar-detail">Est. Wrap</div>
              <div className="call-bar-detail-val">{wrapTime}</div>
            </div>
          )}
          {locationAddress && (
            <div style={{ marginLeft: "auto" }}>
              <div className="call-bar-detail">Address</div>
              <div className="call-bar-detail-val" style={{ fontSize: 10 }}>{locationAddress}</div>
            </div>
          )}
        </div>

        {/* ── CREW BY DEPARTMENT ── */}
        {crewAssignments.length > 0 && (
          <>
            <div className="section-hd">Crew</div>
            {crewGroups.map((group) => (
              <table key={group.department} className="pba" style={{ marginBottom: 4 }}>
                <thead>
                  <tr>
                    <th style={{ width: "28%" }}>Name</th>
                    <th style={{ width: "22%" }}>Role</th>
                    <th style={{ width: "15%" }}>Call Time</th>
                    <th style={{ width: "15%" }}>Day Rate</th>
                    <th style={{ width: "20%" }}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="dept-hdr">
                    <td colSpan={5}>{group.department}</td>
                  </tr>
                  {group.members.map((crew) => (
                    <tr key={crew.id}>
                      <td style={{ fontWeight: 500 }}>{crew.name}</td>
                      <td>{crew.role}</td>
                      <td style={{ fontWeight: 600 }}>{crew.callTime || "\u00A0"}</td>
                      <td>{crew.rate ? `$${crew.rate}` : "\u00A0"}</td>
                      <td style={{ color: "#666", fontSize: 10 }}>{crew.notes || "\u00A0"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </>
        )}

        {/* ── EQUIPMENT BY CATEGORY ── */}
        {equipmentAssignments.length > 0 && (
          <>
            <div className="section-hd">Equipment</div>
            {equipmentGroups.map((group) => (
              <table key={group.category} className="pba" style={{ marginBottom: 4 }}>
                <thead>
                  <tr>
                    <th style={{ width: "40%" }}>Item</th>
                    <th style={{ width: "15%" }}>Qty</th>
                    <th style={{ width: "45%" }}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="cat-hdr">
                    <td colSpan={3}>{group.category}</td>
                  </tr>
                  {group.items.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 500 }}>{item.itemName}</td>
                      <td>{item.quantity}</td>
                      <td style={{ color: "#666", fontSize: 10 }}>{item.notes || "\u00A0"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </>
        )}

        {/* ── NOTES ── */}
        {notes && (
          <>
            <div className="section-hd">Notes</div>
            <div className="pba" style={{ fontSize: 11, lineHeight: 1.5, whiteSpace: "pre-wrap", marginBottom: 14 }}>
              {notes}
            </div>
          </>
        )}

        {/* ── FOOTER ── */}
        <div className="doc-footer">
          Geared Like A Machine &nbsp;|&nbsp; joey@gearedlikeamachine.com &nbsp;|&nbsp; (682) 229-7699
        </div>
      </div>
    </>
  );
}
