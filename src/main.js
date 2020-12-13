import Vue from "vue";
import App from "./App.vue";
import VueKatex from "vue-katex";
import "katex/dist/katex.min.css";
import './registerServiceWorker'

Vue.config.productionTip = false;

Vue.use(VueKatex, {
  globalOptions: {
    delimiters: [{ left: "$$", right: "$$", display: false }]
  }
});

new Vue({
  render: h => h(App)
}).$mount("#app");
