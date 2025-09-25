import { Maze } from './MazeGenerator';
export function dijkstra(maze: Maze): [number, number][] | null {
    const start = maze.start, end = maze.end;
    const dist  = new Map<string, number>();
    const prev  = new Map<string, [number, number]>();
    const key   = (x:number,y:number)=>`${x},${y}`;
    const pq: [number, number, number][] = [[0, ...start]]; // [distance,x,y]
  
    dist.set(key(...start), 0);
  
    while (pq.length) {
      pq.sort((a,b)=>a[0]-b[0]);
      const [d,x,y] = pq.shift()!;
      if (x===end[0] && y===end[1]) break;
      for (const [nx,ny] of maze.neighbors(x,y)) {
        const nd = d + 1;
        if (nd < (dist.get(key(nx,ny)) ?? Infinity)) {
          dist.set(key(nx,ny), nd);
          prev.set(key(nx,ny), [x,y]);
          pq.push([nd,nx,ny]);
        }
      }
    }
  
    if (!dist.has(key(...end))) return null;
  
    // reconstruire le chemin
    const path: [number, number][] = [];
    let cur: [number, number] | undefined = end;
    while (cur) {
      path.unshift(cur);
      cur = prev.get(key(...cur));
    }
    return path;
  }