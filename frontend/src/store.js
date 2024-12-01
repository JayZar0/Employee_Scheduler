import { createStore } from 'vuex';

export default createStore({
    state: {
        isLoggedIn: true
    },
    mutations: {
        setLoggedIn(state, isLoggedIn) {
            state.isLoggedIn = isLoggedIn;
        }
    },
    actions: {
        logout({ commit }) {
            localStorage.removeItem('bearerToken');
            commit('setLoggedIn', false);
        }
    }
});
