/* global Vue:false Rematrix:false */

// {
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

    rotate(axis, deg, immediate) {
      this.busy = true;
      this.rotateAxis = axis;
      this.rotateDeg = deg;
      if (immediate) {
        this.transform();
        this.busy = false;
      }
    }

    transform() {
      const rotate = Rematrix[`rotate${this.rotateAxis}`](this.rotateDeg);
      this.matrix = Rematrix.multiply(rotate, this.matrix);
      this.rotateAxis = '';
      this.rotateDeg = 0;
    }

    async idle() {
      this.noAnim = true;
      await wait();
      this.transform();
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

    data() {
      return {
        cubes,
        activeCube: null,
      }
    },

    created() {
      for (let i = 0; i < 100; i++) {
        const cube = cubes[Math.random() * cubes.length | 0];
        switch (Math.random() * 4 | 0) {
          case 0: this.rotateUp(cube, true); break;
          case 1: this.rotateDown(cube, true); break;
          case 2: this.rotateLeft(cube, true); break;
          case 3: this.rotateRight(cube, true); break;
        }
      }
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
          case 'w': return this.rotateUp(this.activeCube);
          case 's': return this.rotateDown(this.activeCube);
          case 'a': return this.rotateLeft(this.activeCube);
          case 'd': return this.rotateRight(this.activeCube);
        }
      },

      rotateUp(cube, immediate) {
        this.rotateX(cube, 90, immediate);
      },

      rotateDown(cube, immediate) {
        this.rotateX(cube, -90, immediate);
      },

      rotateLeft(cube, immediate) {
        this.rotateY(cube, -90, immediate);
      },

      rotateRight(cube, immediate) {
        this.rotateY(cube, 90, immediate);
      },

      rotateX(cube, deg, immediate) {
        if (cube.canRotate('X')) {
          cube.rotate('X', deg, immediate);
          cube.top && cube.top.rotate('X', -deg, immediate);
          cube.bottom && cube.bottom.rotate('X', -deg, immediate);
        }
      },

      rotateY(cube, deg, immediate) {
        if (cube.canRotate('Y')) {
          cube.rotate('Y', deg, immediate);
          cube.left && cube.left.rotate('Y', -deg, immediate);
          cube.right && cube.right.rotate('Y', -deg, immediate);
        }
      },
    },
  });
// }
