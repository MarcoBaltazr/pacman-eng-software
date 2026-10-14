import { calculateNextPosition } from "./movement";
import { DIRECTION } from "../types/direction";
import { Character } from "../types/character";

// jsdom window is 1024x768
const character: Character = {
  velocity: 30,
  size: 60,
  border: 20,
  topScoreBoard: 100,
  color: "yellow",
  name: "test",
};

test.each([
  [DIRECTION.LEFT, { top: 200, left: 170 }],
  [DIRECTION.UP, { top: 170, left: 200 }],
  [DIRECTION.RIGHT, { top: 200, left: 230 }],
  [DIRECTION.DOWN, { top: 230, left: 200 }],
])("moves %s by the character velocity", (direction, expected) => {
  expect(
    calculateNextPosition({ top: 200, left: 200 }, direction, character)
  ).toEqual(expected);
});

test.each([
  [DIRECTION.LEFT, { top: 10, left: 10 }, { top: 10, left: 0 }],
  [DIRECTION.UP, { top: 10, left: 10 }, { top: 0, left: 10 }],
  [DIRECTION.RIGHT, { top: 10, left: 930 }, { top: 10, left: 944 }],
  [DIRECTION.DOWN, { top: 580, left: 10 }, { top: 588, left: 10 }],
])("does not cross the border when moving %s", (direction, from, expected) => {
  expect(calculateNextPosition(from, direction, character)).toEqual(expected);
});
