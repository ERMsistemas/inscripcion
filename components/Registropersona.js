// components/Registropersona.js
export default {
  name: 'Registropersona',
  template: `
  <div class="container">
    <div class="row justify-content-center mb-3">
      <div class="col-lg-6 col-md-10">
        <div class="card p-4 shadow-sm">
          <h4 class="mb-3">Registro de Tutor</h4>

          <!-- Datos -->
          <div class="row g-2">
            <div class="col-md-6">
              <label class="form-label">Nombre</label>
              <input v-model.trim="form.nombre" class="form-control" required>
            </div>
            <div class="col-md-6">
              <label class="form-label">Apellido</label>
              <input v-model.trim="form.apellido" class="form-control" required>
            </div>
            <div class="col-md-6">
              <label class="form-label">DNI</label>
              <input v-model.trim="form.dni" class="form-control" inputmode="numeric" required>
            </div>
            <div class="col-md-6">
              <label class="form-label">Celular</label>
              <input v-model.trim="form.cel" class="form-control" inputmode="tel" required>
            </div>

            <div class="col-12">
            <label class="form-label d-block">Sexo</label>

            <div class="form-check form-check-inline">
                <input
                class="form-check-input"
                type="radio"
                id="sexoF"
                value="F"
                v-model="form.genero"
                >
                <label class="form-check-label" for="sexoF">
                <i class="bi bi-gender-female text-danger me-1"></i>Femenino</label>
            </div>

            <div class="form-check form-check-inline">
                <input
                class="form-check-input"
                type="radio"
                id="sexoM"
                value="M"
                v-model="form.genero"
                >
                <label class="form-check-label" for="sexoM">
                <i class="bi bi-gender-male text-primary me-1"></i> Masculino</label>
            </div>

            <div class="form-check form-check-inline">
                <input
                class="form-check-input"
                type="radio"
                id="sexoX"
                value="NB"
                v-model="form.genero"
                >
                <label class="form-check-label" for="sexoX">
                <i class="bi bi-gender-ambiguous text-secondary me-1"></i> Otro / No binario</label>
            </div>
            </div>

            <div class="col-12">
            <label class="form-label">Nacionalidad</label>
            <select v-model="form.nacionalidad" class="form-select" required>
                <option disabled value="">Seleccione...</option>
                <option value="1">Argentina</option>
                <option value="2">Chile</option>
                <option value="3">Paraguay</option>
                <option value="4">Brasil</option>
                <option value="5">Otro</option>
            </select>
            </div>

            <div class="col-12">
              <label class="form-label">Email</label>
              <input v-model.trim="form.email" type="email" class="form-control" required>
            </div>
            <div class="col-12">
              <label class="form-label">Domicilio</label>
              <input v-model.trim="form.domicilio" type="domicilio" class="form-control" required>
            </div>
            
            <div class="mb-3">
            <label class="form-label">Fecha de nacimiento</label>
            <input
                v-model="form.fecha_nacimiento"
                type="date"
                class="form-control"
                placeholder="Seleccione fecha"
            >
            </div>

          </div>

          <hr class="my-3">

          <!-- Foto genérica reutilizable -->
          <div v-for="campo in camposFoto" :key="campo.key" class="mb-3">
            <label class="form-label">{{ campo.label }}</label>
            <div class="row g-2 align-items-center">
              <div class="col-6">
                <div class="preview-box ref d-flex flex-column justify-content-center align-items-center">
                  <i :class="campo.icon + ' display-4'"></i>
                  <small class="text-muted mt-1">Referencia</small>
                </div>
              </div>
              <div class="col-6">
                <!-- Caja clickeable -->
                <div class="preview-box d-flex justify-content-center align-items-center pointer"
                     @click="abrirArchivo(campo.key)">
                  <img v-if="previews[campo.key]" :src="previews[campo.key]" class="img-fit">
                  <i v-else class="bi bi-camera display-4 text-muted"></i>
                </div>
                <!-- Input oculto -->
                <input :ref="campo.key"
                       type="file"
                       class="d-none"
                       accept="image/*"
                       :capture="campo.capture"
                       @change="onFile($event, campo.key)">
              </div>
            </div>
          </div>

          <button class="btn btn-success w-100" @click="guardar">Guardar</button>
        </div>
      </div>
    </div>
  </div>
  `,
  data() {
    return {
      form: { nombre:'', apellido:'', dni:'', cel:'', email:'' , nacionalidad:''},
      files: { dni_frente:null, dni_dorso:null, perfil:null },
      previews: { dni_frente:'', dni_dorso:'', perfil:'' },
      camposFoto: [
        { key:'dni_frente', label:'DNI Frente', icon:'bi bi-credit-card-2-front', capture:'environment' },
        { key:'dni_dorso', label:'DNI Dorso', icon:'bi bi-credit-card-2-back', capture:'environment' },
        { key:'perfil', label:'Foto de Perfil', icon:'bi bi-person-circle', capture:'user' }
      ]
    };
  },
  methods: {
    abrirArchivo(key) {
      this.$refs[key][0]?.click?.(); // Vue 2: refs con v-for son arrays
    },
    onFile(e, key) {
      const f = e.target.files?.[0] || null;
      this.files[key] = f;
      if (!f) { this.previews[key] = ''; return; }
      const r = new FileReader();
      r.onload = () => (this.previews[key] = r.result);
      r.readAsDataURL(f);
    },
    async guardar() {
    const reqOk = this.form.nombre && this.form.apellido && this.form.dni && this.form.cel;
    const fotosOk = this.files.dni_frente && this.files.dni_dorso && this.files.perfil;
    if (!reqOk || !fotosOk) { alert('Complete los campos.'); return; }

    const fd = new FormData();
    Object.entries(this.form).forEach(([k,v]) => fd.append(k, v ?? ''));
    fd.append('dni_frente', this.files.dni_frente);
    fd.append('dni_dorso',  this.files.dni_dorso);
    fd.append('perfil',     this.files.perfil);

    try {
        const { data } = await axios.post('./api/personas_add.php', fd);
        if (!data.ok) throw new Error(data.error || 'API');

        // armo objeto usuario para el store
       +

        this.$store.commit('setWsp', this.form.cel);   // <- guardar en Vuex
        alert('Guardado correctamente');
        this.$router.push('/confirmar_wsp');            // opcional
    } catch (e) {
        console.error(e);
        alert('Error al guardar');
    }
    }

  },
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
