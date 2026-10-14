import { Position } from "../types/position";
import { DIRECTION, Direction } from "../types/direction";
import { Character } from "../types/character";

export function calculateNextPosition(
  position: Position,
  direction: Direction,
  character: Character
): Position {
  switch (direction) {
    case DIRECTION.LEFT:
      return {
        top: position.top,
        left: Math.max(position.left - character.velocity, 0),
      };
    case DIRECTION.UP:
      return {
        top: Math.max(position.top - character.velocity, 0),
        left: position.left,
      };
    case DIRECTION.RIGHT:
      return {
        top: position.top,
        left: Math.min(
          position.left + character.velocity,
          window.innerWidth - character.border - character.size
        ),
      };

    default:
      return {
        top: Math.min(
          position.top + character.velocity,
          window.innerHeight -
            character.size -
            character.border -
            character.topScoreBoard
        ),
        left: position.left,
      };
  }
}
