import EstimateBuilder from "../EstimateBuilder";

export default async function EditEstimatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EstimateBuilder id={id} />;
}
