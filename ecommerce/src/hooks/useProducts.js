import { useState, useEffect } from "react"
import productService from "../lib/api/productService"

export const useProducts = () => {
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
      console.log("Token:", token)

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
        image: product.imagenes && product.imagenes.length > 0 ? product.imagenes[0].url : "https://via.placeholder.com/300",
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

  const handleRemoveFromCart = (index) => {
    const updatedCart = [...cart]
    const removed = updatedCart.splice(index, 1)
    setCart(updatedCart)
    showNotification(`${removed[0].name} eliminado del carrito`)
  }

  const clearFilters = () => {
    setSelectedCategory('todos')
    setPriceRange('todos')
  }

  return {
    products: filteredProducts,
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
  }
} 