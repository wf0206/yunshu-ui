import Vue from "vue";
import Vuex from "vuex";

import app from "./modules/app";
import user from "./modules/user";
import dict from "./modules/dict";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    // 状态
    notices: "" ,//通知提示信息
    webSocketMsg:''
  },
  mutations: {
    // 改变方法
    SET_WS_MSG (state, msg) {
      state.webSocketMsg = msg
    }
  },
  actions: {},
  modules: {
    app,
    user,
    dict
  }
});

export default store;
