/**
 * A point represented as a tuple of [x, y] coordinates.
 */
export type Point = [number, number];

/**
 * A line represented as a tuple of [Point, Point].
 */
export type Line = [Point, Point];

/**
 * A rectangle represented by its top left corner and width and height.
 */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Calculates the length of a line segment.
 * @param line The line segment.
 * @returns The length of the line segment.
 */
export function lineLength(line: Line): number {
  const p1 = line[0];
  const p2 = line[1];
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}