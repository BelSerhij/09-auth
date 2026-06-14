'use client';

import { useMemo, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

import NoteList from '@/components/NoteList/NoteList';
// import NoteForm from '@/components/NoteForm/NoteForm';
// import Modal from '@/components/Modal/Modal';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { fetchNotes } from '@/lib/api/clientApi';
import type { NoteTag } from '@/types/note';
import css from './NotesPage.module.css';

import Link from 'next/link';

const PER_PAGE = 12;

interface NotesClientProps {
  tag?: NoteTag;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, 500);

  const queryKey = useMemo(
    () => ['notes', page, searchQuery, tag] as const,
    [page, searchQuery, tag],
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: searchQuery,
        tag,
      }),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <main className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onChange={debouncedSetSearch} />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      {isLoading && <p>Loading, please wait...</p>}
      {isError && <p>{error.message || 'Failed to load notes.'}</p>}
      {!isLoading && !isError && notes.length > 0 && <NoteList notes={notes} />}
      {!isLoading && !isError && notes.length === 0 && <p>No notes found.</p>}

      {/* {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )} */}
    </main>
  );
}