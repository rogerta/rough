import type { Config, Options, Drawable, OpSet, Op, ResolvedOptions, PathInfo } from './core.js';
import type { Point } from './geometry.js';
import { line, solidFillPolygon, patternFillPolygons, rectangle, ellipseWithParams, generateEllipseParams, linearPath, arc, patternFillArc, curve, svgPath } from './renderer.js';
import { randomSeed } from './math.js';
import { curveToBezier } from 'points-on-curve/lib/curve-to-bezier.js';
import { pointsOnBezierCurves } from 'points-on-curve';
import { pointsOnPath } from 'points-on-path';

const NOS = 'none';

/**
 * The RoughGenerator class is used to generate drawable objects (shapes) without drawing them to a canvas or SVG.
 * These drawable objects can then be drawn using a RoughCanvas or RoughSVG instance.
 */
export class RoughGenerator {
  private config: Config;

  /**
   * Default options for the RoughGenerator instance.
   */
  defaultOptions: ResolvedOptions = {
    maxRandomnessOffset: 2,
    roughness: 1,
    bowing: 1,
    stroke: '#000',
    strokeWidth: 1,
    curveTightness: 0,
    curveFitting: 0.95,
    curveStepCount: 9,
    fillStyle: 'hachure',
    fillWeight: -1,
    hachureAngle: -41,
    hachureGap: -1,
    dashOffset: -1,
    dashGap: -1,
    zigzagOffset: -1,
    seed: 0,
    disableMultiStroke: false,
    disableMultiStrokeFill: false,
    preserveVertices: false,
    fillShapeRoughnessGain: 0.8,
  };

  /**
   * Creates a new RoughGenerator instance.
   * @param config Optional configuration for the RoughGenerator.
   */
  constructor(config?: Config) {
    this.config = config || {};
    if (this.config.options) {
      this.defaultOptions = this._o(this.config.options);
    }
  }

  /**
   * Generates a new random seed.
   * @returns A new random seed as a number.
   */
  static newSeed(): number {
    return randomSeed();
  }

  private _o(options?: Options): ResolvedOptions {
    return options ? Object.assign({}, this.defaultOptions, options) : this.defaultOptions;
  }

  private _d(shape: string, sets: OpSet[], options: ResolvedOptions): Drawable {
    return { shape, sets: sets || [], options: options || this.defaultOptions };
  }

  /**
   * Generates a line.
   * @param x1 The x-coordinate of the start point.
   * @param y1 The y-coordinate of the start point.
   * @param x2 The x-coordinate of the end point.
   * @param y2 The y-coordinate of the end point.
   * @param options Optional overrides for the drawing options.
   * @returns A Drawable object representing the line.
   */
  line(x1: number, y1: number, x2: number, y2: number, options?: Options): Drawable {
    const o = this._o(options);
    return this._d('line', [line(x1, y1, x2, y2, o)], o);
  }

  /**
   * Generates a rectangle.
   * @param x The x-coordinate of the top-left corner.
   * @param y The y-coordinate of the top-left corner.
   * @param width The width of the rectangle.
   * @param height The height of the rectangle.
   * @param options Optional overrides for the drawing options.
   * @returns A Drawable object representing the rectangle.
   */
  rectangle(x: number, y: number, width: number, height: number, options?: Options): Drawable {
    const o = this._o(options);
    const paths = [];
    const outline = rectangle(x, y, width, height, o);
    if (o.fill) {
      const points: Point[] = [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];
      if (o.fillStyle === 'solid') {
        paths.push(solidFillPolygon([points], o));
      } else {
        paths.push(patternFillPolygons([points], o));
      }
    }
    if (o.stroke !== NOS) {
      paths.push(outline);
    }
    return this._d('rectangle', paths, o);
  }

  /**
   * Generates an ellipse.
   * @param x The x-coordinate of the center.
   * @param y The y-coordinate of the center.
   * @param width The width of the ellipse.
   * @param height The height of the ellipse.
   * @param options Optional overrides for the drawing options.
   * @returns A Drawable object representing the ellipse.
   */
  ellipse(x: number, y: number, width: number, height: number, options?: Options): Drawable {
    const o = this._o(options);
    const paths: OpSet[] = [];
    const ellipseParams = generateEllipseParams(width, height, o);
    const ellipseResponse = ellipseWithParams(x, y, o, ellipseParams);
    if (o.fill) {
      if (o.fillStyle === 'solid') {
        const shape = ellipseWithParams(x, y, o, ellipseParams).opset;
        shape.type = 'fillPath';
        paths.push(shape);
      } else {
        paths.push(patternFillPolygons([ellipseResponse.estimatedPoints], o));
      }
    }
    if (o.stroke !== NOS) {
      paths.push(ellipseResponse.opset);
    }
    return this._d('ellipse', paths, o);
  }

