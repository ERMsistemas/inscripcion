export default {
  name: 'Trayectos',
  props: {
    dias: Array,
    horas: Array,
    diaSeleccionado: [String, Number],
    horaSeleccionada: [String, Number]
  },
  template: `
    <div class="row justify-content-center mb-3">
      <div class="col-lg-4 col-md-8 mb-3">
        <label>Día:</label>
        <select class="form-control" 
                :value="diaSeleccionado" 
                @change="$emit('update-dia', Number($event.target.value))">
          <option disabled :value="null">-- Seleccionar --</option>
          <option v-for="d in dias" :key="d.id_dia" :value="d.id_dia">
            {{ d.nombre_dia }}
          </option>
        </select>
      </div>

      <div class="col-lg-4 col-md-8 mb-3">
        <label>Hora:</label>
        <select class="form-control" 
                :value="horaSeleccionada" 
                @change="$emit('update-hora', Number($event.target.value))">
          <option disabled :value="null">-- Seleccionar --</option>
          <option v-for="h in horas" :key="h.id_hora" :value="h.id_hora">
            {{ h.hora }}
          </option>
        </select>
      </div>

    </div>
  `
};
