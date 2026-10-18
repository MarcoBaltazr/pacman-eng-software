import styled from "styled-components";
import { Position } from "../types/position";
import colors from "../styles/Colors";
import { isWallCell, wallSize } from "../utils/walls";

type WallProps = {
  position: Position;
};

type StyledWallProps = WallProps & {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
};

// space left on the sides that do not touch another wall
const gap = 18;
const radius = 12;

const Wall = (props: WallProps) => {
  const column = props.position.left / wallSize;
  const row = props.position.top / wallSize;

  return (
    <StyledWall
      data-testid="wall"
      position={props.position}
      top={isWallCell(column, row - 1)}
      right={isWallCell(column + 1, row)}
      bottom={isWallCell(column, row + 1)}
      left={isWallCell(column - 1, row)}
    />
  );
};

const StyledWall = styled.div<StyledWallProps>`
  width: ${wallSize}px;
  height: ${wallSize}px;
  position: absolute;
  top: ${(props) => props.position.top}px;
  left: ${(props) => props.position.left}px;

  ::before,
  ::after {
    content: "";
    position: absolute;
    background-color: ${colors.color5};
  }

  ::before {
    top: ${gap}px;
    bottom: ${gap}px;
    left: ${(props) => (props.left ? 0 : gap)}px;
    right: ${(props) => (props.right ? 0 : gap)}px;
    border-radius: ${(props) => (props.left ? 0 : radius)}px
      ${(props) => (props.right ? 0 : radius)}px
      ${(props) => (props.right ? 0 : radius)}px
      ${(props) => (props.left ? 0 : radius)}px;
  }

  ::after {
    left: ${gap}px;
    right: ${gap}px;
    top: ${(props) => (props.top ? 0 : gap)}px;
    bottom: ${(props) => (props.bottom ? 0 : gap)}px;
    border-radius: ${(props) => (props.top ? 0 : radius)}px
      ${(props) => (props.top ? 0 : radius)}px
      ${(props) => (props.bottom ? 0 : radius)}px
      ${(props) => (props.bottom ? 0 : radius)}px;
  }
`;

export default Wall;
