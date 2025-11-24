import React from "react";
import { Link } from "react-router-dom";
// ⬅️ Ya NO importamos 'Navigation'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules"; // Solo Autoplay y Pagination

// ⬅️ Ya NO importamos el CSS de navegación
import "swiper/css";
// import 'swiper/css/navigation'; // 🛑 QUITAR ESTA LÍNEA
import "swiper/css/pagination";

// 5+ Imágenes estáticas de ejemplo
const carouselImages = [
  {
    id: 1,
    src: "https://via.placeholder.com/1200x400/8B0000/FFFFFF?text=OFERTA+DE+ARRRRACHERA",
    alt: "Oferta Semanal",
    link: "/products/arrachera",
  },
  {
    id: 2,
    src: "https://via.placeholder.com/1200x400/DC143C/FFFFFF?text=CORTES+FINOS+PARA+PARRILLADA",
    alt: "Cortes Premium",
    link: "/category/cortes-premium",
  },
  {
    id: 3,
    src: "https://via.placeholder.com/1200x400/A52A2A/FFFFFF?text=CARNE+MOLIDA+FRESCA+DIARIA",
    alt: "Carne Molida",
    link: "/products/carne-molida",
  },
  {
    id: 4,
    src: "https://via.placeholder.com/1200x400/B22222/FFFFFF?text=PROMOCION+PAQUETES+FAMILIARES",
    alt: "Paquetes Familiares",
    link: "/category/paquetes",
  },
  {
    id: 5,
    src: "https://via.placeholder.com/1200x400/CD5C5C/FFFFFF?text=POLLO+Y+CERDO+FRESCURA+GARANTIZADA",
    alt: "Pollo y Cerdo",
    link: "/category/pollo",
  },
];

const ImageCarousel = () => {
  return (
    <div className="w-full">
      <Swiper
        // ⬅️ Módulos ahora solo incluyen Autoplay y Pagination
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        // CONFIGURACIÓN DEL AUTO-PLAY
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        // Configuraciones de UI
        pagination={{ clickable: true }} // Mantenemos los puntos de paginación
        // navigation={true} // 🛑 QUITAR ESTA PROPIEDAD

        className="mySwiper"
      >
        {carouselImages.map((slide) => (
          <SwiperSlide key={slide.id}>
            <Link to={slide.link} className="block cursor-pointer">
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-[99vh] sm:h-80 md:h-96 lg:h-[480px] xl:h-[560px] object-cover"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageCarousel;
