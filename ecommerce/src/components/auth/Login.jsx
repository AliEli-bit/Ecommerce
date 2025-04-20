import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import api from "../../lib/api"; // Importamos la instancia de axios que has creado

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
   
    try {
      // Llamada a la API para autenticación
      const response = await api.post('/usuarios/login', {
        email: formData.email,
        password: formData.password
      });
      
      // Guardar el token recibido en localStorage
      const token = response.data.token;
      if (!token) {
        throw new Error('No se recibió un token de autenticación');
      }
      
      localStorage.setItem('token', token);
      
      // Opcional: Guardar información adicional del usuario si la API la proporciona
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
     
      // Redirigir a la página de productos después del login exitoso
      navigate("/products");
    } catch (err) {
      console.error('Error de autenticación:', err);
      
      // Manejo de diferentes tipos de errores
      if (err.response) {
        // Error de respuesta del servidor (status code diferente a 2xx)
        if (err.response.status === 401) {
          setError("Credenciales incorrectas. Por favor verifica tu email y contraseña.");
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(`Error del servidor: ${err.response.status}`);
        }
      } else if (err.request) {
        // Error de conexión (no se recibió respuesta)
        setError("No se pudo conectar con el servidor. Verifica tu conexión a internet.");
      } else {
        // Error en la configuración de la solicitud
        setError("Error al iniciar sesión. Intenta de nuevo más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-lg rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Iniciar Sesión</CardTitle>
            <CardDescription>Accede a tu cuenta con tus credenciales</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="text-sm font-medium">Correo electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                    placeholder="ejemplo@correo.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="text-sm font-medium">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              {error && <div className="text-sm text-red-500 text-center">{error}</div>}
              <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-600 transition flex items-center justify-center" disabled={loading}>
                {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                {loading ? "Iniciando..." : "Iniciar Sesión"}
                {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center">
            <p className="text-sm text-gray-600">¿No tienes una cuenta? <Link to="/register" className="text-blue-600 hover:underline">Regístrate</Link></p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}