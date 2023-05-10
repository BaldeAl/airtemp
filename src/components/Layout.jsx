import Navbar from './navbar/Navbar';

const Layout = ({ children }) => {
    return (
        <div className='dark'>
            <Navbar />
            <main className="antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">{children}</main>
        </div>
    );
};

export default Layout;
