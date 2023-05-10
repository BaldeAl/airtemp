import '@/styles/globals.css'
import { ThemeProvider } from '../components/ThemeProvider'
import { UserProvider } from '../components/context/UserContext'

function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ThemeProvider>
  )
}

export default App;
