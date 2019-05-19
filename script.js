/* global Vue:false */

cn
const cubes = Array(25).fill(0).map(() => ({
  x: 0, y: 0, z: 0,
}));

new Vue({
  data: {
    cubes,
  },
  methods: {
  },
}).$mount('#app');
