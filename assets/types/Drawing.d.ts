/**
 * The `Drawing` class represents a renderable 2D object that appears on the user's screen. Every specific drawing type (e.g. `Circle`, `Text`, `Line`) inherits from this base and extends it with shape-specific properties.
 * Drawing objects are ***not*** instances - they are client-only graphical primitives that do not interact with the 3D world and must be managed manually.
 * @see https://docs.sunc.su/Drawing
 */

/**
 * Base interface for all Drawing objects.
 */
interface DrawingBase {
  /** Whether the object is rendered. Defaults to `false`. */
  Visible: boolean;
  /** Render order; higher values appear on top. */
  ZIndex: number;
  /** Translucency, where `1` is fully transparent and `0` is fully visible. */
  Transparency: number;
  /** The color of the drawing. */
  Color: Color3;
  /** Whether the drawing object exists. */
  readonly __OBJECT_EXISTS: boolean;
  /** Permanently removes the drawing from view. */
  Destroy(): void;
}

/**
 * Line drawing object.
 */
interface Line extends DrawingBase {
  /** Start position of the line. */
  From: Vector2;
  /** End position of the line. */
  To: Vector2;
  /** Width of the line. */
  Thickness: number;
}

/**
 * Text drawing object.
 */
interface Text extends DrawingBase {
  /** The text content to render. */
  Text: string;
  /** Computed text size (read-only). */
  readonly TextBounds: Vector2;
  /** Font to use. */
  Font: number;
  /** Size of the text. */
  Size: number;
  /** Top-left corner of the text. */
  Position: Vector2;
  /** Horizontally center the text. */
  Center: boolean;
  /** Whether to draw an outline. */
  Outline: boolean;
  /** Outline color. */
  OutlineColor: Color3;
}

/**
 * Image drawing object.
 */
interface Image extends DrawingBase {
  /** Raw image byte string (e.g. from `readfile`). */
  Data: string;
  /** Size of the rendered image. */
  Size: Vector2;
  /** Top-left corner of the image. */
  Position: Vector2;
  /** Amount of corner rounding (optional aesthetic). */
  Rounding?: number;
}

/**
 * Circle drawing object.
 */
interface Circle extends DrawingBase {
  /** Number of sides used to approximate the circle. */
  NumSides: number;
  /** Radius of the circle. */
  Radius: number;
  /** Center point of the circle. */
  Position: Vector2;
  /** Outline thickness (if not filled). */
  Thickness: number;
  /** Whether the circle is filled. */
  Filled: boolean;
}

/**
 * Square drawing object.
 */
interface Square extends DrawingBase {
  /** Size of the rectangle. */
  Size: Vector2;
  /** Top-left corner. */
  Position: Vector2;
  /** Outline thickness (if not filled). */
  Thickness: number;
  /** Whether the square is filled. */
  Filled: boolean;
}

/**
 * Quad drawing object.
 */
interface Quad extends DrawingBase {
  /** First point. */
  PointA: Vector2;
  /** Second point. */
  PointB: Vector2;
  /** Third point. */
  PointC: Vector2;
  /** Fourth point. */
  PointD: Vector2;
  /** Outline thickness (if not filled). */
  Thickness: number;
  /** Whether the quad is filled. */
  Filled: boolean;
}

/**
 * Triangle drawing object.
 */
interface Triangle extends DrawingBase {
  /** First point. */
  PointA: Vector2;
  /** Second point. */
  PointB: Vector2;
  /** Third point. */
  PointC: Vector2;
  /** Outline thickness (if not filled). */
  Thickness: number;
  /** Whether the triangle is filled. */
  Filled: boolean;
}

/**
 * Map of drawing type strings to their corresponding interfaces.
 */
interface DrawingTypeMap {
  Line: Line;
  Text: Text;
  Image: Image;
  Circle: Circle;
  Square: Square;
  Quad: Quad;
  Triangle: Triangle;
}

/**
 * Union of all drawing type strings.
 */
type DrawingType = keyof DrawingTypeMap;

/**
 * Drawing constructor interface.
 */
interface DrawingConstructor {
  /**
   * Creates a new render object of the specified type.
   * @param type The type of drawing to create. Must be one of: `"Line"`, `"Text"`, `"Image"`, `"Circle"`, `"Square"`, `"Quad"`, or `"Triangle"`.
   * @returns A new Drawing object of the specified type.
   * @example
   * const camera = game.Workspace.CurrentCamera;
   * const viewport = camera.ViewportSize;
   * const position = Vector2.new(viewport.X / 2, viewport.Y / 2);
   * const circle = new Drawing("Circle");
   * circle.Radius = 50;
   * circle.Color = Color3.fromRGB(255, 0, 0);
   * circle.Filled = true;
   * circle.NumSides = 150;
   * circle.Position = position;
   * circle.Transparency = 0;
   * circle.Visible = true;
   * print(circle.__OBJECT_EXISTS); // Output: true
   * circle.Destroy();
   * print(circle.__OBJECT_EXISTS); // Output: false
   * @example
   * const camera = game.Workspace.CurrentCamera;
   * const viewport = camera.ViewportSize;
   * const position = Vector2.new(viewport.X / 2, viewport.Y / 2);
   * const image = new Drawing("Image");
   * image.Data = readfile("your_image.png");
   * image.Size = Vector2.new(455, 155);
   * image.Visible = true;
   * image.Position = position;
   * task.wait(2);
   * image.Destroy();
   */
  new <T extends DrawingType>(type: T): DrawingTypeMap[T];

