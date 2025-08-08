import React from 'react';
import LiveClock from './components/LiveClock';
import { Link } from 'react-router';

// Updated Header Component
const Header = () => (
  <header
    style={{
      textAlign: 'center',
      margin: '10px 0',
      padding: '20px',
      background: 'linear-gradient(to bottom right, #ff7e5f, #feb47b)',
      color: 'white',
      borderRadius: '10px',
      fontFamily: 'Georgia, serif',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
    }}>
    <h1 style={{ margin: 0, fontSize: '1.75rem' }}>OnePieceDle - Not Enough Characters!</h1>
  </header>
);

// Button Component
const Button = ({ label, location }: { label: string; location: string; }) => (
  <Link to={location} >
    <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>
    {label}
    </button>
  </Link>
);

// Card Component for Transparent Backgrounds
const Card = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      background: 'linear-gradient(to top, rgba(118, 151, 0, 0.2), rgba(255, 255, 255, 0.0))',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
      width: '100%',
      textAlign: 'center',
    }}>
    {children}
  </div>
);
const CardHeading = ({ heading, children }: { heading: string; children?: React.ReactNode }) => (
  <h3
    style={{
      textAlign: 'center',
      margin: '10px 0',
      padding: '2px',
      background: 'linear-gradient(to top left, #213cc3ff, #de2522ff)',
      color: 'white',
      borderRadius: '10px',
      fontFamily: 'Georgia, serif',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
    }}>
    {heading}
    {children}
  </h3>
);

// Updated Home Page Component
const HomeScreen = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '20px' }}>
        {/* Left Column */}
        <Card>
          <CardHeading heading='Dailies'>
            <LiveClock />
          </CardHeading>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button label='Daily Game' location='daily' />
            <Button label='Guess the Laugh' location='' />
            <Button label='Guess the Fruit' location='' />
          </div>
        </Card>
        <hr
          style={{
            border: 'dashed 2px',
            color: "rgba(0, 0, 0, 0.1)",
            borderRadius: '5px',
          }}
        />
        {/* Middle Column */}
        <Card>
          <CardHeading heading='Free Play' />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button label='Guesser' location='guesser' />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HomeScreen;
