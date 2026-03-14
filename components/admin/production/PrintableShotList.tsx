"use client";

import type { ShotListDetail, ShotEntry } from "@/lib/production-types";

interface PrintableShotListProps {
  shotList: ShotListDetail;
  shots: ShotEntry[];
}

// ── Shot size reference data ──
const SIZE_REF = [
  ["ECU", "Extreme Close-Up"],
  ["CU", "Close-Up"],
  ["MCU", "Medium Close-Up"],
  ["MS", "Medium Shot"],
  ["MFS", "Medium Full Shot"],
  ["FS", "Full Shot"],
  ["WS", "Wide Shot"],
  ["ES", "Extreme Wide Shot"],
  ["OTS", "Over the Shoulder"],
  ["POV", "Point of View"],
  ["Insert", "Insert / Detail"],
];

const MOVEMENT_REF = [
  ["Static", "Locked-off, no movement"],
  ["Pan", "Horizontal rotation on axis"],
  ["Tilt", "Vertical rotation on axis"],
  ["Push In", "Camera moves toward subject"],
  ["Pull Out", "Camera moves away from subject"],
  ["Tracking", "Following subject movement"],
  ["Trucking", "Camera moves left/right"],
  ["Handheld", "Handheld, organic movement"],
  ["Crane", "Crane / Jib arm"],
  ["Drone", "Aerial drone movement"],
  ["Dolly Zoom", "Simultaneous zoom and dolly"],
  ["Roll", "Camera rotation on lens axis"],
  ["Zoom", "Optical zoom in/out"],
];

