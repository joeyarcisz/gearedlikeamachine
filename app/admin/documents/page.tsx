import DocumentDashboard from "@/components/documents/DocumentDashboard";

export const metadata = {
  title: "Documents | GLM Admin",
};

export default function DocumentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-steel uppercase tracking-wider">
          Documents
        </h1>
        <p className="text-chrome text-sm mt-1">
          Create, send, and manage all production documents
        </p>
      </div>
      <DocumentDashboard />
    </div>
  );
}
