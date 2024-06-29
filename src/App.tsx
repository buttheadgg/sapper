import React, { ReactNode, useEffect, useState } from 'react';
import NumberDisplay from './components/NumberDisplay';
import {generateCells, openMultipleCells} from '../src/utils/Utils'
import { render } from '@testing-library/react';
import Button from './components/button/Button';
import { Cell, CellState, CellValue } from './types/Types';
import { MAX_COLS, MAX_ROWS, NOMBER_OF_BOMBS } from './constants/Constants';


function App() {


  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState(<div className='faceSmile'></div>);
  const [time, setTime] = useState(0);
  const [live, setLive] = useState<boolean>(false);
  const [bombCount, setbombCount] = useState<number>(NOMBER_OF_BOMBS);
  const [hasLost, setHasLost] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);

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

  useEffect(() => {
    if(hasLost){
      setFace(<div className='faceDie'/>);
      setLive(false);
    }
  },[hasLost])

  useEffect(() => {
    if(hasWon){
      setLive(false);
      setFace(<div className='faceWon'/>)
    }
  }, [hasWon])

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    let newCells = cells.slice();
    if(!live) {
        let isABomb = newCells[rowParam][colParam].value === CellValue.bomb;
        while(isABomb){
          newCells = generateCells();
          if (newCells[rowParam][colParam].value !== CellValue.bomb){
            isABomb = false;
            break;
          }
        }

      setLive(true);
    }

    const currentCell = newCells[rowParam][colParam];

    if (currentCell.state === CellState.flagged || currentCell.state === CellState.visible){
      return;
    }

    if (currentCell.value === CellValue.bomb){
      setHasLost(true);
      newCells[rowParam][colParam].red = true;
      newCells = showAllBombs();
      setCells(newCells);
    }else if (currentCell.value === CellValue.none){
      newCells = openMultipleCells(newCells, rowParam, colParam);
      setCells(newCells);
    } else {
      newCells[rowParam][colParam].state = CellState.visible;
      setCells(newCells);
    }

    let safeOpenCellsExists = false;
    for( let row=0; row<MAX_ROWS; row++){
      for (let col = 0; col < MAX_COLS; col++){
        const currentCell = newCells[row][col];

        if(currentCell.value !== CellValue.bomb && currentCell.state === CellState.Transparent){
          safeOpenCellsExists = true;
          break;
        }
      }
    }

    if(!safeOpenCellsExists) {
      newCells = newCells.map(row => row.map(cell => {
        if (cell.value === CellValue.bomb){
          return {
            ...cell,
            state: CellState.flagged
          }
        }
        return cell;
      }))
      setHasWon(true);
    }

    setCells(newCells);

  }

  const handleFaceClick = (): void => {
      setLive(false);
      setTime(0);
      setCells(generateCells());
      setbombCount(10);
      setHasLost(false);
      setHasWon(false);
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
    return cells.map((row, rowIndex) => row.map((cell, colIndex) => <Button key={`${rowIndex}-${colIndex}`} state={cell.state} value={cell.value} onClick={handleCellClick} onContext={handleCellContext} red={cell.red} row={rowIndex} col={colIndex}/>))
  }

  const showAllBombs = (): Cell[][] => {
    const currentCell = cells.slice();
    return currentCell.map(row => row.map(cell => {
      if(cell.value === CellValue.bomb){
        return {
          ...cell,
          state: CellState.visible
        };
      }
      return cell;
    })
  )
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
