import React, { useState } from 'react'

import { GameMap } from '../components/GameMap'
import { NavBar } from './NavBar'
import { QueuePage } from './QueuePage'

interface HomeProps {
    channelName?: string
    status: string
    avatarUri?: string
    username?: string
    displayName?: string
}

export const Home: React.FC<HomeProps> = ({ channelName, status, avatarUri, username, displayName }) => {
    const [showQueue, setShowQueue] = useState(false);
    const [inGame, setInGame] = useState(false);
    
    const handleJoinQueue = () => {
        setShowQueue(true);
    };
    
    const handleStartGame = () => {
        setShowQueue(false);
        setInGame(true);
    };
    
    if (showQueue) {
        return (
            <QueuePage 
                avatarUri={avatarUri}
                username={username}
                displayName={displayName}
                onGameStart={handleStartGame}
            />
        );
    }
    
    return (
        <div style={{ position: 'relative' }}>
            <NavBar avatarUri={avatarUri} username={username} displayName={displayName} powerPoints={5} />

            <img src="/rocket.png" className="logo" alt="Discord" />

            {channelName ? <h3>#{channelName}</h3> : <h3>{status}</h3>}

            <div style={{ margin: '20px 0', textAlign: 'center' }}>
                <button 
                    onClick={handleJoinQueue}
                    style={{ 
                        padding: '10px 20px',
                        backgroundColor: '#7289DA',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: 'pointer'
                    }}
                >
                    Join Game Queue
                </button>
            </div>

            {/* {inGame && <GameMap />} */}
            
            <small>
                Powered by <strong>Robo.js</strong>
            </small>
        </div>
    )
}