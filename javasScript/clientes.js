
/* Consulta, búsqueda y actualización de clientes */
document.addEventListener("DOMContentLoaded", function () {

    const buscarCliente = document.getElementById("buscarCliente");
    const tablaClientes = document.getElementById("tablaClientes");
    const formulario = document.getElementById("formActualizarCliente");
    const modalElemento = document.getElementById("modalActualizarCliente");

    if (!buscarCliente || !tablaClientes || !formulario || !modalElemento) {
        return;
    }

    if (typeof CLIENTS === "undefined") {
        console.error("No se encontró el arreglo CLIENTS.");
        return;
    }

    const modalCliente = bootstrap.Modal.getOrCreateInstance(modalElemento);

    // Mostrar todos los clientes al cargar la página.
    mostrarClientes(CLIENTS);

    // Búsqueda dinámica por nombre.
    buscarCliente.addEventListener("input", function () {

        const texto = buscarCliente.value.trim().toLowerCase();

        const clientesFiltrados = CLIENTS.filter(cliente =>
            String(cliente.name_ctl || "").toLowerCase().includes(texto)
        );

        mostrarClientes(clientesFiltrados);
    });

    // Generar las filas de la tabla.
    function mostrarClientes(clientes) {

        tablaClientes.innerHTML = "";

        if (clientes.length === 0) {
            tablaClientes.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center textSecondary">
                        No se encontraron clientes.
                    </td>
                </tr>
            `;
            return;
        }

        clientes.forEach(cliente => {

            const fila = document.createElement("tr");

            const estado = cliente.status_ctl === "AC"
                ? "Activo"
                : "Inactivo";

            fila.innerHTML = `
                <td>
                    <h6 class="textSecondary fw-semibold">
                        ${escaparHTML(cliente.name_ctl)}
                    </h6>
                </td>

                <td>
                    <h6 class="textSecondary fw-semibold">
                        ${escaparHTML(cliente.phone ?? "")}
                    </h6>
                </td>

                <td>
                    <h6 class="textSecondary fw-semibold">
                        ${escaparHTML(cliente.address_ctl ?? "")}
                    </h6>
                </td>

                <td>
                    <h6 class="textSecondary fw-semibold">
                        ${estado}
                    </h6>
                </td>

                <td>
                    <h6 class="textSecondary fw-semibold">
                        <a href="#"
                           class="editarCliente"
                           data-id="${cliente.id}"
                           title="Actualizar cliente"
                           aria-label="Actualizar cliente">
                            <i class="bi bi-pencil-square"></i>
                        </a>
                    </h6>
                </td>
            `;

            tablaClientes.appendChild(fila);
        });
    }

    // Abrir el modal y cargar los datos actuales.
    tablaClientes.addEventListener("click", function (evento) {

        const botonEditar = evento.target.closest(".editarCliente");

        if (!botonEditar) return;

        evento.preventDefault();

        const id = Number(botonEditar.dataset.id);

        const cliente = CLIENTS.find(item => Number(item.id) === id);

        if (!cliente) return;

        document.getElementById("idClienteEditar").value = cliente.id;
        document.getElementById("nombreClienteEditar").value = cliente.name_ctl;
        document.getElementById("celularClienteEditar").value = cliente.phone ?? "";
        document.getElementById("direccionClienteEditar").value = cliente.address_ctl ?? "";
        document.getElementById("estadoClienteEditar").value = cliente.status_ctl;

        modalCliente.show();
    });

    // Guardar cambios del cliente.
    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();

        const id = Number(document.getElementById("idClienteEditar").value);
        const nombre = document.getElementById("nombreClienteEditar").value.trim();
        const celular = document.getElementById("celularClienteEditar").value.trim();
        const direccion = document.getElementById("direccionClienteEditar").value.trim();
        const estado = document.getElementById("estadoClienteEditar").value;

        if (!nombre || !celular || !direccion) {
            alert("Completa todos los campos del cliente.");
            return;
        }

        const cliente = CLIENTS.find(item => Number(item.id) === id);

        if (!cliente) {
            alert("No se encontró el cliente.");
            return;
        }

        // Modificar el objeto original de datos ficticios.
        cliente.name_ctl = nombre;
        cliente.phone = celular;
        cliente.address_ctl = direccion;
        cliente.status_ctl = estado;

        // Actualizar la tabla respetando el texto buscado.
        const texto = buscarCliente.value.trim().toLowerCase();

        const clientesFiltrados = CLIENTS.filter(item =>
            String(item.name_ctl || "").toLowerCase().includes(texto)
        );

        mostrarClientes(clientesFiltrados);

        modalCliente.hide();
    });

    // Evitar que los datos de texto se interpreten como HTML.
    function escaparHTML(texto) {
        return String(texto).replace(/[&<>"']/g, caracter => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[caracter]);
    }
});


/* estadisticas de clientes */


document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // 1. ELEMENTOS DEL HTML
    // =========================================

    const selectorAnio = document.getElementById("anioEstClientes");
    const encabezado = document.getElementById("encabezadoEstClientes");
    const cuerpoTabla = document.getElementById("tablaEstClientes");
    const contenedorGrafico = document.getElementById("estClientes");

    const meses = [
        "Enero", "Febrero", "Marzo", "Abril",
        "Mayo", "Junio", "Julio", "Agosto",
        "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // =========================================
    // 2. VERIFICAR DATOS Y ELEMENTOS
    // =========================================

    if (
        typeof T_ORDERS === "undefined" ||
        typeof DETAILS === "undefined" ||
        typeof CLIENTS === "undefined"
    ) {
        console.error(
            "No se encontraron los datos de pedidos, detalles o clientes."
        );
        return;
    }

    if (
        !selectorAnio ||
        !encabezado ||
        !cuerpoTabla ||
        !contenedorGrafico
    ) {
        console.error(
            "No se encontraron los elementos HTML de estadísticas."
        );
        return;
    }

    // =========================================
    // 3. OBTENER LOS AÑOS DE LOS PEDIDOS
    // =========================================

    const anios = [...new Set(
        T_ORDERS
            .map(pedido => {
                if (!pedido.date_ord) return null;

                const coincidencia = String(pedido.date_ord)
                    .match(/^(\d{4})/);

                return coincidencia
                    ? Number(coincidencia[1])
                    : null;
            })
            .filter(anio => anio !== null)
    )].sort((a, b) => b - a);

    selectorAnio.innerHTML = "";

    if (anios.length === 0) {
        selectorAnio.innerHTML =
            '<option value="">No hay años registrados</option>';

        encabezado.innerHTML = "";
        cuerpoTabla.innerHTML = "";

        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.textContent = "No hay pedidos registrados.";
        fila.appendChild(celda);
        cuerpoTabla.appendChild(fila);

        contenedorGrafico.textContent =
            "No hay datos disponibles.";

        return;
    }

    // Crear las opciones del selector automáticamente
    anios.forEach(anio => {
        const opcion = document.createElement("option");

        opcion.value = anio;
        opcion.textContent = anio;

        selectorAnio.appendChild(opcion);
    });

    let grafico = null;

    // =========================================
    // 4. CALCULAR COMPRAS POR CLIENTE Y MES
    // =========================================

    function obtenerEstadisticas(anioSeleccionado) {

        const estadisticas = {};

        // Inicializar los doce meses de cada cliente
        CLIENTS.forEach(cliente => {
            estadisticas[cliente.id] = Array(12).fill(0);
        });

        T_ORDERS.forEach(pedido => {

            if (!pedido.date_ord) return;

            const coincidencia = String(pedido.date_ord)
                .match(/^(\d{4})-(\d{1,2})/);

            if (!coincidencia) return;

            const anioPedido = Number(coincidencia[1]);
            const mesPedido = Number(coincidencia[2]) - 1;

            // Filtrar por el año seleccionado
            if (anioPedido !== Number(anioSeleccionado)) return;

            if (mesPedido < 0 || mesPedido > 11) return;

            // Buscar detalles correspondientes al pedido
            DETAILS.forEach(detalle => {

                if (
                    String(detalle.id_order) !== String(pedido.id)
                ) {
                    return;
                }

                const clienteId = pedido.id_cliente;
                const cantidad = Number(detalle.lot) || 0;

                // Acumular unidades compradas por cliente y mes
                if (
                    Object.prototype.hasOwnProperty.call(
                        estadisticas,
                        clienteId
                    )
                ) {
                    estadisticas[clienteId][mesPedido] += cantidad;
                }
            });
        });

        return estadisticas;
    }

    // =========================================
    // 5. MOSTRAR TABLA Y GRÁFICA
    // =========================================

    function mostrarEstadisticas() {

        const anio = selectorAnio.value;

        if (!anio) return;

        const estadisticas = obtenerEstadisticas(anio);

        // -----------------------------------------
        // A. FILTRAR MESES CON COMPRAS
        // -----------------------------------------

        // Un mes se incluye si al menos un cliente
        // tiene una cantidad comprada mayor que cero.
        const mesesConDatos = meses
            .map((nombre, indice) => ({
                nombre: nombre,
                indice: indice
            }))
            .filter(mes =>
                CLIENTS.some(cliente =>
                    estadisticas[cliente.id][mes.indice] > 0
                )
            );

        // -----------------------------------------
        // B. GENERAR ENCABEZADOS DE LA TABLA
        // -----------------------------------------

        encabezado.innerHTML = "";

        const filaEncabezado = document.createElement("tr");

        const thMes = document.createElement("th");
        thMes.textContent = "Mes";
        filaEncabezado.appendChild(thMes);

        CLIENTS.forEach(cliente => {

            const th = document.createElement("th");
            th.textContent = cliente.name_ctl;

            filaEncabezado.appendChild(th);
        });

        encabezado.appendChild(filaEncabezado);

        // -----------------------------------------
        // C. GENERAR FILAS DE LA TABLA
        // -----------------------------------------

        cuerpoTabla.innerHTML = "";

        if (mesesConDatos.length === 0) {

            const fila = document.createElement("tr");
            const celda = document.createElement("td");

            celda.colSpan = CLIENTS.length + 1;
            celda.textContent =
                `No hay compras registradas en ${anio}.`;

            fila.appendChild(celda);
            cuerpoTabla.appendChild(fila);

        } else {

            mesesConDatos.forEach(mes => {

                const fila = document.createElement("tr");

                // Columna del mes
                const celdaMes = document.createElement("td");
                celdaMes.textContent = mes.nombre;
                fila.appendChild(celdaMes);

                // Columna de cada cliente
                CLIENTS.forEach(cliente => {

                    const celda = document.createElement("td");

                    const cantidad =
                        estadisticas[cliente.id][mes.indice];

                    const texto = document.createElement("h6");
                    texto.className = "textSecondary fw-semibold";
                    texto.textContent = cantidad;

                    celda.appendChild(texto);
                    fila.appendChild(celda);
                });

                cuerpoTabla.appendChild(fila);
            });
        }

        // -----------------------------------------
        // D. PREPARAR DATOS DE LA GRÁFICA
        // -----------------------------------------

        const categoriasGrafico = mesesConDatos.map(
            mes => mes.nombre
        );

        const series = CLIENTS.map(cliente => ({
            name: cliente.name_ctl,

            data: mesesConDatos.map(
                mes => estadisticas[cliente.id][mes.indice]
            )
        }));

        // Eliminar el gráfico anterior al cambiar el año
        if (grafico) {
            grafico.destroy();
            grafico = null;
        }

        contenedorGrafico.innerHTML = "";

        // Si no hay compras, mostrar mensaje y no crear gráfico
        if (mesesConDatos.length === 0) {

            contenedorGrafico.textContent =
                `No hay referencias compradas registradas en ${anio}.`;

            return;
        }

        // -----------------------------------------
        // E. CONFIGURAR APEXCHARTS
        // -----------------------------------------

        const opciones = {

            series: series,

            chart: {
                type: "bar",
                height: 400,
                stacked: true,
                toolbar: {
                    show: true
                }
            },

            plotOptions: {
                bar: {
                    horizontal: true,
                    dataLabels: {
                        total: {
                            enabled: true,
                            style: {
                                fontSize: "13px",
                                fontWeight: 900
                            }
                        }
                    }
                }
            },

            dataLabels: {
                enabled: false
            },

            stroke: {
                width: 1,
                colors: ["#fff"]
            },

            title: {
                text: `Referencias compradas por cliente - ${anio}`
            },

            xaxis: {
                categories: categoriasGrafico,
                title: {
                    text: "Cantidad de referencias compradas"
                }
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
                horizontalAlign: "left"
            },

            noData: {
                text: "No hay datos disponibles"
            }
        };

        grafico = new ApexCharts(
            contenedorGrafico,
            opciones
        );

        grafico.render();
    }

    // =========================================
    // 6. EVENTOS
    // =========================================

    // Actualizar tabla y gráfica al cambiar de año
    selectorAnio.addEventListener(
        "change",
        mostrarEstadisticas
    );

    // Mostrar el año más reciente inicialmente
    mostrarEstadisticas();

});


