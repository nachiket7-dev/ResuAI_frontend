import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Menu, X } from 'lucide-react'
import { logout } from '../app/features/authSlice';
import api from '../configs/api';

const Navbar = () => {
    const {user} = useSelector((state) => state.auth);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)
    const logoutUser = async () => {
        navigate('/')
        setMenuOpen(false)
        try {
            await api.post('/api/users/logout');
        } finally {
            dispatch(logout())
        }
    }
  return (
    <header className='sticky top-0 z-40 border-b border-slate-200/80 bg-[#fbfaf6]/90 backdrop-blur'>
        <nav className='relative flex items-center justify-between max-w-7xl mx-auto px-4 py-3 text-slate-800'>
            <Link to='/'>
                <img src="/logo.svg" alt="ResuAI home" className='h-10 w-auto' />
            </Link>
            <div className='hidden items-center gap-3 text-sm sm:flex'>
                <Link to='/app' className={`flex items-center gap-2 rounded-full px-4 py-2 ${location.pathname.startsWith('/app') ? 'bg-green-100 text-green-800' : 'text-slate-600 hover:bg-white'}`}>
                    <LayoutDashboard className='size-4' /> Studio
                </Link>
                <span className='h-6 w-px bg-slate-200' aria-hidden='true' />
                <p className='text-slate-600'>Hi, <span className='font-semibold text-slate-900'>{user?.name || 'there'}</span></p>
                <button type='button' onClick={logoutUser} className='rounded-full border border-slate-300 bg-white px-5 py-2 font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50 active:scale-95'>Logout</button>
            </div>
            <button type='button' onClick={() => setMenuOpen((open) => !open)} className='rounded-lg p-2 text-slate-600 hover:bg-slate-100 sm:hidden' aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen}>
                {menuOpen ? <X className='size-5' /> : <Menu className='size-5' />}
            </button>
            {menuOpen && <div className='absolute left-4 right-4 top-[calc(100%+0.5rem)] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl sm:hidden'>
                <Link to='/app' onClick={() => setMenuOpen(false)} className='flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50'><LayoutDashboard className='size-4' /> Dashboard</Link>
                <div className='my-2 h-px bg-slate-100' />
                <p className='px-3 py-2 text-sm text-slate-500'>Signed in as <span className='font-semibold text-slate-800'>{user?.name || 'there'}</span></p>
                <button type='button' onClick={logoutUser} className='mt-1 w-full rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50'>Logout</button>
            </div>}
        </nav>
    </header>
  )
}

export default Navbar
