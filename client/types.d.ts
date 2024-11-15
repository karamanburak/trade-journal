// Auth
interface IUser {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface IAuthState {
  currentUser: IUser | null;
  loading: boolean;
  error: boolean;
  token: null;
}
