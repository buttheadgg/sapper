import React, { FC } from 'react';
import "../styles/App.css";

interface valueProps{
    value: number;
}


const NumberDisplay:FC<valueProps> = ({value}) => {
    return (
        <div>
            0
        </div>
    );
};

export default NumberDisplay;