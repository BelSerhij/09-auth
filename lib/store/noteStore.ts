import { create } from 'zustand';
import { CreateNotePayload } from '../../types/note';
import { persist } from 'zustand/middleware';

type NoteDraftStore = {
  draft: CreateNotePayload;
  setDraft: (note: CreateNotePayload) => void;
  clearDraft: () => void;
};

const initialDraft: CreateNotePayload = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteDraftStore = create<NoteDraftStore>()(
    persist(
        (set) => ({
            draft: initialDraft,
            setDraft: (note) => set(() => ({ draft: note })),
            clearDraft: () => set(() => ({ draft: initialDraft })),
        }),
        {
            name: 'note-draft-storage',
            partialize: (state) => ({ draft: state.draft }),
        },
    ),
);