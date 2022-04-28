import './style.css';

export default function Resumo({ allCredit, allDebit }) {
    return (
        <div>
            <div className='container-resumo'>
                <h1>Resumo</h1>
                <div className='d-flex'>
                    <h2>Entradas</h2>
                    <h3 className='credit'>{(allCredit).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h3>
                </div>
                <div className='d-flex'>
                    <h2>Saída</h2>
                    <h3 className='debit'>{(allDebit).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h3>
                </div>
                <div className='line' />
                <div className='d-flex'>
                    <h4 >Saldo</h4>
                    <h3 className='balance'>{(allCredit - allDebit).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h3>
                </div>
            </div>
        </div>
    )
}