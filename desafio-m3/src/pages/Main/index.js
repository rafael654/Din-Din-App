import './style.css';
import { useEffect, useState } from 'react';
import api from '../../service/api';

import ModalEditProfile from '../../components/ModalEditProfile';
import ModalEdit from '../../components/ModalEdit';
import ModalAdd from '../../components/ModalAdd';
import ModalDelete from '../../components/ModalDelete';
import Navbar from '../../components/Navbar';
import Resumo from '../../components/Resumo';

import edit from '../../assets/edit.svg';
import trash from '../../assets/trash.svg';
import filter from '../../assets/filter.svg';
import arrow from '../../assets/arrow.svg'

import { useNavigate } from 'react-router-dom';


export default function Main() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const [showModalAdd, setShowModalAdd] = useState(false);

    const [showModalEdit, setShowModalEdit] = useState();
    const [currentEdit, setCurrentEdit] = useState();

    const [showModalEditProfile, setShowModalEditProfile] = useState(false);

    const [transactions, setTransactions] = useState([]);
    const [category, setCategory] = useState();


    const [thisTransactionID, setThisTransactionID] = useState(0);
    const [allCredit, setAllCredit] = useState([]);
    const [allDebit, setAllDebit] = useState([]);

    const [order, setOrder] = useState('dec');

    const [error, setError] = useState({ message: '' });

    const [showFilter, setShowFilter] = useState(false);

    const [arrayFilter, setArrayFilter] = useState([]);

    const loadTransactions = async () => {
        try {
            const response = await api.get('/transacao', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTransactions(response.data);

        } catch (error) {

        }
    }
    const handleGetCategories = async () => {
        try {
            const response = await api.get('/categoria', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setCategory(response.data);
        } catch (error) {

        }
    }
    const updateResumo = () => {
        const spreadTransactions = [...transactions]
        const credit = spreadTransactions.filter((item) => {
            return item.tipo === 'entrada'
        })
        const debit = spreadTransactions.filter((item) => {
            return item.tipo === 'saida'
        })
        setAllCredit(credit.reduce((total, item) => {
            return total + item.valor / 100
        }, 0))
        setAllDebit(debit.reduce((total, item) => {
            return total + item.valor / 100
        }, 0))
    }
    const getThisDay = (date) => {
        const dateCopy = date.split("/").reverse().join("/");
        const weekDay = new Date(dateCopy);
        const index = weekDay.getDay();
        const daysWeek = { 1: "Segunda", 2: "Terça", 3: "Quarta", 4: "Quinta", 5: "Sexta", 6: "Sabado", 7: "Domingo" };

        return daysWeek[index];
    }
    const handleOrderByDate = () => {
        const copyTransactions = [...transactions];
        if (order === 'dec') {
            const orderDecr = copyTransactions.sort((a, b) => {
                const aDate = (a.data).slice(0, 10).split('-').reverse().join('/');
                const dateACopy = aDate.split("/").reverse().join("/");
                const newADate = new Date(dateACopy);
                const bDate = (b.data).slice(0, 10).split('-').reverse().join('/');
                const dateBCopy = bDate.split("/").reverse().join("/");
                const newBDate = new Date(dateBCopy);
                return newADate.getTime() - newBDate.getTime();
            })
            setTransactions(orderDecr);
            setOrder('asc');
        } else {
            const orderAsc = copyTransactions.sort((a, b) => {
                const aDate = (a.data).slice(0, 10).split('-').reverse().join('/');
                const dateACopy = aDate.split("/").reverse().join("/");
                const newADate = new Date(dateACopy);
                const bDate = (b.data).slice(0, 10).split('-').reverse().join('/');
                const dateBCopy = bDate.split("/").reverse().join("/");
                const newBDate = new Date(dateBCopy);
                return newBDate.getTime() - newADate.getTime();
            })
            setTransactions(orderAsc);
            setOrder('dec');
        }
    }
    const handleAddFilter = (e) => {
        const copyFilter = [...arrayFilter];
        const value = e.target.value;
        if (copyFilter.includes(value)) {
            const filterArray = copyFilter.filter((item) => {
                return item !== value
            });
            setArrayFilter(filterArray)
            return;
        }
        copyFilter.push(value);
        setArrayFilter(copyFilter);
    }
    const handleSubmitFilter = async () => {

        try {
            const response = await api.get(`/transacao?:filtro=${arrayFilter}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const arrayEmp = [];
            let notFound = false;
            for (let item of response.data) {
                for (let i = 0; i < arrayFilter.length; i++) {
                    if (item.categoria_nome === arrayFilter[i]) {
                        arrayEmp.push(item);
                    } else {
                        notFound = true;
                    }
                }
            }
            if (arrayEmp.length !== 0) {
                setTransactions(arrayEmp)
            } else {
                if (notFound) {
                    setError({ message: "Nenhum resultado encontrado." });
                    setTimeout(() => setError(false), 3000);
                    return
                }
                setError({ message: "Nenhum filtro está selecionado." });
                setTimeout(() => setError(false), 3000);
                return
            }
        } catch (error) {
            setError({ message: error.response.data.mensagem })
            setTimeout(() => setError(false), 3000)
        }
    }
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/')
        }
        loadTransactions();
    }, [setShowModalAdd, setShowModalEdit, setShowModalEditProfile, setThisTransactionID])
    useEffect(() => {
        handleGetCategories();
    }, [])
    useEffect(() => {
        updateResumo();
    }, [loadTransactions])

    return (
        <div className='container-master'>
            <Navbar setShowModalEditProfile={setShowModalEditProfile} />
            <div className='container-page'>
                <section className='container-main'>
                    <button
                        className='btn-filtrar'
                        onClick={() => setShowFilter(!showFilter)}
                    ><img src={filter} alt='filter' >
                        </img>Filtrar</button>
                    {showFilter &&
                        <div className='filter-container'>
                            <h1 >Categoria</h1>
                            <div className='container-elem'>
                                {category.map((elem) => {
                                    return <button
                                        type='button'
                                        key={elem.id}
                                        className={arrayFilter.includes(elem.nome) ? "btn-filter btn-select" : "btn-filter"}
                                        value={elem.nome}
                                        onClick={(e) => handleAddFilter(e)}
                                    >{elem.nome} &ensp;+</button>
                                })}

                            </div>
                            {error && <p className='error-message'>{error.message}</p>}
                            <div className='container-btn-control'>
                                <button
                                    className='btn-control-filtro white'
                                    onClick={() => setArrayFilter([]) & loadTransactions()}
                                >Limpar filtros
                                </button>
                                <button
                                    className='btn-control-filtro purple'
                                    onClick={() => handleSubmitFilter()}
                                >Aplicar filtros
                                </button>
                            </div>
                        </div>
                    }
                    <div className='container-table'>
                        <h1 className='header-table' onClick={() => handleOrderByDate()}>
                            Data
                            &ensp;
                            <img src={arrow} alt='arrow' className={order === 'dec' ? 'dec' : 'asc'} />
                        </h1>
                        <h1 className='header-table'>Dia da semana</h1>
                        <h1 className='header-table'>Descrição</h1>
                        <h1 className='header-table'>Categoria</h1>
                        <h1 className='header-table'>Valor</h1>
                    </div>
                    <div className='table'>
                        {transactions.map((item) => {
                            return (
                                <div key={item.id} className='item'>
                                    <h1>{(item.data).slice(0, 10).split('-').reverse().join('/')}</h1>
                                    <p className='day'>{getThisDay(item.data)}</p>
                                    <p className='description'>{item.descricao}</p>
                                    <p className='category'>{item.categoria_nome}</p>
                                    <h2 className={item.tipo === 'saida' ? 'debit' : 'credit'}
                                    >   {(item.valor / 100).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h2>
                                    <img
                                        src={edit}
                                        alt='edit'
                                        onClick={() => setShowModalEdit(true) & setCurrentEdit(item.id)}
                                    />
                                    <img
                                        src={trash}
                                        alt='trash'
                                        onClick={() => { setThisTransactionID(item.id) }}
                                    />
                                    {(thisTransactionID === item.id) &&
                                        < ModalDelete id={item.id}
                                            loadTransactions={loadTransactions}
                                            setThisTransactionID={setThisTransactionID}
                                        />
                                    }
                                </div>
                            )
                        })}
                    </div>
                </section>
                <section className='section-resumo'>
                    <Resumo allCredit={allCredit} allDebit={allDebit} />
                    <button
                        className='btn-add'
                        onClick={() => setShowModalAdd(true) & setThisTransactionID(0)}
                    >Adicionar registro
                    </button>
                </section>
            </div>
            {showModalAdd &&
                <ModalAdd
                    setShowModalAdd={setShowModalAdd}
                    loadTransactions={loadTransactions}
                    updateResumo={updateResumo}
                />}

            {showModalEdit &&
                <ModalEdit
                    id={currentEdit}
                    setCurrentEdit={setCurrentEdit}
                    setShowModalEdit={setShowModalEdit}
                    loadTransactions={loadTransactions}
                    updateResumo={updateResumo}
                />}
            {
                showModalEditProfile && <ModalEditProfile setShowModalEditProfile={setShowModalEditProfile} />
            }
        </div>
    )
}