import {useEffect, useState} from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";
import {Line} from "react-chartjs-2";
import {format, subDays} from "date-fns";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const ExchangeRateChart = ({fromCurrency, toCurrency}) => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [days, setDays] = useState(30);
    useEffect(() => {
        const fetchHistory = async () => {
            if(fromCurrency === toCurrency){
                return;
            }
            setLoading(true);
            try{
                const endDate = format(new Date(), "yyyy-MM-dd");
                const startDate = format(subDays(new Date, days), "yyyy-MM-dd");
                const response = await fetch(
                    `https://api.frankfurter.dev/v1/${startDate}..${endDate}?base=${fromCurrency}&symbols=${toCurrency}`
                );
                const data = await response.json();
                const labels = Object.keys(data.rates)
                const values = labels.map(date => data.rates[date][toCurrency]);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: `${fromCurrency} / ${toCurrency}`,
                            data: values,
                            backgroundColor: 'rgba(59, 132, 242, 0.1)',
                            borderColor: 'rgb(59, 132, 242)',
                            tension: 0.1
                        },
                    ],
                });
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [fromCurrency, toCurrency, days]);
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Історія курсу за останні ${days} днів`,
            },
        },
        scales: {
            y: {
                beginAtZero: false,
            }
        }
    };
    return (
        <div className={"chart-container"}>
            <div className={"chart-controls"}>
                <button onClick={()=>setDays(7)} className={days === 7 ? 'active':''}>7д</button>
                <button onClick={()=>setDays(30)} className={days === 30 ? 'active':''}>30д</button>
                <button onClick={()=>setDays(90)} className={days === 90 ? 'active':''}>90д</button>
            </div>
            {loading ? (
                <div className={"loading"}>Завантаження графіка</div>
            ): chartData ? (
                <Line options={options} data={chartData}/>
            ) : (
                <div className={"no-data"}>Немає даних для відображення</div>
            )}
        </div>
    )
}

export default ExchangeRateChart;