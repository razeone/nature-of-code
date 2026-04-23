// Conway's Game of Life grid.
// Rules:
//   1. A live cell with 2 or 3 live neighbors survives.
//   2. A dead cell with exactly 3 live neighbors becomes alive.
//   3. Everything else dies or stays dead.
class Grid {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.cells = new Uint8Array(cols * rows);
    this.ages = new Uint16Array(cols * rows);
    this.buffer = new Uint8Array(cols * rows);
  }

  idx(x, y) {
    // Toroidal wrap — the world loops on the edges.
    const c = (x + this.cols) % this.cols;
    const r = (y + this.rows) % this.rows;
    return r * this.cols + c;
  }

  get(x, y) { return this.cells[this.idx(x, y)]; }
  set(x, y, v) {
    const i = this.idx(x, y);
    this.cells[i] = v;
    if (!v) this.ages[i] = 0;
  }

  randomize(p = 0.25) {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i] = Math.random() < p ? 1 : 0;
      this.ages[i] = this.cells[i];
    }
  }

  clear() {
    this.cells.fill(0);
    this.ages.fill(0);
  }

  step() {
    const { cols, rows, cells, buffer } = this;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let n = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            n += cells[this.idx(x + dx, y + dy)];
          }
        }
        const i = y * cols + x;
        const alive = cells[i] === 1;
        buffer[i] = (alive && (n === 2 || n === 3)) || (!alive && n === 3) ? 1 : 0;
      }
    }
    // Track "age" for nicer coloring — fresh cells are brighter.
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i]) this.ages[i] = Math.min(255, this.ages[i] + 1);
      else this.ages[i] = 0;
    }
    this.cells.set(buffer);
  }

  // Paste a pattern of [x, y] offsets at (ox, oy).
  stamp(pattern, ox, oy) {
    for (const [x, y] of pattern) this.set(ox + x, oy + y, 1);
  }
}

// Gosper's glider gun — a classic self-replicating pattern.
const GLIDER_GUN = [
  [1,5],[1,6],[2,5],[2,6],
  [11,5],[11,6],[11,7],[12,4],[12,8],[13,3],[13,9],[14,3],[14,9],
  [15,6],[16,4],[16,8],[17,5],[17,6],[17,7],[18,6],
  [21,3],[21,4],[21,5],[22,3],[22,4],[22,5],[23,2],[23,6],
  [25,1],[25,2],[25,6],[25,7],
  [35,3],[35,4],[36,3],[36,4]
];
