import Vue from 'vue'
import VueI18n from 'vue-i18n';
import iView from 'view-design'
import zh from 'view-design/dist/locale/zh-CN';
import en from 'view-design/dist/locale/en-US';
import app_zh from './zh-cn.json'
import app_en from './en-us.json';

Vue.use(VueI18n);
Vue.use(iView);
Vue.locale = () => {};

const messages = {
    en: Object.assign(app_en, en),
    zh: Object.assign(app_zh, zh)
};

// Create VueI18n instance with options
const i18n = new VueI18n({
    locale: 'zh',  // set locale
    messages  // set locale messages
});

export default i18n

