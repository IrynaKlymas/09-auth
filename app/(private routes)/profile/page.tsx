import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUserServer } from "@/lib/api/serverApi";
import css from "./ProfilePage.module.css";

export async function generateMetadata(): Promise<Metadata> {
    try {
        const user = await getCurrentUserServer();
        return {
            title: `${user.username}'s Profile | NoteHub`,
            description: `View and manage ${user.username}'s profile on NoteHub.`,
        };
    } catch (error) {
        return {
            title: "Profile | NoteHub",
            description: "View and manage your user profile on NoteHub.",
        };
    }
}

export default async function ProfilePage() {
    let user;
    try {
        user = await getCurrentUserServer();
    } catch (error) {
        redirect("/sign-in");
    }

    return (
        <main className={css.mainContent}>
            <div className={css.profileCard}>
                <div className={css.header}>
                    <h1 className={css.formTitle}>Profile Page</h1>
                    <Link
                        href="/profile/edit"
                        className={css.editProfileButton}
                    >
                        Edit Profile
                    </Link>
                </div>
                <div className={css.avatarWrapper}>
                    <Image
                        src={user.avatar || "/default-avatar.png"}
                        alt="User Avatar"
                        width={120}
                        height={120}
                        className={css.avatar}
                        priority
                    />
                </div>
                <div className={css.profileInfo}>
                    <p>
                        <strong>Username:</strong> {user.username}
                    </p>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                </div>
            </div>
        </main>
    );
}