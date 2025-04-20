import React from 'react';

import { GameMap } from '../components/GameMap';
import { NavBar } from './NavBar';

interface HomeProps {
  channelName?: string;
  status: string;
  avatarUri?: string;
  username?: string;
}

export const Home: React.FC<HomeProps> = ({ channelName, status, avatarUri, username }) => {
  return (
    <div style={{ position: 'relative' }}>
      <NavBar avatarUri={avatarUri} username={username} />

      <img src="/rocket.png" className="logo" alt="Discord" />
      
      {channelName ? <h3>#{channelName}</h3> : <h3>{status}</h3>}

      <GameMap />
      <small>
        Powered by <strong>Robo.js</strong>
      </small>
    </div>
  )
}