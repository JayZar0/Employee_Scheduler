import { createStore } from 'vuex';

export default createStore({
    state: {
        isLoggedIn: false,
        isManager: false
    },
    mutations: {
        setLoggedIn(state, isLoggedIn) {
            state.isLoggedIn = isLoggedIn;
        },
        setManager (state, isManager) {
            state.isManager = isManager;
        }
    },
    actions: {
        logout({ commit }, router) {
            commit('setLoggedIn', false); // update state
            commit('setManager', false); // remove privilege
            localStorage.removeItem('bearerToken'); // remove token
            router.push('/');
        }, login( { commit }, employee) {
            commit('setLoggedIn', true); // update state
            commit('setManager', employee.isManager); // give appropriate privilege


        }
    }
});
