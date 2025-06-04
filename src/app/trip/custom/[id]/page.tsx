import CustomPlanDetailClient from "./CustomPlanDetailClient";

export default function CustomPlanDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <CustomPlanDetailClient params={params} />;
} 