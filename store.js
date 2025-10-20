export default new Vuex.Store({
/* const store = new Vuex.Store({ */
    /* mode: history; */
    state: {
        user: null,
        cursos: [],
        horarios: [],
        wsp: ''
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
            //console.log('Usuario actualizado:', user);
            
        },
        setWsp(state,wsp){
            state.wsp = wsp;
        },
        setCursos(state, cursos) {
            state.cursos = cursos;
            //console.log('alumno actualizado:', cursos);
        },
        setHorarios(state, horarios) {
            state.horarios = horarios;
         }
    },
    actions: {
        login({commit, dispatch}, creds) {
            return axios.post('./api/login.php', creds)
                .then(res => {
                    commit('setUser', res.data.user);
                    //return dispatch('fetchCursos');
                });
        },
        fetchCursos({ commit, state }) {
            const dni = state.user?.dni;
            if (!dni) return Promise.reject('DNI no disponible');

            return axios.get(`./api/cursos_alumnos.php?dni=${dni}`)
                .then(res => {
                    commit('setCursos', res.data);
                });
        },

        fetchHorariosSimple({ commit }, dni) {
            return axios.get(`./api/horarios_simple.php?dni=${dni}`)
            .then(res => {
                commit('setHorarios', res.data);
            });
        }

    }
});
