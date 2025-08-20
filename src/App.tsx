// import { useState } from 'react'
import './App.css';
import { Routes, Route } from 'react-router';
import HomeScreen from './frontend/homeScreen';
import BasicGuessingGame from './frontend/BasicGameController';
import DailyGameController from './frontend/dailyGuessingGame';

function App() {
  return (
    <>
      <Routes>
          <Route path='/' element={<HomeScreen />} />
          <Route path='guesser' element={<BasicGuessingGame />} />
          <Route path='daily' element={<DailyGameController />} />
      </Routes>
    </>
  );
}

export default App;
