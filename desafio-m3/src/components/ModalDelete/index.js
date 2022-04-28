import './style.css';
import polygon from '../../assets/polygon.svg';
import api from '../../service/api'

export default function ModalDelete({ id, loadTransactions, setThisTransactionID }) {

    const handleDeleteTransaction = async () => {
        const token = localStorage.getItem('token')
        try {
            await api.delete(`/transacao/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            loadTransactions();
        } catch (error) {
            alert("Transação não encontrada ");
        }
    }
    return (
        <div>
            <img src={polygon} className='polygon' />
            <div className='modal-delete-container'>
                <p>Apagar item?</p>
                <div>
                    <button
                        className='confirm'
                        onClick={handleDeleteTransaction}
                    >Sim</button>
                    <button
                        className='cancel'
                        onClick={() => setThisTransactionID(0)}
                    >Não</button>
                </div>
            </div>
        </div>

    )
}