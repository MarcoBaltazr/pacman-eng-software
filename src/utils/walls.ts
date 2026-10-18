import { Position } from "../types/position";

export const wallSize = 60;

// "#" is a wall; the map repeats every 16 columns and 10 rows
const wallMap = [
  "................",
  ".....######.....",
  "..#..........#..",
  "..#..######..#..",
  "................",
  "................",
  ".##..#....#..##.",
  ".....#....#.....",
  ".##..######..##.",
  "................",
];

export function isWallCell(column: number, row: number): boolean {
  if (column < 0 || row < 0) {
    return false;
  }
  const mapRow = wallMap[row % wallMap.length];
  return mapRow[column % mapRow.length] === "#";
}

export function wallPositions(columns: number, rows: number): Position[] {
  const walls: Position[] = [];

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      if (isWallCell(column, row)) {
        walls.push({ top: row * wallSize, left: column * wallSize });
      }
    }
  }
  return walls;
}

export function hitsWall(
  position: Position,
  size: number,
  walls: Position[]
): boolean {
  return walls.some(
    (wall) =>
      position.left < wall.left + wallSize &&
      position.left + size > wall.left &&
      position.top < wall.top + wallSize &&
      position.top + size > wall.top
  );
}
