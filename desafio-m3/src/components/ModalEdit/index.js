import './style.css';
import closeBtn from '../../assets/close.svg';
import { useEffect, useState } from 'react';
import api from '../../service/api';

export default function ModalEdit({ id, setShowModalEdit, loadTransactions, updateResumo }) {

    const token = localStorage.getItem('token');
    const [thisValue, setThisValue] = useState('');
    const [descript, setDescript] = useState('');
    const [category, setCategory] = useState([]);
    const [idCategory, setIdCategory] = useState(1)

    const [date, setDate] = useState('');
    const [type, setType] = useState('saida');

    const [error, setError] = useState({ message: '' });

    useEffect(() => {
        handleGetCategory();
        handleGetTransaction();
    }, [])

    const handleClear = () => {
        return (
            setThisValue(''),
            setDescript(''),
            setDate(''),
            setIdCategory(1),
            setType('saida')
        )
    }

    const handleGetTransaction = async () => {
        try {
            const response = await api.get(`/transacao/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const { valor, data, categoria_id, tipo, descricao } = response.data;


            setThisValue(valor / 100)
            setDescript(descricao)
            setDate(data.slice(0, 10).split('-').reverse().join('/'))
            setIdCategory(categoria_id)
            setType(tipo)

        } catch (err) {
            setError({ message: err.response.data.message })
        }
    }
    const handleGetCategory = async () => {

        try {
            const response = await api.get('/categoria', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setCategory(response.data);
        } catch (err) {
            setError({ message: err.response.data.message })
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!thisValue || !category || !date || !descript || !type) {
            setError({ message: 'Todos os campos são obrigatórios.' })
            setTimeout(() => setError(false), 3000);
            return;
        }
        if (Number(thisValue) < 0) {
            setError({ message: 'Insira um valor válido.' })
            setTimeout(() => setError(false), 3000);
            return;
        }
        if (date.trim().length !== 10) {
            setError({ message: 'A data inserida é inválida. Digite novamente Dia/Mes/Ano' })
            setTimeout(() => setError(false), 3000);
        }
        const formatDate = date.split("/").reverse().join("/").trim();
        const newDate = new Date(formatDate);

        try {
            await api.put(`/transacao/${id}`, {
                "descricao": descript,
                "valor": thisValue * 100,
                "data": newDate,
                "categoria_id": idCategory,
                "tipo": type
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            loadTransactions();
            updateResumo();
            handleClear();
            setShowModalEdit(false);
        } catch (err) {
            setError({ message: err.response.data.mensagem })
        }
    }

    return (
        <div className='background-modal' >
            <form onSubmit={handleSubmit}>
                <div className='modal-add' >
                    <div className='modal-title'>
                        <h1>Editar registro</h1>
                        <img className='btn-close' src={closeBtn} alt='close' onClick={() => setShowModalEdit(false)} />
                    </div>
                    <div>
                        <button type='button' className={type === 'entrada' ? 'entrada' : 'off-btn'} onClick={() => setType('entrada')}>Entrada</button>
                        <button type='button' className={type === 'saida' ? 'saida' : 'off-btn'} onClick={() => setType('saida')}>Saída</button>
                    </div>
                    <label htmlFor='category'>Valor</label>
                    <input
                        placeholder='Digite o valor em REAIS:'
                        name='thisValue'
                        type='text'
                        value={thisValue}
                        required
                        onChange={(e) => setThisValue(e.target.value)}
                    />
                    <label htmlFor='category'>Categoria</label>
                    <select name='category' value={idCategory} id='category' onChange={(e) => setIdCategory(e.target.value)}>
                        {category.map((item) => {
                            return <option key={item.id} value={item.id}>{item.nome}</option>
                        })}
                    </select>
                    <label htmlFor='date'>Data</label>
                    <input
                        id='date'
                        name='date'
                        type='text'
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <label htmlFor='description'>Descrição</label>
                    <input
                        id='description'
                        name='description'
                        type='text'
                        value={descript}
                        onChange={(e) => setDescript(e.target.value)}
                    />
                    {error && <p className='error-message'>{error.message}</p>}
                    <button className='btn-confirm'>Confirmar</button>
                </div>
            </form>
        </div>
    )
}
