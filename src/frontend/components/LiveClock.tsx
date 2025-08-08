import React, { useState, useEffect } from 'react';

// Live Clock Component
export default function LiveClock () {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return <p style={{ textAlign: 'center', margin:"0" }}>{time.toLocaleTimeString()}</p>;
};
