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
  /////////////////////////////////////////////////////////////////////////////
  // Options that affect all shape generation.

  /**
   * Maximum offset from the actual point in a line.
   */
  maxRandomnessOffset?: number;
  /**
   * Numerical value indicating how rough the drawing is. 0 is a perfect shape.
   * Numbers above 10 are pretty useless.
   */
  roughness?: number;
  /**
   * Numerical value indicating how curvy the lines are when drawing a shape.
   * Zero is a straight line, while higher values will make the shape more
   * curvy.
   */
  bowing?: number;
  /**
   * Fill style.
   */
  fillStyle?: 'hachure' | 'solid' | 'zigzag' | 'cross-hatch' | 'dots' | 'dashed' | 'zigzag-line';
  /**
   * Angle of hachure lines.
   */
  hachureAngle?: number;
  /**
   * Gap between hachure lines.
   */
  hachureGap?: number;
  /**
   * Zigzag offset for zigzag fills.
   */
  zigzagOffset?: number;
  /**
   * Random seed for reproducible drawings.
   */
  seed?: number;
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

  /////////////////////////////////////////////////////////////////////////////
  // Presenation properties.  These should eventually be removed and replaced
  // with CSS properties.  This gets a little tricker for canvas.

  /**
   * Color of the stroke.
   */
  stroke?: string;
  /**
   * Width of the stroke.
   */
  strokeWidth?: number;
  /**
   * Color used to fill the shape.
   */
  fill?: string;
  /**
   * Weight of the fill lines.
   */
  fillWeight?: number;
  /**
   * Dash offset for dashed fills.
   */
  dashOffset?: number;
  /**
   * Dash gap for dashed fills.
   */
  dashGap?: number;
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

  /////////////////////////////////////////////////////////////////////////////
  // Options that affect shape generation that are curve-based, like ellipses,
  // curves, arcs, and curves.

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

  /////////////////////////////////////////////////////////////////////////////
  // Options that affect shape generation from SVG paths.

  /**
   * Simplification factor for paths.
   */
  simplification?: number;
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