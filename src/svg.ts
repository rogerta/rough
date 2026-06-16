import type { Config, Options, OpSet, ResolvedOptions, Drawable } from './core';
import { SVGNS } from './core';
import { RoughGenerator } from './generator';
import type { Point } from './geometry';

/**
 * The RoughSVG class is used to draw hand-drawn, sketchy shapes as SVG elements.
 */
export class RoughSVG {
  private gen: RoughGenerator;
  private svg: SVGSVGElement;

  /**
   * Creates a new RoughSVG instance.
   * @param svg The SVGSVGElement to draw on.
   * @param config Optional configuration for the RoughSVG.
   */
  constructor(svg: SVGSVGElement, config?: Config) {
    this.svg = svg;
    this.gen = new RoughGenerator(config);
  }

  /**
   * Draws a Drawable object and returns an SVG G element containing the shape.
   * @param drawable The Drawable object to draw.
   * @returns An SVGGElement containing the rendered shape.
   */
  draw(drawable: Drawable): SVGGElement {
    const sets = drawable.sets || [];
    const o = drawable.options || this.getDefaultOptions();
    const doc = this.svg.ownerDocument || window.document;
    const g = doc.createElementNS(SVGNS, 'g');
    g.classList.add(drawable.shape);
    const precision = drawable.options.fixedDecimalPlaceDigits;
    for (const drawing of sets) {
      let path = null;
      switch (drawing.type) {
        case 'path': {
          path = doc.createElementNS(SVGNS, 'path');
          path.setAttribute('d', this.opsToPath(drawing, precision));
          path.classList.add('outline');

          // The following are presentation attributes which can be overridden
          // with CSS.
          path.setAttribute('stroke', o.stroke);
          path.setAttribute('stroke-width', o.strokeWidth + '');
          path.setAttribute('fill', 'none');
          if (o.strokeLineDash.length > 0) {
            path.setAttribute('stroke-dasharray', o.strokeLineDash.join(' ').trim());
          }
          if (o.strokeLineDashOffset) {
            path.setAttribute('stroke-dashoffset', `${o.strokeLineDashOffset}`);
          }
          break;
        }
        case 'fillPath': {
          path = doc.createElementNS(SVGNS, 'path');
          path.setAttribute('d', this.opsToPath(drawing, precision));
          path.classList.add('solid-fill');

          // The following are presentation attributes which can be overridden
          // with CSS.
          path.setAttribute('stroke', 'none');
          path.setAttribute('stroke-width', '0');
          path.setAttribute('fill', o.fill);
          if (drawable.shape === 'curve' || drawable.shape === 'polygon') {
            path.setAttribute('fill-rule', 'evenodd');
          }
          break;
        }
        case 'fillSketch': {
          path = this.fillSketch(doc, drawing, o);
          break;
        }
      }
      if (path) {
        g.appendChild(path);
      }
    }
    return g;
  }

  private fillSketch(doc: Document, drawing: OpSet, o: ResolvedOptions): SVGPathElement {
    let fweight = o.fillWeight;
    if (fweight < 0) {
      fweight = o.strokeWidth / 2;
    }
    const path = doc.createElementNS(SVGNS, 'path');
    path.setAttribute('d', this.opsToPath(drawing, o.fixedDecimalPlaceDigits));
    path.classList.add('pattern-fill');

    // The following are presentation attributes which can be overridden
    // with CSS.
    path.setAttribute('stroke', o.fill);
    path.setAttribute('stroke-width', fweight + '');
    path.setAttribute('fill', 'none');
    if (o.fillLineDash.length > 0) {
      path.setAttribute('stroke-dasharray', o.fillLineDash.join(' ').trim());
    }
    if (o.fillLineDashOffset) {
      path.setAttribute('stroke-dashoffset', `${o.fillLineDashOffset}`);
    }
    return path;
  }

  /**
   * Returns the RoughGenerator instance used by this RoughSVG.
   */
  get generator(): RoughGenerator {
    return this.gen;
  }

  /**
   * Returns the default options used by this RoughSVG.
   */
  getDefaultOptions(): ResolvedOptions {
    return this.gen.defaultOptions;
  }

  /**
   * Converts an OpSet to an SVG path string.
   * @param drawing The OpSet to convert.
   * @param fixedDecimals Number of decimal places to fix coordinates to.
   * @returns The SVG path string.
   */
  opsToPath(drawing: OpSet, fixedDecimals: number): string {
    return this.gen.opsToPath(drawing, fixedDecimals);
  }

