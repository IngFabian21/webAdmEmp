/*tabla de inventario inicial*/


document.addEventListener("DOMContentLoaded", () => {

    const tablaInventario = document.getElementById("tablaInventario");

    let inventario = [];
    let columnaOrden = "";
    let ordenAscendente = true;

    function obtenerNivel(existencia, minimo) {
        if (existencia <= minimo) return "Bajo";
        if (existencia <= minimo * 2) return "Medio";
        return "Alto";
    }

    function mostrarInventario() {

        tablaInventario.innerHTML = "";

        inventario.forEach(item => {

            const fila = document.createElement("tr");

            let colorNivel = "";

            if (item.nivel === "Bajo") {
                colorNivel = "text-danger";
            } else if (item.nivel === "Medio") {
                colorNivel = "text-warning";
            } else {
                colorNivel = "text-success";
            }

            fila.innerHTML = `
                <td>
                    <h6 class="textSecondary fw-semibold">
                        ${item.producto}
                    </h6>
                </td>

                <td>
                    <h6 class="textSecondary fw-semibold">
                        ${item.unidad}
                    </h6>
                </td>

                <td>
                    <h6 class="textSecondary fw-semibold">
                        ${item.entrada}
                    </h6>
                </td>

                <td>
                    <h6 class="textSecondary fw-semibold">
                        ${item.existencia}
                    </h6>
                </td>

                <td>
                    <h6 class="${colorNivel} fw-semibold">
                        ${item.nivel}
                    </h6>
                </td>
            `;

            tablaInventario.appendChild(fila);
        });
    }

    // Preparar los datos del inventario
    function cargarInventario() {
        inventario = [];
        window.actualizarTablaInventario = cargarInventario;
        PRODUCTS.forEach(producto => {

            const movimientos = INVENTORYS
                .filter(inv => inv.id_prod === producto.id_prod)
                .sort((a, b) =>
                    new Date(b.date_inv) - new Date(a.date_inv)
                );

            if (movimientos.length === 0) return;

            const ultimoMovimiento = movimientos[0];

            const unidad = UNIT_TYPES.find(
                u => u.id_unit === producto.id_unit_type
            );

            const existencia = ultimoMovimiento.lot_total;
            const minimo = producto.min_stock;

            inventario.push({
                producto: producto.name_prod,
                unidad: unidad ? unidad.name_unit : "Sin unidad",
                entrada: ultimoMovimiento.input_inv,
                existencia: existencia,
                nivel: obtenerNivel(existencia, minimo)
            });

        });

        mostrarInventario();
    }

    // Ordenar al hacer clic en un encabezado
    window.ordenarInventario = function (columna) {

        if (columnaOrden === columna) {
            ordenAscendente = !ordenAscendente;
        } else {
            columnaOrden = columna;
            ordenAscendente = true;
        }

        const ordenNivel = {
            "Bajo": 1,
            "Medio": 2,
            "Alto": 3
        };

        inventario.sort((a, b) => {

            let valorA = a[columna];
            let valorB = b[columna];

            if (columna === "nivel") {
                valorA = ordenNivel[valorA];
                valorB = ordenNivel[valorB];
            }

            if (typeof valorA === "string") {
                return ordenAscendente
                    ? valorA.localeCompare(valorB, "es")
                    : valorB.localeCompare(valorA, "es");
            }

            return ordenAscendente
                ? valorA - valorB
                : valorB - valorA;
        });

        mostrarInventario();
    };

    cargarInventario();

});


/*añadir un producto*/

