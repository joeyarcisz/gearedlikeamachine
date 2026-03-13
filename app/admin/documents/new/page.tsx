import DocumentCreator from "@/components/documents/DocumentCreator";

export const metadata = {
  title: "New Document | GLM Admin",
};

export default function NewDocumentPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-steel uppercase tracking-wider">
          New Document
        </h1>
        <p className="text-chrome text-sm mt-1">
          Select a template and fill in the details
        </p>
      </div>
      <DocumentCreator />
    </div>
  );
}
