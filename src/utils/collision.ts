import { Position } from "../types/position";

const eatPrecision = 18;

export function isPacmanOverFood(
  pacmanPosition: Position,
  foodPosition: Position,
  pacmanSize: number
): boolean {
  const reach = (pacmanSize - eatPrecision) / 2;

  return (
    pacmanPosition.left + reach >= foodPosition.left &&
    pacmanPosition.left - reach < foodPosition.left &&
    pacmanPosition.top + reach >= foodPosition.top &&
    pacmanPosition.top - reach < foodPosition.top
  );
}

export function isTouchingGhost(
  pacmanPosition: Position,
  ghostPosition: Position,
  ghostSize: number
): boolean {
  return (
    pacmanPosition.left > ghostPosition.left - ghostSize &&
    pacmanPosition.left < ghostPosition.left + ghostSize &&
    pacmanPosition.top > ghostPosition.top - ghostSize &&
    pacmanPosition.top < ghostPosition.top + ghostSize
  );
}
