import type { Config, Options, ResolvedOptions, Drawable, OpSet } from './core';
import { RoughGenerator } from './generator';
import type { Point } from './geometry';

/**
 * The RoughCanvas class is used to draw hand-drawn, sketchy shapes on an
 * HTML canvas.
 */
export class RoughCanvas {
  /** @ignore */
  private gen: RoughGenerator;
  /** @ignore */
  private canvas: HTMLCanvasElement;
  /** @ignore */
  private ctx: CanvasRenderingContext2D;

  /**
   * Creates a new RoughCanvas instance.
   * @param canvas The HTMLCanvasElement to draw on.
   * @param config Optional configuration for the RoughCanvas.
   */
  constructor(canvas: HTMLCanvasElement, config?: Config) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
    this.gen = new RoughGenerator(config);
  }

  /**
   * Draws a Drawable object to the canvas.
   * @param drawable The Drawable object to draw.
   */
  draw(drawable: Drawable): void {
    const sets = drawable.sets || [];
    const o = drawable.options || this.getDefaultOptions();
    const ctx = this.ctx;
    const precision = drawable.options.fixedDecimalPlaceDigits;
    for (const drawing of sets) {
      switch (drawing.type) {
        case 'path':
          ctx.save();
          ctx.strokeStyle = o.stroke === 'none' ? 'transparent' : o.stroke;
          ctx.lineWidth = o.strokeWidth;
          if (o.strokeLineDash.length > 0) {
            ctx.setLineDash(o.strokeLineDash);
          }
          if (o.strokeLineDashOffset) {
            ctx.lineDashOffset = o.strokeLineDashOffset;
          }
          this._drawToContext(ctx, drawing, precision);
          ctx.restore();
          break;
        case 'fillPath': {
          ctx.save();
          ctx.fillStyle = o.fill;
          const fillRule: CanvasFillRule = (drawable.shape === 'curve' || drawable.shape === 'polygon' || drawable.shape === 'path') ? 'evenodd' : 'nonzero';
          this._drawToContext(ctx, drawing, precision, fillRule);
          ctx.restore();
          break;
        }
        case 'fillSketch':
          this.fillSketch(ctx, drawing, o);
          break;
      }
    }
  }

  /** @ignore */
  private fillSketch(ctx: CanvasRenderingContext2D, drawing: OpSet, o: ResolvedOptions) {
    let fweight = o.fillWeight;
    if (fweight < 0) {
      fweight = o.strokeWidth / 2;
    }
    ctx.save();
    if (o.fillLineDash.length > 0) {
      ctx.setLineDash(o.fillLineDash);
    }
    if (o.fillLineDashOffset) {
      ctx.lineDashOffset = o.fillLineDashOffset;
    }
    ctx.strokeStyle = o.fill;
    ctx.lineWidth = fweight;
    this._drawToContext(ctx, drawing, o.fixedDecimalPlaceDigits);
    ctx.restore();
  }

  /** @ignore */
  private _drawToContext(ctx: CanvasRenderingContext2D, drawing: OpSet, fixedDecimals: number, rule: CanvasFillRule = 'nonzero') {
    ctx.beginPath();
    for (const item of drawing.ops) {
      const data = fixedDecimals >= 0 ? (item.data.map((d) => +d.toFixed(fixedDecimals))) : item.data;
      switch (item.op) {
        case 'move':
          ctx.moveTo(data[0], data[1]);
          break;
        case 'bcurveTo':
          ctx.bezierCurveTo(data[0], data[1], data[2], data[3], data[4], data[5]);
          break;
        case 'lineTo':
          ctx.lineTo(data[0], data[1]);
          break;
      }
    }
    if (drawing.type === 'fillPath') {
      ctx.fill(rule);
    } else {
      ctx.stroke();
    }
  }

  /**
   * Returns the RoughGenerator instance used by this RoughCanvas.
   */
  get generator(): RoughGenerator {
    return this.gen;
  }

  /**
   * Returns the default options used by this RoughCanvas.
   */
  getDefaultOptions(): ResolvedOptions {
    return this.gen.defaultOptions;
  }

  /**
   * Draws a line.
   * @param x1 The x-coordinate of the start point.
   * @param y1 The y-coordinate of the start point.
   * @param x2 The x-coordinate of the end point.
   * @param y2 The y-coordinate of the end point.
   * @param options Optional overrides for the drawing options.
   * @returns A Drawable object representing the line.
   */
  line(x1: number, y1: number, x2: number, y2: number, options?: Options): Drawable {
    const d = this.gen.line(x1, y1, x2, y2, options);
    this.draw(d);
    return d;
  }

  /**
   * Draws a rectangle.
   * @param x The x-coordinate of the top-left corner.
   * @param y The y-coordinate of the top-left corner.
   * @param width The width of the rectangle.
   * @param height The height of the rectangle.
   * @param options Optional overrides for the drawing options.
   * @returns A Drawable object representing the rectangle.
   */
  rectangle(x: number, y: number, width: number, height: number, options?: Options): Drawable {
    const d = this.gen.rectangle(x, y, width, height, options);
    this.draw(d);
    return d;
  }

  /**
   * Draws an ellipse.
   * @param x The x-coordinate of the center.
   * @param y The y-coordinate of the center.
   * @param width The width of the ellipse.
   * @param height The height of the ellipse.
   * @param options Optional overrides for the drawing options.
   * @returns A Drawable object representing the ellipse.
   */
  ellipse(x: number, y: number, width: number, height: number, options?: Options): Drawable {
    const d = this.gen.ellipse(x, y, width, height, options);
    this.draw(d);
    return d;
  }

  /**
   * Draws a circle.
   * @param x The x-coordinate of the center.
   * @param y The y-coordinate of the center.
   * @param diameter The diameter of the circle.
   * @param options Optional overrides for the drawing options.
   * @returns A Drawable object representing the circle.
   */
  circle(x: number, y: number, diameter: number, options?: Options): Drawable {
    const d = this.gen.circle(x, y, diameter, options);
    this.draw(d);
    return d;
  }

  /**
   * Draws a linear path.
   * @param points An array of points representing the path.
   * @param options Optional overrides for the drawing options.
   * @returns A Drawable object representing the linear path.
   */
  linearPath(points: Point[], options?: Options): Drawable {
    const d = this.gen.linearPath(points, options);
    this.draw(d);
    return d;
  }

  /**
   * Draws a polygon.
   * @param points An array of points representing the polygon.
   * @param options Optional overrides for the drawing options.
   * @returns A Drawable object representing the polygon.
   */
  polygon(points: Point[], options?: Options): Drawable {
    const d = this.gen.polygon(points, options);
    this.draw(d);
    return d;
  }

  /**
   * Draws an arc.
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
    const d = this.gen.arc(x, y, width, height, start, stop, closed, options);
    this.draw(d);
    return d;
  }

  /**
   * Draws a curve.
   * @param points An array of points or an array of arrays of points (for multiple paths) representing the curve.
   * @param options Optional overrides for the drawing options.
   * @returns A Drawable object representing the curve.
   */
  curve(points: Point[] | Point[][], options?: Options): Drawable {
    const d = this.gen.curve(points, options);
    this.draw(d);
    return d;
  }

  /**
   * Draws a shape from an SVG path string.
   * @param d The SVG path string.
   * @param options Optional overrides for the drawing options.
   * @returns A Drawable object representing the path.
   */
  path(d: string, options?: Options): Drawable {
    const drawing = this.gen.path(d, options);
    this.draw(drawing);
    return drawing;
  }
}
