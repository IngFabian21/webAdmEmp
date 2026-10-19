document.addEventListener("DOMContentLoaded", function () {
  var options = {
    series: [
      {
        name: "Ref 1",
        data: [44, 55, 41, 37, 22, 43, 21],
      },
      {
        name: "Ref 2",
        data: [53, 32, 33, 52, 13, 43, 32],
      },
      {
        name: "Ref 3",
        data: [12, 17, 11, 9, 15, 11, 20],
      },
      {
        name: "Ref 4",
        data: [9, 7, 5, 8, 6, 9, 4],
      },
      {
        name: "Ref 5",
        data: [25, 12, 19, 32, 25, 24, 10],
      },
    ],
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
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
              fontWeight: 900,
            },
          },
        },
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    title: {
      text: "Ventas mensuales por referencia",
    },
    xaxis: {
      categories: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"],
      
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    
    fill: {
      opacity: 1,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      offsetX: 40,
    },
  };

  var chart = new ApexCharts(document.querySelector("#estPedidos"), options);
  chart.render();
});

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