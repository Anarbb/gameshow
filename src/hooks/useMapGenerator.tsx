import { useCallback, useState } from 'react';

export interface Tile {
  type: "empty" | "start" | "end" | "path" | "combat" | "treasure";
  connections: boolean[];  // [north, east, south, west]
  visited: boolean;
  x: number;
  y: number;
  special: any;
}

export interface MapConfig {
  level: number;
  size: { width: number; height: number };
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  specialTiles: Array<{type: string; position: {x: number; y: number}}>;
  difficulty: number;
}

export interface GameMap {
  grid: Tile[][];
  pathGraph: Record<string, string[]>;
  levelConfig: MapConfig;
  pathTiles: Array<{x: number; y: number}>;
}

const useMapGenerator = () => {
  const [currentMap, setCurrentMap] = useState<GameMap | null>(null);
  
  const generateMap = useCallback((level: number = 1): GameMap => {
    // Base parameters that scale with level
    const baseWidth = 5;
    const baseHeight = 5;
    const width = baseWidth + Math.floor(level * 0.5);
    const height = baseHeight + Math.floor(level * 0.5);
    const minPathLength = 5 + level * 2;
    const branchChance = Math.min(0.1 + level * 0.03, 0.4); // Capped at 40% chance
    
    // Initialize empty map grid
    const grid: Tile[][] = Array(height).fill(0).map(() => 
      Array(width).fill(0).map(() => ({
        type: "empty",
        connections: [false, false, false, false], // [north, east, south, west]
        visited: false,
        x: 0,
        y: 0,
        special: null
      }))
    );
    
    // Set coordinates for each tile
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        grid[y][x].x = x;
        grid[y][x].y = y;
      }
    }

    // Choose start position (usually on the left side)
    const startX = 0;
    const startY = Math.floor(height / 2);
    const startPosition = { x: startX, y: startY };
    grid[startY][startX].type = "start";
    grid[startY][startX].visited = true;
    
    // Generate the main path and branches
    const pathTiles: Array<{x: number; y: number}> = [];
    pathTiles.push({ x: startX, y: startY });
    
    const directions = [
      { x: 0, y: -1, direction: 0, opposite: 2 }, // North
      { x: 1, y: 0, direction: 1, opposite: 3 },  // East
      { x: 0, y: 1, direction: 2, opposite: 0 },  // South
      { x: -1, y: 0, direction: 3, opposite: 1 }  // West
    ];

    // Generate the map using a modified random walk with branching
    function generatePath(currentX: number, currentY: number, length: number, isMainPath: boolean = true) {
      if (length <= 0) return;
      
      // Shuffle directions for randomness
      const shuffledDirections = [...directions].sort(() => Math.random() - 0.5);
      
      for (const dir of shuffledDirections) {
        const newX = currentX + dir.x;
        const newY = currentY + dir.y;
        
        // Check if the new position is within bounds and not visited
        if (newX >= 0 && newX < width && newY >= 0 && newY < height && !grid[newY][newX].visited) {
          // Create a connection between tiles
          grid[currentY][currentX].connections[dir.direction] = true;
          grid[newY][newX].connections[dir.opposite] = true;
          
          // Mark the new tile as visited and set as path
          grid[newY][newX].visited = true;
          grid[newY][newX].type = "path";
          pathTiles.push({ x: newX, y: newY });
          
          // Continue the path
          generatePath(newX, newY, length - 1, isMainPath);
          
          // If this is the main path and we meet branching criteria, create a branch
          if (isMainPath && length > 2 && Math.random() < branchChance) {
            generatePath(newX, newY, Math.floor(length / 2), false);
          }
          
          // For main path, we only take one direction
          if (isMainPath) break;
        }
      }
    }
    
    // Generate the main path
    generatePath(startX, startY, minPathLength);
    
    // Set the end tile (furthest from start)
    let endTile = pathTiles.reduce((furthest, current) => {
      const currentDist = Math.abs(current.x - startX) + Math.abs(current.y - startY);
      const furthestDist = Math.abs(furthest.x - startX) + Math.abs(furthest.y - startY);
      return currentDist > furthestDist ? current : furthest;
    }, pathTiles[0]);
    
    grid[endTile.y][endTile.x].type = "end";
    const endPosition = { x: endTile.x, y: endTile.y };
    
    // Add special tiles (combat, treasure, etc.)
    const specialTiles: Array<{type: string; position: {x: number; y: number}}> = [];
    const numSpecialTiles = Math.min(Math.floor(level * 1.5), pathTiles.length - 2);
    
    // Filter out start and end tiles
    const availableTiles = pathTiles.filter(tile => 
      !(tile.x === startX && tile.y === startY) && 
      !(tile.x === endTile.x && tile.y === endTile.y)
    );
    
    // Shuffle the available tiles
    availableTiles.sort(() => Math.random() - 0.5);
    
    // Add special tiles
    for (let i = 0; i < numSpecialTiles && i < availableTiles.length; i++) {
      const tile = availableTiles[i];
      const specialType = Math.random() < 0.7 ? "combat" : "treasure";
      grid[tile.y][tile.x].type = specialType;
      grid[tile.y][tile.x].special = specialType === "combat" ? 
        { difficulty: level * 0.5 + Math.random() * level } : 
        { value: Math.floor(10 + level * 5 * Math.random()) };
      
      specialTiles.push({
        type: specialType,
        position: { x: tile.x, y: tile.y }
      });
    }
    
    // Create the level config object
    const levelConfig: MapConfig = {
      level,
      size: { width, height },
      startPosition,
      endPosition,
      specialTiles,
      difficulty: level
    };
    
    // Create path graph (adjacency list)
    const pathGraph: Record<string, string[]> = {};
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (grid[y][x].type !== "empty") {
          const key = `${x},${y}`;
          pathGraph[key] = [];
          
          // Add connected neighbors
          directions.forEach((dir, index) => {
            if (grid[y][x].connections[index]) {
              const nx = x + dir.x;
              const ny = y + dir.y;
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                pathGraph[key].push(`${nx},${ny}`);
              }
            }
          });
        }
      }
    }
    
    const newMap = {
      grid,
      pathGraph,
      levelConfig,
      pathTiles: pathTiles.map(tile => ({ x: tile.x, y: tile.y }))
    };
    
    setCurrentMap(newMap);
    return newMap;
  }, []);

  return {
    currentMap,
    generateMap
  };
};

export default useMapGenerator;