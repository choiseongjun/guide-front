import TripDetailClient from './TripDetailClient';

export default function TripDetailPage({ params }: { params: { id: string } }) {
  return <TripDetailClient params={params} />;
} 