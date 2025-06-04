import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';

const OrderTracking = ({ orderId, onClose, orderDetails }) => {
  const [orderStatus, setOrderStatus] = useState({
    estado: 'procesando',
    ultimaActualizacion: new Date(),
    pasos: [
      {
        icon: Package,
        title: "Pedido Confirmado",
        description: "Tu pedido ha sido recibido y está siendo procesado",
        status: "completed",
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      },
      {
        icon: Truck,
        title: "En Camino",
        description: "Tu pedido está en camino a tu dirección",
        status: "current",
        time: "Estimado: " + new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      },
      {
        icon: CheckCircle,
        title: "Entregado",
        description: "Pendiente de entrega",
        status: "pending",
        time: "Estimado: " + new Date(Date.now() + 4 * 60 * 60 * 1000).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      }
    ]
  });

  useEffect(() => {
    console.log('OrderTracking mounted with orderId:', orderId);
    console.log('Order details:', orderDetails);

    const fetchOrderStatus = async () => {
      try {
        // Simulación de actualización de estado
        const updateStatus = () => {
          setOrderStatus(prev => {
            const newPasos = [...prev.pasos];
            const currentIndex = newPasos.findIndex(paso => paso.status === 'current');
            
            if (currentIndex < newPasos.length - 1) {
              newPasos[currentIndex].status = 'completed';
              newPasos[currentIndex + 1].status = 'current';
            }
            
            return {
              ...prev,
              pasos: newPasos,
              ultimaActualizacion: new Date()
            };
          });
        };

        // Simular actualizaciones cada 30 segundos
        const interval = setInterval(updateStatus, 30000);
        return () => clearInterval(interval);
      } catch (error) {
        console.error('Error fetching order status:', error);
      }
    };

    fetchOrderStatus();
  }, [orderId, orderDetails]);

  const getProgressPercentage = () => {
    const totalSteps = orderStatus.pasos.length;
    const completedSteps = orderStatus.pasos.filter(paso => paso.status === 'completed').length;
    return (completedSteps / totalSteps) * 100;
  };

  if (!orderId) {
    console.error('No orderId provided to OrderTracking');
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#0f172a]">Seguimiento de Pedido</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">Número de Pedido:</span>
            <span className="font-medium text-[#0f172a]">{orderId}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-[#0f172a] rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-8">
          {orderStatus.pasos.map((paso, index) => {
            const Icon = paso.icon;
            return (
              <div key={index} className="flex items-start gap-4 transition-all duration-300 hover:bg-gray-50 p-3 rounded-lg">
                <div className={`p-2 rounded-full ${
                  paso.status === 'completed' ? 'bg-green-100' :
                  paso.status === 'current' ? 'bg-blue-100' :
                  'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    paso.status === 'completed' ? 'text-green-600' :
                    paso.status === 'current' ? 'text-blue-600' :
                    'text-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-[#0f172a]">{paso.title}</h3>
                      <p className="text-sm text-gray-600">{paso.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{paso.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h3 className="font-medium text-[#0f172a] mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Detalles de Entrega
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              {orderDetails?.direccionEnvio && (
                <>
                  <p>Dirección: {orderDetails.direccionEnvio.calle}</p>
                  <p>Ciudad: {orderDetails.direccionEnvio.ciudad}</p>
                  <p>Estado: {orderDetails.direccionEnvio.estado}</p>
                  <p>Código Postal: {orderDetails.direccionEnvio.codigoPostal}</p>
                </>
              )}
              {orderDetails?.datosContacto && (
                <>
                  <p>Contacto: {orderDetails.datosContacto.nombre}</p>
                  <p>Teléfono: {orderDetails.datosContacto.telefono}</p>
                  <p>Email: {orderDetails.datosContacto.email}</p>
                </>
              )}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-[#0f172a] text-white py-3 rounded-lg hover:bg-[#1e293b] transition-colors"
          >
            Cerrar Seguimiento
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking; 