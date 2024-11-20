import { AxiosError } from "axios"
import toastNotify from "../utils/toastNotify"

export const handleAxiosError = (error: unknown) => {
  if (error instanceof AxiosError && error.response) {
    const message = error.response.data?.message || "An unexpected error occurred"
    toastNotify("error", message)
  } else {
    toastNotify("error", "An unexpected error occurred")
  }
}
