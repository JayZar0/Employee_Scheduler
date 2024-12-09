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
            commit('setLoggedIn', false);
            commit('setManager', false); // remove privilege
            localStorage.removeItem('bearerToken'); // remove token
            router.push('/'); // send back to log in
        },
        login( { commit }, userAccessCredentials) {
            commit('setLoggedIn', true);
            commit('setManager', userAccessCredentials.isManager); // give appropriate privilege
            localStorage.setItem('bearerToken', userAccessCredentials.bearerToken); // set bearer token
        }
    }
});
