import { Suspense } from "react";
import NewCallSheetForm from "./NewCallSheetForm";

export default function NewCallSheetPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 sm:p-6">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
                New Call Sheet
              </h2>
            </div>
            <div className="dashboard-card-body">
              <p className="text-muted text-sm">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <NewCallSheetForm />
    </Suspense>
  );
}
