import { isPacmanOverFood, isTouchingGhost } from "./collision";

test("pacman eats a food that is within its reach", () => {
  expect(
    isPacmanOverFood({ top: 60, left: 60 }, { top: 60, left: 60 }, 60)
  ).toBe(true);
  expect(
    isPacmanOverFood({ top: 60, left: 40 }, { top: 60, left: 60 }, 60)
  ).toBe(true);
});

test("pacman does not eat a food out of its reach", () => {
  expect(
    isPacmanOverFood({ top: 60, left: 30 }, { top: 60, left: 60 }, 60)
  ).toBe(false);
  expect(
    isPacmanOverFood({ top: 0, left: 60 }, { top: 60, left: 60 }, 60)
  ).toBe(false);
});

test("pacman touches a ghost that overlaps it", () => {
  expect(
    isTouchingGhost({ top: 300, left: 0 }, { top: 300, left: 40 }, 60)
  ).toBe(true);
});

test("pacman does not touch a ghost that is one size away", () => {
  expect(
    isTouchingGhost({ top: 300, left: 0 }, { top: 300, left: 60 }, 60)
  ).toBe(false);
  expect(
    isTouchingGhost({ top: 240, left: 0 }, { top: 300, left: 0 }, 60)
  ).toBe(false);
});
