const Rectangle = class {
  constructor(p) {
    this.p = p;
    this.type = p[0].type();
  }
  copy() {
    return new Rectangle(this.p);
  }
  type() {
    return this.v_type;
  }
  plane() {
    this.type = 1;
    this.p.forEach((p) => {
      p.plane();
    });
  }
  screen() {
    this.type = 0;
    this.p.forEach((p) => {
      p.screen();
    });
  }
};
