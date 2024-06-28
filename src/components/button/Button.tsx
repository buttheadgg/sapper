import React, { FC, ReactNode } from 'react';
import './Button.css';
import { CellState, CellValue } from '../../types/Types';

interface ButtonProps{
    row: number;
    col: number;
    state: CellState;
    value: CellValue;
}

const Button:FC<ButtonProps> = ({row,col,state,value}) => {
    const renderContent = (): React.ReactNode => {
        if(state === CellState.visible){
            if (value === CellValue.bomb){
                return (<div className='mineDef'></div>);
            }else if (value === CellValue.none){
                return null;
            }
        }else if (state === CellState.flagged) {
            return (<div className='flag'></div>);
        }

        return null;
    }


    return (
        <div className={`Button ${state === CellState.visible ? "visible" : ""} value-${value}`}>
          {renderContent()}
        </div>
    );
};

export default Button;