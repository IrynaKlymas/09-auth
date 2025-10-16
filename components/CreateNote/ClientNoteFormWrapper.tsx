"use client";

import { useRouter } from "next/navigation";
import NoteForm from "@/components/NoteForm/NoteForm";

export default function ClientNoteFormWrapper() {
    const router = useRouter();
    return <NoteForm onCancel={() => router.back()} />;
}