document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("formNuevoProducto");
    const selectUnidad = document.getElementById("unidadMedidad");

    // Cargar unidades de medida
    function cargarUnidades() {

        selectUnidad.innerHTML = `
            <option value="">Seleccionar unidad</option>
        `;

        UNIT_TYPES.forEach(unidad => {

            const opcion = document.createElement("option");

            opcion.value = unidad.id_unit;
            opcion.textContent = unidad.name_unit;

            selectUnidad.appendChild(opcion);

        });
    }

    // Registrar producto
    formulario.addEventListener("submit", (event) => {

        event.preventDefault();

        const nombre = document.getElementById("nombreProducto").value.trim();
        const unidad = Number(selectUnidad.value);
        const precio = Number(document.getElementById("precioProducto").value);
        const existencia = Number(document.getElementById("existenciaInicial").value);
        const stockMinimo = Number(document.getElementById("stockMinimo").value);

        // Validar datos
        if (
            nombre === "" ||
            !Number.isInteger(unidad) ||
            !UNIT_TYPES.some(u => u.id_unit === unidad) ||
            !Number.isFinite(precio) || precio < 0 ||
            !Number.isFinite(existencia) || existencia < 0 ||
            !Number.isFinite(stockMinimo) || stockMinimo < 0
        ) {
            alert("Por favor, verifica los datos ingresados.");
            return;
        }

        // Validar nombre duplicado
        const productoExiste = PRODUCTS.some(
            producto =>
                producto.name_prod.toLowerCase() === nombre.toLowerCase()
        );

        if (productoExiste) {
            alert("Este producto ya está registrado.");
            return;
        }

        // Generar identificadores
        const idProducto = PRODUCTS.length
            ? Math.max(...PRODUCTS.map(p => p.id_prod)) + 1
            : 1;

        const idInventario = INVENTORYS.length
            ? Math.max(...INVENTORYS.map(i => i.id_inventory)) + 1
            : 1;

        // Fecha actual
        const fecha = new Date().toISOString().split("T")[0];

        // Objeto del producto
        const nuevoProducto = {
            id_prod: idProducto,
            name_prod: nombre,
            price: precio,
            id_unit_type: unidad,
            min_stock: stockMinimo
        };

        // Objeto del inventario inicial
        const nuevoInventario = {
            id_inventory: idInventario,
            id_prod: idProducto,
            date_inv: fecha,
            input_inv: existencia,
            output_inv: 0,
            lot_total: existencia
        };

        // Guardar en los datos ficticios
        PRODUCTS.push(nuevoProducto);
        INVENTORYS.push(nuevoInventario);

        // Actualizar tabla
        if (typeof window.actualizarTablaInventario === "function") {
            window.actualizarTablaInventario();
        }

        // Limpiar formulario
        formulario.reset();

        // Cerrar modal
        const modalElemento = document.getElementById("modalAddRef");
        const modal = bootstrap.Modal.getInstance(modalElemento);

        if (modal) {
            modal.hide();
        }

        alert("Producto registrado correctamente.");

    });

    cargarUnidades();

});


/* tabla de movimientos 2tab panel */



