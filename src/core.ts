import type { Point } from './geometry';
import { Random } from './math';

export const SVGNS = 'http://www.w3.org/2000/svg';

/**
 * Configuration for Rough.js instances.
 */
export interface Config {
  /**
   * Default options to be used by the Rough.js instance.
   */
  options?: Options;
}

/**
 * Interface for a drawing surface (Canvas or SVG).
 */
export interface DrawingSurface {
  width: number | SVGAnimatedLength;
  height: number | SVGAnimatedLength;
}

/**
 * Options for drawing shapes.
 */
export interface Options {
  /**
   * Maximum offset from the actual point in a line.
   */
  maxRandomnessOffset?: number;
  /**
   * Numerical value indicating how rough the drawing is. 0 is a perfect shape.
   */
  roughness?: number;
  /**
   * Numerical value indicating how curvy the lines are when drawing a shape.
   */
  bowing?: number;
  /**
   * Color of the stroke.
   */
  stroke?: string;
  /**
   * Width of the stroke.
   */
  strokeWidth?: number;
  /**
   * Curve fitting for curve-based shapes.
   */
  curveFitting?: number;
  /**
   * Tightness of the curve.
   */
  curveTightness?: number;
  /**
   * Number of steps for curve generation.
   */
  curveStepCount?: number;
  /**
   * Color used to fill the shape.
   */
  fill?: string;
  /**
   * Fill style.
   */
  fillStyle?: 'hachure' | 'solid' | 'zigzag' | 'cross-hatch' | 'dots' | 'dashed' | 'zigzag-line';
  /**
   * Weight of the fill lines.
   */
  fillWeight?: number;
  /**
   * Angle of hachure lines.
   */
  hachureAngle?: number;
  /**
   * Gap between hachure lines.
   */
  hachureGap?: number;
  /**
   * Simplification factor for paths.
   */
  simplification?: number;
  /**
   * Dash offset for dashed fills.
   */
  dashOffset?: number;
  /**
   * Dash gap for dashed fills.
   */
  dashGap?: number;
  /**
   * Zigzag offset for zigzag fills.
   */
  zigzagOffset?: number;
  /**
   * Random seed for reproducible drawings.
   */
  seed?: number;
  /**
   * Line dash for the stroke.
   */
  strokeLineDash?: number[];
  /**
   * Line dash offset for the stroke.
   */
  strokeLineDashOffset?: number;
  /**
   * Line dash for the fill.
   */
  fillLineDash?: number[];
  /**
   * Line dash offset for the fill.
   */
  fillLineDashOffset?: number;
  /**
   * If true, multi-stroke will be disabled for the stroke.
   */
  disableMultiStroke?: boolean;
  /**
   * If true, multi-stroke will be disabled for the fill.
   */
  disableMultiStrokeFill?: boolean;
  /**
   * If true, vertices of the shape will be preserved and not randomized.
   */
  preserveVertices?: boolean;
  /**
   * Number of decimal places to fix coordinates to.
   */
  fixedDecimalPlaceDigits?: number;
  /**
   * Extra roughness gain for fill shapes.
   */
  fillShapeRoughnessGain?: number;
}

/**
 * Options with all optional properties resolved to their default values.
 */
export interface ResolvedOptions extends Required<Options> {
  randomizer?: Random;
}

export declare type OpType = 'move' | 'bcurveTo' | 'lineTo';
export declare type OpSetType = 'path' | 'fillPath' | 'fillSketch';

/**
 * A single drawing operation.
 */
export interface Op {
  op: OpType;
  data: number[];
}

/**
 * A set of drawing operations representing a part of a shape (e.g., outline or fill).
 */
export interface OpSet {
  type: OpSetType;
  ops: Op[];
  size?: Point;
  path?: string;
}

/**
 * A drawable object containing the instructions and options for a shape.
 */
export interface Drawable {
  shape: string;
  options: ResolvedOptions;
  sets: OpSet[];
}

/**
 * Information about an SVG path.
 */
export interface PathInfo {
  /**
   * The path data string (d attribute).
   */
  d: string;
  /**
   * Stroke color.
   */
  stroke: string;
  /**
   * Stroke width.
   */
  strokeWidth: number;
  /**
   * Fill color.
   */
  fill?: string;
}