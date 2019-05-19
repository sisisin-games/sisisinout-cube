/* global Vue:false */

const width = 5;
const height = 5;
const cubes = [];

for (let x = 0; x < height; x++) {
  for (let y = 0; y < width; y++) {
    cubes.push({ x, y, rotateX: 0, rotateY: 0, rotateZ: 0 });
  }
}

cubes.forEach(c => {
  c.top = cubes[(c.y - 1) * width + c.x];
  c.bottom = cubes[(c.y + 1) * width + c.x];
  c.left = cubes[c.y * width + c.x];
  c.top = cubes[(c.y - 1) * width + c.x];
});

new Vue({
  data: {
    cubes,
  },
  methods: {
  },
}).$mount('#app');
