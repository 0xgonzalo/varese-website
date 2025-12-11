'use client';

import { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const tourDates = [
  {
    venue: "DUNEPARK",
    city: "BUENOS AIRES",
    date: "31",
    month: "DIC",
    day: "LUN",
  },
  {
    venue: "CLUB TRI",
    city: "MAR DEL PLATA",
    date: "02",
    month: "ENE",
    day: "MIE",
  },
];

export default function Tour() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % tourDates.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + tourDates.length) % tourDates.length);
  };

  return (
    <div id="tour" className="relative w-full bg-black">
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-2 md:px-8 py-12 md:py-20">
        {/* Tour Title */}
        <div className="mb-6 md:mb-16 flex items-center justify-center gap-4">
          <h2 className="text-4xl md:text-6xl font-bold tracking-wider text-white">
            TOUR
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full max-w-7xl">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 md:left-0 top-1/2 z-20 -translate-y-1/2 transform rounded-full border-2 border-white p-2 md:p-3 text-white transition-all hover:bg-white hover:text-black"
            aria-label="Previous"
          >
            <IoIosArrowBack size={18} className="md:w-6 md:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 md:right-0 top-1/2 z-20 -translate-y-1/2 transform rounded-full border-2 border-white p-2 md:p-3 text-white transition-all hover:bg-white hover:text-black"
            aria-label="Next"
          >
            <IoIosArrowForward size={18} className="md:w-6 md:h-6" />
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden px-10 md:px-16">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {tourDates.map((show, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 px-1 md:px-4"
                >
                  <div className="group relative overflow-hidden border-2 border-white/20 bg-gradient-to-b from-white/5 to-transparent p-8 md:p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/40">
                    {/* Venue & City */}
                    <div className="mb-6 md:mb-8">
                      <h3 className="mb-2 text-xl md:text-2xl font-bold tracking-wider text-white">
                        {show.venue}
                      </h3>
                      <p className="text-base md:text-lg tracking-wide text-white/60">
                        {show.city}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="mb-6 md:mb-8">
                      <div className="flex items-baseline">
                        <span className="text-6xl md:text-8xl font-bold italic text-white">
                          {show.date}
                        </span>
                        <div className="ml-3 md:ml-4 flex flex-col">
                          <span className="text-2xl md:text-3xl font-bold text-white">
                            {show.month}
                          </span>
                          <span className="text-xs md:text-sm text-white/60">
                            {show.day}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Buy Tickets Button */}
                    <a
                      href="#"
                      className="inline-block border-2 border-white px-6 md:px-8 py-2.5 md:py-3 text-xs md:text-sm font-semibold tracking-widest text-white transition-all duration-300 hover:bg-white hover:text-black"
                    >
                      COMPRAR ENTRADAS
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
