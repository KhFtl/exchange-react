import {useState, useEffect} from "react";
import {RefreshCcw, ArrowRightLeft} from "lucide-react";
import ExchangeRateChart from "./ExchangeRateChart.jsx";
import ConversionHistory from "./ConversionHistory.jsx";

const CurrencyConverter = () => {
    const[currencies, setCurrencies] = useState([]);
    const[amount, setAmount] = useState(1);
    const[fromCurrency, setFromCurrency] = useState("USD");
    const[toCurrency, setToCurrency] = useState("EUR");
    const[result, setResult] = useState(null);
    const[rate, setRate]=useState(null);
    const[loading, setLoading] = useState(false);
    const[history, setHistory] = useState([]);

    useEffect(() => {
        const fetchCurrencies = async () => {
            try{
                const response = await fetch('https://api.frankfurter.dev/v1/currencies');
                const data = await response.json();
                setCurrencies(Object.keys(data));
            } catch (error) {
                console.log(error);
            }
        }
        fetchCurrencies();
    },[]);

    useEffect( () => {
        const convert = async () => {
            if(fromCurrency === toCurrency){
                setResult(amount);
                setRate(1);
                return;
            }
            setLoading(true);
            try{
                const response = await fetch(
                    `https://api.frankfurter.dev/v1/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
                );
                const data = await response.json();
                const convertedValue = data.rates[toCurrency];
                setResult(convertedValue);
                setRate(convertedValue / amount);
                setHistory(prev => [
                    {
                        from: fromCurrency,
                        to: toCurrency,
                        amount: amount,
                        result: convertedValue.toFixed(2),
                        rate: (convertedValue / amount).toFixed(4),
                        date: new Date()
                    },
                    ...prev.slice(0, 9)
                ]);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            if(amount > 0) convert();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [amount, fromCurrency, toCurrency]);

    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    }

    return (
        <div className={"converter-card"}>
            <div className={"converter-header"}>
                <h2>Конвертер валют</h2>
            </div>
        <div className={"converter-grid"}>
            <div className={"input-group"}>
                <label >Сума</label>
                <input
                    type={"number"}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min={"0"}
                />
            </div>
            <div className={"input-group"}>
                <label >З</label>
                <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                    {currencies.map(code => (
                        <option key={code} value={code}>{code}</option>
                    ))}
                </select>
            </div>
            <div className={"swap-button-container"}>
                <button onClick={handleSwap} className={"swap-button"}>
                    <ArrowRightLeft size={20} />
                </button>
            </div>
            <div className={"input-group"}>
                <label >В</label>
                <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                    {currencies.map(code => (
                        <option key={code} value={code}>{code}</option>
                    ))}
                </select>
            </div>
        </div>

        <div className={"result-container"}>
            {loading ? (
                <div className="loading-spinner">
                    <RefreshCcw className={"animate-spin"} size={24} /> Оновлення...
                </div>
            ): (
                result !== null && (
                    <div className={"result-display"}>
                        <span className={"result-main"}>
                            {amount} {fromCurrency} = {result.toFixed(2)} {toCurrency}
                        </span>
                        <span className={"result-rate"}>
                            1 {fromCurrency} = {rate?.toFixed(4)} {toCurrency}
                        </span>
                    </div>
                )
            )}
        </div>

        <div className={"dashboard-content"}>
            <div className={"dashboard-item"}>
                <ExchangeRateChart fromCurrency={fromCurrency} toCurrency={toCurrency}/>
            </div>
            <div className={"dashboard-item"}>
                <ConversionHistory history={history}/>
            </div>
        </div>

        </div>
    )
}

export  default CurrencyConverter;