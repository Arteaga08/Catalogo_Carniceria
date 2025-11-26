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
    src: "/images/Carrusel/homepage.png",
    alt: "Oferta Semanal",
    link: "/products/arrachera",
  },
  {
    id: 2,
    src: "/images/Carniceria/CarneRes/Tomahawk.png",
    alt: "Cortes Premium",
    link: "/category/cortes-premium",
  },
  {
    id: 3,
    src: "/images/Carniceria/CarneRes/Cowboy.png",
    alt: "Carne Molida",
    link: "/products/carne-molida",
  },
  {
    id: 4,
    src: "/images/Carniceria/CarneRes/Porter-house.png",
    alt: "Paquetes Familiares",
    link: "/category/paquetes",
  },
  {
    id: 5,
    src: "/images/Carniceria/CarneRes/milanesa-res.png",
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
          delay: 3000,
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
