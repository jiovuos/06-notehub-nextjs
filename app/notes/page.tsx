import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes, type FetchNotesResponse } from "@/lib/api";
import NotesClient from "./Notes.client";

export default async function NotesPage() {
  const page = 1;
  const search = "";

  const queryClient = new QueryClient();

  const initialNotes: FetchNotesResponse = await fetchNotes({
    page,
    perPage: 8,
    search,
  });

  await queryClient.prefetchQuery({
    queryKey: ["notes", page, search],
    queryFn: () => Promise.resolve(initialNotes),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        initialPage={page}
        initialSearch={search}
        initialNotes={initialNotes}
      />
    </HydrationBoundary>
  );
}
