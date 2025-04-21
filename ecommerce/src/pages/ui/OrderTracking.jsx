import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

const OrderTracking = ({ orderId = "OD-2024-001", onClose }) => {
  const steps = [
    {
      icon: Package,
      title: "Pedido Confirmado",
      description: "Tu pedido ha sido recibido y está siendo procesado",
      status: "completed",
      time: "Hoy, 10:30 AM"
    },
    {
      icon: Truck,
      title: "En Camino",
      description: "Tu pedido está en camino a tu dirección",
      status: "current",
      time: "Estimado: Hoy, 2:30 PM"
    },
    {
      icon: CheckCircle,
      title: "Entregado",
      description: "Pendiente de entrega",
      status: "pending",
      time: "Estimado: Hoy, 4:00 PM"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 border border-gray-200">
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
            <div className="h-full w-1/2 bg-[#0f172a] rounded-full transition-all duration-500"></div>
          </div>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex items-start gap-4 transition-all duration-300 hover:bg-white/80 p-3 rounded-lg">
                <div className={`p-2 rounded-full ${
                  step.status === 'completed' ? 'bg-green-100' :
                  step.status === 'current' ? 'bg-blue-100' :
                  'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    step.status === 'completed' ? 'text-green-600' :
                    step.status === 'current' ? 'text-blue-600' :
                    'text-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-[#0f172a]">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{step.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 space-y-4">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-gray-100">
            <h3 className="font-medium text-[#0f172a] mb-2">Detalles de Entrega</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Dirección: Av. Principal #123, Ciudad</p>
              <p>Contacto: +1 234 567 890</p>
              <p>Instrucciones: Dejar en recepción</p>
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