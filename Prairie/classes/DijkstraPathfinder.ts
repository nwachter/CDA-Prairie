import { Maze } from './MazeGenerator.js';

export function dijkstra(maze: Maze): [number, number][] | null {
    const dist: Record<string, number> = {};
    const prev: Record<string, string | null> = {};
    const unvisited = new Set<string>();

    // Initialize distances
    for (let y = 0; y < maze.height; y++) {
        for (let x = 0; x < maze.width; x++) {
            if (maze.getGrid()[y][x] === 0) {
                const key = `${x},${y}`;
                dist[key] = Infinity;
                prev[key] = null;
                unvisited.add(key);
            }
        }
    }

    const startKey = `${maze.start[0]},${maze.start[1]}`;
    dist[startKey] = 0;

    while (unvisited.size > 0) {
        let current: string | null = null;
        let minDist = Infinity;

        for (const node of unvisited) {
            if (dist[node] < minDist) {
                minDist = dist[node];
                current = node;
            }
        }

        if (!current || minDist === Infinity) break;

        unvisited.delete(current);
        const [cx, cy] = current.split(',').map(Number);

        if (cx === maze.end[0] && cy === maze.end[1]) break;

        for (const [nx, ny] of maze.neighbors(cx, cy)) {
            const neighborKey = `${nx},${ny}`;
            if (unvisited.has(neighborKey)) {
                const alt = dist[current] + 1;
                if (alt < dist[neighborKey]) {
                    dist[neighborKey] = alt;
                    prev[neighborKey] = current;
                }
            }
        }
    }

    // Reconstruct path
    const path: [number, number][] = [];
    let current: string | null = `${maze.end[0]},${maze.end[1]}`;

    while (current && prev[current] !== undefined) {
        const [x, y] = current.split(',').map(Number);
        path.unshift([x, y]);
        current = prev[current];
    }

    if (path.length > 0) {
        path.unshift(maze.start);
    }

    return path.length > 0 ? path : null;
}