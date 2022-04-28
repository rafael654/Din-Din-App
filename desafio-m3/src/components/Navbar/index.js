import './style.css';
import logo from '../../assets/logo.svg';
import profile from '../../assets/profile.svg';
import leave from '../../assets/leave.svg'
import { useNavigate } from 'react-router-dom';

export default function Navbar({ setShowModalEditProfile }) {
    const navigate = useNavigate()
    return (
        <header className='nav'>
            <img src={logo} alt='logo' />
            <div className='profile-container'>
                <img src={profile} className='profile' alt='profile img' onClick={() => setShowModalEditProfile(true)} />
                <p>{localStorage.getItem('name')}</p>
                <img src={leave} alt='leave' className='leave' onClick={() => localStorage.clear() & navigate('/')} />
            </div>
        </header>
    )
}