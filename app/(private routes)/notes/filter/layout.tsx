import css from './LayoutNotes.module.css';

type NotesProps = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
};

export default function NotesLayout ({ children, sidebar }: NotesProps) {
  return (
    <main className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <section className={css.notesWrapper}>{children}</section>
    </main>
  );
};

