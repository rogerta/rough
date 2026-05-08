import type { Config } from './core';
import { RoughCanvas } from './canvas';
import { RoughGenerator } from './generator';
import { RoughSVG } from './svg';

/**
 * The main entry point for Rough.js.
 *
 * Provides methods to create RoughCanvas, RoughSVG, and RoughGenerator instances.
 */
export default {
  /**
   * Creates a RoughCanvas instance for drawing on an HTML canvas.
   * @param canvas The HTMLCanvasElement to draw on.
   * @param config Optional configuration for the RoughCanvas.
   * @returns A new RoughCanvas instance.
   */
  canvas(canvas: HTMLCanvasElement, config?: Config) {
    return new RoughCanvas(canvas, config);
  },

  /**
   * Creates a RoughSVG instance for drawing on an SVG element.
   * @param svg The SVGSVGElement to draw on.
   * @param config Optional configuration for the RoughSVG.
   * @returns A new RoughSVG instance.
   */
  svg(svg: SVGSVGElement, config?: Config) {
    return new RoughSVG(svg, config);
  },

  /**
   * Creates a RoughGenerator instance for generating drawable shapes.
   * @param config Optional configuration for the RoughGenerator.
   * @returns A new RoughGenerator instance.
   */
  generator(config?: Config) {
    return new RoughGenerator(config);
  },

  /**
   * Generates a new random seed.
   * @returns A new random seed as a number.
   */
  newSeed(): number {
    return RoughGenerator.newSeed();
  },
};
