import TravelPlanResultClient from "./TravelPlanResultClient";

export default function TravelPlanResultPage({
  params,
}: {
  params: { id: string };
}) {
  return <TravelPlanResultClient params={params} />;
} 