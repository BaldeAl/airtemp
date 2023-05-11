import '@/styles/globals.css'
import { ThemeProvider } from '../components/ThemeProvider'

function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      
        
        <Component {...pageProps} />
      
    
    </ThemeProvider>
  )
}

export default App;
