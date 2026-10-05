/**
 * A procedurally drawn aerial wheat field for the segmentation demo.
 * Illustrative only: no real imagery and no model inference.
 */

export const FIELD_W = 36;
export const FIELD_H = 22;
const SUPERPIXEL_STEP = 4;

export interface Cell {
  x: number;
  y: number;
  crop: boolean;
  /** 0..1 deterministic texture used for colour variation. */
  shade: number;
  /** Superpixel id: nearest grid centre, split where the crop boundary runs through. */
  region: string;
}

function hash(x: number, y: number): number {
  let h = Math.imul(x * 374761393 + y * 668265263, 1274126177) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
  return (h % 1000) / 1000;
}

export function isCrop(x: number, y: number): boolean {
  const bare = (x - 26) ** 2 / 20 + (y - 9) ** 2 / 12 < 1;
  const track = x === 12;
  // Gently curving drill rows: three cells of wheat, two of soil.
  const rows = (x + 1.6 * Math.sin(y / 4) + 20) % 5 < 3;
  return rows && !bare && !track;
}

export function buildField(): Cell[] {
  const cells: Cell[] = [];
  for (let y = 0; y < FIELD_H; y++) {
    for (let x = 0; x < FIELD_W; x++) {
      const crop = isCrop(x, y);
      const cx = Math.round(x / SUPERPIXEL_STEP);
      const cy = Math.round(y / SUPERPIXEL_STEP);
      cells.push({ x, y, crop, shade: hash(x, y), region: `${cx}:${cy}:${crop ? 1 : 0}` });
    }
  }
  return cells;
}

/** Edges between neighbouring cells in different superpixels, as [x1, y1, x2, y2] in cell units. */
export function superpixelEdges(cells: Cell[]): [number, number, number, number][] {
  const at = (x: number, y: number) => cells[y * FIELD_W + x];
  const edges: [number, number, number, number][] = [];
  for (const c of cells) {
    const right = c.x + 1 < FIELD_W ? at(c.x + 1, c.y) : undefined;
    const down = c.y + 1 < FIELD_H ? at(c.x, c.y + 1) : undefined;
    if (right && right.region !== c.region) edges.push([c.x + 1, c.y, c.x + 1, c.y + 1]);
    if (down && down.region !== c.region) edges.push([c.x, c.y + 1, c.x + 1, c.y + 1]);
  }
  return edges;
}

export const PATCH = SUPERPIXEL_STEP;
