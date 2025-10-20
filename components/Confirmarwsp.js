export default {
  name: 'Confirmarwsp',
  template: `
  <div class="container">
    <div class="row justify-content-center mb-3">
      <div class="col-lg-6 col-md-10">
        <div class="card p-4 shadow-sm">
          <h4 class="mb-3">Registro de Tutor</h4>
          
            <div class="col-12">
            <label class="form-label">Whatsapp</label>
            <input v-model="telefono" type="number" class="form-control" required>
            </div>
             <div class="row g-2">
            
                <div class="col-md-6">
                <button class="my-4 btn  btn-outline-secondary w-100" @click="gohome">Ahora No</button>
                </div>
                <div class="col-md-6">
                <button class="my-4 btn btn-success w-100" @click="confirmar">Confirmar</button>
                </div>
                
            </div>
          </div>
          
          </div>
        </div>
    </div>
  </div>
   `,
data(){ return { telefono:'' }; },

methods: {
    confirmar() {
      console.log('confirmando....'); // Vue 2: refs con v-for son arrays
    },
    gohome(){
        this.$router.push('/home'); 
    }
  },

  created(){ this.telefono = this.$store.state.wsp || ''; },

  mounted() {
    const style = document.createElement('style');
    style.textContent = `
      .preview-box{width:100%;aspect-ratio:1/1;border:1px dashed #ced4da;border-radius:.5rem;background:#f8f9fa;overflow:hidden;cursor:pointer}
      .preview-box.ref{background:#fff;cursor:default}
      .img-fit{width:100%;height:100%;object-fit:cover}
    `;
    document.head.appendChild(style);
  }
};