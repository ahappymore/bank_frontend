import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // 引入路由配置
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';  // 引入 Element Plus 样式
import './style/global.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn'; // 中文语言包
import Particles from "@tsparticles/vue3";

// 创建 Vue 应用并使用插件
const app = createApp(App);

// 使用 Element Plus 插件
app.use(ElementPlus, { locale: zhCn });

app.use(Particles) // 配置相关的文件

// 使用 Vue Router 插件
app.use(router);


// 挂载 Vue 应用
app.mount('#app');

