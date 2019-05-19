/* global Vue:false */

Vue.component('v-cube', {
  template: `
    <div class="cube" :style="style" v-on="$listeners">
      <div class="dice dice-1"/>
      <div class="dice dice-2"/>
      <div class="dice dice-3"/>
      <div class="dice dice-4"/>
      <div class="dice dice-5"/>
      <div class="dice dice-6"/>
    </div>
  `,
  props: {
    cube: Object,
  },
  computed: {
    style() {
      return {
        transform: `
          translateZ(-40px)
          rotateX(${this.cube.rotateX * 90}deg)
          rotateY(${this.cube.rotateY * 90}deg)
          rotateZ(${this.cube.rotateZ * 90}deg)
        `,
      };
    },
  },
  methods: {
  },
});
