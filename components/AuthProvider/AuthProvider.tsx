"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { getCurrentUser, checkSession } from "@/lib/api/clientApi";

const privateRoutes = ["/notes", "/profile"];

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { setUser, clearAuthState } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const isPrivateRoute = privateRoutes.some((route) =>
                pathname.startsWith(route)
            );

            if (isPrivateRoute) {
                try {
                    const session = await checkSession();
                    if (!session.success) {
                        throw new Error("Session expired or invalid");
                    }

                    const user = await getCurrentUser();
                    setUser(user);
                } catch (error) {
                    clearAuthState();
                    router.replace("/sign-in");
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, [pathname, router, setUser, clearAuthState]);

    if (
        isLoading &&
        privateRoutes.some((route) => pathname.startsWith(route))
    ) {
        return <p>Loading, please wait...</p>;
    }

    return <>{children}</>;
};

export default AuthProvider;