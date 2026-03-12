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
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
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
  return (
    <div className="print-estimate hidden bg-white text-black p-8 max-w-[800px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 pb-4 border-b-2 border-gray-900">
        <div>
          <h1 className="text-2xl font-bold tracking-wide uppercase text-gray-900">
            GLM
          </h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
            Geared Like A Machine
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-widest">Shoot Day</p>
          <p className="text-sm font-semibold text-gray-900 mt-1">{formatDateLong(date)}</p>
        </div>
      </div>

      {/* Project title */}
      <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4">
        {projectTitle}
      </h2>

      {/* Location & Times */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Location</p>
          {locationName && <p className="font-medium text-gray-900">{locationName}</p>}
          {locationAddress && <p className="text-gray-700">{locationAddress}</p>}
          {!locationName && !locationAddress && (
            <p className="text-gray-400">TBD</p>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Schedule</p>
          <p className="text-gray-900">
            <span className="font-medium">Start:</span> {startTime}
          </p>
          {wrapTime && (
            <p className="text-gray-900">
              <span className="font-medium">Wrap:</span> {wrapTime}
            </p>
          )}
        </div>
      </div>

      {/* Crew Table */}
      {crewAssignments.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2 pb-1 border-b border-gray-300">
            Crew
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-semibold text-gray-900 text-xs uppercase tracking-widest">Name</th>
                <th className="text-left py-2 font-semibold text-gray-900 text-xs uppercase tracking-widest">Role</th>
                <th className="text-left py-2 font-semibold text-gray-900 text-xs uppercase tracking-widest">Call Time</th>
                <th className="text-left py-2 font-semibold text-gray-900 text-xs uppercase tracking-widest">Notes</th>
              </tr>
            </thead>
            <tbody>
              {crewAssignments.map((crew) => (
                <tr key={crew.id} className="border-b border-gray-100">
                  <td className="py-2 text-gray-900">{crew.name}</td>
                  <td className="py-2 text-gray-700">{crew.role}</td>
                  <td className="py-2 text-gray-700">{crew.callTime || "-"}</td>
                  <td className="py-2 text-gray-500 text-xs">{crew.notes || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Equipment Table */}
      {equipmentAssignments.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2 pb-1 border-b border-gray-300">
            Equipment
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-semibold text-gray-900 text-xs uppercase tracking-widest">Item</th>
                <th className="text-left py-2 font-semibold text-gray-900 text-xs uppercase tracking-widest">Category</th>
                <th className="text-left py-2 font-semibold text-gray-900 text-xs uppercase tracking-widest">Qty</th>
                <th className="text-left py-2 font-semibold text-gray-900 text-xs uppercase tracking-widest">Notes</th>
              </tr>
            </thead>
            <tbody>
              {equipmentAssignments.map((eq) => (
                <tr key={eq.id} className="border-b border-gray-100">
                  <td className="py-2 text-gray-900">{eq.itemName}</td>
                  <td className="py-2 text-gray-700">{eq.category || "-"}</td>
                  <td className="py-2 text-gray-700">{eq.quantity}</td>
                  <td className="py-2 text-gray-500 text-xs">{eq.notes || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Notes */}
      {notes && (
        <div className="mt-6 pt-4 border-t border-gray-300">
          <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">
            Notes
          </h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{notes}</p>
        </div>
      )}
    </div>
  );
}
