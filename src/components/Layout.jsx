import Navbar from './navbar/Navbar';
import { ThemeProvider } from './ThemeProvider';

const Layout = ({ children }) => {
    return (
        <>
            <Navbar />
            <main className="antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">{children}</main>
        </>
    );
};

export default Layout;
