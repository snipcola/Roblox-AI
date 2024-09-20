// https://github.com/roblox-ts/types/tree/master/include

// Drawing library

interface Drawings {
	Line: DrawingLine;
	Text: DrawingText;
	Image: DrawingImage;
	Circle: DrawingCircle;
	Square: DrawingSquare;
	Quad: DrawingQuad;
	Triangle: DrawingTriangle;
}

interface DrawingConstructor {
	/**
	 * Creates a new drawing of type `drawingType`.
	 */
	new <T extends keyof Drawings>(drawingType: T): Drawings[T];

	/**
	 * Maps the supported font styles to numbers.
	 */
	readonly Fonts: {
		UI: 0;
		System: 1;
		Plex: 2;
		Monospace: 3;
	};
}

/**
 * The Drawing library. Uses Luau objects to create and manipulate drawings.
 * @example
 * const circle = new Drawing("Circle");
 * circle.Radius = 50;
 * circle.Color = Color3.fromRGB(255, 255, 255);
 * circle.Filled = false;
 * circle.NumSides = 32;
 * circle.Position = new Vector2(20, 20);
 * circle.Transparency = 0.9;
 * circle.Destroy();
 */
declare const Drawing: DrawingConstructor;

/**
 * The base class for all drawings. Cannot be instantiated directly.
 */
interface Drawing {
	Visible: boolean;
	ZIndex: number;
	Transparency: number;
	Color: Color3;
	Destroy(): void;

	/** @deprecated */
	Remove(): void;
}

/**
 * Draws a line from `From` to `To`.
 */
interface DrawingLine extends Drawing {
	Thickness: number;
	From: Vector2;
	To: Vector2;
}

/**
 * Renders text to the screen.
 */
interface DrawingText extends Drawing {
	Text: string;
	readonly TextBounds: Vector2;
	Size: number;
	Center: boolean;
	Outline: boolean;
	OutlineColor: Color3;
	Position: Vector2;
	Font: number;
}

/**
 * Renders an image to the screen. Set `Data` to the image data, **not a URL!**
 */
interface DrawingImage extends Drawing {
	Data: string;
	Size: Vector2;
	Position: Vector2;
	Rounding: number;
}

/**
 * Draws a circle centered at `Position`.
 *
 * **NOTE:** Circles are not drawn perfectly; the more "sides" rendered, the
 * greater the performance hit.
 */
interface DrawingCircle extends Drawing {
	Thickness: number;
	NumSides: number;
	Radius: number;
	Filled: boolean;
	Position: Vector2;
}

/**
 * Draws a square starting at `Position` and ending at `Position + Size`.
 */
interface DrawingSquare extends Drawing {
	Thickness: number;
	Size: Vector2;
	Position: Vector2;
	Filled: boolean;
}

/**
 * Draws a quadrilateral with the given points.
 */
interface DrawingQuad extends Drawing {
	Thickness: number;
	PointA: Vector2;
	PointB: Vector2;
	PointC: Vector2;
	PointD: Vector2;
	Filled: boolean;
}

/**
 * Draws a triangle with the given points.
 */
interface DrawingTriangle extends Drawing {
	Thickness: number;
	PointA: Vector2;
	PointB: Vector2;
	PointC: Vector2;
	Filled: boolean;
}

// Drawing functions

/**
 * Clears all Drawings from the screen. Invalidates all references to pre-existing Drawing objects.
 */
declare function cleardrawcache(): void;

/**
 * Gets the value of a Drawing's property. Invokes `__index`.
 * @param drawing The Drawing to get the property of.
 * @param property The property to get.
 * @returns The value of the property.
 * @example
 * const circle = new Drawing("Circle");
 * getrenderproperty(circle, "Position"); // Vector2
 */
declare function getrenderproperty<T extends Drawing, K extends keyof T>(drawing: T, property: K): T[K];

/**
 * Returns whether `object` is a valid Drawing.
 * @param object The object to check.
 * @returns Whether `object` is a valid Drawing.
 */
declare function isrenderobj(object: unknown): object is Drawing;

/**
 * Sets the value of a Drawing's property to `value`. Invokes `__newindex`.
 * @param drawing The Drawing to set the property of.
 * @param property The property to set.
 * @param value The value to set.
 * @example
 * const circle = new Drawing("Circle");
 * setrenderproperty(circle, "Position", new Vector2());
 */
declare function setrenderproperty<T extends Drawing, K extends keyof T>(drawing: T, property: K, value: T[K]): void;