document.addEventListener("DOMContentLoaded", () => {

    const tablaMovimientos = document.getElementById("tablaMovimientos");

    const filtroFecha = document.getElementById("filtroFecha");
    const filtroProducto = document.getElementById("filtroProducto");
    const btnBorrarFiltros = document.getElementById("btnBorrarFiltros");

    // Mostrar movimientos en la tabla
    function mostrarMovimientos(listaMovimientos = INVENTORYS) {

        tablaMovimientos.innerHTML = "";

        // Ordenar del más reciente al más antiguo
        const movimientosOrdenados = [...listaMovimientos].sort((a, b) => {

            const fechaA = new Date(a.date_inv);
            const fechaB = new Date(b.date_inv);

            if (fechaA.getTime() === fechaB.getTime()) {
                return b.id_inventory - a.id_inventory;
            }

            return fechaB - fechaA;
        });

        movimientosOrdenados.forEach(movimiento => {

            const producto = PRODUCTS.find(
                p => p.id_prod === movimiento.id_prod
            );

            if (!producto) return;

            const fecha = movimiento.date_inv.split("-").reverse().join("-");

            const entrada = movimiento.input_inv;
            const salida = movimiento.output_inv;
            const saldo = movimiento.lot_total;

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>
                    <h6 class="textSecondary fw-semibold">${fecha}</h6>
                </td>

                <td>
                    <h6 class="textSecondary fw-semibold">${producto.name_prod}</h6>
                </td>

                <td>
                    <h6 class="text-success fw-semibold">
                        ${entrada > 0 ? entrada : "---"}
                    </h6>
                </td>

                <td>
                    <h6 class="text-danger fw-semibold">
                        ${salida > 0 ? salida : "---"}
                    </h6>
                </td>

                <td>
                    <h6 class="textSecondary fw-semibold">${saldo}</h6>
                </td>
            `;

            tablaMovimientos.appendChild(fila);

        });

        // Mensaje cuando no existen resultados
        if (tablaMovimientos.children.length === 0) {

            tablaMovimientos.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center textSecondary fw-semibold">
                        No se encontraron movimientos.
                    </td>
                </tr>
            `;
        }
    }

    // Aplicar filtros independientes y combinados
    function filtrarMovimientos() {

        const fechaSeleccionada = filtroFecha.value;
        const nombreProducto = filtroProducto.value.trim().toLowerCase();

        const movimientosFiltrados = INVENTORYS.filter(movimiento => {

            const producto = PRODUCTS.find(
                p => p.id_prod === movimiento.id_prod
            );

            if (!producto) return false;

            // Filtro por fecha
            const coincideFecha = !fechaSeleccionada ||
                movimiento.date_inv === fechaSeleccionada;

            // Filtro por nombre de producto
            const coincideProducto = !nombreProducto ||
                producto.name_prod.toLowerCase().includes(nombreProducto);

            return coincideFecha && coincideProducto;

        });

        mostrarMovimientos(movimientosFiltrados);
    }

    // Detectar cambios en la fecha
    filtroFecha.addEventListener("change", filtrarMovimientos);

    // Buscar mientras se escribe
    filtroProducto.addEventListener("input", filtrarMovimientos);

    // Borrar ambos filtros
    btnBorrarFiltros.addEventListener("click", () => {

        filtroFecha.value = "";
        filtroProducto.value = "";

        mostrarMovimientos();

    });

    // Función global para actualizar la tabla desde otros archivos
    window.actualizarTablaMovimientos = filtrarMovimientos;

    // Cargar movimientos al iniciar
    mostrarMovimientos();

});


/* registro de movimientos */


document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("formNuevoMovimiento");
    const selectProducto = document.getElementById("productoMovimiento");
    const inputFecha = document.getElementById("fechaMovimiento");
    const inputCantidad = document.getElementById("cantidadMovimiento");
    const existenciaProducto = document.getElementById("existenciaProducto");

    // Obtener la existencia actual de un producto
    function obtenerExistencia(idProducto) {

        const movimientos = INVENTORYS
            .filter(m => m.id_prod === idProducto)
            .sort((a, b) => {
                const diferencia = new Date(b.date_inv) - new Date(a.date_inv);

                return diferencia !== 0
                    ? diferencia
                    : b.id_inventory - a.id_inventory;
            });

        return movimientos.length > 0
            ? Number(movimientos[0].lot_total)
            : 0;
    }

    // Cargar productos en el select
    function cargarProductos() {

        selectProducto.innerHTML = `
            <option value="">Seleccionar producto</option>
        `;

        PRODUCTS.forEach(producto => {

            const opcion = document.createElement("option");

            opcion.value = producto.id_prod;
            opcion.textContent = producto.name_prod;

            selectProducto.appendChild(opcion);

        });
    }

    // Mostrar existencia del producto seleccionado
    function mostrarExistencia() {

        const idProducto = Number(selectProducto.value);

        if (!idProducto) {
            existenciaProducto.textContent = "Existencia actual: ---";
            return;
        }

        const existencia = obtenerExistencia(idProducto);

        existenciaProducto.textContent =
            `Existencia actual: ${existencia}`;
    }

    selectProducto.addEventListener("change", mostrarExistencia);

    // Establecer fecha actual
    function establecerFechaActual() {

        const hoy = new Date();
        const fechaLocal = new Date(
            hoy.getTime() - hoy.getTimezoneOffset() * 60000
        ).toISOString().split("T")[0];

        inputFecha.value = fechaLocal;
    }

    // Registrar movimiento
    formulario.addEventListener("submit", (event) => {

        event.preventDefault();

        const tipo = document.querySelector(
            'input[name="tipoMovimiento"]:checked'
        ).value;

        const idProducto = Number(selectProducto.value);
        const fecha = inputFecha.value;
        const cantidad = Number(inputCantidad.value);

        const producto = PRODUCTS.find(
            p => p.id_prod === idProducto
        );

        // Validaciones
        if (!producto || !fecha || !Number.isFinite(cantidad) || cantidad <= 0) {
            alert("Verifica los datos del movimiento.");
            return;
        }

        // Obtener existencia actual
        const existenciaActual = obtenerExistencia(idProducto);

        let entrada = 0;
        let salida = 0;
        let nuevoSaldo = existenciaActual;

        if (tipo === "entrada") {

            entrada = cantidad;
            nuevoSaldo = existenciaActual + cantidad;

        } else {

            salida = cantidad;

            if (cantidad > existenciaActual) {
                alert(
                    `No hay suficiente existencia. Disponible: ${existenciaActual}`
                );
                return;
            }

            nuevoSaldo = existenciaActual - cantidad;
        }

        // Generar identificador
        const nuevoId = INVENTORYS.length > 0
            ? Math.max(...INVENTORYS.map(m => m.id_inventory)) + 1
            : 1;

        // Crear movimiento
        const nuevoMovimiento = {
            id_inventory: nuevoId,
            id_prod: idProducto,
            date_inv: fecha,
            input_inv: entrada,
            output_inv: salida,
            lot_total: nuevoSaldo
        };

        // Guardar movimiento
        INVENTORYS.push(nuevoMovimiento);

        // Actualizar tabla de movimientos
        if (typeof window.actualizarTablaMovimientos === "function") {
            window.actualizarTablaMovimientos();
        }

        // Actualizar tabla de inventario
        if (typeof window.actualizarTablaInventario === "function") {
            window.actualizarTablaInventario();
        }

        // Limpiar formulario
        formulario.reset();
        establecerFechaActual();
        cargarProductos();
        mostrarExistencia();

        // Cerrar modal
        const modalElemento = document.getElementById("modalAddReMov");
        const modal = bootstrap.Modal.getInstance(modalElemento);

        if (modal) {
            modal.hide();
        }

        alert("Movimiento registrado correctamente.");

    });

    cargarProductos();
    establecerFechaActual();

});

