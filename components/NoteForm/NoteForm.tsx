'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import * as Yup from 'yup';

import css from './NoteForm.module.css';

import { createNote } from '../../lib/api';
import type { NoteTag } from '../../types/note';

import { useNoteDraftStore } from '../../lib/store/noteStore';

const NoteSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Занадто короткий заголовок!')
    .max(50, 'Занадто довгий заголовок!')
    .required("Це поле обов'язкове"),

  content: Yup.string()
    .max(500, 'Опис занадто довгий'),

  tag: Yup.string()
    .oneOf([
      'Todo',
      'Work',
      'Personal',
      'Meeting',
      'Shopping',
    ])
    .required('Виберіть тег'),
});

type Errors = {
  title?: string;
  content?: string;
  tag?: string;
};

export default function NoteForm() {
  const router = useRouter();

  const { draft, setDraft, clearDraft } = useNoteDraftStore();

    const handleChange = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,) => {
        setDraft({
        ...draft,
        [event.target.name]: event.target.value,
        });
      };

  const queryClient = useQueryClient();

  const [errors, setErrors] = useState<Errors>({});

  const mutation = useMutation({
    mutationFn: ({
      title,
      content,
      tag,
    }: {
      title: string;
      content: string;
      tag: NoteTag;
    }) => createNote(title, content, tag),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      });
      clearDraft();
      router.push('/notes');
    },
  });

  async function handleSubmit(formData: FormData) {
    const values = {
      title: String(formData.get('title') || ''),
      content: String(formData.get('content') || ''),
      tag: String(formData.get('tag') || '') as NoteTag,
    };

    try {
      await NoteSchema.validate(values, {
        abortEarly: false,
      });

      setErrors({});

      mutation.mutate(values);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const newErrors: Errors = {};

        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path as keyof Errors] = err.message;
          }
        });

        setErrors(newErrors);
      }
    }
  }

  return (
    <form
      className={css.form}
      action={handleSubmit}
    >
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>

        <input
          id="title"
          name="title"
          className={`${css.input} ${
            errors.title ? css.inputError : ''
            }`}
          defaultValue={draft?.title}
          onChange={handleChange}
        />

        {errors.title && (
          <span className={css.error}>
            {errors.title}
          </span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>

        <textarea
          id="content"
          name="content"
          rows={8}
          className={`${css.textarea} ${
            errors.content ? css.inputError : ''
            }`}
          defaultValue={draft?.content}
          onChange={handleChange}
        />

        {errors.content && (
          <span className={css.error}>
            {errors.content}
          </span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>

        <select
          id="tag"
          name="tag"
          className={`${css.select} ${
            errors.tag ? css.inputError : ''
          }`}
          defaultValue={draft?.tag || 'Todo'}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>

        {errors.tag && (
          <span className={css.error}>
            {errors.tag}
          </span>
        )}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending
            ? 'Creating...'
            : 'Create note'}
        </button>
      </div>
    </form>
  );
}