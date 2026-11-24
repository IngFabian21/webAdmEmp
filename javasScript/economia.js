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



/*estadistica*/
document.addEventListener("DOMContentLoaded", function () {
  var options = {
    series: [
      {
        name: "Gastos",
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
      {
        name: "Ingresos",
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
    ],
    chart: {
      type: "bar",
      height: 350,
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
      categories: [
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
      ],
    },
    yaxis: {
      title: {
        text: "$ (miles)",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val + " mil";
        },
      },
    },
  };

  var chart = new ApexCharts(document.querySelector("#estEco"), options);
  chart.render();
});
