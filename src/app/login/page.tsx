import LoginClient from "./LoginClient";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  };

export default async function LoginPage({ params }: Props) {
    const resolvedParams = await params;

  return <LoginClient  params={resolvedParams}/>;
} 