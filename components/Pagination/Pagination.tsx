'use client';

import * as ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";
import css from "./Pagination.module.css";

type PaginateModule = {
  default?: ComponentType<ReactPaginateProps>;
};

const ReactPaginate = 
  (ReactPaginateModule as PaginateModule).default || 
  (ReactPaginateModule as unknown as ComponentType<ReactPaginateProps>);

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (nextPage: number) => void;
}

export default function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      forcePage={currentPage - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      disabledClassName={css.disabled} 
      nextLabel="→"
      previousLabel="←"
    />
  );
}
