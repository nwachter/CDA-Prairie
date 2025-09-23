//Algorithme de Djikistra (cf geeksforgeeks)
class MinHeap {
    constructor() {
        this.heap = [];
    }

    push(val) {
        this.heap.push(val);
        this._heapifyUp(this.heap.length - 1);
    }

    pop() {
        if (this.size() === 0) return null;
        if (this.size() === 1) return this.heap.pop();

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this._heapifyDown(0);
        return min;
    }

    size() {
        return this.heap.length;
    }

    _heapifyUp(index) {
        while (index > 0) {
            const parent = Math.floor((index - 1) / 2);
            if (this.heap[parent][0] <= this.heap[index][0]) break;
            [this.heap[parent], this.heap[index]] = [this.heap[index],
            this.heap[parent]];
            index = parent;
        }
    }

    _heapifyDown(index) {
        const n = this.heap.length;
        while (true) {
            let smallest = index;
            const left = 2 * index + 1;
            const right = 2 * index + 2;

            if (left < n && this.heap[left][0] < this.heap[smallest][0]) {
                smallest = left;
            }

            if (right < n && this.heap[right][0] < this.heap[smallest][0]) {
                smallest = right;
            }

            if (smallest === index) break;
            [this.heap[smallest], this.heap[index]] =
                [this.heap[index], this.heap[smallest]];
            index = smallest;
        }
    }
}

// Function to construct adjacency 
function constructAdj(edges, V) {
    // adj[u] = list of [v, wt]
    const adj = Array.from({ length: V }, () => []);

    for (const edge of edges) {
        const [u, v, wt] = edge;
        adj[u].push([v, wt]);
        adj[v].push([u, wt]);
    }

    return adj;
}

// Returns shortest distances from src to all other vertices
function dijkstra(V, edges, src) {
    /*
  V: Number of vertices/nodes in the graph
edges: Array of edges, where each edge is [u, v, weight] (undirected)
src: Source vertex from which to calculate shortest paths
  */

    // Create adjacency list
    const adj = constructAdj(edges, V);

    // Create a min heap to store <distance, node>
    const minHeap = new MinHeap();

    // Create an array for distances and initialize all distances as infinity
    const dist = Array(V).fill(Number.MAX_SAFE_INTEGER);

    // Push the source node with distance 0
    minHeap.push([0, src]);
    dist[src] = 0;

    // Process the heap
    while (minHeap.size() > 0) {
        const [d, u] = minHeap.pop();

        // Traverse all adjacent of u
        for (const [v, weight] of adj[u]) {
            if (dist[v] > dist[u] + weight) {
                dist[v] = dist[u] + weight;
                minHeap.push([dist[v], v]);
            }
        }
    }

    return dist;
}

// Driver code
const V = 5;
const src = 0;

// edge list format: [u, v, weight]
const edges = [[0, 1, 4], [0, 2, 8], [1, 4, 6], [2, 3, 2], [3, 4, 10]];

const result = dijkstra(V, edges, src);

// Print shortest distances in one line
console.log(result.join(' '));
