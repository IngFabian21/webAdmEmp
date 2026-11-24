/*panel movimiento */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTOS HTML
    ===================================================== */

    const totalIngresosMes = document.getElementById("totalIngresosMes");
    const totalGastosMes = document.getElementById("totalGastosMes");
    const tablaMovimientosEconomia = document.getElementById("tablaMovimientosEconomia");


    /* =====================================================
       FORMATO DE MONEDA
    ===================================================== */

    function formatoCOPEconomia(valor) {

        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }).format(valor);

    }


    /* =====================================================
       FORMATO DE FECHA
    ===================================================== */

    function formatoFechaEconomia(fecha) {

        const [anio, mes, dia] = fecha.split("-");

        return `${dia}-${mes}-${anio}`;

    }


    /* =====================================================
       OBTENER CONCEPTO DEL MOVIMIENTO
    ===================================================== */

    function obtenerConceptoEconomia(idDetalle) {

        const concepto = CONCEPT_DETAILS.find(detalle =>
            Number(detalle.id) === Number(idDetalle)
        );

        return concepto
            ? concepto.name_detail
            : "Concepto no encontrado";

    }


    /* =====================================================
       OBTENER ÚLTIMO MES REGISTRADO
    ===================================================== */

    function obtenerUltimoMesRegistrado() {

        if (ACCOUNTINGS.length === 0) {
            return null;
        }

        const fechas = ACCOUNTINGS.map(movimiento =>
            movimiento.date_acc
        );

        const ultimaFecha = fechas.sort().at(-1);

        return ultimaFecha.substring(0, 7);

    }


    /* =====================================================
       OBTENER MOVIMIENTOS DEL MES
    ===================================================== */

    function obtenerMovimientosDelMes(mes) {

        return ACCOUNTINGS.filter(movimiento =>
            movimiento.date_acc.substring(0, 7) === mes
        );

    }


    /* =====================================================
       CALCULAR INGRESOS DEL MES
    ===================================================== */

    function calcularIngresosMes(movimientos) {

        return movimientos.reduce((total, movimiento) => {

            return total + (Number(movimiento.input_acc) || 0);

        }, 0);

    }


    /* =====================================================
       CALCULAR GASTOS DEL MES
    ===================================================== */

    function calcularGastosMes(movimientos) {

        return movimientos.reduce((total, movimiento) => {

            return total + (Number(movimiento.output_acc) || 0);

        }, 0);

    }


    /* =====================================================
       MOSTRAR TARJETAS
    ===================================================== */

    function mostrarResumenEconomico(movimientos) {

        const ingresos = calcularIngresosMes(movimientos);

        const gastos = calcularGastosMes(movimientos);

        totalIngresosMes.textContent = formatoCOPEconomia(ingresos);

        totalGastosMes.textContent = formatoCOPEconomia(gastos);

    }


    /* =====================================================
       MOSTRAR TABLA DE MOVIMIENTOS
    ===================================================== */

    function mostrarTablaEconomia(movimientos) {

        tablaMovimientosEconomia.innerHTML = "";

        if (movimientos.length === 0) {

            tablaMovimientosEconomia.innerHTML = `
                <tr>
                    <td colspan="4"
                        class="text-center textSecondary fw-semibold">
                        No hay movimientos registrados.
                    </td>
                </tr>
            `;

            return;

        }


        // Ordenar del más reciente al más antiguo
        const movimientosOrdenados = [...movimientos].sort((a, b) =>
            b.date_acc.localeCompare(a.date_acc)
        );


        movimientosOrdenados.forEach(movimiento => {

            const concepto = obtenerConceptoEconomia(
                movimiento.id_detail
            );

            const esEntrada = Number(movimiento.input_acc) > 0;

            const tipo = esEntrada ? "Entrada" : "Salida";

            const claseTipo = esEntrada
                ? "text-success"
                : "text-danger";

            const valor = esEntrada
                ? movimiento.input_acc
                : movimiento.output_acc;


            tablaMovimientosEconomia.innerHTML += `

                <tr>

                    <td>
                        <h6 class="textSecondary fw-semibold">
                            ${formatoFechaEconomia(movimiento.date_acc)}
                        </h6>
                    </td>

                    <td>
                        <h6 class="textSecondary fw-semibold">
                            ${concepto}
                        </h6>
                    </td>

                    <td>
                        <h6 class="${claseTipo} fw-semibold">
                            ${tipo}
                        </h6>
                    </td>

                    <td>
                        <h6 class="textSecondary fw-semibold">
                            ${formatoCOPEconomia(valor)}
                        </h6>
                    </td>

                </tr>

            `;

        });

    }


    /* =====================================================
       CARGAR MOVIMIENTOS ECONÓMICOS
    ===================================================== */

    function cargarMovimientosEconomia() {

        if (ACCOUNTINGS.length === 0) {

            totalIngresosMes.textContent = formatoCOPEconomia(0);

            totalGastosMes.textContent = formatoCOPEconomia(0);

            mostrarTablaEconomia([]);

            return;

        }


        // Obtener último mes registrado
        const ultimoMes = obtenerUltimoMesRegistrado();


        // Obtener movimientos de ese mes
        const movimientos = obtenerMovimientosDelMes(ultimoMes);


        // Actualizar tarjetas
        mostrarResumenEconomico(movimientos);


        // Actualizar tabla
        mostrarTablaEconomia(movimientos);

    }


    /* =====================================================
       INICIALIZAR MÓDULO
    ===================================================== */

    cargarMovimientosEconomia();


    /* =====================================================
       FUNCIÓN GLOBAL PARA ACTUALIZAR
    ===================================================== */

    window.actualizarMovimientosEconomia = cargarMovimientosEconomia;

});
/*Registro de movimiento*/