  /**
   * Generates a circle.
   * @param x The x-coordinate of the center.
   * @param y The y-coordinate of the center.
   * @param diameter The diameter of the circle.
   * @param options Optional overrides for the drawing options.
   * @returns A Drawable object representing the circle.
   */
  circle(x: number, y: number, diameter: number, options?: Options): Drawable {
    const ret = this.ellipse(x, y, diameter, diameter, options);
    ret.shape = 'circle';
    return ret;
  }

  /**
   * Generates a linear path.
   * @param points An array of points representing the path.
   * @param options Optional overrides for the drawing options.
   * @returns A Drawable object representing the linear path.
   */
  linearPath(points: Point[], options?: Options): Drawable {
    const o = this._o(options);
    return this._d('linearPath', [linearPath(points, false, o)], o);
  }

  /**
   * Generates an arc.
   * @param x The x-coordinate of the center.
   * @param y The y-coordinate of the center.
   * @param width The width of the arc.
   * @param height The height of the arc.
   * @param start The start angle in radians.
   * @param stop The stop angle in radians.
   * @param closed If true, the arc will be closed (pie slice). Defaults to false.
   * @param options Optional overrides for the drawing options.
   * @returns A Drawable object representing the arc.
   */
  arc(x: number, y: number, width: number, height: number, start: number, stop: number, closed: boolean = false, options?: Options): Drawable {
    const o = this._o(options);
    const paths = [];
    const outline = arc(x, y, width, height, start, stop, closed, true, o);
    if (closed && o.fill) {
      if (o.fillStyle === 'solid') {
        const fillOptions: ResolvedOptions = { ...o };
        fillOptions.disableMultiStroke = true;
        const shape = arc(x, y, width, height, start, stop, true, false, fillOptions);
        shape.type = 'fillPath';
        paths.push(shape);
      } else {
        paths.push(patternFillArc(x, y, width, height, start, stop, o));
      }
    }
    if (o.stroke !== NOS) {
      paths.push(outline);
    }
    return this._d('arc', paths, o);
  }

  /**
   * Generates a curve.
   * @param points An array of points or an array of arrays of points (for multiple paths) representing the curve.
   * @param options Optional overrides for the drawing options.
   * @returns A Drawable object representing the curve.
   */
  curve(points: Point[] | Point[][], options?: Options): Drawable {
    const o = this._o(options);
    const paths: OpSet[] = [];
    const outline = curve(points, o);
    if (o.fill && o.fill !== NOS) {
      if (o.fillStyle === 'solid') {
        const fillShape = curve(points, { ...o, disableMultiStroke: true, roughness: o.roughness ? (o.roughness + o.fillShapeRoughnessGain) : 0 });
        paths.push({
          type: 'fillPath',
          ops: this._mergedShape(fillShape.ops),
        });
      } else {
        const polyPoints: Point[] = [];
        const inputPoints = points;
        if (inputPoints.length) {
          const p1 = inputPoints[0];
          const pointsList = (typeof p1[0] === 'number') ? [inputPoints as Point[]] : inputPoints as Point[][];
          for (const points of pointsList) {
            if (points.length < 3) {
              polyPoints.push(...points);
            } else if (points.length === 3) {
              polyPoints.push(...pointsOnBezierCurves(curveToBezier([
                points[0],
                points[0],
                points[1],
                points[2],
              ]), 10, (1 + o.roughness) / 2));
            } else {
              polyPoints.push(...pointsOnBezierCurves(curveToBezier(points), 10, (1 + o.roughness) / 2));
            }
          }
        }
        if (polyPoints.length) {
          paths.push(patternFillPolygons([polyPoints], o));
        }
      }
    }
    if (o.stroke !== NOS) {
      paths.push(outline);
    }
    return this._d('curve', paths, o);
  }

  /**
   * Generates a polygon.
   * @param points An array of points representing the polygon.
   * @param options Optional overrides for the drawing options.
   * @returns A Drawable object representing the polygon.
   */
  polygon(points: Point[], options?: Options): Drawable {
    const o = this._o(options);
    const paths: OpSet[] = [];
    const outline = linearPath(points, true, o);
    if (o.fill) {
      if (o.fillStyle === 'solid') {
        paths.push(solidFillPolygon([points], o));
      } else {
        paths.push(patternFillPolygons([points], o));
      }
    }
    if (o.stroke !== NOS) {
      paths.push(outline);
    }
    return this._d('polygon', paths, o);
  }

