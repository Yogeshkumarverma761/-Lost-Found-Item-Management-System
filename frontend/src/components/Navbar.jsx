import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Package, Search, PlusCircle } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo">LostFound</Link>
            <div className="nav-links">
                {user ? (
                    <>
                        <Link to="/dashboard" className="nav-link"><Package size={20} /> Dashboard</Link>
                        <button onClick={logout} className="nav-link btn-logout" style={{ background: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <LogOut size={20} /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