document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       ELEMENTOS HTML
    ===================================================== */

  const formMovimientoEconomico = document.getElementById(
    "formNuevoMovimientoEconomico",
  );

  const conceptoMovimiento = document.getElementById(
    "conceptoMovimientoEconomico",
  );

  const fechaMovimiento = document.getElementById("fechaMovimientoEconomico");

  const valorMovimiento = document.getElementById("valorMovimientoEconomico");

  const modalMovimiento = document.getElementById("modalAddReMovEc");

  /* =====================================================
       OBTENER TIPO DE MOVIMIENTO
    ===================================================== */

  function obtenerTipoMovimiento() {
    const seleccionado = document.querySelector(
      'input[name="tipoMovimientoEconomico"]:checked',
    );

    return seleccionado ? seleccionado.value : "IN";
  }

  /* =====================================================
       CARGAR CONCEPTOS SEGÚN EL TIPO
    ===================================================== */

  function cargarConceptosMovimiento() {
    const tipo = obtenerTipoMovimiento();

    conceptoMovimiento.innerHTML = `
            <option value="">Seleccionar concepto</option>
        `;

    const conceptos = CONCEPT_DETAILS.filter(
      (concepto) => concepto.type === tipo,
    );

    conceptos.forEach((concepto) => {
      conceptoMovimiento.innerHTML += `
                <option value="${concepto.id}">
                    ${concepto.name_detail}
                </option>
            `;
    });
  }

  /* =====================================================
       ESTABLECER FECHA ACTUAL
    ===================================================== */

  function establecerFechaActual() {
    const hoy = new Date();

    const fechaLocal = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

    fechaMovimiento.value = fechaLocal;
  }

  /* =====================================================
       GENERAR NUEVO MOVIMIENTO
    ===================================================== */

  function registrarMovimientoEconomico(e) {
    e.preventDefault();

    const tipo = obtenerTipoMovimiento();

    const idConcepto = Number(conceptoMovimiento.value);

    const fecha = fechaMovimiento.value;

    const valor = Number(valorMovimiento.value);

    /* VALIDAR CONCEPTO */

    const concepto = CONCEPT_DETAILS.find(
      (detalle) => Number(detalle.id) === idConcepto && detalle.type === tipo,
    );

    if (!concepto) {
      alert("Selecciona un concepto válido.");

      return;
    }

    /* VALIDAR FECHA */

    if (!fecha || Number.isNaN(Date.parse(fecha))) {
      alert("Selecciona una fecha válida.");

      return;
    }

    /* VALIDAR VALOR */

    if (!Number.isFinite(valor) || valor <= 0) {
      alert("El valor debe ser mayor que cero.");

      return;
    }

    /* =================================================
           CREAR REGISTRO
        ================================================= */

    const nuevoMovimiento = {
      id_detail: idConcepto,

      date_acc: fecha,

      input_acc: tipo === "IN" ? valor : 0,

      output_acc: tipo === "OUT" ? valor : 0,

      total: tipo === "IN" ? valor : -valor,
    };

    /* GUARDAR EN EL ARREGLO */

    ACCOUNTINGS.push(nuevoMovimiento);

    /* =================================================
           ACTUALIZAR TABLA Y TARJETAS
        ================================================= */

    if (typeof window.actualizarMovimientosEconomia === "function") {
      window.actualizarMovimientosEconomia();
    }

    if (typeof window.actualizarEstadisticasEconomia === "function") {
      window.actualizarEstadisticasEconomia();
    }

    /* =================================================
           LIMPIAR FORMULARIO
        ================================================= */

    formMovimientoEconomico.reset();

    document.getElementById("ReMovEntrada").checked = true;

    cargarConceptosMovimiento();

    establecerFechaActual();

    /* =================================================
           CERRAR MODAL
        ================================================= */

    const instanciaModal = bootstrap.Modal.getInstance(modalMovimiento);

    if (instanciaModal) {
      instanciaModal.hide();
    }

    alert("Movimiento registrado correctamente.");
  }

  /* =====================================================
       EVENTOS
    ===================================================== */

  // Cambiar entre entrada y salida
  document
    .querySelectorAll('input[name="tipoMovimientoEconomico"]')
    .forEach((radio) => {
      radio.addEventListener("change", cargarConceptosMovimiento);
    });

  // Guardar movimiento
  formMovimientoEconomico.addEventListener(
    "submit",
    registrarMovimientoEconomico,
  );

  /* =====================================================
       INICIALIZAR
    ===================================================== */

  cargarConceptosMovimiento();

  establecerFechaActual();
});

