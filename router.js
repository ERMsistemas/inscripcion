import Registropersona from './components/Registropersona.js';
import Confirmarwsp from './components/Confirmarwsp.js';

import store from './store.js';
const Login = {
  components: {
        Registropersona
  },
    template: `
      <div class="container">
      <div class="row justify-content-center mt-5">
        <div class="col-12 col-sm-12 col-md-12 col-lg-4">
          <div class="card p-4 shadow-sm">
            <h3 class="text-center mb-4">Ingreso</h3>
            <form @submit.prevent="doLogin">
              <div class="mb-3">
                <input 
                  v-model="usr" 
                  class="form-control form-control-lg" 
                  placeholder="Usuario" 
                  required
                  autofocus
                >
              </div>
              <div class="mb-4">
                <input 
                  v-model="pass" 
                  type="password" 
                  class="form-control form-control-lg" 
                  placeholder="Contraseña" 
                  required
                >
              </div>
              <button 
                type="submit" 
                class="btn btn-primary btn-lg w-100" style="background-color: #FAB803; border-color: #FAB803;"
              >
                Ingresar
              </button>
              <button
              @click="registrarse"
              class="btn btn-primary btn-lg w-100 my-2" style="background-color: #cfbd8bff; border-color: #FAB803;"
              >Registrarse</button>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal de error -->
<div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-danger text-white">
        <h5 class="modal-title" id="errorModalLabel">Error</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        {{ mensajeError }}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>

    </div>
    `,
    data(){
        return { usr:'', pass:'',mensajeError: ''};
    },
    methods:{
        doLogin() {
        if (this.usr && this.usr.trim() !== '' && this.pass && this.pass.trim() !== '') {
          this.$store.dispatch('login', { usr: this.usr, contra: this.pass })
            .then(() => {
              const dni = this.$store.state.user?.dni;
              if (!dni) throw new Error('DNI no disponible');
              return this.$store.dispatch('fetchCursos');
            })
            .then(() => {
              this.$router.push('/home');
            })
            .catch(() => {
              this.mensajeError = 'Credenciales inválidas o error en carga de datos';
              const modal = new bootstrap.Modal(document.getElementById('errorModal'));
              modal.show();
            });
        } else {
          this.mensajeError = 'Credenciales inválidas';
          const modal = new bootstrap.Modal(document.getElementById('errorModal'));
          modal.show();
        }
      },
      registrarse(){ this.$router.push('/registro'); }
    }
};

const Home = {
    data() {
        return {
            mensajeModal: '',
            modalClaseHeader: 'bg-primary', // puede ser: bg-success, bg-danger, bg-warning...
            modalTitulo: 'Mensaje'
        
        }
},
  created() {

},
  methods: {
    logout() {
    axios.get('./api/logout.php')
      .then(() => {
        this.$store.commit('setUser', null);
        this.$router.push('/login');
      });
  }
  },
  computed: {

  },
  template: `
    <div class="container mt-5">
    <div class="text-end my-3">
  <button class="btn btn-danger" @click="logout">
    Salir
  </button>
</div>
   
      <h3>Bienvenido {{$store.state.user.dni}}</h3>
       <div class="guardar-fixed text-center">
                <button class="btn btn-success btn-block btn-lg px-4" @click="agregar">
                    Agregar
                </button>
                <button class="btn btn-success btn-block btn-lg px-4" @click="Matricularme">
                    Matricularme
                </button>
                <button class="btn btn-success btn-block btn-lg px-4" @click="edit">
                    Editar mis Datos 
                </button>
            </div>

<!-- Modal reutilizable -->
<div class="modal fade" id="infoModal" tabindex="-1" aria-labelledby="infoModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div :class="['modal-header', modalClaseHeader, 'text-white']">
        <h5 class="modal-title" id="infoModalLabel">{{ modalTitulo }}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        {{ mensajeModal }}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>

    </div>
  `
};


const router = new VueRouter({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        { path: '/home', component: Home },
        { path: '/registro', component: Registropersona }, // <- nuevo
        { path: '/confirmar_wsp', component: Confirmarwsp } // <- nuevo

    ]
});
router.beforeEach((to, from, next) => {
  const user = store.state.user;
  if (to.path === '/home' && !user) {
    next('/login');
  } else {
    next();
  }
});
export default router;
