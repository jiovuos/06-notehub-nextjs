"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import NoteForm from "@/components/NoteForm/NoteForm";
import Modal from "@/components/Modal/Modal";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import css from "./NotesPage.module.css";

export default function NotesClient() {
  const searchParams = useSearchParams();
  const defaultSearch =
    typeof window === "undefined" ? "" : searchParams.get("search") || "";
  const [search, setSearch] = useState(defaultSearch);

  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page, search, perPage: 8 }),
  });

  const totalPages = data?.totalPages ?? 1;
  const notes = data?.data ?? [];

  const handleSearch = (query: string) => {
    setPage(1);
    setSearch(query);
  };

  return (
    <section className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Add note
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading notes: {(error as Error).message}</p>}
      {!isLoading && !error && <NoteList notes={notes} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </section>
  );
}
