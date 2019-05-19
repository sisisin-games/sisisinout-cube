/* global Vue:false */

const width = 5;
const height = 5;
const cubes = [];

for (let x = 0, i = 0; x < height; x++) {
  for (let y = 0; y < width; y++, i++) {
    cubes.push({ x, y, i, rotateX: 0, rotateY: 0, rotateZ: 0 });
  }
}

cubes.forEach(c => {
  c.top = c.y ? cubes[c.i - width] : null;
  c.bottom = c.y < height - 1 ? cubes[c.i + width] : null;
  c.left = c.x ? cubes[c.i - 1] : null;
  c.right = c.x < width - 1 ? cubes[c.i + 1] : null;
});

new Vue({
  data: {
    cubes,
    selected: null,
  },
  methods: {
    mouseenter() {
    },
  },
}).$mount('#app');
