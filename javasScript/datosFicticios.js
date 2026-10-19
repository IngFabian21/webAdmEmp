/*
 * datosFicticios.js
 * Datos de prueba para webAdmEmp.
 * Basado en el modelo de BD entregado:
 * CLIENTS, COLLECTIONS, T_ORDERS, USERS, REFERENCESS, DETAILS,
 * CONCEPT_DETAILS, ACCOUNTINGS, UNIT_TYPES, PRODUCTS, INVENTORYS,
 * INVENTORY_MONTHS.
 *
 * Uso:
 * <script src="./javasScript/datosFicticios.js"></script>
 *
 * Los arrays quedan disponibles globalmente para todos los HTML.
 */


/* ============================================================
   USERS
   ============================================================ */

const USERS = [
    {
        id: 1,
        name_user: "admin",
        name_: "Administrador",
        pass: "123456"
    },
    {
        id: 2,
        name_user: "ventas",
        name_: "Usuario Ventas",
        pass: "ventas123"
    },
    {
        id: 3,
        name_user: "inventario",
        name_: "Usuario Inventario",
        pass: "inv123"
    }
];


/* ============================================================
   CLIENTS
   ============================================================ */

const CLIENTS = [
    {
        id: 1,
        name_ctl: "Restaurante El Buen Sabor",
        phone: 3004567891,
        address_ctl: "Calle 72 # 15-24",
        status_ctl: "AC"
    },
    {
        id: 2,
        name_ctl: "Café Central",
        phone: 3015678902,
        address_ctl: "Carrera 11 # 82-10",
        status_ctl: "AC"
    },
    {
        id: 3,
        name_ctl: "Panadería La 80",
        phone: 3106789013,
        address_ctl: "Calle 80 # 24-18",
        status_ctl: "AC"
    },
    {
        id: 4,
        name_ctl: "Hotel Los Andes",
        phone: 3157890124,
        address_ctl: "Carrera 7 # 68-35",
        status_ctl: "AC"
    },
    {
        id: 5,
        name_ctl: "Comidas Don José",
        phone: 3208901235,
        address_ctl: "Calle 45 # 20-31",
        status_ctl: "AC"
    },
    {
        id: 6,
        name_ctl: "Restaurante La Esquina",
        phone: 3119012346,
        address_ctl: "Carrera 30 # 53-16",
        status_ctl: "IN"
    },
    {
        id: 7,
        name_ctl: "Cocina Sabores",
        phone: 3001122334,
        address_ctl: "Calle 100 # 18-42",
        status_ctl: "AC"
    },
    {
        id: 8,
        name_ctl: "Eventos Bogotá",
        phone: 3162233445,
        address_ctl: "Carrera 50 # 93-22",
        status_ctl: "AC"
    }
];


/* ============================================================
   COLLECTIONS
   ============================================================ */

const COLLECTIONS = [
    {
        id_cliente: 1,
        date_cllt: "2026-09-01",
        status_cllt: "PA",
        sale_value: 1850000,
        collection_value: 1850000
    },
    {
        id_cliente: 2,
        date_cllt: "2026-09-05",
        status_cllt: "PA",
        sale_value: 920000,
        collection_value: 700000
    },
    {
        id_cliente: 3,
        date_cllt: "2026-09-08",
        status_cllt: "PE",
        sale_value: 1250000,
        collection_value: 0
    },
    {
        id_cliente: 4,
        date_cllt: "2026-09-10",
        status_cllt: "PA",
        sale_value: 2400000,
        collection_value: 1800000
    },
    {
        id_cliente: 5,
        date_cllt: "2026-09-12",
        status_cllt: "PE",
        sale_value: 780000,
        collection_value: 0
    },
    {
        id_cliente: 7,
        date_cllt: "2026-09-15",
        status_cllt: "PA",
        sale_value: 1560000,
        collection_value: 1560000
    },
    {
        id_cliente: 8,
        date_cllt: "2026-09-18",
        status_cllt: "PE",
        sale_value: 2100000,
        collection_value: 500000
    },
    {
        id_cliente: 1,
        date_cllt: "2026-09-20",
        status_cllt: "PA",
        sale_value: 980000,
        collection_value: 980000
    }
];


/* ============================================================
   T_ORDERS
   ============================================================ */

