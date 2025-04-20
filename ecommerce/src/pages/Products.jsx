"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
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

  useEffect(() => {
    fetchProducts()
  }, [])

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

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Productos
        </h1>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p>{error}</p>
            <button onClick={fetchProducts} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              Reintentar
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-xl text-gray-600 mb-4">No hay productos disponibles</p>
            <p className="text-gray-500">Esto puede deberse a:</p>
            <ul className="list-disc list-inside text-gray-500 mt-2">
              <li>No hay productos registrados en el sistema</li>
              <li>No tienes acceso a ver los productos</li>
              <li>Hay un problema de conexión con el servidor</li>
            </ul>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-sm text-gray-600">{product.description}</p>
                <p className="text-blue-600 font-bold mt-2">${product.price}</p>
                <div className="mt-4 flex justify-between">
                  <button onClick={() => handleToggleFavorite(product)} className="text-red-500">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sliding Cart Component */}
      <Cart
        cart={cart}
        onRemoveFromCart={(index) => {
          const updatedCart = [...cart]
          const removed = updatedCart.splice(index, 1)
          setCart(updatedCart)
          showNotification(`${removed[0].name} eliminado del carrito`)
        }}
        isOpen={isCartOpen}
        onClose={toggleCart}
      />
    </div>
  )
}

export default Products
