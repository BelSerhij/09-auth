'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNoteById, deleteNote } from '@/lib/api/clientApi';
import css from './NoteDetails.module.css';

export default function NoteDetailsClient() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params?.id as string;

  // Отримання даних нотатки
  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
    refetchOnMount: false,
  });

  // Мутація для видалення нотатки
  const deleteMutation = useMutation({
    mutationFn: () => deleteNote(id),
    onSuccess: () => {
      // Очищаємо кеш списку нотаток, щоб при поверненні дані оновилися
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      // Перенаправляємо користувача на головну сторінку нотаток
      router.push('/notes');
    },
    onError: (error) => {
      alert(`Failed to delete the note: ${error.message}`);
    }
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) return <p className={css.loading}>Loading, please wait...</p>;
  if (isError || !note) return <p className={css.error}>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
          <button 
            className={css.button} 
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
        {note.tag && <p className={css.tag}>{note.tag}</p>}
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>Created date: {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'No date'}</p>
      </div>
    </div>
  );
}

