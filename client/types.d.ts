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

interface ICurrentUserValues {
  _id: string
  username: string
  firstName: string
  lastName: string
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

// Fetch Data

interface ITrade {
  _id: string
  symbol: string
  transactionType: string
  quantity: number
  price: number
  status: string
  profitOrLoss: number
  tradeDuration: number
  entryPrice: number
  exitPrice: number
  transactionDate: Date
}

interface IStock {
  _id: string
  symbol: string
  name: string
  type: string
  exchange: string
  lastPrice: number
  marketCap: number
}

interface IAccount {
  _id: string
  userId: string
  totalValue: number
  completedTransactions: number
  winRate: number
  profitFactor: number
  avarageProfit: number
  avarageLoss: number
  avarageHoldDuration: number
}
