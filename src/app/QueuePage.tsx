import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QueuePageProps {
  avatarUri?: string;
  username?: string;
  displayName?: string;
  onGameStart: () => void;
}

interface User {
  id: string;
  username: string;
  displayName?: string;
  avatarUri?: string;
  isReady: boolean;
}

const theme = {
  colors: {
    primary: '#4f46e5',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    ready: '#4CAF50',
    waiting: '#ff9800',
    background: '#0a0e17',
    card: 'rgba(26, 34, 52, 0.7)',
    text: {
      primary: '#ffffff',
      secondary: '#e0e0e0',
      muted: '#a0a0a0'
    }
  },
  gradients: {
    primary: 'linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)',
    accent: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    ready: 'linear-gradient(135deg, #43a047 0%, #2e7d32 100%)',
    waiting: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)'
  }
};

export const QueuePage: React.FC<QueuePageProps> = ({ 
  avatarUri, 
  username, 
  displayName, 
  onGameStart 
}) => {
  const [users, setUsers] = useState<(User | null)[]>([
    { id: '1', username: username || 'player1', displayName, avatarUri, isReady: false },
    ...Array(9).fill(null)
  ]);
  
  const toggleReady = (userId: string) => {
    setUsers(prev => 
      prev.map(user => 
        user && user.id === userId ? { ...user, isReady: !user.isReady } : user
      )
    );
  };
  
  const validUsers = users.filter(user => user !== null) as User[];
  const allReady = validUsers.length > 0 && validUsers.every(user => user.isReady);
  const readyCount = validUsers.filter(user => user.isReady).length;
  const placeholders = Array.from({ length: 10 }, (_, i) => users[i] || null);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setUsers(prev => {
//         const emptySlotIndex = prev.findIndex(slot => slot === null);
//         if (emptySlotIndex === -1) return prev;
        
//         const newUsers = [...prev];
//         // newUsers[emptySlotIndex] = {
//         //   id: `auto-${Date.now()}`,
//         //   username: `player${emptySlotIndex + 1}`,
//         //   displayName: `Player ${emptySlotIndex + 1}`,
//         //   isReady: Math.random() > 0.5,
//         //   avatarUri: undefined
//         // };
        
//         return newUsers;
//       });
//     }, 3000);
    
//     return () => clearTimeout(timer);
//   }, []);

  const PlayerCard: React.FC<{ user: User | null; index: number }> = ({ user, index }) => {
    if (!user) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="player-card empty"
        >
          <div className="avatar-placeholder">👤</div>
          <div className="player-info">
            <div className="waiting-text">Waiting...</div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`player-card ${user.isReady ? 'ready' : 'waiting'}`}
      >
        <div className="avatar-container">
          {user.avatarUri ? (
            <img 
              src={user.avatarUri} 
              alt={user.displayName || user.username} 
              className="avatar"
            />
          ) : (
            <div className="avatar-fallback">
              {(user.displayName || user.username).charAt(0).toUpperCase()}
            </div>
          )}
          <div className="status-indicator">
            {user.isReady ? '✓' : '⏱'}
          </div>
        </div>
        
        <div className="player-info">
          <div className="player-name">
            {user.displayName || user.username}
            {user.id === '1' && <span className="you-tag">You</span>}
          </div>
          <div className="player-status">
            {user.isReady ? 'Ready' : 'Waiting...'}
          </div>
        </div>
        
        {user.id === '1' && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleReady(user.id)}
            className={`ready-button ${user.isReady ? 'cancel' : 'ready'}`}
          >
            {user.isReady ? 'Cancel' : 'Ready!'}
          </motion.button>
        )}
      </motion.div>
    );
  };

  return (
    <div className="queue-page">
      <motion.div 
        className="queue-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2 
          className="title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Waiting Room
        </motion.h2>

        <div className="progress-container">
          <p className="progress-text">
            Players Ready: {readyCount}/{validUsers.length}
          </p>
          <div className="progress-bar">
            <motion.div 
              className="progress-fill"
              initial={{ width: '0%' }}
              animate={{ width: `${validUsers.length > 0 ? (readyCount / validUsers.length) * 100 : 0}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="players-grid">
          {placeholders.map((user, index) => (
            <PlayerCard 
              key={user ? user.id : `empty-${index}`}
              user={user}
              index={index}
            />
          ))}
        </div>

        <AnimatePresence>
          {allReady && (
            <motion.div 
              className="start-game-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.button 
                className="start-game-button"
                onClick={onGameStart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Game
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`
        .queue-page {
          height: 100vh;
          width: 100vw;
          background: ${theme.colors.background};
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', system-ui, sans-serif;
          overflow: hidden;
          position: fixed;
          top: 0;
          left: 0;
        }

        .queue-container {
          width: 96%;
          height: 96vh;
          background: ${theme.colors.card};
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
        }

        .title {
          text-align: center;
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 15px 0;
          background: ${theme.gradients.primary};
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .progress-container {
          text-align: center;
          margin-bottom: 15px;
        }

        .progress-text {
          color: ${theme.colors.text.secondary};
          margin: 0 0 8px 0;
          font-size: 14px;
        }

        .progress-bar {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
          width: 50%;
          margin: 0 auto;
        }

        .progress-fill {
          height: 100%;
          background: ${theme.gradients.primary};
          border-radius: 3px;
        }

        .players-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: 8px;
          flex: 1;
          padding: 10px;
          margin: 0;
          height: calc(100% - 140px);
        }

        .player-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 8px;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          height: 70%;
          transform: scale(0.7);
          transform-origin: center;
          margin: auto;
          width: 70%;
        }

        .avatar-container {
          position: relative;
          flex-shrink: 0;
        }

        .avatar, .avatar-fallback, .avatar-placeholder {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar {
          object-fit: cover;
        }

        .avatar-fallback {
          background: ${theme.gradients.accent};
          color: white;
          font-weight: bold;
          font-size: 12px;
        }

        .avatar-placeholder {
          background: rgba(255, 255, 255, 0.1);
          font-size: this;
        }

        .status-indicator {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${theme.colors.ready};
          border: 2px solid ${theme.colors.background};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          color: white;
        }

        .player-info {
          flex: 1;
          min-width: 0;
        }

        .player-name {
          color: ${theme.colors.text.primary};
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 2px;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .you-tag {
          background: rgba(79, 70, 229, 0.3);
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 10px;
          color: ${theme.colors.text.primary};
          flex-shrink: 0;
        }

        .player-status {
          color: ${theme.colors.text.muted};
          font-size: 12px;
        }

        .waiting-text {
          color: ${theme.colors.text.muted};
          font-style: italic;
          font-size: 12px;
        }

        .ready-button {
          padding: 4px 8px;
          border-radius: 4px;
          border: none;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          color: white;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .ready-button.ready {
          background: ${theme.gradients.ready};
        }

        .ready-button.cancel {
          background: ${theme.gradients.waiting};
        }

        .start-game-container {
          text-align: center;
          margin-top: 10px;
          padding: 10px;
        }

        .start-game-button {
          padding: 10px 24px;
          border-radius: 8px;
          border: none;
          background: ${theme.gradients.primary};
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};