import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from './plugins/font-awesome'

/*
window.Vue = require('vue').default;
window.Vue.use(router);
window.Vue.use(store);
window.Vue.component("font-awesome-icon", FontAwesomeIcon);
window.Vue.mount('#app');
*/

let app = createApp(App)
    .use(router)
    .use(store)
    .component("font-awesome-icon", FontAwesomeIcon)


app.mount('#app');