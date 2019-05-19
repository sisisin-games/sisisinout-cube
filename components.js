/* global Vue:false */

Vue.component('v-cube', {
  template: `
    <div class="cube" :style="style" @click="$emit('click')">
      <div class="dice dice-1"/>
      <div class="dice dice-2"/>
      <div class="dice dice-3"/>
      <div class="dice dice-4"/>
      <div class="dice dice-5"/>
      <div class="dice dice-6"/>
    </div>
  `,
  props: {
    x: Number,
    y: Number,
    z: Number,
  },
  computed: {
    style() {
      return {
        transform: `
          rotateX(${this.x * 90}deg)
          rotateY(${this.y * 90}deg)
          rotateZ(${this.z * 90}deg)
        `,
      };
    },
  },
  methods: {
    click() {
      this.y++;
    },
  },
});
