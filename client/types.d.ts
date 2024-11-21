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
  token: string | null
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
  _id?: string
  userId: string | undefined
  stockId: IStock | string
  symbol: string
  transactionType: "BUY" | "SELL"
  quantity: number
  price?: number
  status: string
  profitOrLoss: number
  tradeDuration: number
  entryPrice?: number
  exitPrice: number
  transactionDate: Date
  createdAt?: Date
  updatedAt?: Date
}

interface ITradeState {
  trades: ITrade[]
  stocks: IStock[]
  singleTrade: ITrade | null
  singleStock: IStock | null
  loading: boolean
  error: boolean
}

interface IStock {
  _id: string
  symbol: string
  name: string
  type?: string
  exchange?: string
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
  createdAt?: Date
  updatedAt?: Date
}

interface ITradePayload {
  userId: string | undefined
  stockId: string
  symbol: string
  price: number
  transactionType: "BUY" | "SELL"
  quantity: number
  status: string
  profitOrLoss: number
  tradeDuration: number
  entryPrice: number
  exitPrice: number
  transactionDate: Date
}
