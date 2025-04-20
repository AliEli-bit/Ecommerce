"use client"
import { X, ShoppingCart } from "lucide-react"

const Cart = ({ cart, onRemoveFromCart, isOpen, onClose }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <>
      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-xl z-50 w-full md:w-96 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Carrito</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 h-[calc(100vh-64px)] flex flex-col">
          {cart.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Tu carrito está vacío.</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto">
                <ul>
                  {cart.map((item, index) => (
                    <li key={index} className="mb-4 border-b pb-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-blue-500 font-bold">${item.price * item.quantity}</p>
                          <button onClick={() => onRemoveFromCart(index)} className="text-red-500 text-sm mt-1">
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="font-bold text-lg text-right mb-4">Total: ${total.toFixed(2)}</div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                  Proceder al pago
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cart Toggle Button */}
      <button
        onClick={onClose}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg z-40 hover:bg-blue-700 transition"
      >
        <ShoppingCart className="w-6 h-6" />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
            {cart.length}
          </span>
        )}
      </button>
    </>
  )
}

export default Cart
