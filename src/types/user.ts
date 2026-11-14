export interface AuthUser {
  username: string;
  isLoggedIn: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface LoginFormValues {
  username: string;
  password: string;
}

export type ProfileForm = Pick<AuthUser, "firstName" | "lastName" | "email" | "phone">;
export type ProfilePatch = Partial<ProfileForm>;

export const GUEST: AuthUser = {
  username: "",
  isLoggedIn: false,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};