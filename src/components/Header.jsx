import { useState } from 'react'
import PropTypes from 'prop-types'

export default function Header({ cart, removeFromCart, increaseQuantity, decreaseQuantity, removeAllCart }) {

    // Estado para abrir/cerrar el carrito con click o teclado (necesario en mobile,
    // donde el :hover de CSS no funciona).
    const [isCartOpen, setIsCartOpen] = useState(false)

    const cartTotal = () => cart.reduce((total, item) => total + (item.quantity * item.price), 0)

    const generatePDF = async () => {
        // jsPDF es pesado (~600 kB): lo cargamos de forma diferida solo al generar
        // la factura, para no penalizar la carga inicial de la app (code-splitting).
        const { default: jsPDF } = await import('jspdf')
        await import('jspdf-autotable')

        // Crear nuevo documento PDF
        const doc = new jsPDF()
        const today = new Date()
        const invoiceNumber = `INV-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000)}`

        // Configurar fuente y tamaño
        doc.setFont("helvetica")
        doc.setFontSize(20)
        doc.text("FACTURA", 105, 20, { align: "center" })

        // Información de la empresa
        doc.setFontSize(12)
        doc.text("BatteryBA S.A.", 20, 40)
        doc.text("Av. Libertador 1234", 20, 50)
        doc.text("Buenos Aires, Argentina", 20, 60)
        doc.text("CUIT: 30-12345678-9", 20, 70)

        // Información de la factura
        doc.text(`Número: ${invoiceNumber}`, 140, 40)
        doc.text(`Fecha: ${today.toLocaleDateString()}`, 140, 50)

        // Crear tabla de productos
        const tableColumn = ["Producto", "Cantidad", "Precio Unit.", "Subtotal"]
        const tableRows = cart.map(item => [
            item.name,
            item.quantity,
            `$${item.price}`,
            `$${(item.quantity * item.price).toFixed(2)}`
        ])

        // Agregar tabla al PDF
        doc.autoTable({
            startY: 80,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [233, 148, 1] }, // Color naranja de la marca
            styles: { fontSize: 10 }
        })

        // Calcular Y para los totales (después de la tabla)
        const finalY = doc.previousAutoTable.finalY || 150

        // Agregar totales
        const subtotal = cartTotal()
        const iva = subtotal * 0.21
        const total = subtotal + iva

        doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 140, finalY + 20)
        doc.text(`IVA (21%): $${iva.toFixed(2)}`, 140, finalY + 30)
        doc.setFontSize(14)
        doc.text(`Total: $${total.toFixed(2)}`, 140, finalY + 40)

        // Guardar el PDF
        doc.save(`factura-${invoiceNumber}.pdf`)
    }

    return (
        <>
            <header className="py-5 header">
                <div className="container-xl">
                    <div className="row justify-content-center justify-content-md-between">
                        <div className="col-8 col-md-3">
                            <a href="/" aria-label="BatteryBA - Inicio">
                                <img className="img-fluid" src="/img/logo.svg" alt="Logo de BatteryBA" />
                            </a>
                        </div>
                        <nav className="col-md-6 a mt-5 d-flex align-items-start justify-content-end">
                            <div
                                className={`carrito ${cart.length > 0 ? 'has-items' : ''} ${isCartOpen ? 'open' : ''}`}
                            >
                                <button
                                    type="button"
                                    className="carrito-toggle"
                                    aria-label="Abrir carrito de compras"
                                    aria-expanded={isCartOpen}
                                    aria-controls="carrito"
                                    onClick={() => setIsCartOpen(open => !open)}
                                >
                                    <img className="img-fluid" src="/img/carrito.png" alt="" aria-hidden="true" />
                                    {cart.length > 0 && (
                                        <span className="carrito-badge">{cart.reduce((n, item) => n + item.quantity, 0)}</span>
                                    )}
                                </button>

                                <div id="carrito" className="bg-white p-3">
                                {cart.length === 0 ? (
                                    <p className="text-center">El carrito esta vacio</p>
                                ) : (
                                    <>
                                    <table className="w-100 table">
                                    <thead>
                                        <tr>
                                            <th>Imagen</th>
                                            <th>Nombre</th>
                                            <th>Precio</th>
                                            <th>Cantidad</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.map(battery => (
                                            <tr key={battery.id}>
                                                <td>
                                                    <img
                                                        className="img-fluid"
                                                        src={`/img/${battery.image}.jpg`}
                                                        alt={`Batería ${battery.name}`}
                                                    />
                                                </td>
                                                <td>{battery.name}</td>
                                                <td className="fw-bold">
                                                    ${battery.price}
                                                </td>
                                                <td className="flex align-items-start gap-4">
                                                    <button
                                                        type="button"
                                                        className="btn btn-dark"
                                                        aria-label={`Disminuir cantidad de ${battery.name}`}
                                                        onClick={() => decreaseQuantity(battery.id)}
                                                    >
                                                        -
                                                    </button>
                                                    {battery.quantity}
                                                    <button
                                                        type="button"
                                                        className="btn btn-dark"
                                                        aria-label={`Aumentar cantidad de ${battery.name}`}
                                                        onClick={() => increaseQuantity(battery.id)}
                                                    >
                                                        +
                                                    </button>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-danger"
                                                        type="button"
                                                        aria-label={`Eliminar ${battery.name} del carrito`}
                                                        onClick={() => removeFromCart(battery.id)}
                                                    >
                                                        X
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    </table>
                                    <p className="text-end">Total pagar: <span className="fw-bold">${cartTotal()}</span></p>

                                    
                                        <button
                                            className="btn btn-dark w-100 mt-3 p-2"
                                            onClick={() => removeAllCart()}
                                        >
                                            Vaciar Carrito
                                        </button>
                                        <button
                                            className="btn btn-dark w-100 mt-3 p-2"
                                            onClick={generatePDF}
                                        >
                                            Generar Factura
                                        </button>
                                    
                                    </>
                                )}
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>
        </>
    )
}

Header.propTypes = {
    cart: PropTypes.array.isRequired,
    removeFromCart: PropTypes.func.isRequired,
    increaseQuantity: PropTypes.func.isRequired,
    decreaseQuantity: PropTypes.func.isRequired,
    removeAllCart: PropTypes.func.isRequired,
}