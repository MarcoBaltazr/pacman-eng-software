import {
  hitsWall,
  isWallCell,
  moveAvoidingWalls,
  wallPositions,
} from "./walls";
import { DIRECTION } from "../types/direction";
import { Character } from "../types/character";

// jsdom window is 1024x768
const pacman: Character = {
  velocity: 30,
  size: 60,
  border: 20,
  topScoreBoard: 100,
  color: "yellow",
  name: "pacman",
};

function reachableCells(columns: number, rows: number) {
  const visited = new Set(["0,0"]);
  const queue = [[0, 0]];

  while (queue.length > 0) {
    const [column, row] = queue.shift()!;
    const neighbours = [
      [column - 1, row],
      [column + 1, row],
      [column, row - 1],
      [column, row + 1],
    ];
    neighbours.forEach(([c, r]) => {
      const key = c + "," + r;
      if (
        c >= 0 &&
        r >= 0 &&
        c < columns &&
        r < rows &&
        !isWallCell(c, r) &&
        !visited.has(key)
      ) {
        visited.add(key);
        queue.push([c, r]);
      }
    });
  }
  return visited.size;
}

test.each([
  [2, 2],
  [2, 3],
  [5, 1],
  [10, 3],
  [1, 6],
  [10, 8],
  [21, 1],
])("cell (%p, %p) is a wall", (column, row) => {
  expect(isWallCell(column, row)).toBe(true);
});

test.each([
  [0, 0],
  [5, 5],
  [1, 2],
  [3, 3],
  [4, 1],
  [-1, 2],
  [2, -1],
])("cell (%p, %p) is free", (column, row) => {
  expect(isWallCell(column, row)).toBe(false);
});

test("lists the walls inside the grid", () => {
  expect(wallPositions(16, 10)).toHaveLength(34);
  expect(wallPositions(3, 4)).toEqual([
    { top: 120, left: 120 },
    { top: 180, left: 120 },
  ]);
});

test.each([
  [16, 10],
  [31, 16],
  [22, 10],
])("every free cell of a %px%p grid is reachable", (columns, rows) => {
  const freeCells = columns * rows - wallPositions(columns, rows).length;
  expect(reachableCells(columns, rows)).toBe(freeCells);
});

test("detects a character overlapping a wall", () => {
  const walls = [{ top: 120, left: 120 }];

  expect(hitsWall({ top: 120, left: 90 }, 60, walls)).toBe(true);
  expect(hitsWall({ top: 150, left: 150 }, 60, walls)).toBe(true);
  expect(hitsWall({ top: 120, left: 60 }, 60, walls)).toBe(false);
  expect(hitsWall({ top: 60, left: 120 }, 60, walls)).toBe(false);
  expect(hitsWall({ top: 120, left: 180 }, 60, walls)).toBe(false);
});

test("moves normally when there is no wall ahead", () => {
  expect(
    moveAvoidingWalls({ top: 0, left: 0 }, DIRECTION.RIGHT, pacman, [])
  ).toEqual({ top: 0, left: 30 });
});

test("does not move into a wall", () => {
  const walls = [{ top: 60, left: 0 }];

  expect(
    moveAvoidingWalls({ top: 0, left: 0 }, DIRECTION.DOWN, pacman, walls)
  ).toBeNull();
});

test("slides into an opening next to a wall", () => {
  const walls = [{ top: 60, left: 0 }];

  expect(
    moveAvoidingWalls({ top: 0, left: 30 }, DIRECTION.DOWN, pacman, walls)
  ).toEqual({ top: 30, left: 60 });
});

test("does not slide more than one step", () => {
  const walls = [{ top: 60, left: 0 }];

  expect(
    moveAvoidingWalls({ top: 0, left: 10 }, DIRECTION.DOWN, pacman, walls)
  ).toBeNull();
});
