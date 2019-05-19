/* global Vue:false Rematrix:false */

const width = 3;
const height = 3;
const cubes = [];

class Cube {
  constructor(x, y, i) {
    this.x = x;
    this.y = y;
    this.i = i;
    this.transforms = [];
    this.matrixes = [Rematrix.identity(), Rematrix.identity(), Rematrix.identity(), Rematrix.identity()];
  }

  rotateX(deg) {
    this.transforms.unshift(`rotateX(${deg}deg)`);
    const [m1, m2, m3, m4] = this.matrixes;
    this.matrixes = [Rematrix.rotateX(deg), m1, m2, Rematrix.multiply(m3, m4)];
  }

  rotateY(deg) {
    this.transforms.unshift(`rotateY(${deg}deg)`);
    const [m1, m2, m3] = this.matrixes;
    this.matrixes = [Rematrix.rotateY(deg), m1, Rematrix.multiply(m2, m3)];
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
    selected: null,
  },
  mounted() {
    document.addEventListener('keydown', event => this.keydown(event));
  },
  methods: {
    keydown({key}) {
      switch (key) {
        case 'w': return this.rotateX(90);
        case 's': return this.rotateX(-90);
        case 'a': return this.rotateY(-90);
        case 'd': return this.rotateY(90);
      }
    },
    rotateX(deg) {
      if (!this.selected) {
        return;
      }
      this.selected.rotateX(deg);
      this.selected.top && this.selected.top.rotateX(-deg);
      this.selected.bottom && this.selected.bottom.rotateX(-deg);
    },
    rotateY(deg) {
      if (!this.selected) {
        return;
      }
      this.selected.rotateY(deg);
      this.selected.left && this.selected.left.rotateY(-deg);
      this.selected.right && this.selected.right.rotateY(-deg);
    },
  },
});
