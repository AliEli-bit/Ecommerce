import React, { useEffect, useState } from "react";
import { Receipt, ShoppingCart, Calendar } from "lucide-react";
import { Button } from "../components/ui/button";

// Simulación de datos de compras
const comprasEjemplo = [
  {
    id: "ORD-001",
    fecha: "2024-06-02",
    total: 81.32,
    productos: [
      { nombre: "Milanesa", cantidad: 1, precio: 27 },
      // ...otros productos
    ],
    estado: "Pagado",
  },
  // Puedes agregar más objetos para simular más compras
];

const HistorialCompras = () => {
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    // Aquí deberías cargar el historial real del usuario (API, contexto, etc)
    setCompras(comprasEjemplo); // Simulación
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Receipt className="w-8 h-8 text-[#0f172a]" />
        <h2 className="text-2xl font-bold text-[#0f172a]">Historial de Compras</h2>
      </div>
      {compras.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No tienes compras registradas aún.
        </div>
      ) : (
        <div className="space-y-6">
          {compras.map((compra) => (
            <div key={compra.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">{compra.id}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{compra.fecha}</span>
                </div>
              </div>
              <div className="mb-2">
                <span className="font-medium">Estado:</span> {compra.estado}
              </div>
              <div className="mb-2">
                <span className="font-medium">Total:</span> ${compra.total.toFixed(2)}
              </div>
              <div className="mb-2">
                <span className="font-medium">Productos:</span>
                <ul className="list-disc ml-6 mt-1 text-sm text-gray-700">
                  {compra.productos.map((prod, idx) => (
                    <li key={idx}>
                      {prod.nombre} x{prod.cantidad} (${prod.precio})
                    </li>
                  ))}
                </ul>
              </div>
              <Button className="mt-2" variant="outline" size="sm">
                Ver detalles
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorialCompras; 