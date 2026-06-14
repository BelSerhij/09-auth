import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';
import { fetchNoteById } from '@/lib/api/serverApi';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const note = await fetchNoteById(id)
  return {
    title: `Note: ${note.title}`,
    description: note.content.slice(0, 30) || 'Note details',
        openGraph: {
      title: `Note: ${note.title}`,
      description: note.content.slice(0, 100),
      url: `https://07-routing-nextjs-woad-omega.vercel.app/notes/${id}`,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/og-meta.jpg',
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
      type: 'article',
    },
  }
}

export default async function NoteDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5000,
      },
    },
  });
  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
