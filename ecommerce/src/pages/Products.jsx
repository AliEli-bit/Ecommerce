"use client"

import { Heart, ShoppingCart, Filter } from "lucide-react"
import Cart from "./ui/cart"
import { useProducts } from "../hooks/useProducts"

const Products = () => {
  const {
    products,
    loading,
    error,
    cart,
    notification,
    isCartOpen,
    selectedCategory,
    priceRange,
    categories,
    priceRanges,
    fetchProducts,
    handleAddToCart,
    handleToggleFavorite,
    handleRemoveFromCart,
    setIsCartOpen,
    setSelectedCategory,
    setPriceRange,
    clearFilters
  } = useProducts()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#0f172a]">
            Productos
          </h1>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-[#0f172a] hover:bg-gray-100 rounded-full transition"
          >
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white shadow-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#0f172a]" />
              <span className="text-sm font-medium text-[#0f172a]">Filtrar por:</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f172a] focus:border-[#0f172a]"
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
                className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f172a] focus:border-[#0f172a]"
              >
                {priceRanges.map(range => (
                  <option key={range.id} value={range.id}>
                    {range.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        {notification && (
          <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {notification}
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0f172a]"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              <p>{error}</p>
              <button onClick={fetchProducts} className="mt-4 px-4 py-2 bg-[#0f172a] text-white rounded hover:bg-[#1e293b] transition">
                Reintentar
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-xl text-gray-600 mb-4">No hay productos disponibles con los filtros seleccionados</p>
              <button
                onClick={clearFilters}
                className="text-[#0f172a] hover:text-[#1e293b] transition"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h2 className="text-lg font-semibold text-[#0f172a]">{product.name}</h2>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <p className="text-[#0f172a] font-bold mt-2">${product.price}</p>
                  <div className="mt-4 flex justify-between">
                    <button 
                      onClick={() => handleToggleFavorite(product)} 
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-[#0f172a] text-white px-4 py-2 rounded-lg hover:bg-[#1e293b] transition"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart Component */}
      <Cart
        cart={cart}
        onRemoveFromCart={handleRemoveFromCart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  )
}

export default Products
