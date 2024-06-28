import React, { ReactNode, useState } from 'react';
import NumberDisplay from './components/NumberDisplay';
import {generateCells} from '../src/utils/Utils'
import { render } from '@testing-library/react';
import Button from './components/button/Button';


function App() {

  const [cells, setCells] = useState(generateCells());

  const renderCells = (): ReactNode => {
    return cells.map((row, rowIndex) => row.map((cell, colIndex) => <Button key={`${rowIndex}-${colIndex}`} state={cell.state} value={cell.value} row={rowIndex} col={colIndex}/>))
  }

  return (
    <div className="App">
      <div className='Header'>
        <NumberDisplay value={0}/>
        <div className='faceSmile'></div>
        <NumberDisplay value={0}/>
      </div>
      <div className='Body'>
        {renderCells()}
      </div>
    </div>
  );
}

export default App;
