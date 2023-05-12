import '@/styles/globals.css'
import { ThemeProvider } from '../components/ThemeProvider'
import ErrorBoundary from '../components/error/ErrorBoundary';

function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <ErrorBoundary> 
        <Component {...pageProps} />
      </ErrorBoundary>
    
    </ThemeProvider>
  )
}

export default App;
