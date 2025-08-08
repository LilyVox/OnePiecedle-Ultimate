// import { useState } from 'react'
import './App.css';
import { Routes, Route } from 'react-router';
import HomeScreen from './frontend/homeScreen';
import BasicGuessingGame from './frontend/basicGuessingGame';

function App() {
  return (
    <>
      <Routes>
          <Route path='/' element={<HomeScreen />} />
          <Route path='guesser' element={<BasicGuessingGame />} />
      </Routes>
    </>
  );
}

export default App;
