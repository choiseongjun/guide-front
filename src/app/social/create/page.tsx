import CreateSocialClient from "./CreateSocialClient";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CreateSocialPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <CreateSocialClient params={resolvedParams} />;
}
