import DeliverySimulation from '../components/map/DeliverySimulation';
import { useNavigate, useLocation } from 'react-router-dom';

export default function DeliveryPage() {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-[#0f172a]">Simulación de Entrega</h1>
      <DeliverySimulation
        deliveryAddress={order?.direccionEnvio}
        contactInfo={order?.datosContacto}
        orderId={order?._id}
      />
    </div>
  );
}
