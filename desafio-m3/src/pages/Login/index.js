import './style.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.svg';
import api from '../../service/api'

export default function Login() {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({ message: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            navigate('/main');
        }

    }, []);


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!email || !password) {
            setError({ message: 'Todos os campos são obrigatórios.' })
        }
        try {
            const response = await api.post('/login', {
                "email": email,
                "senha": password
            })

            const { token, usuario } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('id', usuario.id);
            localStorage.setItem('name', usuario.nome)

            navigate('/main');
        } catch (err) {
            setError({ message: err.response.data.mensagem })
            setTimeout(() => setError(false), 3000)
        }
    }

    return (
        <div className="container">
            <div className='logo' >
                <img src={logo} alt='logo' />
            </div>
            <main className='main-container'>
                <section className='main-info' >
                    <h1>Controle suas <span>finanças</span>, sem planilha chata.</h1>
                    <p>Organizar as suas finanças nunca foi tão fácil, com o DINDIN, você tem tudo num único lugar e em um clique de distância.</p>
                    <button onClick={() => navigate('/signup')}>Cadastre-se</button>
                </section>
                <section className='main-form'>
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>E-mail</label>
                            <input
                                id='email'
                                type='email'
                                name='email'
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Senha</label>
                            <input
                                id='password'
                                type='password'
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <p className='error-message'>{error.message}</p>}
                        <button >Entrar</button>
                    </form>
                </section>
            </main>
        </div >
    )
}