const T_ORDERS = [
    {
        id: 1001,
        id_cliente: 1,
        id_user: 2,
        date_ord: "2026-09-02"
    },
    {
        id: 1002,
        id_cliente: 2,
        id_user: 2,
        date_ord: "2026-09-04"
    },
    {
        id: 1003,
        id_cliente: 3,
        id_user: 2,
        date_ord: "2026-09-07"
    },
    {
        id: 1004,
        id_cliente: 4,
        id_user: 2,
        date_ord: "2026-09-09"
    },
    {
        id: 1005,
        id_cliente: 5,
        id_user: 1,
        date_ord: "2026-09-11"
    },
    {
        id: 1006,
        id_cliente: 7,
        id_user: 2,
        date_ord: "2026-09-14"
    },
    {
        id: 1007,
        id_cliente: 8,
        id_user: 1,
        date_ord: "2026-09-17"
    },
    {
        id: 1008,
        id_cliente: 1,
        id_user: 2,
        date_ord: "2026-09-19"
    }
];


/* ============================================================
   REFERENCESS
   ============================================================ */

const REFERENCESS = [
    {
        id: 1,
        name_ref: "Arroz con pollo",
        price: 18000,
        status_ref: "AC"
    },
    {
        id: 2,
        name_ref: "Arroz con carne",
        price: 20000,
        status_ref: "AC"
    },
    {
        id: 3,
        name_ref: "Arroz mixto",
        price: 22000,
        status_ref: "AC"
    },
    {
        id: 4,
        name_ref: "Arroz especial",
        price: 25000,
        status_ref: "AC"
    },
    {
        id: 5,
        name_ref: "Arroz vegetariano",
        price: 16000,
        status_ref: "AC"
    },
    {
        id: 6,
        name_ref: "Arroz con camarón",
        price: 28000,
        status_ref: "AC"
    },
    {
        id: 7,
        name_ref: "Arroz familiar",
        price: 35000,
        status_ref: "AC"
    },
    {
        id: 8,
        name_ref: "Arroz ejecutivo",
        price: 15000,
        status_ref: "IN"
    }
];


/* ============================================================
   DETAILS
   ============================================================ */

const DETAILS = [
    {
        id_reference: 1,
        id_order: 1001,
        lot: 20
    },
    {
        id_reference: 3,
        id_order: 1001,
        lot: 15
    },
    {
        id_reference: 2,
        id_order: 1001,
        lot: 10
    },

    {
        id_reference: 1,
        id_order: 1002,
        lot: 12
    },
    {
        id_reference: 4,
        id_order: 1002,
        lot: 8
    },

    {
        id_reference: 2,
        id_order: 1003,
        lot: 20
    },
    {
        id_reference: 5,
        id_order: 1003,
        lot: 10
    },

    {
        id_reference: 3,
        id_order: 1004,
        lot: 25
    },
    {
        id_reference: 6,
        id_order: 1004,
        lot: 10
    },

    {
        id_reference: 1,
        id_order: 1005,
        lot: 15
    },
    {
        id_reference: 7,
        id_order: 1005,
        lot: 5
    },

    {
        id_reference: 4,
        id_order: 1006,
        lot: 18
    },
    {
        id_reference: 2,
        id_order: 1006,
        lot: 12
    },

    {
        id_reference: 6,
        id_order: 1007,
        lot: 20
    },
    {
        id_reference: 3,
        id_order: 1007,
        lot: 15
    },

    {
        id_reference: 1,
        id_order: 1008,
        lot: 30
    },
    {
        id_reference: 4,
        id_order: 1008,
        lot: 10
    }
];


/* ============================================================
   CONCEPT_DETAILS
   ============================================================ */

const CONCEPT_DETAILS = [
    {
        id: 1,
        name_detail: "Venta de pedidos",
        type: "IN",
        description: "Ingreso generado por venta de referencias",
        value: 1850000
    },
    {
        id: 2,
        name_detail: "Compra de materia prima",
        type: "OUT",
        description: "Compra de insumos para producción",
        value: 650000
    },
    {
        id: 3,
        name_detail: "Transporte",
        type: "OUT",
        description: "Gastos de transporte y distribución",
        value: 180000
    },
    {
        id: 4,
        name_detail: "Servicios públicos",
        type: "OUT",
        description: "Pago de servicios del establecimiento",
        value: 320000
    },
    {
        id: 5,
        name_detail: "Venta de pedido especial",
        type: "IN",
        description: "Ingreso por pedido especial",
        value: 980000
    },
    {
        id: 6,
        name_detail: "Mantenimiento",
        type: "OUT",
        description: "Mantenimiento de equipos",
        value: 250000
    },
    {
        id: 7,
        name_detail: "Otros ingresos",
        type: "IN",
        description: "Otros ingresos operativos",
        value: 300000
    },
    {
        id: 8,
        name_detail: "Otros gastos",
        type: "OUT",
        description: "Gastos operativos varios",
        value: 120000
    }
];


