import './style.css';
import closeBtn from '../../assets/close.svg';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../service/api';

export default function ModalEditProfile({ setShowModalEditProfile }) {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const [error, setError] = useState({ message: '' });

    useEffect(() => {
        handleGetUser();
    }, [])

    const handleGetUser = async () => {
        try {
            const response = await api.get(`/usuario`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const { nome, email } = response.data;

            setName(nome);
            setEmail(email);

        } catch (error) {
            setError({ message: error.response.data.message });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !name || !password || !checkPassword) {
            setError({ message: 'Todos os campos são obrigatórios.' });
            return;
        }
        if (password !== checkPassword) {
            setError({ message: 'As senhas estão diferentes.' });
            return;
        }
        try {
            await api.put('/usuario', {
                "nome": name, "email": email, "senha": password
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            localStorage.setItem('name', name);
            setShowModalEditProfile(false);
        } catch (error) {
            setError({ message: error.response.data.message })
        }

    }

    return (
        <div className='background-modal' >
            <form onSubmit={handleSubmit}>
                <div className='modal-add' >
                    <div className='modal-title'>
                        <h1>Editar Perfil</h1>
                        <img className='btn-close' alt='close' src={closeBtn} onClick={() => setShowModalEditProfile(false)} />
                    </div>
                    <label htmlFor='name'>Nome</label>
                    <input
                        id='name'
                        name='name'
                        type='text'
                        value={name}
                        required
                        onChange={(e) => setName(e.target.value)}
                    />
                    <label htmlFor='email'>Email</label>
                    <input
                        id='email'
                        name='email'
                        type='email'
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor='password'>Senha</label>
                    <input
                        id='password'
                        name='password'
                        type='password'
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor='checkPassword'>Confirmação de senha</label>
                    <input
                        id='checkPassword'
                        name='checkPassword'
                        type='password'
                        value={checkPassword}
                        required
                        onChange={(e) => setCheckPassword(e.target.value)}
                    />
                    {error && <p className='error-message'>{error.message}</p>}
                    <button className='btn-confirm'>Confirmar</button>
                </div>
            </form>
        </div>
    )
}