/*estadistica*/

document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       ELEMENTOS HTML
    ===================================================== */

  const selectAnio = document.getElementById("anioEstadisticasEc");

  const btnBuscar = document.getElementById("btnBuscarEstadisticasEc");

  const tablaEstadisticas = document.getElementById("tablaEstadisticasEc");

  const contenedorGrafico = document.querySelector("#estEco");

  /* =====================================================
       VARIABLES
    ===================================================== */

  let graficoEconomia = null;

  const meses = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  /* =====================================================
       FORMATO DE MONEDA
    ===================================================== */

  function formatoCOPEstadisticas(valor) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(valor);
  }

  /* =====================================================
       OBTENER CONCEPTO
    ===================================================== */

  function obtenerConcepto(idDetalle) {
    return CONCEPT_DETAILS.find(
      (concepto) => Number(concepto.id) === Number(idDetalle),
    );
  }

  /* =====================================================
       CARGAR AÑOS DISPONIBLES
    ===================================================== */

  function cargarAnios() {
    selectAnio.innerHTML = "";

    if (ACCOUNTINGS.length === 0) {
      selectAnio.innerHTML = `
                <option value="">Sin registros</option>
            `;

      return;
    }

    const anios = [
      ...new Set(
        ACCOUNTINGS.map((movimiento) => movimiento.date_acc.substring(0, 4)),
      ),
    ].sort((a, b) => Number(b) - Number(a));

    anios.forEach((anio) => {
      selectAnio.innerHTML += `
                <option value="${anio}">
                    ${anio}
                </option>
            `;
    });

    // Seleccionar automáticamente el último año registrado
    selectAnio.value = anios[0];
  }

  /* =====================================================
       OBTENER MOVIMIENTOS DEL AÑO
    ===================================================== */

  function obtenerMovimientosAnio(anio) {
    return ACCOUNTINGS.filter(
      (movimiento) => movimiento.date_acc.substring(0, 4) === anio,
    );
  }

  /* =====================================================
       AGRUPAR TOTALES POR CONCEPTO
    ===================================================== */

  function calcularTotalesConceptos(movimientos) {
    const agrupados = {};

    movimientos.forEach((movimiento) => {
      const concepto = obtenerConcepto(movimiento.id_detail);

      if (!concepto) return;

      const id = movimiento.id_detail;

      if (!agrupados[id]) {
        agrupados[id] = {
          nombre: concepto.name_detail,
          tipo: concepto.type,
          total: 0,
        };
      }

      agrupados[id].total +=
        Number(
          concepto.type === "IN" ? movimiento.input_acc : movimiento.output_acc,
        ) || 0;
    });

    return Object.values(agrupados);
  }

  /* =====================================================
       MOSTRAR TABLA
    ===================================================== */

  function mostrarTablaEstadisticas(movimientos) {
    tablaEstadisticas.innerHTML = "";

    const totales = calcularTotalesConceptos(movimientos);

    if (totales.length === 0) {
      tablaEstadisticas.innerHTML = `
                <tr>
                    <td colspan="3"
                        class="text-center textSecondary fw-semibold">
                        No hay movimientos registrados para este año.
                    </td>
                </tr>
            `;

      return;
    }

    // Ordenar por tipo y luego por nombre
    totales.sort((a, b) => {
      if (a.tipo !== b.tipo) {
        return a.tipo.localeCompare(b.tipo);
      }

      return a.nombre.localeCompare(b.nombre);
    });

    totales.forEach((concepto) => {
      const esEntrada = concepto.tipo === "IN";

      const textoTipo = esEntrada ? "Entrada" : "Salida";

      const claseTipo = esEntrada ? "text-success" : "text-danger";

      tablaEstadisticas.innerHTML += `

                <tr>

                    <td>
                        <h6 class="textSecondary fw-semibold">
                            ${concepto.nombre}
                        </h6>
                    </td>

                    <td>
                        <h6 class="${claseTipo} fw-semibold">
                            ${textoTipo}
                        </h6>
                    </td>

                    <td>
                        <h6 class="textSecondary fw-semibold">
                            ${formatoCOPEstadisticas(concepto.total)}
                        </h6>
                    </td>

                </tr>

            `;
    });
  }

  /* =====================================================
       CALCULAR INGRESOS Y GASTOS POR MES
    ===================================================== */

  function calcularTotalesMensuales(movimientos) {
    const ingresos = Array(12).fill(0);

    const gastos = Array(12).fill(0);

    movimientos.forEach((movimiento) => {
      const mes = Number(movimiento.date_acc.substring(5, 7)) - 1;

      if (mes < 0 || mes > 11) return;

      ingresos[mes] += Number(movimiento.input_acc) || 0;

      gastos[mes] += Number(movimiento.output_acc) || 0;
    });

    return {
      ingresos,
      gastos,
    };
  }

  /* =====================================================
       CREAR / ACTUALIZAR GRÁFICO
    ===================================================== */

  function actualizarGrafico(movimientos) {
    const totales = calcularTotalesMensuales(movimientos);

    const opciones = {
      series: [
        {
          name: "Gastos",
          data: totales.gastos,
        },
        {
          name: "Ingresos",
          data: totales.ingresos,
        },
      ],

      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: true,
        },
      },

      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        },
      },

      dataLabels: {
        enabled: false,
      },

      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },

      xaxis: {
        categories: meses,
      },

      yaxis: {
        title: {
          text: "Valor en COP",
        },
        labels: {
          formatter: function (valor) {
            return new Intl.NumberFormat("es-CO", {
              notation: "compact",
              maximumFractionDigits: 1,
            }).format(valor);
          },
        },
      },

      fill: {
        opacity: 1,
      },

      tooltip: {
        y: {
          formatter: function (valor) {
            return formatoCOPEstadisticas(valor);
          },
        },
      },

      noData: {
        text: "No hay datos disponibles",
      },
    };

    if (graficoEconomia) {
      graficoEconomia.updateOptions(opciones);
    } else {
      graficoEconomia = new ApexCharts(contenedorGrafico, opciones);

      graficoEconomia.render();
    }
  }

  /* =====================================================
       BUSCAR ESTADÍSTICAS POR AÑO
    ===================================================== */

  function buscarEstadisticas() {
    const anio = selectAnio.value;

    if (!anio) {
      tablaEstadisticas.innerHTML = `
                <tr>
                    <td colspan="3"
                        class="text-center textSecondary fw-semibold">
                        No hay años disponibles.
                    </td>
                </tr>
            `;

      actualizarGrafico([]);

      return;
    }

    const movimientos = obtenerMovimientosAnio(anio);

    mostrarTablaEstadisticas(movimientos);

    actualizarGrafico(movimientos);
  }

  /* =====================================================
       EVENTOS
    ===================================================== */

  btnBuscar.addEventListener("click", buscarEstadisticas);

  /* =====================================================
       INICIALIZAR
    ===================================================== */

  cargarAnios();

  buscarEstadisticas();

  /* =====================================================
       ACTUALIZAR DESDE OTROS MÓDULOS
    ===================================================== */

  window.actualizarEstadisticasEconomia = function () {
    const anioActual = selectAnio.value;

    cargarAnios();

    // Mantener el año seleccionado si todavía existe
    if (
      anioActual &&
      [...selectAnio.options].some((opcion) => opcion.value === anioActual)
    ) {
      selectAnio.value = anioActual;
    }

    buscarEstadisticas();
  };
});

