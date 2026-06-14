import css from './CreateNote.module.css';
import NoteForm from '@/components/NoteForm/NoteForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Note',
    description: 'Create a new note',
  openGraph: {
      title: `Create Note`,
      description: 'Create a new note',
      url: 'https://notehub.com/notes/action/create',
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `Create Note`,
        },
      ],
      type: 'website',
    },
  };

export default async function CreateNotePage() {
  return (
<main className={css.main}>
  <div className={css.container}>
    <h1 className={css.title}>Create note</h1>
    <NoteForm />
  </div>
</main>
  );
}
