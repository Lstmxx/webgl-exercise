class Vector2D {
  public x: number;

  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get length(): number {
    return Math.hypot(this.x, this.y);
  }

  get dir(): number {
    return Math.atan2(this.y, this.x);
  }

  copy(): Vector2D {
    return new Vector2D(this.x, this.y);
  }

  add(v: Vector2D): Vector2D {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v: Vector2D): Vector2D {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  scale(a: number): Vector2D {
    this.x *= a;
    this.y *= a;
    return this;
  }

  cross(v: Vector2D): number {
    return this.x * v.y - v.x * this.y;
  }

  dot(v: Vector2D): number {
    return this.x * v.y + v.x * this.y;
  }

  normalize(): Vector2D {
    return this.scale(1 / this.length);
  }

  rotate(rad: number): Vector2D {
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    const { x, y } = this;
    this.x = x * c + y * -s;
    this.y = x * s + y * c;
    return this;
  }
}

export default Vector2D;
