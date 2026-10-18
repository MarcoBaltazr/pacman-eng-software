import { Position } from "../types/position";
import { DIRECTION, Direction } from "../types/direction";
import { Character } from "../types/character";
import { calculateNextPosition } from "./movement";

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

// when the way is blocked, tries to slide up to one step to line up with an opening
export function moveAvoidingWalls(
  position: Position,
  direction: Direction,
  character: Character,
  walls: Position[]
): Position | null {
  const horizontal =
    direction === DIRECTION.LEFT || direction === DIRECTION.RIGHT;
  const offset = (horizontal ? position.top : position.left) % wallSize;
  const shifts = [0];
  if (offset !== 0 && offset <= character.velocity) {
    shifts.push(-offset);
  }
  if (offset !== 0 && wallSize - offset <= character.velocity) {
    shifts.push(wallSize - offset);
  }

  for (const shift of shifts) {
    const start = horizontal
      ? { top: position.top + shift, left: position.left }
      : { top: position.top, left: position.left + shift };
    const next = calculateNextPosition(start, direction, character);
    if (
      !hitsWall(start, character.size, walls) &&
      !hitsWall(next, character.size, walls)
    ) {
      return next;
    }
  }
  return null;
}
