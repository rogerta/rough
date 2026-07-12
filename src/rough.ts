import type { Config } from './core';
import { RoughCanvas } from './canvas';
import { RoughGenerator } from './generator';
import { RoughSVG } from './svg';

export * from './core';
export type * from './geometry';
export { RoughCanvas } from './canvas';
export { RoughGenerator } from './generator';
export { RoughSVG } from './svg';

/**
 * Creates a `RoughCanvas` instance for drawing on an HTML canvas.
 * `RoughCanvas` can only be used in browser contexts since it depends
 * on the Canvas API and `HTMLCanvasElement`.
 *
 * @param canvas The `HTMLCanvasElement` to draw on.
 * @param config Optional configuration.
 * @returns A new `RoughCanvas` instance.
 */
export function canvas(
    canvas: HTMLCanvasElement,
    config?: Config): RoughCanvas {
  return new RoughCanvas(canvas, config);
}

/**
 * Creates a `RoughSVG` instance for drawing on an SVG element.
 * `RoughSVG` can only be used in browser contexts since it depends
 * on the Canvas API and `SVGSVGElement`.
 *
 * @param svg The `SVGSVGElement` to draw on.
 * @param config Optional configuration.
 * @returns A new `RoughSVG` instance.
 */
export function svg(svg: SVGSVGElement, config?: Config): RoughSVG {
  return new RoughSVG(svg, config);
}

/**
 * Creates a `RoughGenerator` instance for generating drawable shapes.
 * `RoughGenerator` has not dependency on the browser contexts and can be
 * used server-side for shape generation.
 *
 * @param config Optional configuration for the RoughGenerator.
 * @returns A new RoughGenerator instance.
 */
export function generator(config?: Config): RoughGenerator {
  return new RoughGenerator(config);
}

/**
 * Generates a new random seed.
 * @returns A new random seed as a number.
 */
export function newSeed(): number {
  return RoughGenerator.newSeed();
}