  /**
   * Generates a shape from an SVG path string.
   * @param d The SVG path string.
   * @param options Optional overrides for the drawing options.
   * @returns A Drawable object representing the path.
   */
  path(d: string, options?: Options): Drawable {
    const o = this._o(options);
    const paths: OpSet[] = [];
    if (!d) {
      return this._d('path', paths, o);
    }
    d = (d || '').replace(/\n/g, ' ').replace(/(-\s)/g, '-').replace('/(\s\s)/g', ' ');

    const hasFill = o.fill && o.fill !== 'transparent' && o.fill !== NOS;
    const hasStroke = o.stroke !== NOS;
    const simplified = !!(o.simplification && (o.simplification < 1));
    const distance = simplified ? (4 - 4 * (o.simplification || 1)) : ((1 + o.roughness) / 2);
    const sets = pointsOnPath(d, 1, distance);
    const shape = svgPath(d, o);

    if (hasFill) {
      if (o.fillStyle === 'solid') {
        if (sets.length === 1) {
          const fillShape = svgPath(d, { ...o, disableMultiStroke: true, roughness: o.roughness ? (o.roughness + o.fillShapeRoughnessGain) : 0 });
          paths.push({
            type: 'fillPath',
            ops: this._mergedShape(fillShape.ops),
          });
        } else {
          paths.push(solidFillPolygon(sets, o));
        }
      } else {
        paths.push(patternFillPolygons(sets, o));
      }
    }
    if (hasStroke) {
      if (simplified) {
        sets.forEach((set) => {
          paths.push(linearPath(set, false, o));
        });
      } else {
        paths.push(shape);
      }
    }

    return this._d('path', paths, o);
  }

  /**
   * Converts an OpSet to an SVG path string.
   * @param drawing The OpSet to convert.
   * @param fixedDecimals Optional number of decimal places to fix coordinates to.
   * @returns The SVG path string.
   */
  opsToPath(drawing: OpSet, fixedDecimals?: number): string {
    let path = '';
    for (const item of drawing.ops) {
      const data = ((typeof fixedDecimals === 'number') && fixedDecimals >= 0) ? (item.data.map((d) => +d.toFixed(fixedDecimals))) : item.data;
      switch (item.op) {
        case 'move':
          path += `M${data[0]} ${data[1]} `;
          break;
        case 'bcurveTo':
          path += `C${data[0]} ${data[1]}, ${data[2]} ${data[3]}, ${data[4]} ${data[5]} `;
          break;
        case 'lineTo':
          path += `L${data[0]} ${data[1]} `;
          break;
      }
    }
    return path.trim();
  }

  /**
   * Converts a Drawable object to an array of PathInfo objects, which can be used to render the shape as SVG paths.
   * @param drawable The Drawable object to convert.
   * @returns An array of PathInfo objects.
   */
  toPaths(drawable: Drawable): PathInfo[] {
    const sets = drawable.sets || [];
    const o = drawable.options || this.defaultOptions;
    const paths: PathInfo[] = [];
    for (const drawing of sets) {
      let path: PathInfo | null = null;
      switch (drawing.type) {
        case 'path':
          path = {
            d: this.opsToPath(drawing),
            stroke: o.stroke,
            strokeWidth: o.strokeWidth,
            fill: NOS,
          };
          break;
        case 'fillPath':
          path = {
            d: this.opsToPath(drawing),
            stroke: NOS,
            strokeWidth: 0,
            fill: o.fill || NOS,
          };
          break;
        case 'fillSketch':
          path = this.fillSketch(drawing, o);
          break;
      }
      if (path) {
        paths.push(path);
      }
    }
    return paths;
  }

  private fillSketch(drawing: OpSet, o: ResolvedOptions): PathInfo {
    let fweight = o.fillWeight;
    if (fweight < 0) {
      fweight = o.strokeWidth / 2;
    }
    return {
      d: this.opsToPath(drawing),
      stroke: o.fill || NOS,
      strokeWidth: fweight,
      fill: NOS,
    };
  }

  private _mergedShape(input: Op[]): Op[] {
    return input.filter((d, i) => {
      if (i === 0) {
        return true;
      }
      if (d.op === 'move') {
        return false;
      }
      return true;
    });
  }
}
