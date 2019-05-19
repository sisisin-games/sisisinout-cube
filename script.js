/* global Vue:false Rematrix:false */

const width = 5;
const height = 5;
const cubes = [];

class Cube {
  constructor(x, y, i) {
    this.x = x;
    this.y = y;
    this.i = i;
    this.matrix = Rematrix.identity();
  }

  rotateX(dir) {
    this.matrix = Rematrix.multiply(this.matrix, Rematrix.rotateX(dir * 90));
  }

  rotateY(dir) {
    this.matrix = Rematrix.multiply(this.matrix, Rematrix.rotateY(dir * 90));
  }
}

for (let x = 0, i = 0; x < height; x++) {
  for (let y = 0; y < width; y++, i++) {
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
        case 'w': return this.rotateX(1);
        case 's': return this.rotateX(-1);
        case 'a': return this.rotateY(-1);
        case 'd': return this.rotateY(1);
      }
    },
    rotateX(dir) {
      if (!this.selected) {
        return;
      }
      this.selected.rotateX(dir);
      this.selected.top && this.selected.top.rotateX(-dir);
      this.selected.bottom && this.selected.bottom.rotateX(-dir);
    },
    rotateY(dir) {
      if (!this.selected) {
        return;
      }
      this.selected.rotateY(dir);
      this.selected.left && this.selected.left.rotateY(-dir);
      this.selected.right && this.selected.right.rotateY(-dir);
    },
  },
});