/* ============================================================
   ACCOUNTINGS
   ============================================================ */

const ACCOUNTINGS = [
    {
        id_detail: 1,
        date_acc: "2026-09-02",
        input_acc: 540000,
        output_acc: 0,
        total: 540000
    },
    {
        id_detail: 2,
        date_acc: "2026-09-03",
        input_acc: 0,
        output_acc: 650000,
        total: -650000
    },
    {
        id_detail: 3,
        date_acc: "2026-09-05",
        input_acc: 0,
        output_acc: 180000,
        total: -180000
    },
    {
        id_detail: 4,
        date_acc: "2026-09-08",
        input_acc: 0,
        output_acc: 320000,
        total: -320000
    },
    {
        id_detail: 5,
        date_acc: "2026-09-10",
        input_acc: 980000,
        output_acc: 0,
        total: 980000
    },
    {
        id_detail: 1,
        date_acc: "2026-09-12",
        input_acc: 1250000,
        output_acc: 0,
        total: 1250000
    },
    {
        id_detail: 6,
        date_acc: "2026-09-15",
        input_acc: 0,
        output_acc: 250000,
        total: -250000
    },
    {
        id_detail: 7,
        date_acc: "2026-09-18",
        input_acc: 300000,
        output_acc: 0,
        total: 300000
    },
    {
        id_detail: 8,
        date_acc: "2026-09-20",
        input_acc: 0,
        output_acc: 120000,
        total: -120000
    }
];


/* ============================================================
   UNIT_TYPES
   ============================================================ */

const UNIT_TYPES = [
    {
        id_unit: 1,
        name_unit: "Kilogramo",
        descrip: "Unidad de peso en kilogramos"
    },
    {
        id_unit: 2,
        name_unit: "Gramo",
        descrip: "Unidad de peso en gramos"
    },
    {
        id_unit: 3,
        name_unit: "Litro",
        descrip: "Unidad de volumen en litros"
    },
    {
        id_unit: 4,
        name_unit: "Unidad",
        descrip: "Producto contado por unidad"
    },
    {
        id_unit: 5,
        name_unit: "Paquete",
        descrip: "Producto empacado"
    },
    {
        id_unit: 6,
        name_unit: "Caja",
        descrip: "Producto almacenado por caja"
    }
];


/* ============================================================
   PRODUCTS
   ============================================================ */

const PRODUCTS = [
    {
        id_prod: 1,
        name_prod: "Arroz",
        price: 4200,
        id_unit_type: 1
    },
    {
        id_prod: 2,
        name_prod: "Pollo",
        price: 12500,
        id_unit_type: 1
    },
    {
        id_prod: 3,
        name_prod: "Carne de res",
        price: 22000,
        id_unit_type: 1
    },
    {
        id_prod: 4,
        name_prod: "Camarón",
        price: 30000,
        id_unit_type: 1
    },
    {
        id_prod: 5,
        name_prod: "Verduras mixtas",
        price: 7500,
        id_unit_type: 1
    },
    {
        id_prod: 6,
        name_prod: "Aceite vegetal",
        price: 9500,
        id_unit_type: 3
    },
    {
        id_prod: 7,
        name_prod: "Salsa de soya",
        price: 8500,
        id_unit_type: 3
    },
    {
        id_prod: 8,
        name_prod: "Huevos",
        price: 18000,
        id_unit_type: 5
    },
    {
        id_prod: 9,
        name_prod: "Sal",
        price: 2200,
        id_unit_type: 2
    },
    {
        id_prod: 10,
        name_prod: "Cebolla",
        price: 4800,
        id_unit_type: 1
    },
    {
        id_prod: 11,
        name_prod: "Pimentón",
        price: 6200,
        id_unit_type: 1
    },
    {
        id_prod: 12,
        name_prod: "Ajo",
        price: 9000,
        id_unit_type: 2
    }
];


/* ============================================================
   INVENTORYS
   ============================================================ */

