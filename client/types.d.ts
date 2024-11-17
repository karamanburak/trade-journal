// Auth
interface IMyRegisterFormValues {
  username: string
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  _id?: string
}

interface IAuthState {
  currentUser: IMyRegisterFormValues | null
  loading: boolean
  error: boolean
  token: null
}

interface IMyLoginFormValues {
  email: string
  password: string
}

interface IFormikHelpers {
  setSubmitting: (isSubmitting: boolean) => void
}

// Terms
interface ITermsModal {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}