  /**
   * Creates a new render object of the specified type.
   * @param type The type of drawing to create. Must be one of: `"Line"`, `"Text"`, `"Image"`, `"Circle"`, `"Square"`, `"Quad"`, or `"Triangle"`.
   * @returns A new Drawing object of the specified type.
   * @example
   * const camera = game.Workspace.CurrentCamera;
   * const viewport = camera.ViewportSize;
   * const position = Vector2.new(viewport.X / 2, viewport.Y / 2);
   * const circle = new Drawing("Circle");
   * circle.Radius = 50;
   * circle.Color = Color3.fromRGB(255, 0, 0);
   * circle.Filled = true;
   * circle.NumSides = 150;
   * circle.Position = position;
   * circle.Transparency = 0;
   * circle.Visible = true;
   * print(circle.__OBJECT_EXISTS); // Output: true
   * circle.Destroy();
   * print(circle.__OBJECT_EXISTS); // Output: false
   * @example
   * const camera = game.Workspace.CurrentCamera;
   * const viewport = camera.ViewportSize;
   * const position = Vector2.new(viewport.X / 2, viewport.Y / 2);
   * const image = new Drawing("Image");
   * image.Data = readfile("your_image.png");
   * image.Size = Vector2.new(455, 155);
   * image.Visible = true;
   * image.Position = position;
   * task.wait(2);
   * image.Destroy();
   */
  new: <T extends DrawingType>(type: T) => DrawingTypeMap[T];

  /**
   * Enum for font styles used by Text drawing objects.
   */
  readonly Fonts: {
    UI: 0;
    System: 1;
    Plex: 2;
    Monospace: 3;
  };
}

/**
 * Global Drawing object for creating drawing instances.
 */
declare const Drawing: DrawingConstructor;

/**
 * `getrenderproperty` retrieves the value of a property from a [`Drawing`](https://docs.sunc.su/Drawing/) object. This behaves identically to using `object[property]`, but is useful when working with dynamic property names or for reflection-like access.
 * @param drawing A valid [`Drawing`](https://docs.sunc.su/Drawing/) object.
 * @param property The name of the property to retrieve.
 * @returns The value of the property.
 * @example
 * const circle = new Drawing("Circle");
 * circle.Radius = 50;
 * circle.Visible = true;
 * print(getrenderproperty(circle, "Radius"));    // Output: 50
 * print(getrenderproperty(circle, "Visible"));   // Output: true
 * @see https://docs.sunc.su/Drawing/getrenderproperty
 */
declare function getrenderproperty(drawing: DrawingBase, property: string): any;

/**
 * `isrenderobj` checks whether a given value is a valid [`Drawing`](https://docs.sunc.su/Drawing/) object.
 * @param object The value to check for Drawing validity.
 * @returns `true` if the object is a valid Drawing object, otherwise `false`.
 * @example
 * const square = new Drawing("Square");
 * print(isrenderobj(square));       // Output: true
 * print(isrenderobj(workspace));    // Output: false
 * print(isrenderobj("not a draw")); // Output: false
 * @see https://docs.sunc.su/Drawing/isrenderobj
 */
declare function isrenderobj(object: any): boolean;

/**
 * `cleardrawcache` removes **all active drawing objects** created with [`Drawing.new`](https://docs.sunc.su/Drawing/#constructor).
 * @example
 * const camera = game.Workspace.CurrentCamera;
 * const viewport = camera.ViewportSize;
 * const pos = Vector2.new(viewport.X / 2, viewport.Y / 2);
 * const circle = new Drawing("Circle");
 * circle.Radius = 50;
 * circle.Color = Color3.fromRGB(255, 0, 0);
 * circle.Filled = true;
 * circle.NumSides = 60;
 * circle.Position = pos;
 * circle.Transparency = 1;
 * circle.Visible = true;
 * task.defer(cleardrawcache);
 * print(circle.__OBJECT_EXISTS); // Output: true
 * task.wait();
 * print(circle.__OBJECT_EXISTS); // Output: false
 * @see https://docs.sunc.su/Drawing/cleardrawcache
 */
declare function cleardrawcache(): void;

/**
 * `setrenderproperty` assigns a value to a property of a [`Drawing`](https://docs.sunc.su/Drawing/) object. This behaves identically to `object[property] = value`, but is useful for dynamic or abstracted property access.
 * @param drawing A valid [`Drawing`](https://docs.sunc.su/Drawing/) object.
 * @param property The name of the property to assign.
 * @param value The value to assign to the specified property.
 * @example
 * const circle = new Drawing("Circle");
 * setrenderproperty(circle, "Radius", 50);
 * setrenderproperty(circle, "Visible", true);
 * print(circle.Radius);   // Output: 50
 * print(circle.Visible);  // Output: true
 * @see https://docs.sunc.su/Drawing/setrenderproperty
 */
declare function setrenderproperty(
  drawing: DrawingBase,
  property: string,
  value: any,
): void;
