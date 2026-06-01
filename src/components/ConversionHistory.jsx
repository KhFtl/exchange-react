import React from 'react';
import {format} from 'date-fns';
import {History, ArrowRight} from "lucide-react";

const ConversionHistory = ({history}) => {
    if(history.length === 0){
        return (
            <div className="history-empty">
                <p>Нажаль історія порожня</p>
            </div>
        );
    }

    return (
        <div className={"history-section"}>
            <h3>
                <History size={20} className={"history-icon"}/> Останні зміни
            </h3>
            <ul className={"history-list"}>
                {history.map((item, index) => (
                    <li key={index} className={"history-item"}>
                        <span className={"history-date"}>{format(new Date(item.date), "HH:mm:ss")}</span>
                        <span className="history-values">
                            {item.amount} {item.from} <ArrowRight size={14} className="inline-icon"/> {item.result} {item.to}
                        </span>
                        <span className={"history-rate"}>Курс: {item.rate}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ConversionHistory;