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
      for (let i = 0; i < 4; i++) {
        for (const cube of cubes) {
          switch (Math.random() * 4 | 0) {
            case 0: this.rotateUp();
          }
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
          case 'w': return this.rotateUp();
          case 's': return this.rotateDown();
          case 'a': return this.rotateLeft();
          case 'd': return this.rotateRight();
        }
      },

      rotateUp() {
        this.rotateX(90)
      },

      rotateDown() {
        this.rotateX(-90)
      },

      rotateLeft() {
        this.rotateY(-90)
      },

      rotateRight() {
        this.rotateY(90)
      },

      rotateX(deg, immediate) {
        if (this.activeCube.canRotate('X')) {
          this.activeCube.rotate('X', deg, immediate);
          this.activeCube.top && this.activeCube.top.rotate('X', -deg, immediate);
          this.activeCube.bottom && this.activeCube.bottom.rotate('X', -deg, immediate);
        }
      },

      rotateY(deg, immediate) {
        if (this.activeCube.canRotate('Y')) {
          this.activeCube.rotate('Y', deg, immediate);
          this.activeCube.left && this.activeCube.left.rotate('Y', -deg);
          this.activeCube.right && this.activeCube.right.rotate('Y', -deg);
        }
      },
    },
  });
// }
