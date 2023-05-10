import '@/styles/globals.css'
import { ThemeProvider } from '../components/ThemeProvider'
import Layout from '../components/Layout';

function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      
        <Component {...pageProps} />
      
    
    </ThemeProvider>
  )
}

export default App;