const INVENTORYS = [
    {
        id_inventory: 1,
        id_prod: 1,
        date_inv: "2026-09-01",
        input_inv: 100,
        output_inv: 0,
        lot_total: 100
    },
    {
        id_inventory: 2,
        id_prod: 1,
        date_inv: "2026-09-15",
        input_inv: 50,
        output_inv: 35,
        lot_total: 115
    },
    {
        id_inventory: 3,
        id_prod: 2,
        date_inv: "2026-09-01",
        input_inv: 80,
        output_inv: 0,
        lot_total: 80
    },
    {
        id_inventory: 4,
        id_prod: 2,
        date_inv: "2026-09-16",
        input_inv: 30,
        output_inv: 45,
        lot_total: 65
    },
    {
        id_inventory: 5,
        id_prod: 3,
        date_inv: "2026-09-02",
        input_inv: 60,
        output_inv: 25,
        lot_total: 35
    },
    {
        id_inventory: 6,
        id_prod: 4,
        date_inv: "2026-09-03",
        input_inv: 30,
        output_inv: 12,
        lot_total: 18
    },
    {
        id_inventory: 7,
        id_prod: 5,
        date_inv: "2026-09-04",
        input_inv: 70,
        output_inv: 28,
        lot_total: 42
    },
    {
        id_inventory: 8,
        id_prod: 6,
        date_inv: "2026-09-05",
        input_inv: 40,
        output_inv: 15,
        lot_total: 25
    },
    {
        id_inventory: 9,
        id_prod: 7,
        date_inv: "2026-09-06",
        input_inv: 35,
        output_inv: 10,
        lot_total: 25
    },
    {
        id_inventory: 10,
        id_prod: 8,
        date_inv: "2026-09-07",
        input_inv: 20,
        output_inv: 8,
        lot_total: 12
    },
    {
        id_inventory: 11,
        id_prod: 9,
        date_inv: "2026-09-08",
        input_inv: 15,
        output_inv: 5,
        lot_total: 10
    },
    {
        id_inventory: 12,
        id_prod: 10,
        date_inv: "2026-09-09",
        input_inv: 30,
        output_inv: 14,
        lot_total: 16
    },
    {
        id_inventory: 13,
        id_prod: 11,
        date_inv: "2026-09-10",
        input_inv: 25,
        output_inv: 9,
        lot_total: 16
    },
    {
        id_inventory: 14,
        id_prod: 12,
        date_inv: "2026-09-11",
        input_inv: 12,
        output_inv: 4,
        lot_total: 8
    }
];


/* ============================================================
   INVENTORY_MONTHS
   ============================================================ */

const INVENTORY_MONTHS = [
    {
        date_inv_mnth: "2026-09-01",
        id_prod: 1,
        lot: "ARZ-SEP-01",
        price_unit: 4200,
        price_total: 483000
    },
    {
        date_inv_mnth: "2026-09-01",
        id_prod: 2,
        lot: "POL-SEP-01",
        price_unit: 12500,
        price_total: 812500
    },
    {
        date_inv_mnth: "2026-09-01",
        id_prod: 3,
        lot: "CAR-SEP-01",
        price_unit: 22000,
        price_total: 770000
    },
    {
        date_inv_mnth: "2026-09-01",
        id_prod: 4,
        lot: "CAM-SEP-01",
        price_unit: 30000,
        price_total: 540000
    },
    {
        date_inv_mnth: "2026-09-01",
        id_prod: 5,
        lot: "VER-SEP-01",
        price_unit: 7500,
        price_total: 315000
    },
    {
        date_inv_mnth: "2026-09-01",
        id_prod: 6,
        lot: "ACE-SEP-01",
        price_unit: 9500,
        price_total: 237500
    },
    {
        date_inv_mnth: "2026-09-01",
        id_prod: 7,
        lot: "SOY-SEP-01",
        price_unit: 8500,
        price_total: 212500
    },
    {
        date_inv_mnth: "2026-09-01",
        id_prod: 8,
        lot: "HUE-SEP-01",
        price_unit: 18000,
        price_total: 216000
    }
];


/* ============================================================
   FUNCIONES AUXILIARES
   ============================================================ */


/*
 * Buscar un cliente por ID
 */
function obtenerCliente(id) {
    return CLIENTS.find(cliente => cliente.id === id);
}


/*
 * Buscar un usuario por ID
 */
function obtenerUsuario(id) {
    return USERS.find(usuario => usuario.id === id);
}


/*
 * Buscar una referencia por ID
 */
function obtenerReferencia(id) {
    return REFERENCESS.find(referencia => referencia.id === id);
}


/*
 * Buscar un producto por ID
 */
function obtenerProducto(id) {
    return PRODUCTS.find(producto => producto.id_prod === id);
}


/*
 * Buscar una unidad por ID
 */
function obtenerUnidad(id) {
    return UNIT_TYPES.find(unidad => unidad.id_unit === id);
}


/*
 * Buscar un pedido por ID
 */
function obtenerPedido(id) {
    return T_ORDERS.find(pedido => pedido.id === id);
}


/*
 * Obtener todos los detalles de un pedido
 */
