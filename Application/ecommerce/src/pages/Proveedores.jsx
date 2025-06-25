import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useProveedores } from "../hooks/useProveedores";
import { useState, useEffect } from "react";
import { Home, User, Phone, Package, Star } from "lucide-react";
import productService from "../lib/api/productService";

const Proveedores = () => {
  const { proveedores, loading, error } = useProveedores();
  const navigate = useNavigate();
  const [imageErrors, setImageErrors] = useState({});
  const [productosPorProveedor, setProductosPorProveedor] = useState({});

  const handleNavigateToProducts = (proveedor) => {
    console.log('Navegando a productos del proveedor:', proveedor);
    navigate(`/products?proveedorId=${proveedor._id}`);
  };

  const handleImageError = (proveedorId) => {
    setImageErrors(prev => ({
      ...prev,
      [proveedorId]: true
    }));
  };

  const handleImageLoad = (proveedorId) => {
    setImageErrors(prev => ({
      ...prev,
      [proveedorId]: false
    }));
  };

  useEffect(() => {
    const fetchProductos = async () => {
      if (!proveedores || proveedores.length === 0) return;
      const nuevosProductos = {};
      await Promise.all(
        proveedores.map(async (prov) => {
          try {
            const productos = await productService.getProductsByProvider(prov._id, { status: "disponible" });
            nuevosProductos[prov._id] = productos;
          } catch (e) {
            nuevosProductos[prov._id] = [];
          }
        })
      );
      setProductosPorProveedor(nuevosProductos);
    };
    fetchProductos();
  }, [proveedores]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Proveedores
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 rounded-full">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium text-orange-700">
                {proveedores?.length || 0} proveedores
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 py-6 mt-16">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-96">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 absolute top-0 left-0"></div>
              </div>
              <p className="mt-6 text-slate-600 text-lg font-medium">Cargando proveedores...</p>
            </div>
          ) : error ? (
            <div className="text-center bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-red-100 p-12">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Error al cargar</h3>
              <p className="text-lg text-red-600 mb-8">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Reintentar
              </Button>
            </div>
          ) : proveedores.length === 0 ? (
            <div className="text-center py-20 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-orange-100">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <Package className="w-12 h-12 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">No hay proveedores</h3>
              <p className="text-lg text-slate-600">No hay proveedores disponibles en este momento</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {proveedores.map((prov) => (
                <div
                  key={prov._id}
                  className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl border border-slate-200/50 hover:border-orange-300/50 transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-1 hover:rotate-1 max-w-xs mx-auto"
                  onClick={() => handleNavigateToProducts(prov)}
                >
                  {/* Imagen con overlay mejorado */}
                  <div className="relative w-full h-28 flex items-center justify-center bg-white border-b border-slate-100">
                    {prov.imagenes && prov.imagenes.length > 0 && !imageErrors[prov._id] ? (
                      <img
                        src={prov.imagenes[0].url}
                        alt={prov.nombre}
                        className="max-h-20 max-w-[80%] object-contain mx-auto my-2 drop-shadow-sm"
                        onError={() => handleImageError(prov._id)}
                        onLoad={() => handleImageLoad(prov._id)}
                        loading="lazy"
                        style={{ background: 'white', borderRadius: '0.5rem', padding: '0.25rem' }}
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-amber-200 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-10 h-10 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Contenido de la tarjeta mejorado */}
                  <div className="p-4">
                    {/* Nombre del proveedor */}
                    <h2 className="text-lg font-bold text-slate-800 text-center mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors duration-300">
                      {prov.nombre}
                    </h2>
                    
                    {/* Tipo de servicio con diseño mejorado */}
                    <div className="flex justify-center mb-2">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow">
                        {prov.tipoServicio}
                      </span>
                    </div>
                    
                    {/* Fundación y contacto */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center">
                          <Star className="w-3.5 h-3.5 text-purple-600" />
                        </div>
                        <span className="text-xs font-medium">
                          {prov.fundacion?.nombre ? prov.fundacion.nombre : 'Sin fundación'}
                        </span>
                      </div>
                      {prov.telefono && (
                        <div className="flex items-center gap-3 text-slate-600">
                          <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
                            <Phone className="w-3.5 h-3.5 text-green-600" />
                          </div>
                          <span className="text-xs font-medium">{prov.telefono}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Descripción mejorada */}
                    <div className="mb-3">
                      <p className="text-xs text-slate-600 text-center line-clamp-3 leading-relaxed bg-slate-50 rounded-lg p-2 border border-slate-100">
                        {prov.descripcion || 'Proveedor de productos de alta calidad y excelente servicio.'}
                      </p>
                    </div>
                    
                    {/* Productos disponibles con mejor diseño */}
                    {productosPorProveedor[prov._id] && productosPorProveedor[prov._id].length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-center mb-4">
                          <div className="flex items-center gap-2 px-2 py-0.5 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full">
                            <Package className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-xs font-semibold text-emerald-700">
                              {productosPorProveedor[prov._id].length} productos disponibles
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {productosPorProveedor[prov._id].slice(0, 4).map((prod) => (
                            <div
                              key={prod._id}
                              className="bg-white border border-slate-200 rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-300 group/product"
                              title={prod.nombre}
                            >
                              <div className="flex items-center gap-1">
                                {prod.imagenes && prod.imagenes.length > 0 ? (
                                  <img
                                    src={prod.imagenes[0].url}
                                    alt={prod.nombre}
                                    className="w-6 h-6 object-cover rounded border border-slate-200 bg-white shadow-sm group-hover/product:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="w-6 h-6 bg-orange-100 rounded border border-orange-200 flex items-center justify-center">
                                    <Package className="w-3.5 h-3.5 text-orange-500" />
                                  </div>
                                )}
                                <span className="text-xs text-slate-700 font-medium truncate flex-1 group-hover/product:text-orange-600 transition-colors max-w-[70px]">
                                  {prod.nombre}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {productosPorProveedor[prov._id].length > 4 && (
                          <p className="text-center text-[11px] text-slate-500 mt-2 font-medium">
                            +{productosPorProveedor[prov._id].length - 4} productos más
                          </p>
                        )}
                      </div>
                    )}
                    
                    {/* Botón de acción con mejor diseño */}
                    <button
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${
                        prov.estado === 'rechazado'
                          ? 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:via-orange-700 hover:to-amber-600 text-white shadow-orange-200'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (prov.estado !== 'rechazado') {
                          handleNavigateToProducts(prov);
                        }
                      }}
                      disabled={prov.estado === 'rechazado'}
                    >
                      {prov.estado === 'rechazado' ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                          </svg>
                          Proveedor no disponible
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                          Explorar productos
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Proveedores;