document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
   REGISTROS DE CONCEPTOS
===================================================== */

  // Elementos HTML
  const tablaConceptos = document.getElementById("tablaConceptos");
  const buscarConcepto = document.getElementById("buscarConcepto");

  // Formularios
  const formAddConcepto = document.getElementById("formAddConcepto");
  const formEditConcepto = document.getElementById("formEditConcepto");

  // Modales Bootstrap
  const modalAddConcepto = new bootstrap.Modal(
    document.getElementById("modalAddConcepto"),
  );

  const modalEditConcepto = new bootstrap.Modal(
    document.getElementById("modalEditConcepto"),
  );

  /* =====================================================
   FUNCIONES AUXILIARES
===================================================== */

  // Obtener el nombre del tipo
  function obtenerTipoConcepto(tipo) {
    return tipo === "IN" ? "Ingreso" : "Egreso";
  }

  // Obtener el nombre del estado
  function obtenerEstadoConcepto(concepto) {
    return (concepto.status ?? "AC") === "AC" ? "Activo" : "Inactivo";
  }

  // Formatear valores
  function formatearValorConcepto(valor) {
    return typeof formatoCOP === "function"
      ? formatoCOP(Number(valor))
      : Number(valor).toLocaleString("es-CO");
  }

  /* =====================================================
   MOSTRAR CONCEPTOS EN LA TABLA
===================================================== */

  function mostrarConceptos(filtro = "") {
    // Limpiar tabla
    tablaConceptos.innerHTML = "";

    // Filtrar por nombre
    const conceptosFiltrados = CONCEPT_DETAILS.filter((concepto) => {
      return concepto.name_detail
        .toLowerCase()
        .includes(filtro.trim().toLowerCase());
    });

    // Validar si existen resultados
    if (conceptosFiltrados.length === 0) {
      tablaConceptos.innerHTML = `
            <tr>
                <td colspan="5" class="text-center textSecondary fw-semibold">
                    No se encontraron conceptos.
                </td>
            </tr>
        `;

      return;
    }

    // Generar filas
    conceptosFiltrados.forEach((concepto) => {
      const fila = document.createElement("tr");

      // Nombre
      const celdaNombre = document.createElement("td");
      celdaNombre.textContent = concepto.name_detail;

      // Valor
      const celdaValor = document.createElement("td");
      celdaValor.textContent = formatearValorConcepto(concepto.value);

      // Tipo
      const celdaTipo = document.createElement("td");
      celdaTipo.textContent = obtenerTipoConcepto(concepto.type);

      // Estado
      const celdaEstado = document.createElement("td");
      celdaEstado.textContent = obtenerEstadoConcepto(concepto);

      // Acciones
      const celdaAcciones = document.createElement("td");

      const botonEditar = document.createElement("button");

      botonEditar.type = "button";
      botonEditar.className = "btn btn-link p-1";
      botonEditar.innerHTML = '<i class="bi bi-pencil-square"></i>';
      botonEditar.title = "Actualizar concepto";

      botonEditar.addEventListener("click", () => {
        abrirEditarConcepto(concepto.id);
      });

      celdaAcciones.appendChild(botonEditar);

      // Agregar celdas a la fila
      fila.append(
        celdaNombre,
        celdaValor,
        celdaTipo,
        celdaEstado,
        celdaAcciones,
      );

      tablaConceptos.appendChild(fila);
    });
  }

  /* =====================================================
   BUSCADOR EN TIEMPO REAL
===================================================== */

  buscarConcepto.addEventListener("input", function () {
    mostrarConceptos(this.value);
  });

  /* =====================================================
   AGREGAR NUEVO CONCEPTO
===================================================== */

  formAddConcepto.addEventListener("submit", function (e) {
    e.preventDefault();

    // Obtener datos
    const nombre = document.getElementById("nombreNuevoConcepto").value.trim();

    const tipo = document.getElementById("tipoNuevoConcepto").value;

    const valor = Number(document.getElementById("valorNuevoConcepto").value);

    const descripcion = document
      .getElementById("descripcionNuevoConcepto")
      .value.trim();

    // Validar datos
    if (!nombre || !tipo || !Number.isFinite(valor) || valor < 0) {
      alert("Por favor, completa correctamente los campos.");

      return;
    }

    // Generar nuevo ID
    const nuevoId =
      CONCEPT_DETAILS.length > 0
        ? Math.max(...CONCEPT_DETAILS.map((concepto) => concepto.id)) + 1
        : 1;

    // Crear objeto
    const nuevoConcepto = {
      id: nuevoId,

      name_detail: nombre,

      type: tipo,

      description: descripcion,

      value: valor,

      status: "AC",
    };

    // Agregar al arreglo
    CONCEPT_DETAILS.push(nuevoConcepto);

    // Actualizar tabla
    mostrarConceptos(buscarConcepto.value);

    // Limpiar formulario
    formAddConcepto.reset();

    // Cerrar modal
    modalAddConcepto.hide();
  });

  /* =====================================================
   ABRIR MODAL DE ACTUALIZACIÓN
===================================================== */

  function abrirEditarConcepto(id) {
    // Buscar concepto seleccionado
    const concepto = CONCEPT_DETAILS.find((item) => item.id === id);

    if (!concepto) {
      alert("No se encontró el concepto seleccionado.");

      return;
    }

    // Cargar información en el formulario
    document.getElementById("idEditConcepto").value = concepto.id;

    document.getElementById("nombreEditConcepto").value = concepto.name_detail;

    document.getElementById("tipoEditConcepto").value = concepto.type;

    document.getElementById("valorEditConcepto").value = concepto.value;

    document.getElementById("descripcionEditConcepto").value =
      concepto.description;

    document.getElementById("estadoEditConcepto").value =
      concepto.status ?? "AC";

    // Mostrar modal
    modalEditConcepto.show();
  }

  /* =====================================================
   ACTUALIZAR CONCEPTO
===================================================== */

  formEditConcepto.addEventListener("submit", function (e) {
    e.preventDefault();

    // Obtener ID
    const id = Number(document.getElementById("idEditConcepto").value);

    // Buscar concepto
    const concepto = CONCEPT_DETAILS.find((item) => item.id === id);

    if (!concepto) {
      alert("No se encontró el concepto.");

      return;
    }

    // Obtener información actualizada
    const nombre = document.getElementById("nombreEditConcepto").value.trim();

    const tipo = document.getElementById("tipoEditConcepto").value;

    const valor = Number(document.getElementById("valorEditConcepto").value);

    const descripcion = document
      .getElementById("descripcionEditConcepto")
      .value.trim();

    const estado = document.getElementById("estadoEditConcepto").value;

    // Validar
    if (!nombre || !tipo || !Number.isFinite(valor) || valor < 0) {
      alert("Por favor, completa correctamente los campos.");

      return;
    }

    // Actualizar objeto seleccionado
    concepto.name_detail = nombre;

    concepto.type = tipo;

    concepto.value = valor;

    concepto.description = descripcion;

    concepto.status = estado;

    // Actualizar tabla
    mostrarConceptos(buscarConcepto.value);

    // Cerrar modal
    modalEditConcepto.hide();
  });

  /* =====================================================
   CARGA INICIAL
===================================================== */

  // Mostrar todos los conceptos al iniciar
  mostrarConceptos();
});

