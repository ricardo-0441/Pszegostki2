import { cn } from "@/lib/utils";
import { Marquee } from "@/registry/magicui/marquee";

// Testimonios de clientes de la inmobiliaria
const reviews = [
  {
    name: "María López",
    username: "Propietaria",
    body: "Excelente servicio de asesoramiento para la venta de mi propiedad. Muy profesionales y atentos.",
    img: "/api/placeholder/48/48",
  },
  {
    name: "Carlos Rodríguez",
    username: "Inquilino",
    body: "Encontré mi departamento ideal gracias a Ricardo Pszegotski. El proceso de alquiler fue rápido y transparente.",
    img: "/api/placeholder/48/48",
  },
  {
    name: "Laura Martínez",
    username: "Inversora",
    body: "Me asesoraron perfectamente para comprar propiedades como inversión en Apóstoles. Muy recomendable.",
    img: "/api/placeholder/48/48",
  },
  {
    name: "Establecimiento Las Marías",
    username: "Cliente Corporativo",
    body: "Confiamos en Ricardo Pszegotski para la gestión de nuestras propiedades comerciales. Excelente atención.",
    img: "/api/placeholder/48/48",
  },
  {
    name: "Juan Pérez",
    username: "Comprador",
    body: "Compramos nuestra primera casa con su ayuda. El asesoramiento fue clave para tomar la mejor decisión.",
    img: "/api/placeholder/48/48",
  },
  {
    name: "García Construcciones",
    username: "Desarrollador",
    body: "Colaboramos con la inmobiliaria para comercializar nuestros proyectos. Gran profesionalismo y resultados.",
    img: "/api/placeholder/48/48",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-72 cursor-pointer overflow-hidden rounded-xl border p-5 mx-4",
        // Estilo claro adaptado a los colores de la inmobiliaria
        "border-gray-950/[.1] bg-white hover:bg-gray-100",
        // Estilo oscuro adaptado
        "dark:border-gray-50/[.1] dark:bg-gray-800 dark:hover:bg-gray-700",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div className="w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center text-white font-bold">
          {name.charAt(0)}
        </div>
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-gray-900 dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-blue-500 dark:text-blue-300">{username}</p>
        </div>
      </div>
      <blockquote className="mt-4 text-sm text-gray-700 dark:text-gray-300">{body}</blockquote>
    </figure>
  );
};

export function TestimonialsMarquee() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-16">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Lo que dicen nuestros clientes</h2>
      
      <Marquee pauseOnHover className="[--duration:60s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>
      
      <div className="my-8"></div>
      
      <Marquee reverse pauseOnHover className="[--duration:50s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>
      
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white dark:from-gray-900"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white dark:from-gray-900"></div>
    </div>
  );
}