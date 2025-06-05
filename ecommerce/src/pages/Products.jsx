// ecommerce/src/pages/Products.jsx (versión actualizada)
import { Heart, ShoppingCart, Filter, Plus, Check, History } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { useCarritoAvanzado } from "../hooks/useCarritoAvanzado";
import { Button } from "../components/ui/button";
import CarritoMejorado from "../components/carrito/CarritoMejorado";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const Products = () => {
  const {
    products,
    loading,
    error,
    selectedCategory,
    priceRange,
    categories,
    priceRanges,
    fetchProducts,
    setSelectedCategory,
    setPriceRange,
    clearFilters
  } = useProducts();

  const {
    cantidadItems,
    setIsCartOpen,
    agregarConNotificacion,
    estaEnCarrito,
    getCantidadEnCarrito,
    actualizarCantidad
  } = useCarritoAvanzado();

  const handleAddToCart = async (product) => {
    await agregarConNotificacion(product, 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Productos
          </h1>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              >
                {priceRanges.map(range => (
                  <option key={range.id} value={range.id}>
                    {range.name}
                  </option>
                ))}
              </select>
              {(selectedCategory !== 'todos' || priceRange !== 'todos') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="text-sm border-gray-200 hover:bg-gray-50 transition-colors duration-300"
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-8">
              <p className="text-xl mb-4">{error}</p>
              <Button 
                onClick={fetchProducts} 
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
              >
                Reintentar
              </Button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm">
              <p className="text-xl text-gray-600 mb-4">No hay productos disponibles con los filtros seleccionados</p>
              <Button
                onClick={clearFilters}
                variant="outline"
                className="text-gray-700 hover:text-gray-900 border-gray-200 hover:bg-gray-50 transition-colors duration-300"
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 text-sm text-gray-600">
                Mostrando {products.length} productos
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => {
                  const enCarrito = estaEnCarrito(product.id);
                  const cantidadEnCarrito = getCantidadEnCarrito(product.id);
                  
                  return (
                    <div 
                      key={product.id} 
                      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 hover:shadow-xl transition-all duration-300 relative group"
                    >
                      {/* Badge de stock */}
                      {product.stock <= 5 && product.stock > 0 && (
                        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full z-10">
                          ¡Últimas {product.stock}!
                        </div>
                      )}
                      
                      {product.stock === 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
                          Agotado
                        </div>
                      )}

                      {/* Imagen del producto */}
                      <div className="relative mb-4">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className={`w-full h-48 object-cover rounded-lg transition-all duration-300 ${
                            product.stock === 0 ? 'grayscale opacity-50' : 'group-hover:scale-105'
                          }`}
                        />
                        
                        {/* Botón de favoritos */}
                        <button 
                          className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-red-50 transition-colors"
                          onClick={() => {
                            console.log('Agregar a favoritos:', product.name);
                          }}
                        >
                          <Heart className="w-4 h-4 text-red-500" />
                        </button>
                      </div>

                      {/* Información del producto */}
                      <div className="space-y-2">
                        <h2 className="text-lg font-semibold text-gray-900 line-clamp-2 min-h-[3rem]">
                          {product.name}
                        </h2>
                        
                        <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
                          {product.description}
                        </p>
                        
                        {/* Precio y unidad */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xl font-bold text-gray-900">
                              {product.price} Bs.
                            </p>
                            <p className="text-xs text-gray-500">
                              por {product.unit}
                            </p>
                          </div>
                          
                          {/* Badge de categoría */}
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            {product.category}
                          </span>
                        </div>

                        {/* Stock disponible */}
                        <div className="text-sm text-gray-500">
                          Stock: {product.stock} {product.unit}s
                        </div>

                        {/* Botones de acción */}
                        <div className="flex items-center justify-between pt-2">
                          {enCarrito ? (
                            <div className="flex items-center gap-2 flex-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  actualizarCantidad(
                                    product.id || product._id,
                                    getCantidadEnCarrito(product.id || product._id) + 1
                                  );
                                }}
                                disabled={product.stock === 0}
                                className="flex-1 border-gray-200 hover:bg-gray-50 transition-colors duration-300"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Agregar más
                              </Button>
                              <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                                <Check className="w-4 h-4" />
                                {cantidadEnCarrito}
                              </div>
                            </div>
                          ) : (
                            <Button
                              onClick={() => handleAddToCart(product)}
                              disabled={product.stock === 0}
                              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300"
                            >
                              {product.stock === 0 ? (
                                'Agotado'
                              ) : (
                                <>
                                  <ShoppingCart className="w-4 h-4 mr-2" />
                                  Agregar al carrito
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Información adicional */}
              <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información de Compra
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-orange-500" />
                    <span>Envío gratis en pedidos mayores a $500</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>Cada compra apoya a fundaciones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>Productos de calidad garantizada</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <CarritoMejorado />
    </div>
  );
};

export default Products;