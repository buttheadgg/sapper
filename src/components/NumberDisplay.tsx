import React, { FC, useEffect } from 'react';
import "../styles/App.css";

interface valueProps{
    value: number;
}


const NumberDisplay:FC<valueProps> = ({value}) => {

    const splitNumber = () => {
    
    const digits = value.toString().padStart(3, '0').split('').map(Number);
    
    const result = [
        digits[0] || 0,
        digits[1] || 0, 
        digits[2] || 0, 
      ];
      return result;
    }

    const numberArray = splitNumber(); 

    return (
    <div className="Display">
        {numberArray.map((digit, index) => (
        <div key={index} className={`value-${digit}`}>
        </div>
        ))}
    </div>
    );
};

export default NumberDisplay;