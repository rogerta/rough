import type { Config } from './core';
import { RoughCanvas } from './canvas';
import { RoughGenerator } from './generator';
import { RoughSVG } from './svg';

/**
 * Creates a RoughCanvas instance for drawing on an HTML canvas.
 * @param canvas The HTMLCanvasElement to draw on.
 * @param config Optional configuration for the RoughCanvas.
 * @returns A new RoughCanvas instance.
 */
export function canvas(
    canvas: HTMLCanvasElement,
    config?: Config): RoughCanvas {
  return new RoughCanvas(canvas, config);
}

/**
 * Creates a RoughSVG instance for drawing on an SVG element.
 * @param svg The SVGSVGElement to draw on.
 * @param config Optional configuration for the RoughSVG.
 * @returns A new RoughSVG instance.
 */
export function svg(svg: SVGSVGElement, config?: Config): RoughSVG {
  return new RoughSVG(svg, config);
}

/**
 * Creates a RoughGenerator instance for generating drawable shapes.
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

