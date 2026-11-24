document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
   ELEMENTOS HTML
===================================================== */

  const tablaDeudasAbonos = document.getElementById("tablaDeudasAbonos");
  const filtroEstadoCobro = document.getElementById("filtroEstadoCobro");

  const formRegistrarAbono = document.getElementById("formRegistrarAbono");
  const modalAbonarCliente = document.getElementById("modalAbonarCliente");

  /* =====================================================
   FORMATO DE MONEDA
===================================================== */

  function formatoCOP(valor) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(valor);
  }

  /* =====================================================
   OBTENER NOMBRE DEL CLIENTE
===================================================== */

  function obtenerNombreCliente(idCliente) {
    const cliente = CLIENTS.find((c) => Number(c.id) === Number(idCliente));

    return cliente ? cliente.name_ctl : "Cliente no encontrado";
  }

  /* =====================================================
   CALCULAR RESUMEN DE DEUDAS POR CLIENTE
===================================================== */

  function obtenerResumenCobros() {
    const resumen = {};

    COLLECTIONS.forEach((registro) => {
      const idCliente = Number(registro.id_cliente);

      if (!resumen[idCliente]) {
        resumen[idCliente] = {
          id_cliente: idCliente,
          venta: 0,
          abonado: 0,
          saldo: 0,
          estado: "",
        };
      }

      resumen[idCliente].venta += Number(registro.sale_value) || 0;

      resumen[idCliente].abonado += Number(registro.collection_value) || 0;
    });

    // Calcular saldo y estado
    Object.values(resumen).forEach((cliente) => {
      cliente.saldo = cliente.venta - cliente.abonado;

      if (cliente.saldo <= 0) {
        cliente.saldo = 0;
        cliente.estado = "PA";
      } else if (cliente.abonado > 0) {
        cliente.estado = "AB";
      } else {
        cliente.estado = "PE";
      }
    });

    return Object.values(resumen);
  }

  /* =====================================================
   MOSTRAR TABLA DE DEUDAS Y ABONOS
===================================================== */

  function mostrarDeudasAbonos() {
    const filtro = filtroEstadoCobro.value;

    let clientes = obtenerResumenCobros();

    // Aplicar filtro
    if (filtro !== "TODOS") {
      clientes = clientes.filter((cliente) => cliente.estado === filtro);
    }

    tablaDeudasAbonos.innerHTML = "";

    if (clientes.length === 0) {
      tablaDeudasAbonos.innerHTML = `
            <tr>
                <td colspan="6" class="text-center textSecondary fw-semibold">
                    No se encontraron registros.
                </td>
            </tr>
        `;

      return;
    }

    clientes.forEach((cliente) => {
      const nombre = obtenerNombreCliente(cliente.id_cliente);

      let estadoTexto = "";
      let claseEstado = "";

      switch (cliente.estado) {
        case "PA":
          estadoTexto = "Pagado";
          claseEstado = "text-success";

          break;

        case "AB":
          estadoTexto = "Abono parcial";
          claseEstado = "text-warning";

          break;

        case "PE":
          estadoTexto = "Debe";
          claseEstado = "text-danger";

          break;
      }

      // Botón para agregar abono
      const botonAbono =
        cliente.saldo > 0
          ? `
                <a href="javascript:void(0)"
                    class="btnAbrirAbono"
                    data-id="${cliente.id_cliente}"
                    title="Agregar abono">

                    <i class="bi bi-receipt"></i>

                </a>
            `
          : `<span class="textSecondary">---</span>`;

      tablaDeudasAbonos.innerHTML += `

            <tr>

                <td>
                    <h6 class="textSecondary fw-semibold">
                        ${nombre}
                    </h6>
                </td>

                <td>
                    <h6 class="textSecondary fw-semibold">
                        ${formatoCOP(cliente.venta)}
                    </h6>
                </td>

                <td>
                    <h6 class="textSecondary fw-semibold">
                        ${formatoCOP(cliente.abonado)}
                    </h6>
                </td>

                <td>
                    <h6 class="${cliente.saldo > 0 ? "text-danger" : "textSecondary"} fw-semibold">
                        ${formatoCOP(cliente.saldo)}
                    </h6>
                </td>

                <td>
                    <h6 class="${claseEstado} fw-semibold">
                        ${estadoTexto}
                    </h6>
                </td>

                <td>
                    ${botonAbono}
                </td>

            </tr>

        `;
    });
  }

  /* =====================================================
   FILTRAR POR ESTADO
===================================================== */

  filtroEstadoCobro.addEventListener("change", mostrarDeudasAbonos);

  /* =====================================================
   ABRIR MODAL Y CARGAR INFORMACIÓN DEL CLIENTE
===================================================== */

  tablaDeudasAbonos.addEventListener("click", function (e) {
    const boton = e.target.closest(".btnAbrirAbono");

    if (!boton) return;

    const idCliente = Number(boton.dataset.id);

    const cliente = obtenerResumenCobros().find(
      (c) => c.id_cliente === idCliente,
    );

    if (!cliente || cliente.saldo <= 0) return;

    // Cargar información del cliente
    document.getElementById("idClienteAbono").value = idCliente;

    document.getElementById("nombreClienteAbono").textContent =
      obtenerNombreCliente(idCliente);

    document.getElementById("ventaClienteAbono").textContent = formatoCOP(
      cliente.venta,
    );

    document.getElementById("abonadoClienteAbono").textContent = formatoCOP(
      cliente.abonado,
    );

    document.getElementById("saldoClienteAbono").textContent = formatoCOP(
      cliente.saldo,
    );

    // Establecer fecha actual
    const hoy = new Date();

    const fechaActual = new Date(
      hoy.getTime() - hoy.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .split("T")[0];

    document.getElementById("fechaAbono").value = fechaActual;

    // Limpiar valor anterior
    document.getElementById("valorNuevoAbono").value = "";

    // El abono no puede superar la deuda
    document.getElementById("valorNuevoAbono").max = cliente.saldo;

    // Mostrar modal
    const modal = bootstrap.Modal.getOrCreateInstance(modalAbonarCliente);

    modal.show();
  });

  /* =====================================================
   REGISTRAR NUEVO ABONO
===================================================== */

  formRegistrarAbono.addEventListener("submit", function (e) {
    e.preventDefault();

    const idCliente = Number(document.getElementById("idClienteAbono").value);

    const fecha = document.getElementById("fechaAbono").value;

    const valorAbono = Number(document.getElementById("valorNuevoAbono").value);

    // Consultar deuda actualizada
    const cliente = obtenerResumenCobros().find(
      (c) => c.id_cliente === idCliente,
    );

    // Validaciones
    if (!cliente) {
      alert("No se encontró el cliente.");

      return;
    }

    if (!fecha || !Number.isFinite(valorAbono) || valorAbono <= 0) {
      alert("Verifica la fecha y el valor del abono.");

      return;
    }

    if (valorAbono > cliente.saldo) {
      alert("El abono no puede superar el saldo pendiente.");

      return;
    }

    /* ================================================
       GUARDAR HISTORIAL DEL ABONO
    ================================================ */

    const nuevoIdPago =
      COLLECTION_PAYMENTS.length > 0
        ? Math.max(...COLLECTION_PAYMENTS.map((p) => p.id_payment)) + 1
        : 1;

    const nuevoAbono = {
      id_payment: nuevoIdPago,

      id_cliente: idCliente,

      date_payment: fecha,

      amount_payment: valorAbono,
    };

    COLLECTION_PAYMENTS.push(nuevoAbono);

    /* ================================================
       DISTRIBUIR ABONO ENTRE VENTAS PENDIENTES
    ================================================ */

    const ventasPendientes = COLLECTIONS.filter(
      (registro) =>
        Number(registro.id_cliente) === idCliente &&
        Number(registro.collection_value) < Number(registro.sale_value),
    )

      .sort((a, b) => a.date_cllt.localeCompare(b.date_cllt));

    let restante = valorAbono;

    ventasPendientes.forEach((venta) => {
      if (restante <= 0) return;

      const saldoVenta =
        Number(venta.sale_value) - Number(venta.collection_value);

      const nuevoValorAbono = Math.min(restante, saldoVenta);

      venta.collection_value = Number(venta.collection_value) + nuevoValorAbono;

      restante -= nuevoValorAbono;

      // Actualizar estado individual de la venta
      if (venta.collection_value >= venta.sale_value) {
        venta.status_cllt = "PA";
      } else {
        venta.status_cllt = "AB";
      }
    });

    /* ================================================
       ACTUALIZAR TABLA Y CERRAR MODAL
    ================================================ */

    mostrarDeudasAbonos();

    formRegistrarAbono.reset();

    bootstrap.Modal.getInstance(modalAbonarCliente).hide();

    alert("Abono registrado correctamente.");
  });

  /* =====================================================
   INICIALIZAR MÓDULO
===================================================== */

  mostrarDeudasAbonos();

  /* =====================================================
   FUNCIÓN GLOBAL PARA ACTUALIZAR TABLA
===================================================== */

  window.actualizarTablaDeudasAbonos = mostrarDeudasAbonos;
});


