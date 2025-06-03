import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500" />
          <span className="text-xl font-bold">Alas Orientales</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link to="/" className="text-sm font-medium hover:underline underline-offset-4">
            Inicio
          </Link>
          <Link to="/about" className="text-sm font-medium hover:underline underline-offset-4">
            Sobre Nosotros
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden md:block">
            <Button>Iniciar Sesión</Button>
          </Link>
          <Link to="/register" className="hidden md:block">
            <Button>Registarme</Button>
          </Link>
          <Button variant="outline" size="icon" className="md:hidden">
            <ShoppingBag className="h-5 w-5" />
            <span className="sr-only">Carrito</span>
          </Button>
        </div>
      </div>
    </header>
  );
} 