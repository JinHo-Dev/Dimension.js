const Point = class {
  constructor(x, y, type) {
    this.v_type = type === undefined ? 0 : type - 0;
    if (this.v_type) {
      this.v_x = x === undefined ? 0 : x;
      this.v_y = y === undefined ? 0 : y;
    } else {
      this.v_x = x === undefined ? 0 : x - W / 2;
      this.v_y = y === undefined ? 0 : y - H / 2;
    }
  }
  valueOf() {
    return this.v_y * W + this.v_x;
  }
  x(x) {
    if (this.v_type) {
      if (x === undefined) {
        return this.v_x;
      } else {
        this.v_x = x;
      }
    } else {
      if (x === undefined) {
        return this.v_x + W / 2;
      } else {
        this.v_x = x - W / 2;
      }
    }
  }
  y(y) {
    if (this.v_type) {
      if (y === undefined) {
        return this.v_y;
      } else {
        this.v_y = y;
      }
    } else {
      if (y === undefined) {
        return this.v_y + H / 2;
      } else {
        this.v_y = y - H / 2;
      }
    }
  }
  type() {
    return this.v_type;
  }
  copy() {
    if (this.v_type) {
      return new Point(this.v_x, this.v_y, this.v_type);
    } else {
      return new Point(this.v_x + W / 2, this.v_y + H / 2, this.v_type);
    }
  }
  plane() {
    if (this.v_type) return;
    const cosTheta = Math.cos(-theta);
    const sinTheta = Math.sin(-theta);
    const x = cosTheta * this.v_x - sinTheta * this.v_y;
    const y = sinTheta * this.v_x + cosTheta * this.v_y;
    const t = R + Math.atan(y / F);
    const Y = DsinR * (itanR - 1 / Math.tan(t));
    const X = (x * DsinR) / Math.sin(t) / Math.sqrt(y * y + F * F);
    this.v_x = X;
    this.v_y = Y;
    this.v_type = 1;
  }
  screen() {
    if (!this.v_type) return;
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);
    const Y = this.v_y;
    const X = this.v_x;
    const y = F * Math.tan(Math.atan(1 / (itanR - Y / DsinR)) - R);
    let t = R + Math.atan(y / F);
    if (t < 0) t += 2 * Math.PI;
    else if (t > 2 * Math.PI) t -= 2 * Math.PI;
    const x = (X / DsinR) * Math.sin(t) * Math.sqrt(y * y + F * F);
    this.v_x = cosTheta * x - sinTheta * y;
    this.v_y = sinTheta * x + cosTheta * y;
    this.v_type = 0;
  }
};
