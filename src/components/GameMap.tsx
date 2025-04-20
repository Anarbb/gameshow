
import { GameMap as GameMapType } from '../hooks/useMapGenerator';

import { useEffect, useState } from 'react';


import useMapGenerator from '../hooks/useMapGenerator';
import '../styles/Activity.css';

interface GameMapProps {
    map: GameMapType;
}

const MapTiles: React.FC<GameMapProps> = ({ map }) => {



    const { grid, levelConfig } = map;
    const { width, height } = levelConfig.size;

    return (
        <div
            className="game-map-grid"
            style={{
                gridTemplateColumns: `repeat(${width}, 1fr)`,
                gridTemplateRows: `repeat(${height}, 1fr)`
            }}
        >
            {grid.flat().map((tile, index) => (
                <div
                    key={index}
                    className={`game-map-tile tile-${tile.type} ${tile.visited ? 'visited' : ''}`}
                    data-x={tile.x}
                    data-y={tile.y}
                >
                    {tile.type === 'start' && 'S'}
                    {tile.type === 'end' && 'E'}
                    {tile.type === 'combat' && '⚔️'}
                    {tile.type === 'treasure' && '💰'}
                </div>
            ))}
        </div>
    );
};

export const GameMap = () => {
    // const [channelName, setChannelName] = useState<string>()
    const [level, setLevel] = useState(1)
    const [mapKey, setMapKey] = useState(0)
    const [mapData, setMapData] = useState<GameMapType | null>(null)
    const { generateMap } = useMapGenerator()



    // Skip authentication for now, generate map immediately
    useEffect(() => {
        try {
            const map = generateMap(level)
            setMapData(map)

        } catch (err) {
            console.error("Map generation error:", err)
        }
    }, [level, mapKey, generateMap])

    const handleLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLevel(parseInt(event.target.value))
    }

    const handleRegenerate = () => {
        setMapKey(prev => prev + 1)
    }

    return (
        <div className="activity-container">

            <div className="activity-content">
                <div className="controls">
                    <div className="level-control">
                        <label htmlFor="level-slider">Level: {level}</label>
                        <input
                            id="level-slider"
                            type="range"
                            min="1"
                            max="10"
                            value={level}
                            onChange={handleLevelChange}
                        />
                    </div>
                    <button className="regenerate-button" onClick={handleRegenerate}>
                        Regenerate Map
                    </button>
                </div>

                <div className="game-map-container">
                    {mapData ? (
                        <MapTiles map={mapData} />
                    ) : (
                        <div className="game-map-loading">Loading map...</div>
                    )}
                </div>

                {mapData && (
                    <div className="map-info">
                        <h3>Map Information</h3>
                        <p>Path Length: {mapData.pathTiles.length} tiles</p>
                        <p>Special Tiles: {mapData.levelConfig.specialTiles.length}</p>
                        <p>Start: ({mapData.levelConfig.startPosition.x}, {mapData.levelConfig.startPosition.y})</p>
                        <p>End: ({mapData.levelConfig.endPosition.x}, {mapData.levelConfig.endPosition.y})</p>
                    </div>
                )}
            </div>
        </div>
    )
}
