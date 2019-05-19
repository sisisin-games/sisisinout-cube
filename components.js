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
        transform: `translateZ(-40px) ${this.cube.transforms.join(' ')}`,
      };
    },
  },
  methods: {
  },
});
