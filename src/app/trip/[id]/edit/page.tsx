import EditTripClient from "./components/EditTripClient";

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function EditTripPage({ params, searchParams }: Props) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams]);
  return <EditTripClient tripId={resolvedParams.id} />;
} 