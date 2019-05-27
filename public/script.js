/*
  global
  Vue:false
  Rematrix:false
  io:false
  dayjs:false
  dayjs_plugin_relativeTime:false
  dayjs_plugin_localizedFormat:false
*/

dayjs.locale('ja');
dayjs.extend(dayjs_plugin_relativeTime);
dayjs.extend(dayjs_plugin_localizedFormat);

{
  const socket = io();

  async function wait(ms) {
    await Promise.all([
      new Promise(requestAnimationFrame),
      ms && new Promise(r => setTimeout(r, ms)),
      ms || new Promise(Vue.nextTick),
    ]);
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
      const rel = axis === 'X' ? [this.top, this.bottom] : [this.left, this.right];

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
        cubes: [],
        scores: [],
        activeCube: null,
        startedAt: 0,
        currentTime: 0,
        finishedAt: 0,
        formShown: false,
        scoreSubmitted: false,
      };
    },

    created() {
      const width = 3;
      const height = 3;

      for (let y = 0, i = 0; y < height; y++) {
        for (let x = 0; x < width; x++, i++) {
          this.cubes.push(new Cube(x, y, i));
        }
      }

      this.cubes.forEach(c => {
        c.top = c.y ? this.cubes[c.i - width] : null;
        c.bottom = c.y < height - 1 ? this.cubes[c.i + width] : null;
        c.left = c.x ? this.cubes[c.i - 1] : null;
        c.right = c.x < width - 1 ? this.cubes[c.i + 1] : null;
      });

      do {
        for (let i = 0; i < width * height * 10; i++) {
          const cube = this.cubes[(Math.random() * this.cubes.length) | 0];
          this.rotate((Math.random() * 4) | 0, cube, true);
        }
      } while (this.completed);

      this.$watch('completed', () => {
        this.finish();
      });
    },

    async mounted() {
      document.addEventListener('keydown', event => this.keydown(event));
      this.startedAt = Date.now();

      socket.on('score:list', scores => {
        this.scores = scores;
      });
      socket.emit('score:list', scores => {
        this.scores = scores;
      });

      while (true) {
        await wait(16);
        this.currentTime = Date.now();
      }
    },

    computed: {
      completed() {
        const identity = Rematrix.identity();
        return this.cubes.every(cube => !cube.busy && cube.matrix.every((v, i) => Math.abs(v - identity[i]) < 10e-8));
      },

      elapsed() {
        return (this.completed ? this.finishedAt : this.currentTime) - this.startedAt;
      },
    },

    methods: {
      keydown({ key }) {
        if (this.completed || !this.activeCube) {
          return;
        }
        switch (key) {
          case 'w':
            return this.rotate(0, this.activeCube);
          case 'd':
            return this.rotate(1, this.activeCube);
          case 's':
            return this.rotate(2, this.activeCube);
          case 'a':
            return this.rotate(3, this.activeCube);
        }
      },

      rotate(dir, cube, immediate) {
        this[dir % 2 ? 'rotateY' : 'rotateX'](cube, (1 - (dir & 2)) * 90, immediate);
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

      async finish() {
        this.finishedAt = Date.now();
        await wait(3000);
        this.formShown = true;
      },

      async submit(name) {
        socket.emit('score:put', { name, time: this.elapsed }, () => {
          this.formShown = false;
        });
      },

      showHelp() {
        alert(`マウス移動でキューブを選択\n選んだキューブを W, A, S, D キーで回転\n黒い sisisin をまっすぐに 9 個そろえればクリアです`);
      },
    },
  });
}
