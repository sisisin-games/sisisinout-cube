/* global Vue:false */

const VCube = Vue.component('v-cube', {
  template: `
    <div class="cube" :class="{'no-anim': cube.noAnim}" :style="style" v-on="$listeners" @transitionend="cube.idle()">
      <div class="cube-inner" :style="innerStyle">
        <div class="dice dice-1"/>
        <div class="dice dice-2"/>
        <div class="dice dice-3"/>
        <div class="dice dice-4"/>
        <div class="dice dice-5"/>
        <div class="dice dice-6"/>
      </div>
    </div>
  `,
  props: {
    cube: Object,
  },
  computed: {
    style() {
      const rotate = this.cube.rotateDeg ? `rotate${this.cube.rotateAxis}(${this.cube.rotateDeg}deg)` : '';
      return {
        transform: `translateZ(-40px) ${rotate}`,
      };
    },
    innerStyle() {
      return {
        transform: `matrix3d(${this.cube.matrix})`,
      };
    },
  },
});
