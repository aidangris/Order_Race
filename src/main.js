import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store";
//import AuthNav from "./components/AuthNav.vue";
//import { domain, clientId, audience } from '../auth_config.json';
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from './plugins/font-awesome'
//import { createAuth0 } from '@auth0/auth0-vue';


let app = createApp(App)
    .use(router)
    .use(store)

/*.use(createAuth0({
    domain: 'dev-a6hh7q6zdg1forxw.us.auth0.com',
    clientId: 'AQZNYsEKKe7qIXoav73tvpothJZ9YJSIo',
    authorizationParams: {
        redirect_uri: 'import.meta.env.AUTH0_CALLBACK_URL'
    }
}))*/

.component("font-awesome-icon", FontAwesomeIcon)


app.mount('#app');