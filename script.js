/* global Vue:false Rematrix:false */

const width = 3;
const height = 3;
const cubes = [];

async function wait() {
  return Promise.all([new Promise(Vue.nextTick), new Promise(requestAnimationFrame)]);
}

class Cube {
  constructor(x, y, i) {
    this.x = x;
    this.y = y;
    this.i = i;
    this.top = null;
    this.bottom = null;
    this.left = null;
    this.right = null;
    this.busy = false;
    this.noAnim = false;
    this.rotateAxis = 'X';
    this.rotateDeg = 0;
    this.matrix = Rematrix.identity();
  }

  canRotate(axis) {
    const rel = axis === 'X'
      ? [this.top, this.bottom]
      : [this.left, this.right];

    return !this.busy && rel.every(c => !c || !c.busy);
  }

  rotateX(deg) {
    this.busy = true;
    this.rotateAxis = 'X';
    this.rotateDeg = deg;
  }

  rotateY(deg) {
    this.busy = true;
    this.rotateAxis = 'Y';
    this.rotateDeg = deg;
  }

  async idle() {
    this.noAnim = true;
    await wait();
    const rotate = Rematrix[`rotate${this.rotateAxis}`](this.rotateDeg);
    this.matrix = Rematrix.multiply(rotate, this.matrix);
    this.rotateAxis = '';
    this.rotateDeg = 0;
    await wait();
    this.noAnim = false;
    this.busy = false;
  }
}

for (let y = 0, i = 0; y < height; y++) {
  for (let x = 0; x < width; x++, i++) {
    cubes.push(new Cube(x, y, i));
  }
}

cubes.forEach(c => {
  c.top = c.y ? cubes[c.i - width] : null;
  c.bottom = c.y < height - 1 ? cubes[c.i + width] : null;
  c.left = c.x ? cubes[c.i - 1] : null;
  c.right = c.x < width - 1 ? cubes[c.i + 1] : null;
});

new Vue({
  el: '#app',
  data: {
    cubes,
    activeCube: null,
  },
  mounted() {
    document.addEventListener('keydown', event => this.keydown(event));
  },
  methods: {
    keydown({key}) {
      if (!this.activeCube || this.activeCube.busy) {
        return;
      }
      switch (key) {
        case 'w': return this.rotateX(90);
        case 's': return this.rotateX(-90);
        case 'a': return this.rotateY(-90);
        case 'd': return this.rotateY(90);
      }
    },
    rotateX(deg) {
      if (this.activeCube.canRotate('X')) {
        this.activeCube.rotateX(deg);
        this.activeCube.top && this.activeCube.top.rotateX(-deg);
        this.activeCube.bottom && this.activeCube.bottom.rotateX(-deg);
      }
    },
    rotateY(deg) {
      if (this.activeCube.canRotate('Y')) {
        this.activeCube.rotateY(deg);
        this.activeCube.left && this.activeCube.left.rotateY(-deg);
        this.activeCube.right && this.activeCube.right.rotateY(-deg);
      }
    },
  },
});
