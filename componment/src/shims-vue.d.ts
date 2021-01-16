/* 声明文件 可以获得更好的代码提示 */
import Vue from "vue";
import VueRouter from "vue-router";
import { AxiosInstance } from "axios";
import { Store } from "vuex";
declare module '*.vue' {
 // import Vue from 'vue'
  export default Vue
}

declare module "vue/types/vue" {
  interface Vue {
    $axios: AxiosInstance;
  }
}

// 扩展ComponentOptions
declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    router?: VueRouter;
    store?: Store<any>;
  }
}