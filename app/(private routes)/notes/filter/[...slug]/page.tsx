import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from "@tanstack/react-query";
import { fetchNotesServer } from "@/lib/api/serverApi";
import NotesClient from "./Notes.client";
import type { Metadata } from "next";

interface NotesPageProps {
    params: Promise<{ slug?: string[] }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
    const { slug } = await params; 
    const rawTag = slug?.[0];
    const tag = rawTag && rawTag !== "All" ? rawTag : "All";

    const title = `Notes – ${tag} | NoteHub`;
    const description =
        tag === "All"
            ? "Browse all your NoteHub notes."
            : `Browse your NoteHub notes filtered by tag: ${tag}.`;

    const url = `${siteUrl}/notes/filter/${tag}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url,
            images: ["/notehub-og-meta.webp"],
            type: "website",
        },
    };
}

export default async function NotesFilterPage({ params }: NotesPageProps) {
    const queryClient = new QueryClient();

    const resolvedParams = await params; 
    const tag =
        resolvedParams.slug?.[0] && resolvedParams.slug[0] !== "All"
            ? resolvedParams.slug[0]
            : "";

    await queryClient.prefetchQuery({
        queryKey: ["notes", 1, "", tag],
        queryFn: () => fetchNotesServer({ page: 1, query: "", tag }),
    });

    const initialNotes = await fetchNotesServer({ page: 1, query: "", tag });
    queryClient.setQueryData(["notes", 1, "", tag], initialNotes);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotesClient tag={tag} />
        </HydrationBoundary>
    );
}