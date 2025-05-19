import ThemePageClient from './ThemePageClient';

export default async function ThemePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ThemePageClient params={resolvedParams} />;
} 