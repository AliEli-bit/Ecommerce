import React, { useState } from 'react';
import { useCarrito } from '../../context/CarritoContext';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ onSuccess, total, desglose, onClose }) => {
  const { crearPago, confirmarPago } = useCarrito();
  const navigate = useNavigate();

  const [datosEnvio, setDatosEnvio] = useState({
    nombre: '', email: '', telefono: '',
    calle: '', ciudad: '', estado: '', codigoPostal: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('info'); // 'info' -> 'payment' -> 'success'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatosEnvio((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simular pago exitoso
      const ordenSimulada = { id: 'orden_ficticia' };

      toast.success('¡Pago realizado con éxito!', {
        position: "top-right",
        autoClose: 5000,
      });

      setStep('success');
      setTimeout(() => {
        onSuccess(ordenSimulada);
        navigate('/delivery-simulation');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="p-6 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#0f172a] mb-2">¡Pago Exitoso!</h2>
        <p className="text-gray-600 mb-4">Tu compra ha sido procesada correctamente.</p>
        <button
          onClick={onClose}
          className="bg-[#0f172a] text-white px-6 py-2 rounded-lg hover:bg-[#1e293b] transition"
        >
          Cerrar
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-[#0f172a]">
          {step === 'info' ? 'Información de Envío' : 'Pago Simulado'}
        </h2>
        <button onClick={onClose} type="button" className="text-gray-500 hover:text-gray-700">✕</button>
      </div>

      {step === 'info' && (
        <>
          {['nombre', 'email', 'telefono', 'calle', 'ciudad', 'estado', 'codigoPostal'].map((campo, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium text-[#0f172a] mb-1 capitalize">{campo}</label>
              <input
                type={campo === 'email' ? 'email' : 'text'}
                name={campo}
                value={datosEnvio[campo]}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f172a] focus:border-[#0f172a]"
                required
              />
            </div>
          ))}
        </>
      )}

      {step === 'payment' && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${desglose.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Envío:</span>
            <span>{desglose.envio === 0 ? 'Gratis' : `$${desglose.envio.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <div className="mt-auto pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0f172a] text-white py-3 rounded-lg hover:bg-[#1e293b] transition font-medium flex items-center justify-center"
          onClick={() => {
            if (step === 'info') setStep('payment');
          }}
        >
          {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
          {step === 'info' ? 'Continuar al Pago' : `Simular Pago de $${total.toFixed(2)}`}
        </button>

        {step === 'payment' && (
          <button
            type="button"
            onClick={() => setStep('info')}
            className="mt-2 w-full text-[#0f172a] border border-gray-300 py-2 rounded-lg hover:bg-gray-100"
            disabled={loading}
          >
            Regresar
          </button>
        )}
      </div>
    </form>
  );
};

export default function StripeCheckout({ isOpen, onClose, onSuccess }) {
  const { total } = useCarrito();

  if (!isOpen) return null;

  const desglose = {
    subtotal: total,
    envio: total > 500 ? 0 : 50,
    total: total + (total > 500 ? 0 : 50),
  };

  return (
    <div className="w-full p-4">
      <ToastContainer />
      <CheckoutForm
        onSuccess={onSuccess}
        total={desglose.total}
        desglose={desglose}
        onClose={onClose}
      />
    </div>
  );
}