function obtenerDetallesPedido(idOrder) {
    return DETAILS.filter(
        detalle => detalle.id_order === idOrder
    );
}

/*
 * mostrar todos los detalles de un pedido
 */

function mostrarDetallePedido(idPedido) {

    const pedido = obtenerPedido(Number(idPedido));

    if (!pedido) {
        console.error("No se encontró el pedido:", idPedido);
        return;
    }

    // Mostrar la fecha y el cliente.
    informacionPedido.textContent =
        `Cliente: ${nombreCliente(pedido.id_cliente)} | ` +
        `Fecha: ${formatearFecha(pedido.date_ord)}`;

    // Limpiar los detalles anteriores.
    detalleReferenciasPedido.innerHTML = "";

    // Buscar los detalles asociados al pedido.
    const detalles = DETAILS.filter(function (detalle) {
        return Number(detalle.id_order) === Number(pedido.id);
    });

    if (detalles.length === 0) {
        detalleReferenciasPedido.innerHTML = `
            <tr>
                <td colspan="2" class="text-center">
                    Este pedido no tiene referencias registradas.
                </td>
            </tr>
        `;
        return;
    }

    // Crear una fila para cada referencia del pedido.
    detalles.forEach(function (detalle) {

        const referencia = REFERENCESS.find(function (ref) {
            return Number(ref.id) === Number(detalle.id_reference);
        });

        const fila = document.createElement("tr");

        const celdaReferencia = document.createElement("td");
        const nombre = document.createElement("h6");

        nombre.className = "textSecondary fw-semibold";
        nombre.textContent = referencia
            ? referencia.name_ref
            : `Referencia ${detalle.id_reference}`;

        celdaReferencia.appendChild(nombre);

        const celdaCantidad = document.createElement("td");
        const cantidad = document.createElement("h6");

        cantidad.className = "textSecondary fw-semibold";
        cantidad.textContent = detalle.lot;

        celdaCantidad.appendChild(cantidad);

        fila.appendChild(celdaReferencia);
        fila.appendChild(celdaCantidad);

        detalleReferenciasPedido.appendChild(fila);
    });
}

/*
 * Obtener nombre de cliente
 */
function nombreCliente(id) {
    const cliente = obtenerCliente(id);

    return cliente
        ? cliente.name_ctl
        : "Cliente no encontrado";
}


/*
 * Obtener nombre de referencia
 */
function nombreReferencia(id) {
    const referencia = obtenerReferencia(id);

    return referencia
        ? referencia.name_ref
        : "Referencia no encontrada";
}


/*
 * Obtener nombre de producto
 */
function nombreProducto(id) {
    const producto = obtenerProducto(id);

    return producto
        ? producto.name_prod
        : "Producto no encontrado";
}


/*
 * Calcular el total de un pedido
 */
function calcularTotalPedido(idOrder) {

    const detalles = obtenerDetallesPedido(idOrder);

    return detalles.reduce((total, detalle) => {

        const referencia = obtenerReferencia(
            detalle.id_reference
        );

        if (!referencia) {
            return total;
        }

        return total +
            (referencia.price * detalle.lot);

    }, 0);
}


/*
 * Calcular saldo pendiente de un cliente
 */
function saldoCliente(idCliente) {

    return COLLECTIONS
        .filter(
            cobro => cobro.id_cliente === idCliente
        )
        .reduce((saldo, cobro) => {

            return saldo +
                (
                    cobro.sale_value -
                    cobro.collection_value
                );

        }, 0);
}


/*
 * Calcular stock actual de un producto
 */
function stockProducto(idProducto) {

    const movimientos = INVENTORYS.filter(
        movimiento => movimiento.id_prod === idProducto
    );

    return movimientos.reduce(
        (stock, movimiento) => {

            return stock +
                movimiento.input_inv -
                movimiento.output_inv;

        },
        0
    );
}


/*
 * Calcular total de ingresos
 */
function totalIngresos() {

    return ACCOUNTINGS.reduce(
        (total, cuenta) => {

            return total + cuenta.input_acc;

        },
        0
    );
}


/*
 * Calcular total de gastos
 */
function totalGastos() {

    return ACCOUNTINGS.reduce(
        (total, cuenta) => {

            return total + cuenta.output_acc;

        },
        0
    );
}


/*
 * Calcular balance actual
 */
function balanceActual() {

    return totalIngresos() - totalGastos();

}


/*
 * Formato de dinero colombiano
 */
function formatoCOP(valor) {

    return new Intl.NumberFormat("es-CO", {

        style: "currency",

        currency: "COP",

        maximumFractionDigits: 0

    }).format(valor);

}