  /**
   * Draws a line as an SVG element.
   * @param x1 The x-coordinate of the start point.
   * @param y1 The y-coordinate of the start point.
   * @param x2 The x-coordinate of the end point.
   * @param y2 The y-coordinate of the end point.
   * @param options Optional overrides for the drawing options.
   * @returns An SVGGElement containing the line.
   */
  line(x1: number, y1: number, x2: number, y2: number, options?: Options): SVGGElement {
    const d = this.gen.line(x1, y1, x2, y2, options);
    return this.draw(d);
  }

  /**
   * Draws a rectangle as an SVG element.
   * @param x The x-coordinate of the top-left corner.
   * @param y The y-coordinate of the top-left corner.
   * @param width The width of the rectangle.
   * @param height The height of the rectangle.
   * @param options Optional overrides for the drawing options.
   * @returns An SVGGElement containing the rectangle.
   */
  rectangle(x: number, y: number, width: number, height: number, options?: Options): SVGGElement {
    const d = this.gen.rectangle(x, y, width, height, options);
    return this.draw(d);
  }

  /**
   * Draws an ellipse as an SVG element.
   * @param x The x-coordinate of the center.
   * @param y The y-coordinate of the center.
   * @param width The width of the ellipse.
   * @param height The height of the ellipse.
   * @param options Optional overrides for the drawing options.
   * @returns An SVGGElement containing the ellipse.
   */
  ellipse(x: number, y: number, width: number, height: number, options?: Options): SVGGElement {
    const d = this.gen.ellipse(x, y, width, height, options);
    return this.draw(d);
  }

  /**
   * Draws a circle as an SVG element.
   * @param x The x-coordinate of the center.
   * @param y The y-coordinate of the center.
   * @param diameter The diameter of the circle.
   * @param options Optional overrides for the drawing options.
   * @returns An SVGGElement containing the circle.
   */
  circle(x: number, y: number, diameter: number, options?: Options): SVGGElement {
    const d = this.gen.circle(x, y, diameter, options);
    return this.draw(d);
  }

  /**
   * Draws a linear path as an SVG element.
   * @param points An array of points representing the path.
   * @param options Optional overrides for the drawing options.
   * @returns An SVGGElement containing the linear path.
   */
  linearPath(points: Point[], options?: Options): SVGGElement {
    const d = this.gen.linearPath(points, options);
    return this.draw(d);
  }

  /**
   * Draws a polygon as an SVG element.
   * @param points An array of points representing the polygon.
   * @param options Optional overrides for the drawing options.
   * @returns An SVGGElement containing the polygon.
   */
  polygon(points: Point[], options?: Options): SVGGElement {
    const d = this.gen.polygon(points, options);
    return this.draw(d);
  }

  /**
   * Draws an arc as an SVG element.
   * @param x The x-coordinate of the center.
   * @param y The y-coordinate of the center.
   * @param width The width of the arc.
   * @param height The height of the arc.
   * @param start The start angle in radians.
   * @param stop The stop angle in radians.
   * @param closed If true, the arc will be closed (pie slice). Defaults to false.
   * @param options Optional overrides for the drawing options.
   * @returns An SVGGElement containing the arc.
   */
  arc(x: number, y: number, width: number, height: number, start: number, stop: number, closed: boolean = false, options?: Options): SVGGElement {
    const d = this.gen.arc(x, y, width, height, start, stop, closed, options);
    return this.draw(d);
  }

  /**
   * Draws a curve as an SVG element.
   * @param points An array of points or an array of arrays of points (for multiple paths) representing the curve.
   * @param options Optional overrides for the drawing options.
   * @returns An SVGGElement containing the curve.
   */
  curve(points: Point[] | Point[][], options?: Options): SVGGElement {
    const d = this.gen.curve(points, options);
    return this.draw(d);
  }

  /**
   * Draws a shape from an SVG path string as an SVG element.
   * @param d The SVG path string.
   * @param options Optional overrides for the drawing options.
   * @returns An SVGGElement containing the path.
   */
  path(d: string, options?: Options): SVGGElement {
    const drawing = this.gen.path(d, options);
    return this.draw(drawing);
  }
}