import React from 'react';
import Field from './components/Field';
import NumberDisplay from './components/NumberDisplay';
function App() {

  const size = 10;

  return (
    <div className="App">
      <div className='Header'>
        <NumberDisplay value={0}/>
        <div className='face'></div>
        <NumberDisplay value={size}/>
      </div>
      <div className='Body'>
      <Field size={size}/>
      </div>
    </div>
  );
}

export default App;
