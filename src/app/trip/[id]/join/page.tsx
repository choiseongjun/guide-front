import JoinTripClient from "./JoinTripClient";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function JoinTripPage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  return (
    <JoinTripClient
      params={resolvedParams}
      searchParams={resolvedSearchParams}
    />
  );
}
