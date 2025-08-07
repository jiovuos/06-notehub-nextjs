import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

// export default async function NoteDetailsPage({
//   params
// }: {
//   params: { id: string };
// }) {

export default async function NoteDetailsPage(
  props: { params: { id: string } }
) {
  const { params } = props;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["note", params.id],
    queryFn: () => fetchNoteById(params.id)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
