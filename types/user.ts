export interface User {
    username: string;
    email: string;
    avatar: string;
}

export type UserCredentials = Pick<User, "email"> & { password?: string };

export type UserProfileUpdate = Partial<Pick<User, "username">>;