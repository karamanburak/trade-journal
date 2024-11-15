import { Provider } from "react-redux"
import { ToastContainer } from "react-toastify"
import { PersistGate } from "redux-persist/integration/react"
import store, { persistor } from "./app/store"
import AppRouter from "./router/AppRouter"

function App() {

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppRouter />
        </PersistGate>
      </Provider>
      <ToastContainer
        autoClose={3000}
        closeOnClick
      />
    </>
  )
}

export default App
