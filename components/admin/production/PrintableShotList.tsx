"use client";

import type { ShotListDetail, ShotEntry } from "@/lib/production-types";

interface PrintableShotListProps {
  shotList: ShotListDetail;
  shots: ShotEntry[];
}

export default function PrintableShotList({ shotList, shots }: PrintableShotListProps) {
  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-shot-list,
          .printable-shot-list * {
            visibility: visible;
          }
          .printable-shot-list {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
            background: white !important;
            color: black !important;
          }
          .print-hide {
            display: none !important;
          }
        }
      `}</style>

      <div className="printable-shot-list bg-white text-black p-8 max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="border-b-2 border-black pb-4 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-wide">
                {shotList.title}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {shotList.project.title}
                {shotList.sceneNumber && ` \u2014 Scene ${shotList.sceneNumber}`}
              </p>
              {shotList.description && (
                <p className="text-sm text-gray-500 mt-2 max-w-lg">
                  {shotList.description}
                </p>
              )}
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>{shots.length} shots</p>
              <p>
                {shots.filter((s) => s.completed).length} completed
              </p>
              <p className="mt-1">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-2 px-2 text-xs uppercase tracking-wide font-semibold text-gray-700 w-12">
                Shot #
              </th>
              <th className="text-left py-2 px-2 text-xs uppercase tracking-wide font-semibold text-gray-700 w-12">
                Size
              </th>
              <th className="text-left py-2 px-2 text-xs uppercase tracking-wide font-semibold text-gray-700">
                Movement
              </th>
              <th className="text-left py-2 px-2 text-xs uppercase tracking-wide font-semibold text-gray-700">
                Angle
              </th>
              <th className="text-left py-2 px-2 text-xs uppercase tracking-wide font-semibold text-gray-700">
                Lens
              </th>
              <th className="text-left py-2 px-2 text-xs uppercase tracking-wide font-semibold text-gray-700">
                Equipment
              </th>
              <th className="text-left py-2 px-2 text-xs uppercase tracking-wide font-semibold text-gray-700">
                Description
              </th>
              <th className="text-left py-2 px-2 text-xs uppercase tracking-wide font-semibold text-gray-700">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {shots.map((shot) => (
              <tr
                key={shot.id}
                className={`border-b border-gray-200 ${
                  shot.completed ? "text-gray-400 line-through" : ""
                }`}
              >
                <td className="py-2 px-2 font-medium">{shot.shotNumber}</td>
                <td className="py-2 px-2">
                  {shot.size && (
                    <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase border border-gray-400 rounded">
                      {shot.size}
                    </span>
                  )}
                </td>
                <td className="py-2 px-2">{shot.movement || "\u2014"}</td>
                <td className="py-2 px-2">{shot.angle || "\u2014"}</td>
                <td className="py-2 px-2">{shot.lens || "\u2014"}</td>
                <td className="py-2 px-2">{shot.equipment || "\u2014"}</td>
                <td className="py-2 px-2 max-w-[250px]">{shot.description}</td>
                <td className="py-2 px-2 text-gray-500 max-w-[150px]">
                  {shot.notes || "\u2014"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-xs text-gray-400 flex justify-between">
          <span>GLM Shot List</span>
          <span>Page 1</span>
        </div>
      </div>
    </>
  );
}
