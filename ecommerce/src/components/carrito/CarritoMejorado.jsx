// ecommerce/src/components/carrito/CarritoMejorado.jsx
import { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingCart, CreditCard, Package } from 'lucide-react';
import { Button } from '../ui/button';
import { useCarritoAvanzado } from '../../hooks/useCarritoAvanzado';
import StripeCheckout from '../checkout/StripeCheckout';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';


// Inicializar Stripe (con tu clave pública de entorno)
const stripePromise = loadStripe('pk_test_51RUpeqGbqqKeGkYdc0b9t7UGY6JZjAnVo7oEQO23HBJnLJmC7H8LxzIFfreHLjdWCHQuPyM3m2XsaNqN7lwKIoNQ00Y0ENiARD');

const CarritoMejorado = () => {
  const {
    items,
    total,
    cantidadItems,
    loading,
    error,
    isCartOpen,
    setIsCartOpen,
    totales,
    actualizarCantidad,
    eliminarConNotificacion,
    vaciarCarrito,
    notifications
  } = useCarritoAvanzado();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showDeliverySimulation, setShowDeliverySimulation] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();

  const handleCantidadChange = async (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      const item = items.find(item => 
        (item.producto._id || item.producto.id) === productoId
      );
      if (item) {
        await eliminarConNotificacion(productoId, item.producto.nombre);
      }
    } else {
      await actualizarCantidad(productoId, nuevaCantidad);
    }
  };

  const handleSuccess = (orden) => {
    const formattedOrder = {
      _id: orden._id,
      direccionEnvio: {
        calle: orden.direccionEnvio?.calle || '',
        ciudad: orden.direccionEnvio?.ciudad || '',
        estado: orden.direccionEnvio?.estado || '',
        codigoPostal: orden.direccionEnvio?.codigoPostal || '',
      },
      datosContacto: {
        nombre: orden.datosContacto?.nombre || '',
        email: orden.datosContacto?.email || '',
        telefono: orden.datosContacto?.telefono || '',
      }
    };
    // Redirige a la página de entrega y pasa la orden
    navigate('/delivery', { state: { order: formattedOrder } });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const CartButton = () => (
    <button
      onClick={() => setIsCartOpen(true)}
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-40 flex items-center gap-2"
    >
      <ShoppingCart className="w-6 h-6" />
      {cantidadItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
          {cantidadItems}
        </span>
      )}
    </button>
  );

  const Notifications = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`px-4 py-2 rounded-lg shadow-lg text-white text-sm transition-all duration-300 ${
            notification.type === 'error' 
              ? 'bg-red-500' 
              : 'bg-green-500'
          }`}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );

  if (!isCartOpen && !isCheckoutOpen) {
    return (
      <>
        <CartButton />
        <Notifications />
      </>
    );
  }

  return (
    <>
      <Notifications />

      {/* Fondo opaco al hacer clic para cerrar */}
      {!isCheckoutOpen && (
        <div 
          className="fixed inset-0.5 z-40"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Panel derecho */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Encabezado */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {isCheckoutOpen ? 'Finalizar Compra' : 'Carrito de Compras'}
          </h2>
          <button
            onClick={() => {
              if (isCheckoutOpen) {
                setIsCheckoutOpen(false);
              } else {
                setIsCartOpen(false);
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto">
          {isCheckoutOpen ? (
            <div className="p-6">
              <Elements stripe={stripePromise}>
                <StripeCheckout
                  isOpen={isCheckoutOpen}
                  onClose={() => setIsCheckoutOpen(false)}
                  onSuccess={handleSuccess}
                  total={totales.total}
                  desglose={totales}
                />
              </Elements>
            </div>
          ) : (
            loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">
                <p>{error}</p>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
                <Package className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg mb-2">Tu carrito está vacío</p>
                <p className="text-sm text-center">
                  Agrega algunos productos para continuar con tu compra
                </p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.producto._id || item.producto.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.producto.imagenes && item.producto.imagenes.length > 0 ? (
                        <img
                          src={item.producto.imagenes[0].url}
                          alt={item.producto.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.producto.nombre}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.precioUnitario)} por {item.producto.unidad}
                      </p>
                      <p className="text-sm font-medium text-blue-600">
                        Subtotal: {formatPrice(item.subtotal)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCantidadChange(
                          item.producto._id || item.producto.id,
                          item.cantidad - 1
                        )}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <span className="w-12 text-center font-medium">
                        {item.cantidad}
                      </span>
                      
                      <button
                        onClick={() => handleCantidadChange(
                          item.producto._id || item.producto.id,
                          item.cantidad + 1
                        )}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => eliminarConNotificacion(
                          item.producto._id || item.producto.id,
                          item.producto.nombre
                        )}
                        className="p-1 hover:bg-red-100 text-red-500 rounded transition-colors ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Pie de carrito (solo cuando no está en checkout) */}
        {!isCheckoutOpen && items.length > 0 && (
          <div className="border-t p-6 space-y-4 bg-gray-50">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(totales.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío:</span>
                <span>
                  {totales.envio === 0 ? (
                    <span className="text-green-600 font-medium">¡Gratis!</span>
                  ) : (
                    formatPrice(totales.envio)
                  )}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-blue-600">{formatPrice(totales.total)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Proceder al Pago
                </div>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setIsCartOpen(false)}
                className="w-full"
              >
                Continuar Comprando
              </Button>
              
              {items.length > 1 && (
                <Button
                  variant="ghost"
                  onClick={vaciarCarrito}
                  className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  Vaciar Carrito
                </Button>
              )}
            </div>

            {totales.subtotal < 500 && (
              <div className="text-xs text-gray-500 text-center p-2 bg-yellow-50 rounded">
                Agrega {formatPrice(500 - totales.subtotal)} más para obtener envío gratuito
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CarritoMejorado;
