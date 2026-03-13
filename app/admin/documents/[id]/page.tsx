import DocumentDetail from "@/components/documents/DocumentDetail";

export const metadata = {
  title: "Document Detail | GLM Admin",
};

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DocumentDetail id={id} />;
}
