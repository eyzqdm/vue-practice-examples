import Vue from "vue";
import VueRouter from "vue-router";
import { Store } from "vuex";
declare module '*.vue' {
 // import Vue from 'vue'
  export default Vue
}
// 扩展ComponentOptions
declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    router?: VueRouter;
    store?: Store<any>;
  }
}