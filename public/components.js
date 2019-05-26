/* global Vue:false dayjs:false */

Vue.filter('relativeTime', value => {
  if (!value) {
    return '';
  }
  return dayjs(value).fromNow();
});

Vue.filter('scoreTime', time => {
  if (!time) {
    return '';
  }
  function pad(n, val) {
    return String(val).padStart(n, '0');
  }
  const ms = time % 1000;
  const seconds = (time / 1000) % 60 | 0;
  const minutes = (time / 1000 / 60) % 60 | 0;
  const hours = (time / 1000 / 60 / 60) | 0;
  let res = '';
  if (hours) {
    res += `${pad(2, hours)}時間`;
  }
  if (res || minutes) {
    res += `${pad(2, minutes)}分`;
  }
  if (res || seconds) {
    res += `${pad(2, seconds)}秒`;
  }
  res += pad(3, ms);
  return res;
});

Vue.component('v-cube', {
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
        transform: `translateZ(50px) ${rotate}`,
      };
    },
    innerStyle() {
      return {
        transform: `matrix3d(${this.cube.matrix})`,
      };
    },
  },
});

Vue.component('v-leaderboard', {
  template: `
    <div class="leaderboard">
      <h2>Ranking</h2>
      <table v-if="list.length">
        <thead>
          <tr><th>Rank</th><th>Name</th><th>Time</th><th>Submitted</th></tr>
        </thead>
        <tbody>
          <v-leaderboard-item v-for="(item, index) in list" :key="item.name" :rank="index + 1" :item="item"/>
        </tbody>
      </table>
      <div v-else>no data</div>
    </div>
  `,
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
});

Vue.component('v-leaderboard-item', {
  template: `
    <tr class="score" :style="{ '--rank': rank }">
      <td class="score-rank">{{ rank }}</td>
      <td class="score-name">{{ item.name }}</td>
      <td class="score-time">{{ item.time | scoreTime }}</td>
      <td class="score-date" :title="datetime">{{ item.updatedAt | relativeTime }}</td>
    </tr>
  `,
  props: {
    rank: {
      type: Number,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    datetime() {
      return dayjs(this.item.updatedAt).format('llll:ss');
    },
  },
});

Vue.component('v-score-form', {
  template: `
    <div v-if="value" class="score-form">
      クリア！！<br/>
      タイムは {{ time | scoreTime }} でした
      <form autocomplete="off" @submit="submit">
        <div><input type="text" v-model="name" placeholder="名前"/></div>
        <div><button>ランキング登録</button></div>
      </form>
    </div>
  `,
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      name: localStorage.getItem('sisisinout-cube:score:name') || '',
    };
  },
  methods: {
    submit(event) {
      event.preventDefault();
      localStorage.setItem('sisisinout-cube:score:name', this.name);
      this.$emit('submit', this.name);
    },
  },
});
