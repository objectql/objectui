import StudioClient from '@/components/StudioClient';

export default async function StudioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StudioClient id={id} />;
}
