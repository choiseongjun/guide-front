import ReviewListClient from "./ReviewListClient";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ReviewListPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <ReviewListClient params={resolvedParams} />;
}
