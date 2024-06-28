import React, { FC } from 'react';
import "../styles/App.css";

interface valueProps{
    value: number;
}


const NumberDisplay:FC<valueProps> = ({value}) => {
    return (
        <div>
            {value}
        </div>
    );
};

export default NumberDisplay;