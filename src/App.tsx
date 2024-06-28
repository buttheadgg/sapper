import React, { ReactNode, useEffect, useState } from 'react';
import NumberDisplay from './components/NumberDisplay';
import {generateCells, openMultipleCells} from '../src/utils/Utils'
import { render } from '@testing-library/react';
import Button from './components/button/Button';
import { Cell, CellState, CellValue } from './types/Types';


function App() {


  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState(<div className='faceSmile'></div>);
  const [time, setTime] = useState(0);
  const [live, setLive] = useState<boolean>(false);
  const [bombCount, setbombCount] = useState<number>(10);


  useEffect(() => {
    const  handleMousedown = (): void => {
      setFace(<div className='faceOh'></div>);
    }

    const  handleMouseup = (): void => {
      setFace(<div className='faceSmile'></div>);
    }

    window.addEventListener('mousedown', handleMousedown);
    window.addEventListener('mouseup', handleMouseup);

    return () => {
      window.removeEventListener('mousedown', handleMousedown);
      window.removeEventListener('mouseup', handleMouseup);
    }
  }, []);

  useEffect(()=> {
    if (live && time < 999) {
      const timer = setInterval(()=>{
        setTime(time + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      }

    }
  }, [live, time]);

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    
    if(!live) {
      setLive(true);
    }

    const currentCell = cells[rowParam][colParam];
    let newCells = cells.slice();

    if (currentCell.state === CellState.flagged || currentCell.state === CellState.visible){
      return;
    }

    if (currentCell.value === CellValue.bomb){

    }else if (currentCell.value === CellValue.none){
      newCells = openMultipleCells(newCells, rowParam, colParam);
      setCells(newCells);
    } else {
      newCells[rowParam][colParam].state = CellState.visible;
      setCells(newCells);
    }

  }

  const handleFaceClick = (): void => {
      setLive(false);
      setTime(0);
      setCells(generateCells());
      setbombCount(10);
  }

  const handleCellContext = (rowParam: number, colParam: number) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.preventDefault();
    const currentCells = cells.slice();
    const currentCell = cells[rowParam][colParam];

    if(currentCell.state === CellState.visible){
      return;
    }else if (currentCell.state === CellState.Transparent){
        currentCells[rowParam][colParam].state = CellState.flagged;
        setCells(currentCells);
        setbombCount(bombCount - 1);
    } else if (currentCell.state === CellState.flagged){
      currentCells[rowParam][colParam].state = CellState.question;
      setCells(currentCells);
      setbombCount(bombCount + 1);
    } else if (currentCell.state === CellState.question){
      currentCells[rowParam][colParam].state = CellState.Transparent;
      setCells(currentCells);
      setbombCount(bombCount);
  }
  }

  const renderCells = (): ReactNode => {
    return cells.map((row, rowIndex) => row.map((cell, colIndex) => <Button key={`${rowIndex}-${colIndex}`} state={cell.state} value={cell.value} onClick={handleCellClick} onContext={handleCellContext} row={rowIndex} col={colIndex}/>))
  }

  return (
    <div className="App">
      <div className='Header'>
        <NumberDisplay value={bombCount}/>
        <div className='faceSmile' onClick={handleFaceClick}>{face}</div>
        <NumberDisplay value={time}/>
      </div>
      <div className='Body'>
        {renderCells()}
      </div>
    </div>
  );
}

export default App;
