import { createStore } from "vuex";
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';


const store = createStore({
    state: {
        user: {
            loggedIn: false,
            data: null
        }
    },
    getters: {
        user(state) {
            return state.user
        }
    },
    mutations: {
        SET_LOGGED_IN(state, value) {
            state.user.loggedIn = value;
        },
        SET_USER(state, data) {
            state.user.data = data;
        },
        SET_SB(state, data) {
            state.user.data.scoreboard = data;
        }
    },
    actions: {
        async register(context, { email, password, name }) {
            const response = await createUserWithEmailAndPassword(auth, email, password)
            if (response) {
                context.commit('SET_USER', response.user)
                updateProfile(response.user, {
                    displayName: name,
                    scoreboard: {
                        "Numbers": [0, 0, 0, 0, 0],
                        "Letters": [0, 0, 0, 0, 0],
                        "Colors": [0, 0, 0, 0, 0],
                        "PHD": [0, 0, 0, 0, 0]
                    },
                })
            } else {
                throw new Error('Unable to register user')
            }
        },

        async logIn(context, { email, password, scoreboard }) {
            const response = await signInWithEmailAndPassword(auth, email, password)
            if (response) {
                context.commit('SET_USER', response.user)
                context.commit('SET_SB', scoreboard)
            } else {
                throw new Error('login failed')
            }
        },

        async logOut(context) {
            await signOut(auth)
            context.commit('SET_USER', null)
        },

        async fetchUser(context, user) {
            context.commit("SET_LOGGED_IN", user !== null);
            if (user) {
                context.commit("SET_USER", {
                    displayName: user.displayName,
                    email: user.email,
                    scoreboard: user.scoreboard
                });
            } else {
                context.commit("SET_USER", null);
            }
        }
    }
});

export default store;