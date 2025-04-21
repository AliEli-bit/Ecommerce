import { useState } from 'react';
import { CreditCard, CheckCircle } from 'lucide-react';
import OrderTracking from './OrderTracking';

const PaymentForm = ({ onClose, total }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTracking, setShowTracking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simular procesamiento de pago
    setTimeout(() => {
      setShowSuccess(true);
      // Mostrar el seguimiento después de 2 segundos
      setTimeout(() => {
        setShowSuccess(false);
        setShowTracking(true);
      }, 2000);
    }, 1500);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return value;
  };

  if (showTracking) {
    return <OrderTracking onClose={onClose} />;
  }

  if (showSuccess) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4">
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-2">¡Pago Exitoso!</h2>
        <p className="text-gray-600">
          Tu compra ha sido procesada correctamente.
          <br />
          Preparando el seguimiento de tu pedido...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0f172a]">Información de Pago</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 flex-1">
        <div className="relative">
          <label className="block text-sm font-medium text-[#0f172a] mb-1">
            Número de Tarjeta
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f172a] focus:border-[#0f172a]"
              maxLength={19}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0f172a] mb-1">
            Nombre en la Tarjeta
          </label>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="JUAN PEREZ"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f172a] focus:border-[#0f172a]"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#0f172a] mb-1">
              Fecha de Expiración
            </label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
              placeholder="MM/YY"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f172a] focus:border-[#0f172a]"
              maxLength={5}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0f172a] mb-1">
              CVV
            </label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="123"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f172a] focus:border-[#0f172a]"
              maxLength={3}
              required
            />
          </div>
        </div>

        <div className="mt-auto pt-4">
          <p className="text-lg font-medium text-[#0f172a] mb-4">
            Total a pagar: ${total}
          </p>
          <button
            type="submit"
            className="w-full bg-[#0f172a] text-white py-3 rounded-lg hover:bg-[#1e293b] transition font-medium"
          >
            Procesar Pago
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm; 