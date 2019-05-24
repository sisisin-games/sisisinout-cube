/* global Vue:false Rematrix:false */

{
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

  new Vue({
    el: '#app',

    data() {
      return {
        cubes,
        activeCube: null,
      }
    },

    created() {
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

      for (let i = 0; i < 100; i++) {
        const cube = cubes[Math.random() * cubes.length | 0];
        this.rotate(Math.random() * 4 | 0, cube, true);
      }
    },

    mounted() {
      document.addEventListener('keydown', event => this.keydown(event));
    },
    
    computed: {
      completed() {
        const identity = Rematrix.identity();
        return cubes.every(
          cube => cube.matrix.every(
            (v, i) => Math.abs(v - identity[i]) < 10e-8));
      },
    },

    methods: {
      keydown({key}) {
        if (this.completed || !this.activeCube) {
          return;
        }
        switch (key) {
          case 'w': return this.rotate(0, this.activeCube);
          case 'd': return this.rotate(1, this.activeCube);
          case 's': return this.rotate(2, this.activeCube);
          case 'a': return this.rotate(3, this.activeCube);
        }
      },

      rotate(dir, cube, immediate) {
        this[dir % 2 ? 'rotateY' : 'rotateX'](cube, (1 - (dir & 2)) * 90, immediate)
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
}
