"use client"

import { useState, useEffect } from "react"
import { Heart, ShoppingCart, Filter } from "lucide-react"
import productService from "../lib/api/productService"
import Cart from "./ui/cart"

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [cart, setCart] = useState([])
  const [notification, setNotification] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [priceRange, setPriceRange] = useState('todos')

  const categories = [
    { id: 'todos', name: 'Todos' },
    { id: 'materiales', name: 'Materiales' },
    { id: 'equipos', name: 'Equipos' },
    { id: 'alimentos', name: 'Alimentos' },
    { id: 'gaseosas', name: 'Gaseosas' },
    { id: 'otros', name: 'Otros' }
  ]

  const priceRanges = [
    { id: 'todos', name: 'Todos los precios' },
    { id: '0-50', name: 'Hasta $50' },
    { id: '50-100', name: 'De $50 a $100' },
    { id: '100+', name: 'Más de $100' }
  ]

  useEffect(() => {
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory
    const price = product.price
    let matchesPrice = true

    switch (priceRange) {
      case '0-50':
        matchesPrice = price <= 50
        break
      case '50-100':
        matchesPrice = price > 50 && price <= 100
        break
      case '100+':
        matchesPrice = price > 100
        break
      default:
        matchesPrice = true
    }

    return matchesCategory && matchesPrice
  })

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      console.log("Token:", token) // Debug

      if (!token) {
        console.log("No hay token")
        setError("No se ha encontrado un token de autenticación")
        return
      }

      console.log("Obteniendo productos de la API...")
      const data = await productService.getAllProducts()
      console.log("Datos recibidos:", data)

      if (!data || data.length === 0) {
        console.log("No se encontraron productos")
        setProducts([])
        return
      }

      const transformedData = data.map((product) => ({
        id: product._id,
        name: product.nombre,
        description: product.descripcion,
        price: product.precio,
        image: product.imagen || "https://via.placeholder.com/300",
        category: product.categoria,
        rating: 4.5,
        tags: [product.categoria],
        stock: product.stock,
        unit: product.unidad,
      }))

      console.log("Datos transformados:", transformedData)
      setProducts(transformedData)
    } catch (err) {
      console.error("Error completo:", err)
      setError("Error al cargar los productos")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }])
    showNotification(`${product.name} agregado al carrito`)
  }

  const handleToggleFavorite = (product) => {
    const updatedFavorites = favorites.some((fav) => fav.id === product.id)
      ? favorites.filter((fav) => fav.id !== product.id)
      : [...favorites, product]

    setFavorites(updatedFavorites)
    showNotification(
      `${product.name} ${updatedFavorites.length < favorites.length ? "removido de favoritos" : "agregado a favoritos"}`,
    )
  }

  const showNotification = (message) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

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
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-xl text-gray-600 mb-4">No hay productos disponibles con los filtros seleccionados</p>
              <button
                onClick={() => {
                  setSelectedCategory('todos')
                  setPriceRange('todos')
                }}
                className="text-[#0f172a] hover:text-[#1e293b] transition"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
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
        onRemoveFromCart={(index) => {
          const updatedCart = [...cart]
          const removed = updatedCart.splice(index, 1)
          setCart(updatedCart)
          showNotification(`${removed[0].name} eliminado del carrito`)
        }}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  )
}

export default Products
