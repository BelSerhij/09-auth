import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { fetchNotes } from '@/lib/api/serverApi';
import type { NoteTag } from '@/types/note';
import NotesClient from './Notes.client';
import type { Metadata } from 'next';

const PER_PAGE = 12;

const validTags: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

interface FilteredNotesPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({
  params,
}: FilteredNotesPageProps): Promise<Metadata> {
  const { slug } = await params;

  const selectedTag = slug[0];

  const title =
    selectedTag === 'all'
      ? 'All Notes'
      : `${selectedTag} Notes`;

  const description =
    selectedTag === 'all'
      ? 'List of all notes'
      : `Notes filtered by ${selectedTag}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url:
        selectedTag === 'all'
          ? 'https://notehub.com/notes/filter/all'
          : `https://notehub.com/notes/filter/${selectedTag}`,

      images: [
        {
          url:
            'https://ac.goit.global/fullstack/react/og-meta.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
  };
}


export default async function FilteredNotesPage({
  params,
}: FilteredNotesPageProps) {
  const { slug } = await params;
  const selectedTag = slug[0];

  if (!selectedTag) {
    notFound();
  }

  if (selectedTag !== 'all' && !validTags.includes(selectedTag as NoteTag)) {
    notFound();
  }

  const tag = selectedTag === 'all' ? undefined : (selectedTag as NoteTag);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: PER_PAGE,
        search: '',
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}