import ChatDetailClient from "./ChatDetailClient";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ChatDetailPage({ params }: Props) {
  const resolvedParams = await params;
  return <ChatDetailClient params={resolvedParams} />;
} 