/* Facturacion*/

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTOS HTML
    ===================================================== */

    const filtroFechaFactura = document.getElementById("filtroFechaFactura");
    const filtroClienteFactura = document.getElementById("filtroClienteFactura");
    const btnBuscarFacturas = document.getElementById("btnBuscarFacturas");

    const tablaFacturas = document.getElementById("tablaFacturas");

    const modalFactura = document.getElementById("modalFactura");

    const btnDescargarFactura = document.getElementById("btnDescargarFactura");


    // Pedido seleccionado para consultar y descargar su factura
    let pedidoSeleccionado = null;


    /* =====================================================
       FUNCIONES GENERALES
    ===================================================== */

    function formatoCOP(valor) {

        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }).format(valor);

    }


    function formatoFecha(fecha) {

        if (!fecha) return "";

        const [anio, mes, dia] = fecha.split("-");

        return `${dia}-${mes}-${anio}`;

    }


    /* =====================================================
       OBTENER INFORMACIÓN
    ===================================================== */

    function obtenerCliente(idCliente) {

        return CLIENTS.find(cliente =>
            Number(cliente.id) === Number(idCliente)
        );

    }


    function obtenerNombreCliente(idCliente) {

        const cliente = obtenerCliente(idCliente);

        return cliente ? cliente.name_ctl : "Cliente no encontrado";

    }


    function obtenerDetallesPedido(idPedido) {

        return DETAILS.filter(detalle =>
            Number(detalle.id_order) === Number(idPedido)
        );

    }


    function obtenerReferencia(idReferencia) {

        return REFERENCESS.find(referencia =>
            Number(referencia.id) === Number(idReferencia)
        );

    }


    /* =====================================================
       CALCULAR TOTAL DEL PEDIDO
    ===================================================== */

    function calcularTotalFactura(idPedido) {

        const detalles = obtenerDetallesPedido(idPedido);

        return detalles.reduce((total, detalle) => {

            const referencia = obtenerReferencia(detalle.id_reference);

            if (!referencia) return total;

            const cantidad = Number(detalle.lot) || 0;
            const precio = Number(referencia.price) || 0;

            return total + (cantidad * precio);

        }, 0);

    }


    /* =====================================================
       CARGAR CLIENTES EN EL SELECT
    ===================================================== */

    function cargarClientesFactura() {

        filtroClienteFactura.innerHTML = `
            <option value="">Todos los clientes</option>
        `;

        CLIENTS.forEach(cliente => {

            filtroClienteFactura.innerHTML += `
                <option value="${cliente.id}">
                    ${cliente.name_ctl}
                </option>
            `;

        });

    }


    /* =====================================================
       MOSTRAR FACTURAS
    ===================================================== */

    function mostrarFacturas(listaPedidos = T_ORDERS) {

        tablaFacturas.innerHTML = "";

        if (listaPedidos.length === 0) {

            tablaFacturas.innerHTML = `
                <tr>
                    <td colspan="4"
                        class="text-center textSecondary fw-semibold">
                        No se encontraron facturas.
                    </td>
                </tr>
            `;

            return;

        }


        listaPedidos.forEach(pedido => {

            const nombreCliente = obtenerNombreCliente(pedido.id_cliente);

            const total = calcularTotalFactura(pedido.id);

            tablaFacturas.innerHTML += `

                <tr>

                    <td>
                        <h6 class="textSecondary fw-semibold">
                            ${formatoFecha(pedido.date_ord)}
                        </h6>
                    </td>

                    <td>
                        <h6 class="textSecondary fw-semibold">
                            ${nombreCliente}
                        </h6>
                    </td>

                    <td>
                        <h6 class="textSecondary fw-semibold">
                            ${formatoCOP(total)}
                        </h6>
                    </td>

                    <td>

                        <a href="javascript:void(0)"
                            class="btnVerFactura"
                            data-id="${pedido.id}"
                            title="Ver factura">

                            <i class="bi bi-eye"></i>

                        </a>

                    </td>

                </tr>

            `;

        });

    }


    /* =====================================================
       FILTRAR FACTURAS
    ===================================================== */

    function filtrarFacturas() {

        const fecha = filtroFechaFactura.value;

        const idCliente = filtroClienteFactura.value;

        let pedidosFiltrados = [...T_ORDERS];


        // Filtro independiente por fecha
        if (fecha !== "") {

            pedidosFiltrados = pedidosFiltrados.filter(pedido =>
                pedido.date_ord === fecha
            );

        }


        // Filtro independiente por cliente
        if (idCliente !== "") {

            pedidosFiltrados = pedidosFiltrados.filter(pedido =>
                Number(pedido.id_cliente) === Number(idCliente)
            );

        }


        // Ordenar por fecha descendente
        pedidosFiltrados.sort((a, b) =>
            b.date_ord.localeCompare(a.date_ord)
        );


        mostrarFacturas(pedidosFiltrados);

    }


    btnBuscarFacturas.addEventListener("click", filtrarFacturas);


    /* =====================================================
       ABRIR MODAL DE FACTURA
    ===================================================== */

    tablaFacturas.addEventListener("click", function (e) {

        const boton = e.target.closest(".btnVerFactura");

        if (!boton) return;

        const idPedido = Number(boton.dataset.id);

        pedidoSeleccionado = T_ORDERS.find(pedido =>
            Number(pedido.id) === idPedido
        );

        if (!pedidoSeleccionado) return;


        const cliente = obtenerCliente(pedidoSeleccionado.id_cliente);

        const detalles = obtenerDetallesPedido(pedidoSeleccionado.id);


        // Encabezado
        document.getElementById("numeroFactura").textContent =
            pedidoSeleccionado.id;

        document.getElementById("fechaFactura").textContent =
            formatoFecha(pedidoSeleccionado.date_ord);


        // Cliente
        document.getElementById("nombreClienteFactura").textContent =
            cliente ? cliente.name_ctl : "Cliente no encontrado";

        document.getElementById("direccionClienteFactura").textContent =
            cliente ? cliente.address_ctl : "";


        // Título del modal
        document.getElementById("tituloModalFactura").textContent =
            `Factura #${pedidoSeleccionado.id}`;


        // Detalles de la factura
        const tablaDetalle = document.getElementById("detalleFactura");

        tablaDetalle.innerHTML = "";

        detalles.forEach(detalle => {

            const referencia = obtenerReferencia(detalle.id_reference);

            if (!referencia) return;

            const cantidad = Number(detalle.lot) || 0;

            const precio = Number(referencia.price) || 0;

            const subtotal = cantidad * precio;


            tablaDetalle.innerHTML += `

                <tr>

                    <td class="textSecondary fw-semibold">
                        ${referencia.name_ref}
                    </td>

                    <td class="textSecondary fw-semibold">
                        ${cantidad}
                    </td>

                    <td class="textSecondary fw-semibold">
                        ${formatoCOP(subtotal)}
                    </td>

                </tr>

            `;

        });


        // Total
        document.getElementById("totalFactura").textContent =
            formatoCOP(calcularTotalFactura(pedidoSeleccionado.id));


        // Mostrar modal
        const modal = bootstrap.Modal.getOrCreateInstance(modalFactura);

        modal.show();

    });


    /* =====================================================
       DESCARGAR FACTURA PDF
    ===================================================== */

    btnDescargarFactura.addEventListener("click", function () {

        if (!pedidoSeleccionado) return;


        // Comprobar que jsPDF esté disponible
        if (!window.jspdf || !window.jspdf.jsPDF) {

            alert("No se pudo cargar jsPDF. Verifica la ruta de la librería.");

            return;

        }


        const { jsPDF } = window.jspdf;

        const doc = new jsPDF();


        const cliente = obtenerCliente(pedidoSeleccionado.id_cliente);

        const detalles = obtenerDetallesPedido(pedidoSeleccionado.id);


        const total = calcularTotalFactura(pedidoSeleccionado.id);


        // Encabezado
        doc.setFontSize(18);

        doc.text("La fabrica de la empanada", 14, 20);

        doc.setFontSize(11);

        doc.text("NIT#", 14, 28);


        doc.setFontSize(15);

        doc.text(`Factura #${pedidoSeleccionado.id}`, 196, 20, {
            align: "right"
        });

        doc.setFontSize(11);

        doc.text(
            `Fecha: ${formatoFecha(pedidoSeleccionado.date_ord)}`,
            196,
            28,
            { align: "right" }
        );


        // Cliente
        doc.setFontSize(13);

        doc.text("Cliente", 14, 45);

        doc.setFontSize(11);

        doc.text(
            cliente ? cliente.name_ctl : "Cliente no encontrado",
            14,
            53
        );

        doc.text(
            cliente ? cliente.address_ctl || "" : "",
            14,
            60
        );


        // Filas de productos
        const filas = detalles.map(detalle => {

            const referencia = obtenerReferencia(detalle.id_reference);

            const cantidad = Number(detalle.lot) || 0;

            const precio = Number(referencia?.price) || 0;

            return [
                referencia ? referencia.name_ref : "Referencia no encontrada",
                cantidad,
                formatoCOP(cantidad * precio)
            ];

        });


        // Tabla PDF
        if (typeof doc.autoTable !== "function") {

            alert("No se pudo cargar el complemento AutoTable.");

            return;

        }

        doc.autoTable({

            startY: 70,

            head: [
                ["Referencia", "Cantidad", "Valor"]
            ],

            body: filas,

            theme: "grid",

            styles: {
                fontSize: 10,
                cellPadding: 4
            },

            headStyles: {
                fontStyle: "bold"
            }

        });


        // Total
        const posicionTotal = doc.lastAutoTable.finalY + 12;

        doc.setFontSize(12);

        doc.setFont(undefined, "bold");

        doc.text(
            `Valor total: ${formatoCOP(total)}`,
            196,
            posicionTotal,
            { align: "right" }
        );


        // Descargar
        doc.save(`Factura_${pedidoSeleccionado.id}.pdf`);

    });


    /* =====================================================
       INICIALIZAR MÓDULO
    ===================================================== */

    cargarClientesFactura();

    mostrarFacturas();


    // Actualizar desde otros archivos si es necesario
    window.actualizarTablaFacturas = filtrarFacturas;

});