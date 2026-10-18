import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import { ARROW } from "./types/direction";

// jsdom window is 1024x768, which gives a 16x10 grid with 34 walls

const TICK = 100;

function tick(times = 1) {
  for (let i = 0; i < times; i++) {
    act(() => {
      jest.advanceTimersByTime(TICK);
    });
  }
}

function score() {
  return screen.getByText(/\/ 126/).textContent;
}

function pressArrow(keyCode: ARROW) {
  fireEvent.keyDown(document, { keyCode });
}

function timeElapsed() {
  // eslint-disable-next-line testing-library/no-node-access
  return screen.getByText("Time elapsed:").nextSibling?.textContent;
}

function selectDifficulty(value: string) {
  fireEvent.change(screen.getByRole("combobox"), { target: { value } });
}

function ghostCount(container: HTMLElement) {
  return container.querySelectorAll("svg").length;
}

function positionOf(element: Element) {
  const style = getComputedStyle(element as HTMLElement);
  return { left: style.left, top: style.top };
}

function pacmanPosition(container: HTMLElement) {
  return positionOf(container.querySelector('[tabindex="0"]')!);
}

function ghostPositions(container: HTMLElement) {
  return Array.from(container.querySelectorAll("svg")).map((svg) =>
    positionOf(svg.parentElement!)
  );
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.spyOn(Math, "random").mockReturnValue(0);
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

test("starts paused, with the difficulty selector and the food counter", () => {
  render(<App />);

  expect(screen.getByText("PACMAN")).toBeInTheDocument();
  expect(screen.getByText("Set Difficulty")).toBeInTheDocument();
  expect(screen.getByRole("combobox")).toHaveValue("medium");
  expect(score()).toBe("1 / 126");
});

test("nothing moves while the game is paused", () => {
  const { container } = render(<App />);

  tick(20);

  expect(score()).toBe("1 / 126");
  expect(pacmanPosition(container)).toEqual({ left: "0px", top: "0px" });
  ghostPositions(container).forEach((position) =>
    expect(position).toEqual({ left: "300px", top: "300px" })
  );
  expect(screen.getByText("Set Difficulty")).toBeInTheDocument();
});

test("number of ghosts depends on the difficulty", () => {
  const { container } = render(<App />);
  expect(ghostCount(container)).toBe(3);

  selectDifficulty("easy");
  expect(ghostCount(container)).toBe(2);

  selectDifficulty("advanced");
  expect(ghostCount(container)).toBe(4);
});

test("pacman moves right and eats the food along the first row", () => {
  const { container } = render(<App />);
  fireEvent.click(screen.getByText("Play!"));

  expect(screen.queryByText("Set Difficulty")).not.toBeInTheDocument();

  tick(10);

  expect(pacmanPosition(container)).toEqual({ left: "300px", top: "0px" });
  expect(score()).toBe("6 / 126");
});

test("pacman stops at the right border", () => {
  const { container } = render(<App />);
  fireEvent.click(screen.getByText("Play!"));

  tick(40);

  // window width - border - pacman size = 1024 - 20 - 60
  expect(pacmanPosition(container)).toEqual({ left: "944px", top: "0px" });
});

test.each([
  ["easy", "255px"],
  ["medium", "240px"],
  ["advanced", "210px"],
])("ghosts move at the %s velocity", (difficulty, left) => {
  const { container } = render(<App />);
  selectDifficulty(difficulty);
  fireEvent.click(screen.getByText("Play!"));

  tick(3);

  ghostPositions(container).forEach((position) =>
    expect(position).toEqual({ left, top: "300px" })
  );
});

test.each([
  [0, "left", { left: "0px", top: "300px" }],
  [0.3, "up", { left: "180px", top: "0px" }],
  [0.6, "down", { left: "180px", top: "588px" }],
  [0.9, "right", { left: "944px", top: "300px" }],
])("ghosts stop at the borders (random %p, %s)", (random, _, expected) => {
  jest.spyOn(Math, "random").mockReturnValue(random as number);
  const { container } = render(<App />);
  fireEvent.click(screen.getByText("Play!"));
  pressArrow(ARROW.LEFT);

  tick(60);

  ghostPositions(container).forEach((position) =>
    expect(position).toEqual(expected)
  );
});

test("time elapsed counts seconds only while playing", () => {
  render(<App />);
  tick(30);
  expect(timeElapsed()).toBe("0");

  fireEvent.click(screen.getByText("Play!"));
  tick(30);

  expect(timeElapsed()).toBe("3");
});

test("arrow keys change pacman direction", () => {
  const { container } = render(<App />);
  fireEvent.click(screen.getByText("Play!"));

  pressArrow(ARROW.DOWN);
  tick(4);
  expect(pacmanPosition(container)).toEqual({ left: "0px", top: "120px" });
  expect(score()).toBe("3 / 126");

  pressArrow(ARROW.RIGHT);
  tick(2);
  expect(pacmanPosition(container)).toEqual({ left: "60px", top: "120px" });

  pressArrow(ARROW.UP);
  tick(1);
  expect(pacmanPosition(container)).toEqual({ left: "60px", top: "90px" });
});

test("pacman does not leave the top and left borders", () => {
  const { container } = render(<App />);
  fireEvent.click(screen.getByText("Play!"));

  pressArrow(ARROW.LEFT);
  tick(5);
  expect(pacmanPosition(container)).toEqual({ left: "0px", top: "0px" });

  pressArrow(ARROW.UP);
  tick(5);
  expect(pacmanPosition(container)).toEqual({ left: "0px", top: "0px" });
  expect(score()).toBe("1 / 126");
});

test("pacman stops at the bottom border", () => {
  const { container } = render(<App />);
  fireEvent.click(screen.getByText("Play!"));

  pressArrow(ARROW.DOWN);
  tick(30);

  // window height - pacman size - border - score board = 768 - 60 - 20 - 100
  expect(pacmanPosition(container)).toEqual({ left: "0px", top: "588px" });
});

function playUntilGhostReachesPacman() {
  fireEvent.click(screen.getByText("Play!"));
  pressArrow(ARROW.DOWN);
  tick(10);
  pressArrow(ARROW.LEFT);
}

test("touching a ghost on medium ends the game", () => {
  render(<App />);
  playUntilGhostReachesPacman();

  tick(2);
  expect(screen.queryByText("GAME OVER :(")).not.toBeInTheDocument();

  tick(3);
  expect(screen.getByText("GAME OVER :(")).toBeInTheDocument();
});

test("ghosts are slower on easy", () => {
  render(<App />);
  selectDifficulty("easy");
  playUntilGhostReachesPacman();

  tick(5);
  expect(screen.queryByText("GAME OVER :(")).not.toBeInTheDocument();

  tick(5);
  expect(screen.getByText("GAME OVER :(")).toBeInTheDocument();
});

test("try again restarts score and time", () => {
  render(<App />);
  playUntilGhostReachesPacman();
  tick(5);

  fireEvent.click(screen.getByText("Try Again"));

  expect(screen.queryByText("GAME OVER :(")).not.toBeInTheDocument();
  expect(score()).toBe("1 / 126");
  expect(timeElapsed()).toBe("0");
});
