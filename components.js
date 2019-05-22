/* global Vue:false */

const VCube = Vue.component('v-cube', {
  template: `
    <div class="cube" :class="{'no-anim': cube.noAnim}" :style="style" v-on="$listeners" @transitionend="cube.idle()">
      <div class="cube-inner" :style="innerStyle">
        <div class="nyan nyan-1"/>
        <div class="nyan nyan-2"/>
        <div class="nyan nyan-3"/>
        <div class="nyan nyan-4"/>
        <div class="nyan nyan-5"/>
        <div class="nyan nyan-6"/>
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
