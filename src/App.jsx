import CurrencyConverter from "./components/CurrencyConverter.jsx";

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Обмін валют</h1>
        <p>Ваш провідний сервіс по обміну валют</p>
      </header>
        <main>
            <CurrencyConverter/>
        </main>
        <footer style={{marginTop:'40px', textAlign:'center', color:'var(--text)', fontSize:'14px'}}>
            <p>&copy; 2006 All data: <a href="https://frankfurter.dev/" target={"_blank"} rel="noreferrer">Frankfurter</a></p>
        </footer>
    </div>
  )
}

export default App