export default function PrintableShotList({ shotList, shots }: PrintableShotListProps) {
  const completed = shots.filter((s) => s.completed).length;

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .glm-printable-shotlist, .glm-printable-shotlist * { visibility: visible; }
          .glm-printable-shotlist {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
          }
          @page { size: letter; margin: 0.4in; }
          .glm-printable-shotlist .shot-tbl th {
            background: #000 !important;
            color: #fff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .glm-printable-shotlist .shot-tbl tr { page-break-inside: avoid; }
          .glm-printable-shotlist .section-hd { page-break-after: avoid; }
        }
        @media screen {
          .glm-printable-shotlist {
            max-width: 1100px;
            margin: 0 auto;
            padding: 0.4in;
          }
        }
        .glm-printable-shotlist {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 400;
          color: #111;
          background: #fff;
          line-height: 1.4;
        }
        .glm-printable-shotlist .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 2px solid #000;
          padding-bottom: 6px;
          margin-bottom: 10px;
        }
        .glm-printable-shotlist .header-company {
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #000;
        }
        .glm-printable-shotlist .header-contact {
          font-size: 9px;
          color: #444;
          text-align: right;
          line-height: 1.5;
        }
        .glm-printable-shotlist .title {
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: 28px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #000;
          margin-bottom: 10px;
        }
        .glm-printable-shotlist .meta-tbl {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 14px;
          table-layout: fixed;
        }
        .glm-printable-shotlist .meta-tbl td { padding: 3px 6px; font-size: 11px; vertical-align: bottom; }
        .glm-printable-shotlist .meta-lbl {
          font-family: 'Rajdhani', sans-serif;
          font-weight: 600;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #555;
          white-space: nowrap;
          width: 80px;
        }
        .glm-printable-shotlist .meta-val { border-bottom: 1px solid #ccc; }
        .glm-printable-shotlist .section-hd {
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #000;
          border-bottom: 1px solid #000;
          padding-bottom: 2px;
          margin-top: 16px;
          margin-bottom: 6px;
        }
        .glm-printable-shotlist .shot-tbl {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          margin-bottom: 14px;
        }
        .glm-printable-shotlist .shot-tbl th {
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: #000;
          color: #fff;
          padding: 4px 3px;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
        }
        .glm-printable-shotlist .shot-tbl td {
          font-size: 10px;
          padding: 3px 3px;
          border-bottom: 1px solid #ddd;
          border-left: none;
          border-right: none;
          vertical-align: top;
          overflow: hidden;
        }
        .glm-printable-shotlist .shot-tbl tr:nth-child(even) td { background: #fafafa; }
        .glm-printable-shotlist .shot-tbl .done-col { width: 4%; text-align: center; }
        .glm-printable-shotlist .shot-tbl .shot-col { width: 7%; }
        .glm-printable-shotlist .shot-tbl .size-col { width: 7%; }
        .glm-printable-shotlist .shot-tbl .move-col { width: 9%; }
        .glm-printable-shotlist .shot-tbl .angle-col { width: 8%; }
        .glm-printable-shotlist .shot-tbl .lens-col { width: 7%; }
        .glm-printable-shotlist .shot-tbl .equip-col { width: 10%; }
        .glm-printable-shotlist .shot-tbl .desc-col { width: 25%; }
        .glm-printable-shotlist .shot-tbl .notes-col { width: 17%; }
        .glm-printable-shotlist .shot-tbl .completed-row td {
          text-decoration: line-through;
          color: #999;
        }
        .glm-printable-shotlist .ref-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 14px;
        }
        .glm-printable-shotlist .ref-block { font-size: 9px; line-height: 1.5; }
        .glm-printable-shotlist .ref-block h4 {
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          border-bottom: 1px solid #999;
          padding-bottom: 2px;
          margin-bottom: 3px;
          color: #000;
        }
        .glm-printable-shotlist .ref-block table { width: 100%; border-collapse: collapse; }
        .glm-printable-shotlist .ref-block td { padding: 1px 4px; font-size: 9px; border-bottom: 1px solid #eee; vertical-align: top; }
        .glm-printable-shotlist .ref-abbr { font-weight: 600; width: 60px; white-space: nowrap; }
        .glm-printable-shotlist .ref-name { color: #444; }
        .glm-printable-shotlist .doc-footer {
          border-top: 1px solid #999;
          padding-top: 6px;
          margin-top: 16px;
          text-align: center;
          font-size: 9px;
          color: #666;
          letter-spacing: 0.04em;
        }
      `}</style>

      <div className="glm-printable-shotlist">
        {/* ── HEADER ── */}
        <div className="header">
          <div className="header-company">Geared Like A Machine</div>
          <div className="header-contact">
            joey@gearedlikeamachine.com<br />
            (682) 229-7699
          </div>
        </div>

        {/* ── TITLE ── */}
        <div className="title">Shot List</div>

        {/* ── META TABLE ── */}
        <table className="meta-tbl">
          <tbody>
            <tr>
              <td className="meta-lbl">Production</td>
              <td className="meta-val">{shotList.project.title}</td>
              <td className="meta-lbl">Scene</td>
              <td className="meta-val">{shotList.sceneNumber || "\u00A0"}</td>
              <td className="meta-lbl">Date</td>
              <td className="meta-val">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
            </tr>
            <tr>
              <td className="meta-lbl">Title</td>
              <td className="meta-val">{shotList.title}</td>
              <td className="meta-lbl">DP</td>
              <td className="meta-val">Joey Arcisz</td>
              <td className="meta-lbl">Shots</td>
              <td className="meta-val">{completed}/{shots.length} complete</td>
            </tr>
          </tbody>
        </table>

        {/* ── MAIN SHOT TABLE ── */}
        <table className="shot-tbl">
          <thead>
            <tr>
              <th className="done-col">Done</th>
              <th className="shot-col">Shot #</th>
              <th className="size-col">Size</th>
              <th className="move-col">Movement</th>
              <th className="angle-col">Angle</th>
              <th className="lens-col">Lens</th>
              <th className="equip-col">Equipment</th>
              <th className="desc-col">Description</th>
              <th className="notes-col">Notes</th>
            </tr>
          </thead>
          <tbody>
            {shots.map((shot) => (
              <tr key={shot.id} className={shot.completed ? "completed-row" : ""}>
                <td className="done-col">
                  <input type="checkbox" checked={shot.completed} readOnly style={{ width: 13, height: 13, accentColor: "#000" }} />
                </td>
                <td style={{ fontWeight: 600 }}>{shot.shotNumber}</td>
                <td>{shot.size || ""}</td>
                <td>{shot.movement || ""}</td>
                <td>{shot.angle || ""}</td>
                <td>{shot.lens || ""}</td>
                <td>{shot.equipment || ""}</td>
                <td>{shot.description}</td>
                <td style={{ color: "#666" }}>{shot.notes || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── REFERENCE SECTION ── */}
        <div className="ref-grid">
          <div className="ref-block">
            <h4>Shot Size Reference</h4>
            <table>
              <tbody>
                {SIZE_REF.map(([abbr, name]) => (
                  <tr key={abbr}>
                    <td className="ref-abbr">{abbr}</td>
                    <td className="ref-name">{name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="ref-block">
            <h4>Movement Reference</h4>
            <table>
              <tbody>
                {MOVEMENT_REF.map(([abbr, name]) => (
                  <tr key={abbr}>
                    <td className="ref-abbr">{abbr}</td>
                    <td className="ref-name">{name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── NOTES ── */}
        {shotList.description && (
          <>
            <div className="section-hd">Notes</div>
            <div style={{ fontSize: 10, lineHeight: 1.6, whiteSpace: "pre-wrap", marginBottom: 14 }}>
              {shotList.description}
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
