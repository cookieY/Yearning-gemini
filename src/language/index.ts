import Vue from 'vue'
import VueI18n from 'vue-i18n';
import iView from 'view-design'

// import locale from 'view-design/dist/locale/en-US';
import locale from 'view-design/dist/locale/zh-CN';
// let ui_zh = require('view-design/dist/locale/zh-CN')
// let ui_en = require('view-design/dist/locale/en-US')
let app_zh = require('./zh-cn.json')
let app_en = require('./en-us.json')
Vue.use(VueI18n);
Vue.use(iView,{
    locale
})
const messages = {
    en: Object.assign(app_en),
    zh: Object.assign(app_zh)
};

const i18n = new VueI18n({
    locale: 'zh', //if you need get the browser language use following "window.navigator.language"
    fallbackLocale: 'zh',
    messages: messages,
    silentTranslationWarn: true
})

export default i18n;

