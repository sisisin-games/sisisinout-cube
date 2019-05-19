/* global Vue:false */

Vue.component('v-cube', {
  template: `
    <div class="cube">
      <div class="dice dice-1"/>
      <div class="dice dice-2"/>
      <div class="dice dice-3"/>
      <div class="dice dice-4"/>
      <div class="dice dice-5"/>
      <div class="dice dice-6"/>
    </div>
  `,
  props: {
  },
  data() {
    return {};
  },
});
