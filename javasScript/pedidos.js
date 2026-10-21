/* filtros y tabla pedidos incluido modal de detalles pedido*/
document.addEventListener("DOMContentLoaded", function () {

    const filtroFecha = document.getElementById("filtroFecha");
    const filtroCliente = document.getElementById("filtroCliente");
    const limpiarFiltros = document.getElementById("limpiarFiltros");

    const cuerpoTablaPedidos = document.getElementById(
        "cuerpoTablaPedidos"
    );

    const detalleReferenciasPedido = document.getElementById(
        "detalleReferenciasPedido"
    );

    const informacionPedido = document.getElementById(
        "informacionPedido"
    );

    // Cargar los clientes en el select desde datosFicticios.js.
    function cargarClientes() {

        filtroCliente.innerHTML = `
            <option value="">Todos los clientes</option>
        `;

        CLIENTS.forEach(function (cliente) {

            const opcion = document.createElement("option");

            opcion.value = cliente.id;
            opcion.textContent = cliente.name_ctl;

            filtroCliente.appendChild(opcion);
        });
    }

    // Convertir la fecha YYYY-MM-DD a DD-MM-YYYY.
    function formatearFecha(fecha) {

        if (!fecha) return "";

        const partes = fecha.split("-");

        return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }

    // Contar las referencias distintas de un pedido.
    function contarReferencias(idPedido) {

        return obtenerDetallesPedido(idPedido).length;
    }

    // Dibujar la tabla principal.
    function mostrarPedidos(listaPedidos) {

        cuerpoTablaPedidos.innerHTML = "";

        if (listaPedidos.length === 0) {

            cuerpoTablaPedidos.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
                        No se encontraron pedidos.
                    </td>
                </tr>
            `;

            return;
        }

        listaPedidos.forEach(function (pedido) {

            const cantidadReferencias = contarReferencias(pedido.id);
            const total = calcularTotalPedido(pedido.id);

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>
                    <h6 class="textSecondary fw-semibold">
                        ${formatearFecha(pedido.date_ord)}
                    </h6>
                </td>

                <td>
                    <h6 class="textSecondary fw-semibold">
                        ${nombreCliente(pedido.id_cliente)}
                    </h6>
                </td>

                <td>
                    <h6 class="textSecondary fw-semibold">
                        <a href="#"
                           data-bs-toggle="modal"
                           data-bs-target="#modalMostrarPedido"
                           data-pedido-id="${pedido.id}">
                            ${cantidadReferencias} refs
                        </a>
                    </h6>
                </td>

                <td>
                    <h6 class="textSecondary fw-semibold">
                        ${formatoCOP(total)}
                    </h6>
                </td>

                <td>
                    <h6 class="textSecondary fw-semibold">
                        <a href="#"
                           class="eliminarPedido"
                           data-pedido-id="${pedido.id}"
                           title="Eliminar pedido">
                            <i class="bi bi-trash"></i>
                        </a>
                    </h6>
                </td>
            `;

            cuerpoTablaPedidos.appendChild(fila);
        });
    }

    // Mostrar el detalle de referencias en el modal.
    function mostrarDetallePedido(idPedido) {

        const pedido = obtenerPedido(Number(idPedido));

        if (!pedido) return;

        const detalles = obtenerDetallesPedido(pedido.id);

        informacionPedido.textContent =
            `Cliente: ${nombreCliente(pedido.id_cliente)} | ` +
            `Fecha: ${formatearFecha(pedido.date_ord)}`;

        detalleReferenciasPedido.innerHTML = "";

        if (detalles.length === 0) {

            detalleReferenciasPedido.innerHTML = `
                <tr>
                    <td colspan="2" class="text-center">
                        Este pedido no tiene referencias.
                    </td>
                </tr>
            `;

            return;
        }

        detalles.forEach(function (detalle) {

            const referencia = obtenerReferencia(
                detalle.id_reference
            );

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>
                    <h6 class="textSecondary fw-semibold">
                        ${referencia
                            ? referencia.name_ref
                            : "Referencia no encontrada"}
                    </h6>
                </td>

                <td>
                    <h6 class="textSecondary fw-semibold">
                        ${detalle.lot}
                    </h6>
                </td>
            `;

            detalleReferenciasPedido.appendChild(fila);
        });
    }

    // Buscar por fecha, cliente o ambos.
    function buscarPedidos() {

        const fecha = filtroFecha.value;
        const idCliente = filtroCliente.value;

        const pedidosFiltrados = T_ORDERS.filter(function (pedido) {

            const coincideFecha =
                !fecha || pedido.date_ord === fecha;

            const coincideCliente =
                !idCliente ||
                pedido.id_cliente === Number(idCliente);

            return coincideFecha && coincideCliente;
        });

        mostrarPedidos(pedidosFiltrados);
    }

    // Abrir el detalle correspondiente al hacer clic en refs.
    cuerpoTablaPedidos.addEventListener("click", function (evento) {

        const enlace = evento.target.closest("[data-pedido-id]");

        if (!enlace) return;

        // Solo abrir el modal al pulsar el enlace de referencias.
        if (
            enlace.hasAttribute("data-bs-toggle") &&
            enlace.getAttribute("data-bs-target") ===
                "#modalMostrarPedido"
        ) {
            evento.preventDefault();

            mostrarDetallePedido(
                enlace.dataset.pedidoId
            );
        }
    });

    // Eventos de los filtros.
    filtroFecha.addEventListener("change", buscarPedidos);
    filtroCliente.addEventListener("change", buscarPedidos);

    // Limpiar los filtros.
    limpiarFiltros.addEventListener("click", function () {

        filtroFecha.value = "";
        filtroCliente.value = "";

        buscarPedidos();
    });

    // Inicializar.
    cargarClientes();
    mostrarPedidos(T_ORDERS);

});

/*modal para agregar un pedido*/
(document,addEventListener("DOMContentLoaded", function () {
    const nCliente = document.getElementById("nCliente");
    const fechaPedido = document.getElementById("fecha");
    const btnConfirmarCliente = document.getElementById("btnConfirmarCliente");
    const seccionReferencias = document.getElementById("seccionReferencias");
    const contenedorReferencias = document.getElementById(
      "contenedorReferencias",
    );
    const btnAgregarReferencia = document.getElementById(
      "btnAgregarReferencia",
    );
    const btnConfirmarPedido = document.getElementById("btnConfirmarPedido");
    const totalPedido = document.getElementById("totalPedido");
    const mensajePedido = document.getElementById("mensajePedido");

    let clienteConfirmado = false;

    /* =========================================
   CARGAR CLIENTES
   Usa los datos de datosFicticios.js
   ========================================= */

    function cargarClientesNuevoPedido() {
      nCliente.innerHTML = `
        <option value="">Seleccione un cliente</option>
    `;

      CLIENTS.filter((cliente) => cliente.status_ctl === "AC").forEach(
        (cliente) => {
          const opcion = document.createElement("option");

          opcion.value = cliente.id;
          opcion.textContent = cliente.name_ctl;

          nCliente.appendChild(opcion);
        },
      );
    }

    /* =========================================
   CONFIRMAR CLIENTE Y FECHA
   ========================================= */

    btnConfirmarCliente.addEventListener("click", function () {
      const idCliente = Number(nCliente.value);
      const fecha = fechaPedido.value;

      if (!idCliente || !fecha) {
        mensajePedido.textContent =
          "Selecciona un cliente y una fecha antes de continuar.";
        mensajePedido.className = "text-danger px-3";
        return;
      }

      clienteConfirmado = true;

      seccionReferencias.hidden = false;
      btnConfirmarPedido.disabled = false;

      // Si aún no hay filas, agregar la primera.
      if (contenedorReferencias.children.length === 0) {
        agregarFilaReferencia();
      }

      mensajePedido.textContent =
        "Cliente y fecha confirmados. Ahora agrega las referencias.";
      mensajePedido.className = "text-success px-3";
    });

    /* =========================================
   AGREGAR UNA FILA DE REFERENCIA
   ========================================= */

    function agregarFilaReferencia() {
      if (!clienteConfirmado) {
        mensajePedido.textContent = "Primero confirma el cliente y la fecha.";
        mensajePedido.className = "text-danger px-3";
        return;
      }

      const fila = document.createElement("div");

      fila.className = "row g-2 align-items-end p-3 border-bottom";

      fila.innerHTML = `
        <div class="col-md-4">
            <label class="form-label textSecondary fw-semibold">
                Referencia
            </label>

            <select class="form-select selectorReferencia">
                <option value="">Seleccione una referencia</option>
            </select>
        </div>

        <div class="col-md-2">
            <label class="form-label textSecondary fw-semibold">
                Cantidad
            </label>

            <input type="number"
                   class="form-control cantidadReferencia"
                   min="1" step="1" value="1">
        </div>

        <div class="col-md-2">
            <label class="form-label textSecondary fw-semibold">
                Precio
            </label>

            <input type="text"
                   class="form-control precioReferencia"
                   value="$0" disabled>
        </div>

        <div class="col-md-2">
            <label class="form-label textSecondary fw-semibold">
                Subtotal
            </label>

            <input type="text"
                   class="form-control subtotalReferencia"
                   value="$0" disabled>
        </div>

        <div class="col-md-2">
            <button type="button"
                    class="btn btn-success textMain fw-semibold btnGeneric eliminarFila w-100"
                    aria-label="Eliminar referencia"
                    title="Eliminar referencia">
                <i class="bi bi-trash3-fill"></i>
            </button>
        </div>
    `;

      const selector = fila.querySelector(".selectorReferencia");
      const cantidad = fila.querySelector(".cantidadReferencia");

      // Cargar referencias activas desde datosFicticios.js.
      REFERENCESS.filter(
        (referencia) => referencia.status_ref === "AC",
      ).forEach((referencia) => {
        const opcion = document.createElement("option");

        opcion.value = referencia.id;
        opcion.textContent = referencia.name_ref;

        selector.appendChild(opcion);
      });

      // Actualizar precio, subtotal y total.
      selector.addEventListener("change", actualizarTotales);
      cantidad.addEventListener("input", actualizarTotales);

      // Eliminar esta fila.
      fila
        .querySelector(".eliminarFila")
        .addEventListener("click", function () {
          fila.remove();
          actualizarTotales();
        });

      contenedorReferencias.appendChild(fila);

      actualizarTotales();
    }

    /* =========================================
   CALCULAR SUBTOTALES Y TOTAL
   ========================================= */

    function actualizarTotales() {
      let total = 0;

      const filas = contenedorReferencias.querySelectorAll(".row");

      filas.forEach((fila) => {
        const idReferencia = Number(
          fila.querySelector(".selectorReferencia").value,
        );

        const cantidad = Number(
          fila.querySelector(".cantidadReferencia").value,
        );

        const referencia = REFERENCESS.find((ref) => ref.id === idReferencia);

        const precio = referencia ? Number(referencia.price) : 0;

        const subtotal =
          referencia && Number.isInteger(cantidad) && cantidad > 0
            ? precio * cantidad
            : 0;

        fila.querySelector(".precioReferencia").value = formatoCOP(precio);

        fila.querySelector(".subtotalReferencia").value = formatoCOP(subtotal);

        total += subtotal;
      });

      totalPedido.textContent = formatoCOP(total);
    }

    /* =========================================
   BOTÓN AGREGAR REFERENCIA
   ========================================= */

    btnAgregarReferencia.addEventListener("click", agregarFilaReferencia);

    /* =========================================
   CONFIRMAR Y GUARDAR PEDIDO
   ========================================= */

    btnConfirmarPedido.addEventListener("click", function () {
      const idCliente = Number(nCliente.value);
      const fecha = fechaPedido.value;

      if (!clienteConfirmado || !idCliente || !fecha) {
        mensajePedido.textContent = "Confirma primero el cliente y la fecha.";
        mensajePedido.className = "text-danger px-3";
        return;
      }

      const filas = [...contenedorReferencias.querySelectorAll(".row")];

      if (filas.length === 0) {
        mensajePedido.textContent = "Agrega al menos una referencia al pedido.";
        mensajePedido.className = "text-danger px-3";
        return;
      }

      const detallesNuevos = [];

      for (const fila of filas) {
        const idReferencia = Number(
          fila.querySelector(".selectorReferencia").value,
        );

        const cantidad = Number(
          fila.querySelector(".cantidadReferencia").value,
        );

        if (!idReferencia || !Number.isInteger(cantidad) || cantidad <= 0) {
          mensajePedido.textContent =
            "Selecciona una referencia y una cantidad válida en cada fila.";
          mensajePedido.className = "text-danger px-3";
          return;
        }

        // El modelo usa id_reference + id_order como clave compuesta.
        // Por eso no permitimos repetir una referencia en el mismo pedido.
        if (detallesNuevos.some((d) => d.id_reference === idReferencia)) {
          mensajePedido.textContent =
            "No repitas una referencia. Si necesitas más unidades, aumenta su cantidad.";
          mensajePedido.className = "text-danger px-3";
          return;
        }

        detallesNuevos.push({
          id_reference: idReferencia,
          lot: cantidad,
        });
      }

      // Generar el nuevo ID a partir del pedido más alto.
      const nuevoId = T_ORDERS.length
        ? Math.max(...T_ORDERS.map((p) => Number(p.id))) + 1
        : 1001;

      // Guardar el pedido.
      T_ORDERS.push({
        id: nuevoId,
        id_cliente: idCliente,
        id_user: 1,
        date_ord: fecha,
      });

      // Guardar sus referencias y cantidades.
      detallesNuevos.forEach((detalle) => {
        DETAILS.push({
          id_reference: detalle.id_reference,
          id_order: nuevoId,
          lot: detalle.lot,
        });
      });

      // Actualizar la tabla existente.
      // mostrarPedidos() es la función que ya tienes en pedidos.js.
      buscarPedidos();

      // Cerrar el modal.
      const modalElemento = document.getElementById("modalAddPedido");
      const modal = bootstrap.Modal.getInstance(modalElemento);

      if (modal) {
        modal.hide();
      }

      // Limpiar el formulario para el siguiente pedido.
      nCliente.value = "";
      fechaPedido.value = "";
      contenedorReferencias.innerHTML = "";
      seccionReferencias.hidden = true;
      totalPedido.textContent = formatoCOP(0);
      clienteConfirmado = false;
      btnConfirmarPedido.disabled = true;

      mensajePedido.textContent = "";
    });

    /* =========================================
   INICIALIZAR MODAL
   ========================================= */

    cargarClientesNuevoPedido();
  }));

/*ESTADÍSTICAS DE PEDIDOS: TABLA Y GRÁFICO*/

document.addEventListener("DOMContentLoaded", function () {

    /* =============================================
       1. ELEMENTOS DEL HTML
    ============================================= */

    const selectorAnio = document.getElementById("filtroAnioPedidos");
    const encabezadoTabla = document.getElementById(
        "encabezadoReferenciasPedidos"
    );
    const cuerpoTabla = document.getElementById(
        "tablaReferenciasPedidos"
    );
    const elementoGrafico = document.querySelector("#estPedidos");

    // Comprobar que existan los elementos necesarios.
    if (
        !selectorAnio ||
        !encabezadoTabla ||
        !cuerpoTabla
    ) {
        return;
    }

    // Comprobar que los datos estén disponibles.
    if (
        typeof T_ORDERS === "undefined" ||
        typeof DETAILS === "undefined" ||
        typeof REFERENCESS === "undefined"
    ) {
        console.error("No se encontraron los datos de pedidos.");
        return;
    }

    /* =============================================
       2. MESES DEL AÑO
    ============================================= */

    const meses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
    ];

    /* =============================================
       3. CONFIGURACIÓN DEL GRÁFICO
    ============================================= */

    let chart = null;

    if (elementoGrafico && typeof ApexCharts !== "undefined") {

        const opcionesGrafico = {
            series: [],

            chart: {
                type: "bar",
                height: 350,
                stacked: true
            },

            plotOptions: {
                bar: {
                    horizontal: true,
                    dataLabels: {
                        total: {
                            enabled: true,
                            offsetX: 0,
                            style: {
                                fontSize: "13px",
                                fontWeight: 900
                            }
                        }
                    }
                }
            },

            stroke: {
                width: 1,
                colors: ["#fff"]
            },

            title: {
                text: "Ventas mensuales por referencia"
            },

            xaxis: {
                categories: []
            },

            yaxis: {
                title: {
                    text: undefined
                }
            },

            fill: {
                opacity: 1
            },

            legend: {
                position: "top",
                horizontalAlign: "left",
                offsetX: 40
            },

            noData: {
                text: "No hay ventas para mostrar"
            }
        };

        chart = new ApexCharts(elementoGrafico, opcionesGrafico);
        chart.render();
    }

    /* =============================================
       4. CARGAR LOS AÑOS DISPONIBLES
    ============================================= */

    const anios = [
        ...new Set(
            T_ORDERS.map(pedido =>
                String(pedido.date_ord).substring(0, 4)
            )
        )
    ].sort((a, b) => Number(b) - Number(a));

    selectorAnio.innerHTML = anios.map(anio => `
        <option value="${anio}">${anio}</option>
    `).join("");

    /* =============================================
       5. FUNCIÓN PRINCIPAL DE ESTADÍSTICAS
    ============================================= */

    function cargarEstadisticasPedidos() {

        const anioSeleccionado = selectorAnio.value;

        // Filtrar todos los pedidos del año seleccionado.
        const pedidosAnio = T_ORDERS.filter(pedido =>
            String(pedido.date_ord).substring(0, 4) === anioSeleccionado
        );

        // Identificar las referencias que tuvieron ventas.
        const idsReferenciasVendidas = new Set();

        pedidosAnio.forEach(pedido => {

            const detallesPedido = DETAILS.filter(detalle =>
                String(detalle.id_order) === String(pedido.id)
            );

            detallesPedido.forEach(detalle => {
                idsReferenciasVendidas.add(
                    String(detalle.id_reference)
                );
            });
        });

        const referenciasVendidas = REFERENCESS.filter(referencia =>
            idsReferenciasVendidas.has(String(referencia.id))
        );

        /* =============================================
           6. CREAR ENCABEZADOS DE LA TABLA
        ============================================= */

        encabezadoTabla.innerHTML = `
            <tr>
                <th>
                    <h6 class="textSecondary fw-semibold">Mes</h6>
                </th>

                ${referenciasVendidas.map(referencia => `
                    <th>
                        <h6 class="textSecondary fw-semibold">
                            ${referencia.name_ref}
                        </h6>
                    </th>
                `).join("")}
            </tr>
        `;

        /* =============================================
           7. PREPARAR LAS VENTAS DE LOS 12 MESES
        ============================================= */

        const ventasPorMes = Array.from(
            { length: 12 },
            () => ({})
        );

        // Sumar las unidades de cada referencia por mes.
        pedidosAnio.forEach(pedido => {

            const mes = Number(
                String(pedido.date_ord).substring(5, 7)
            ) - 1;

            // Evitar fechas con meses inválidos.
            if (mes < 0 || mes > 11) return;

            const detallesPedido = DETAILS.filter(detalle =>
                String(detalle.id_order) === String(pedido.id)
            );

            detallesPedido.forEach(detalle => {

                const idReferencia = String(detalle.id_reference);
                const cantidad = Number(detalle.lot) || 0;

                ventasPorMes[mes][idReferencia] =
                    (ventasPorMes[mes][idReferencia] || 0) + cantidad;
            });
        });

        /* =============================================
           8. IDENTIFICAR TODOS LOS MESES CON VENTAS
        ============================================= */

        const mesesConVentas = ventasPorMes
            .map((ventas, indice) => ({
                nombre: meses[indice],
                ventas: ventas
            }))
            .filter(mes =>
                referenciasVendidas.some(referencia =>
                    (mes.ventas[String(referencia.id)] || 0) > 0
                )
            );

        /* =============================================
           9. ACTUALIZAR LA TABLA
        ============================================= */

        cuerpoTabla.innerHTML = mesesConVentas.map(mes => `
            <tr>
                <td>
                    <h6 class="textSecondary fw-semibold">
                        ${mes.nombre}
                    </h6>
                </td>

                ${referenciasVendidas.map(referencia => `
                    <td>
                        <h6 class="textSecondary fw-semibold">
                            ${mes.ventas[String(referencia.id)] || 0}
                        </h6>
                    </td>
                `).join("")}
            </tr>
        `).join("");

        // Mensaje cuando no existen ventas.
        if (mesesConVentas.length === 0) {
            cuerpoTabla.innerHTML = `
                <tr>
                    <td colspan="${referenciasVendidas.length + 1}">
                        No hay ventas registradas para este año.
                    </td>
                </tr>
            `;
        }

        /* =============================================
           10. PREPARAR LAS SERIES DEL GRÁFICO
        ============================================= */

        const seriesGrafico = referenciasVendidas.map(referencia => ({
            name: referencia.name_ref,

            data: mesesConVentas.map(mes =>
                mes.ventas[String(referencia.id)] || 0
            )
        }));

        /* =============================================
           11. ACTUALIZAR EL GRÁFICO
        ============================================= */

        if (chart) {

            chart.updateOptions({
                xaxis: {
                    categories: mesesConVentas.map(mes => mes.nombre)
                }
            });

            chart.updateSeries(seriesGrafico);
        }
    }

    /* =============================================
       12. EVENTOS
    ============================================= */

    // Actualizar tabla y gráfico al cambiar el año.
    selectorAnio.addEventListener(
        "change",
        cargarEstadisticasPedidos
    );

    // Cargar las estadísticas inicialmente.
    cargarEstadisticasPedidos();

});

/*Generacion de pedidos diario PDF*/
document.addEventListener("DOMContentLoaded", function () {

    const selectorFecha = document.getElementById("fechaGenerarPedido");
    const btnGenerarPDF = document.getElementById("btnGenerarPDF");
    const mensaje = document.getElementById("mensajeReporte");

    if (!selectorFecha || !btnGenerarPDF) return;

    btnGenerarPDF.addEventListener("click", generarPDF);

    function generarPDF() {
        
        const fecha = selectorFecha.value;

        if (!fecha) {
            mostrarMensaje("Selecciona una fecha para generar el reporte.");
            return;
        }

        if (
            typeof CLIENTS === "undefined" ||
            typeof T_ORDERS === "undefined" ||
            typeof DETAILS === "undefined" ||
            typeof REFERENCESS === "undefined"
        ) {
            mostrarMensaje("No se pudieron cargar los datos del reporte.");
            return;
        }

        if (!window.jspdf || !window.jspdf.jsPDF) {
            mostrarMensaje("No se pudo cargar la librería para generar el PDF.");
            return;
        }

        // Buscar los pedidos de la fecha seleccionada.
        const pedidosFecha = T_ORDERS.filter(pedido =>
            String(pedido.date_ord).substring(0, 10) === fecha
        );

        // Preparar el total de cada referencia por cliente.
        const referencias = [...REFERENCESS];
        const cantidades = {};

        CLIENTS.forEach(cliente => {
            cantidades[cliente.id] = {};

            referencias.forEach(referencia => {
                cantidades[cliente.id][referencia.id] = 0;
            });
        });

        pedidosFecha.forEach(pedido => {
            const detalles = DETAILS.filter(detalle =>
                Number(detalle.id_order) === Number(pedido.id)
            );

            detalles.forEach(detalle => {
                const idCliente = Number(pedido.id_cliente);
                const idReferencia = Number(detalle.id_reference);
                const cantidad = Number(detalle.lot) || 0;

                if (
                    cantidades[idCliente] &&
                    Object.prototype.hasOwnProperty.call(
                        cantidades[idCliente],
                        idReferencia
                    )
                ) {
                    cantidades[idCliente][idReferencia] += cantidad;
                }
            });
        });

        // Crear las columnas y filas del PDF.
        const encabezados = [
            "CLIENTE",
            ...referencias.map(referencia => referencia.name_ref),
            "TOTAL"
        ];

        const filas = CLIENTS.map(cliente => {
            const totalCliente = referencias.reduce(
                (total, referencia) =>
                    total + cantidades[cliente.id][referencia.id],
                0
            );

            return [
                cliente.name_ctl,
                ...referencias.map(referencia =>
                    cantidades[cliente.id][referencia.id] || ""
                ),
                totalCliente || ""
            ];
        });

        // Calcular totales por referencia.
        const totales = referencias.map(referencia =>
            CLIENTS.reduce(
                (total, cliente) =>
                    total + cantidades[cliente.id][referencia.id],
                0
            )
        );

        const totalGeneral = totales.reduce(
            (total, cantidad) => total + cantidad,
            0
        );

        filas.push(["TOTAL", ...totales, totalGeneral]);

        // Crear el documento PDF en orientación horizontal.
        const { jsPDF } = window.jspdf;

        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4"
        });

        const [anio, mes, dia] = fecha.split("-");
        const fechaTexto = `${dia}/${mes}/${anio}`;

        // Encabezado del documento.
        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.text("REPORTE DIARIO DE PEDIDOS", 148.5, 13, {
            align: "center"
        });

        doc.setFontSize(10);
        doc.text(`Fecha: ${fechaTexto}`, 148.5, 20, {
            align: "center"
        });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(`Pedidos registrados: ${pedidosFecha.length}`, 7, 25);

        

        // Dibujar la tabla directamente en el PDF.
        doc.autoTable({
            head: [encabezados],
            body: filas,
            startY: 29,
            theme: "grid",

            styles: {
                font: "helvetica",
                fontSize: 8,
                cellPadding: 2,
                lineColor: [0, 0, 0],
                lineWidth: 0.25,
                textColor: [0, 0, 0],
                halign: "center",
                valign: "middle"
            },

            headStyles: {
                fillColor: [0, 174, 220],
                textColor: [0, 0, 0],
                fontStyle: "bold"
            },

            columnStyles: {
                0: {
                    halign: "left",
                    cellWidth: 48
                }
            },

            alternateRowStyles: {
                fillColor: [220, 234, 245]
            },

            didParseCell: function (data) {
                if (
                    data.section === "body" &&
                    data.row.index === filas.length - 1
                ) {
                    data.cell.styles.fillColor = [245, 231, 178];
                    data.cell.styles.fontStyle = "bold";
                }
            },

            margin: {
                top: 29,
                right: 7,
                bottom: 10,
                left: 7
            }
        });

        // Descargar el archivo sin mostrar una tabla en la página.
        doc.save(`reporte_pedidos_${fecha}.pdf`);
        const nombreArchivo = `reporte_pedidos_${fecha}.pdf`;
        const rutaPDF = `./reportesPedidosDiarios/${nombreArchivo}`;

        doc.save(nombreArchivo);

        const visorPDF = document.getElementById("visorPDF");

        if (visorPDF) {
          visorPDF.src = rutaPDF;
        }

        mostrarMensaje("El PDF se ha generado y descargado.");
    }

    function mostrarMensaje(texto) {
        if (mensaje) {
            mensaje.textContent = texto;
        }
    }
});

