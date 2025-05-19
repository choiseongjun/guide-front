import TripDetailClient from './TripDetailClient';

export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <TripDetailClient params={resolvedParams} />;
} 