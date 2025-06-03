import { Link } from "react-router-dom";
import { Anchor, ShoppingBag, ArrowRight, Gift, Users, TrendingUp, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ImageCarousel from "@/components/image-carousel";
import Header from "@/components/layout/Header";

export default function Home() {
  const carouselImages = [
     {
      src: "https://scontent.fsrz1-2.fna.fbcdn.net/v/t39.30808-6/485723814_993465302896503_5361188402991283276_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CHv9Vu2dOgYQ7kNvwE5LdtY&_nc_oc=AdnU-bdHFdKQd2gtB51dQWkH2634cjwcDYxiKplhVPRaePQS8XAMe5V6iGjUEWt5Erg&_nc_zt=23&_nc_ht=scontent.fsrz1-2.fna&_nc_gid=-9N1mPZ78rb6fkn-n_dTyw&oh=00_AfK8rVXUZQEs0Nn0q9nahgpOOrkN1L-SSpA7Vs4Pk9Qx-Q&oe=683F8CBA",
      alt: "Reforestación y plantación de árboles tras un incendio"
    },
    {
      src: "https://scontent.fsrz1-2.fna.fbcdn.net/v/t39.30808-6/474559056_1383157843058938_1036400792571714168_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_ohc=Nd9UxHIkKUUQ7kNvwFXmLnv&_nc_oc=Adkb2Q6uWFC_qr9ADGWoZQTGYKdEaHV38rcfejI8xYqstJdb89B8Ox_ajFIAaO7lMLY&_nc_zt=23&_nc_ht=scontent.fsrz1-2.fna&_nc_gid=gL1nV3UEDpOVKxrde5GR4Q&oh=00_AfJ3WoGizyvNrDU_9n2zzSGK0IkbGXP6i1bU2c-8bvR-fg&oe=683FA079",
      alt: "Voluntarios apagando un incendio forestal"
    },
    {
      src: "https://images.unsplash.com/photo-1617078306809-9e2e046c6b12?auto=format&fit=crop&w=1470&q=80",
      alt: "Voluntarios rescatando animales afectados por incendios"
    },
    {
      src: "https://images.unsplash.com/photo-1618169229254-22c7ff9ab093?auto=format&fit=crop&w=1470&q=80",
      alt: "Guardabosques y voluntarios trabajando juntos para proteger la fauna"
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-orange-50 to-white">
          <div className="container px-4 md:px-6 mx-auto"> {/* Added mx-auto */}
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-800">
              Compra con propósito
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-800">
              Cada compra ayuda a proteger nuestro tierra
            </h1>
            <p className="text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Descubre productos eco-amigables mientras apoyas proyectos que restauran la Tierra.
              El 100% de nuestras ganancias se destinan directamente a la conservación ambiental.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white">
                Comprar ahora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                Conoce nuestras fundaciones
              </Button>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[600px] relative">
            <ImageCarousel images={carouselImages} />
            <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
              <p className="text-sm font-medium text-orange-700">+1000 productos</p>
              <p className="text-xs text-gray-500">Ayudando a 25+ fundaciones</p>
            </div>
          </div>
        </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto"> {/* Added mx-auto */}
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Cómo funciona
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Un modelo simple que maximiza el impacto de cada compra
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <Card className="border-2 border-orange-100">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <ShoppingBag className="h-6 w-6 text-orange-700" />
                    </div>
                    <h3 className="text-xl font-bold">Compra productos</h3>
                    <p className="text-gray-500 text-sm">
                      Explora nuestra selección de productos de alta calidad y elige los que más te gusten.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-orange-100">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Gift className="h-6 w-6 text-orange-700" />
                    </div>
                    <h3 className="text-xl font-bold">Recibe tu pedido</h3>
                    <p className="text-gray-500 text-sm">
                      Disfruta de productos de calidad entregados directamente a tu puerta.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-orange-100">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Anchor className="h-6 w-6 text-orange-700" />
                    </div>
                    <h3 className="text-xl font-bold">Genera impacto</h3>
                    <p className="text-gray-500 text-sm">
                      El 100% de nuestras ganancias se destinan a fundaciones que ayudan a quienes más lo necesitan.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-orange-50">
          <div className="container px-4 md:px-6 mx-auto"> {/* Added mx-auto */}
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Productos destacados
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Cada producto apoya una causa específica
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Link to="#" key={item} className="group relative overflow-hidden rounded-lg border">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={`/placeholder.svg?height=400&width=400&text=Producto ${item}`}
                      alt={`Producto ${item}`}
                      className="object-cover transition-transform group-hover:scale-105 aspect-square"
                    />
                  </div>
                  <div className="p-4 bg-white">
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Fundación Esperanza</Badge>
                    <h3 className="text-lg font-bold mt-2">Producto Artesanal {item}</h3>
                    <p className="text-sm text-gray-500 mt-1">Hecho a mano por artesanos locales</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-bold">$29.99</span>
                      <Button size="sm" variant="outline" className="rounded-full">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Añadir
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex justify-center">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                Ver todos los productos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto"> {/* Added mx-auto */}
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Fundaciones que apoyamos
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Conoce a las organizaciones que están cambiando vidas gracias a tu apoyo
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <Card key={item} className="overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={`/placeholder.svg?height=300&width=500&text=Fundación ${item}`}
                      alt={`Fundación ${item}`}
                      className="object-cover w-full"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold">Fundación Esperanza {item}</h3>
                    <p className="text-sm text-gray-500 mt-2">
                        Trabajando para mejorar la calidad de vida de niños en situación de vulnerabilidad.
                    </p>
                    <div className="flex items-center mt-4 space-x-4">
                        <div className="flex flex-col">
                        <span className="text-2xl font-bold text-orange-600">+1000</span>
                        <span className="text-xs text-gray-500">Beneficiarios</span>
                        </div>
                        <div className="flex flex-col">
                        <span className="text-2xl font-bold text-orange-600">5</span>
                        <span className="text-xs text-gray-500">Años de trabajo</span>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                        Conocer más
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center">
              <Button size="lg" variant="outline">
                Ver todas las fundaciones
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-orange-800 text-white">
          <div className="container px-4 md:px-6 mx-auto"> {/* Added mx-auto */}
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Nuestro impacto hasta ahora
                </h2>
                <p className="md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed opacity-90">
                  Gracias a clientes como tú, hemos logrado un impacto significativo en comunidades vulnerables.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white/10 border-0">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Users className="h-10 w-10 mb-4" />
                    <span className="text-4xl font-bold">10,000+</span>
                    <span className="text-sm opacity-90">Personas beneficiadas</span>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 border-0">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Gift className="h-10 w-10 mb-4" />
                    <span className="text-4xl font-bold">5,000+</span>
                    <span className="text-sm opacity-90">Productos vendidos</span>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 border-0">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Heart className="h-10 w-10 mb-4" />
                    <span className="text-4xl font-bold">25+</span>
                    <span className="text-sm opacity-90">Fundaciones apoyadas</span>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 border-0">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <TrendingUp className="h-10 w-10 mb-4" />
                    <span className="text-4xl font-bold">$100K+</span>
                    <span className="text-sm opacity-90">Donados a causas</span>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto"> {/* Added mx-auto */}
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Únete a nuestra comunidad
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Suscríbete para recibir actualizaciones sobre nuevos productos y el impacto que estamos generando juntos
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Ingresa tu correo electrónico"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                    Suscribirse
                  </Button>
                </form>
                <p className="text-xs text-gray-500">
                  Al suscribirte, aceptas nuestra{" "}
                  <Link to="#" className="underline underline-offset-2">
                    Política de Privacidad
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-gray-50">
        <div className="container flex flex-col gap-6 py-8 px-4 md:px-6 mx-auto"> {/* Added mx-auto */}
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-orange-600" />
                <span className="text-xl font-bold">CompraConCausa</span>
              </div>
              <p className="text-sm text-gray-500">
                Transformando el comercio en impacto social positivo, un producto a la vez.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Productos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="#" className="text-gray-500 hover:text-gray-900">Todos los productos</Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-500 hover:text-gray-900">Artesanías</Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-500 hover:text-gray-900">Ropa</Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-500 hover:text-gray-900">Accesorios</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Fundaciones</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="#" className="text-gray-500 hover:text-gray-900">Nuestras fundaciones</Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-500 hover:text-gray-900">Impacto social</Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-500 hover:text-gray-900">Historias de éxito</Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-500 hover:text-gray-900">Colabora con nosotros</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Contacto</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="#" className="text-gray-500 hover:text-gray-900">Sobre nosotros</Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-500 hover:text-gray-900">Preguntas frecuentes</Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-500 hover:text-gray-900">Contacto</Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-500 hover:text-gray-900">Política de privacidad</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row items-center justify-between border-t pt-6">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} CompraConCausa. Todos los derechos reservados.
            </p>
            <div className="flex gap-4">
              <Link to="#" className="text-gray-500 hover:text-gray-900">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link to="#" className="text-gray-500 hover:text-gray-900">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.315zm-.081 1.802h-.078c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.078c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}