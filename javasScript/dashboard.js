
document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. ELEMENTOS DEL DASHBOARD
    // ==========================================

    // Indicadores
    const pedidosHoy = document.getElementById("pedidosHoy");
    const ventasMes = document.getElementById("ventasMes");
    const clientesDeuda = document.getElementById("clientesDeuda");
    const gastosMes = document.getElementById("gastosMes");

    // Alerta de inventario
    const alertaInventario = document.getElementById("alertaInventario");
    const cantidadInventario = document.getElementById("cantidadInventario");
    const textoInventario = document.getElementById("textoInventario");

    // Alerta de cobranza
    const alertaCobranza = document.getElementById("alertaCobranza");
    const cantidadFacturas = document.getElementById("cantidadFacturas");
    const textoFacturas = document.getElementById("textoFacturas");


    // ==========================================
    // 2. FUNCIONES AUXILIARES
    // ==========================================

    // Obtener la fecha más reciente de los registros
    function obtenerUltimaFecha(datos, propiedad) {

        if (!datos || datos.length === 0) {
            return null;
        }

        const fechas = datos
            .map(registro => registro[propiedad])
            .filter(fecha => fecha);

        if (fechas.length === 0) {
            return null;
        }

        fechas.sort();

        return fechas[fechas.length - 1];
    }


    // Formatear valores en pesos colombianos
    function formatearMoneda(valor) {

        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }).format(valor);

    }


    // Actualizar alertas dinámicamente
    function actualizarAlerta(
        alerta,
        elementoCantidad,
        elementoTexto,
        cantidad,
        singular,
        plural,
        mensaje
    ) {

        if (!alerta || !elementoCantidad || !elementoTexto) {
            return;
        }

        if (cantidad > 0) {

            elementoCantidad.textContent = cantidad;

            elementoTexto.textContent =
                ` ${cantidad === 1 ? singular : plural} ${mensaje}`;

            alerta.classList.remove("d-none");

        } else {

            alerta.classList.add("d-none");

        }

    }


    // ==========================================
    // 3. PEDIDOS DEL DÍA
    // ==========================================

    const fechaReferenciaPedidos = obtenerUltimaFecha(
        T_ORDERS,
        "date_ord"
    );

    const totalPedidosHoy = fechaReferenciaPedidos
        ? T_ORDERS.filter(pedido =>
            pedido.date_ord === fechaReferenciaPedidos
        ).length
        : 0;

    if (pedidosHoy) {
        pedidosHoy.textContent = totalPedidosHoy;
    }


    // ==========================================
    // 4. VENTAS DEL MES
    // ==========================================

    const fechaReferenciaEconomia = obtenerUltimaFecha(
        ACCOUNTINGS,
        "date_acc"
    );

    const mesReferenciaEconomia = fechaReferenciaEconomia
        ? fechaReferenciaEconomia.substring(0, 7)
        : null;

    const totalVentasMes = mesReferenciaEconomia
        ? ACCOUNTINGS
            .filter(registro =>
                registro.date_acc.startsWith(mesReferenciaEconomia)
            )
            .reduce((total, registro) => {

                return total + Number(registro.input_acc || 0);

            }, 0)
        : 0;

    if (ventasMes) {
        ventasMes.textContent = formatearMoneda(totalVentasMes);
    }


    // ==========================================
    // 5. CLIENTES CON DEUDAS
    // ==========================================

    const clientesConDeuda = COLLECTIONS.filter(coleccion => {

        return Number(coleccion.collection_value || 0) <
            Number(coleccion.sale_value || 0);

    });

    // Evitar contar varias veces al mismo cliente
    const clientesUnicos = new Set(
        clientesConDeuda.map(coleccion => coleccion.id_cliente)
    );

    const totalClientesDeuda = clientesUnicos.size;

    if (clientesDeuda) {
        clientesDeuda.textContent = totalClientesDeuda;
    }


    // ==========================================
    // 6. GASTOS DEL MES
    // ==========================================

    const totalGastosMes = mesReferenciaEconomia
        ? ACCOUNTINGS
            .filter(registro =>
                registro.date_acc.startsWith(mesReferenciaEconomia)
            )
            .reduce((total, registro) => {

                return total + Number(registro.output_acc || 0);

            }, 0)
        : 0;

    if (gastosMes) {
        gastosMes.textContent = formatearMoneda(totalGastosMes);
    }


    // ==========================================
    // 7. ALERTA DE INVENTARIO
    // ==========================================

    // Obtener el último inventario registrado de cada producto
    const ultimoInventarioPorProducto = new Map();

    INVENTORYS.forEach(registro => {

        const inventarioActual = ultimoInventarioPorProducto.get(
            registro.id_prod
        );

        if (
            !inventarioActual ||
            registro.date_inv > inventarioActual.date_inv
        ) {

            ultimoInventarioPorProducto.set(
                registro.id_prod,
                registro
            );

        }

    });


    // Identificar productos por debajo del mínimo establecido
    const productosBajoMinimo = [
        ...ultimoInventarioPorProducto.values()
    ].filter(inventario => {

        const producto = obtenerProducto(inventario.id_prod);

        if (!producto) {
            return false;
        }

        return Number(inventario.lot_total || 0) <=
            Number(producto.min_stock || 0);

    });


    // Cantidad total de materias primas por debajo del mínimo
    const totalProductosBajoMinimo = productosBajoMinimo.length;


    // Actualizar alerta de inventario
    actualizarAlerta(
        alertaInventario,
        cantidadInventario,
        textoInventario,
        totalProductosBajoMinimo,
        "materia prima",
        "materias primas",
        "tienen existencias por debajo del mínimo establecido."
    );


    // ==========================================
    // 8. ALERTA DE COBRANZA
    // ==========================================

    // Obtener las facturas que tienen saldo pendiente
    const facturasPendientes = COLLECTIONS.filter(coleccion => {

        return Number(coleccion.collection_value || 0) <
            Number(coleccion.sale_value || 0);

    });


    // Cantidad total de facturas pendientes
    const totalFacturasPendientes = facturasPendientes.length;


    // Actualizar alerta de cobranza
    actualizarAlerta(
        alertaCobranza,
        cantidadFacturas,
        textoFacturas,
        totalFacturasPendientes,
        "factura",
        "facturas",
        "tienen saldos pendientes de pago."
    );


});
