import '@/styles/globals.css'
import { ThemeProvider } from '../components/ThemeProvider'
import ErrorBoundary from '../components/error/ErrorBoundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <ErrorBoundary> 
        <Component {...pageProps} />
        <ToastContainer 
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          toastClassName="font-sans font-bold rounded-2xl shadow-cartoon border-2 border-transparent"
        />
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App;