/*panel inventario mensual */

document.addEventListener("DOMContentLoaded", () => {

    const selectMes = document.getElementById("mesInventario");
    const tabla = document.getElementById("tablaInventarioMensual");
    const totalElemento = document.getElementById("totalInventarioMensual");
    const btnDescargar = document.getElementById("btnDescargarInventario");

    let inventarioMensualActual = [];
    let totalInventarioActual = 0;

    // Formato de moneda colombiana
    function formatoCOP(valor) {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }).format(valor);
    }

    // Obtener los meses disponibles a partir de los movimientos
    function cargarMeses() {

        const meses = [...new Set(
            INVENTORYS.map(movimiento =>
                movimiento.date_inv.substring(0, 7)
            )
        )].sort().reverse();

        selectMes.innerHTML = `
            <option value="">Seleccionar mes</option>
        `;

        meses.forEach(mes => {

            const [anio, numeroMes] = mes.split("-");

            const fecha = new Date(
                Number(anio),
                Number(numeroMes) - 1,
                1
            );

            const nombreMes = fecha.toLocaleDateString("es-CO", {
                month: "long",
                year: "numeric"
            });

            const opcion = document.createElement("option");

            opcion.value = mes;
            opcion.textContent =
                nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);

            selectMes.appendChild(opcion);

        });

        // Seleccionar automáticamente el mes más reciente
        if (meses.length > 0) {
            selectMes.value = meses[0];
            mostrarInventarioMensual();
        }
    }

    // Calcular inventario a fecha 28 del mes seleccionado
    function calcularInventario(mesSeleccionado) {

        const fechaCorte = `${mesSeleccionado}-28`;

        return PRODUCTS.map(producto => {

            // Movimientos del producto hasta la fecha de corte
            const movimientos = INVENTORYS.filter(movimiento =>
                movimiento.id_prod === producto.id_prod &&
                movimiento.date_inv <= fechaCorte
            );

            // Calcular existencia acumulada
            const cantidadEntrada = movimientos.reduce(
                (total, movimiento) =>
                    total + Number(movimiento.input_inv || 0),
                0
            );

            const cantidadSalida = movimientos.reduce(
                (total, movimiento) =>
                    total + Number(movimiento.output_inv || 0),
                0
            );

            const cantidad = cantidadEntrada - cantidadSalida;

            // Buscar unidad de medida
            const unidad = UNIT_TYPES.find(
                u => u.id_unit === producto.id_unit_type
            );

            const precioUnitario = Number(producto.price) || 0;

            const valorTotal = cantidad * precioUnitario;

            return {
                nombre: producto.name_prod,
                unidad: unidad ? unidad.name_unit : "",
                cantidad: cantidad,
                precioUnitario: precioUnitario,
                valorTotal: valorTotal
            };

        }).filter(producto => producto.cantidad > 0);

    }

    // Mostrar inventario mensual en la tabla
    function mostrarInventarioMensual() {

        const mesSeleccionado = selectMes.value;

        tabla.innerHTML = "";

        if (!mesSeleccionado) {
            inventarioMensualActual = [];
            totalInventarioActual = 0;
            totalElemento.textContent = formatoCOP(0);
            return;
        }

        inventarioMensualActual = calcularInventario(mesSeleccionado);

        totalInventarioActual = 0;

        inventarioMensualActual.forEach(producto => {

            totalInventarioActual += producto.valorTotal;

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>
                    <h6 class="textSecondary fw-semibold">
                        ${producto.nombre}
                    </h6>
                </td>

                <td>
                    <h6 class="textSecondary fw-semibold">
                        ${producto.cantidad} ${producto.unidad}
                    </h6>
                </td>

                <td>
                    <h6 class="textSecondary fw-semibold">
                        ${formatoCOP(producto.precioUnitario)}
                    </h6>
                </td>

                <td>
                    <h6 class="textSecondary fw-semibold">
                        ${formatoCOP(producto.valorTotal)}
                    </h6>
                </td>
            `;

            tabla.appendChild(fila);

        });

        if (inventarioMensualActual.length === 0) {

            tabla.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">
                        No hay inventario registrado para este mes.
                    </td>
                </tr>
            `;
        }

        totalElemento.textContent = formatoCOP(totalInventarioActual);
    }

    // Cambiar mes seleccionado
    selectMes.addEventListener("change", mostrarInventarioMensual);

    // Descargar PDF
    btnDescargar.addEventListener("click", () => {

        const mesSeleccionado = selectMes.value;

        if (!mesSeleccionado) {
            alert("Selecciona un mes para descargar el inventario.");
            return;
        }

        if (inventarioMensualActual.length === 0) {
            alert("No hay productos para generar el PDF.");
            return;
        }

        const { jsPDF } = window.jspdf;

        const documento = new jsPDF();

        const [anio, mes] = mesSeleccionado.split("-");

        const fechaCorte = `28/${mes}/${anio}`;

        const nombreMes = new Date(
            Number(anio),
            Number(mes) - 1,
            1
        ).toLocaleDateString("es-CO", {
            month: "long",
            year: "numeric"
        });

        // Título
        documento.setFontSize(16);
        documento.text("INVENTARIO MENSUAL", 14, 20);

        documento.setFontSize(11);
        documento.text(
            `Periodo: ${nombreMes}`,
            14,
            30
        );

        documento.text(
            `Existencias al: ${fechaCorte}`,
            14,
            37
        );

        // Preparar filas del PDF
        const filas = inventarioMensualActual.map(producto => [
            producto.nombre,
            `${producto.cantidad} ${producto.unidad}`,
            formatoCOP(producto.precioUnitario),
            formatoCOP(producto.valorTotal)
        ]);

        // Generar tabla
        documento.autoTable({

            startY: 45,

            head: [[
                "Producto",
                "Cantidad",
                "Precio unitario",
                "Valor total"
            ]],

            body: filas,

            foot: [[
                "Valor total del inventario",
                "",
                "",
                formatoCOP(totalInventarioActual)
            ]],

            theme: "grid",

            styles: {
                fontSize: 9,
                cellPadding: 3
            },

            headStyles: {
                fillColor: [70, 70, 70]
            },

            footStyles: {
                fontStyle: "bold"
            }

        });

        // Descargar archivo
        documento.save(`Inventario_${mesSeleccionado}.pdf`);

    });

    // Inicializar
    cargarMeses();

    // Permitir actualizar desde otros archivos
    window.actualizarInventarioMensual = mostrarInventarioMensual;

});
