import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ArrowRight, Sparkles } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import heroBg from "@/assets/hero-bg.jpg";
import teamImg from "@/assets/team.jpg";
import auditImg from "@/assets/audit-service.jpg";

const slides = [
  {
    tagline: "EXCEPTIONAL OUTSOURCED OFFSHORE ACCOUNTING SOLUTIONS",
    subtitle: "Your premier destination for exceptional outsourced offshore accounting solutions.",
    image: heroBg,
  },
  {
    tagline: "BLENDING NEW TECHNIQUES WITH TRADITIONAL VALUES",
    subtitle: "We combine modern technology with time-tested accounting principles.",
    image: teamImg,
  },
  {
    tagline: "GLOBAL ASSIGNMENTS FROM US, CANADA, AUSTRALIA & EUROPE",
    subtitle: "Serving clients across multiple continents with dedication and expertise.",
    image: auditImg,
  },
  {
    tagline: "YOUR ONE-STOP SHOP FOR FINANCIAL NEEDS",
    subtitle: "Comprehensive accounting services tailored to your firm's requirements.",
    image: heroBg,
  },
];

interface HeroCarouselProps {
  variant?: "classic" | "modern";
}

export function HeroCarousel({ variant = "classic" }: HeroCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  if (variant === "modern") {
    return (
      <section className="relative min-h-[95vh] overflow-hidden">
        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
          className="w-full h-full"
        >
          <CarouselContent className="-ml-0">
            {slides.map((slide, index) => (
              <CarouselItem key={index} className="pl-0">
                <div className="relative min-h-[95vh] flex items-center">
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
                    style={{ backgroundImage: `url(${slide.image})` }}
                  >
                    {/* Multi-layer gradient overlay for vibrancy */}
                    <div className="absolute inset-0 bg-gradient-to-br from-qx-blue via-qx-blue-dark/95 to-qx-blue/90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </div>

                  {/* Animated decorative elements */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-qx-orange rounded-full blur-[150px] opacity-20 animate-float" />
                    <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-cyan-400 rounded-full blur-[120px] opacity-15 animate-float" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-purple-500 rounded-full blur-[100px] opacity-10 animate-pulse-soft" />
                    
                    {/* Geometric shapes */}
                    <div className="absolute top-1/4 right-1/4 w-32 h-32 border border-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
                    <div className="absolute bottom-1/3 left-1/3 w-24 h-24 border border-qx-orange/20 rounded-lg rotate-45 animate-float" style={{ animationDelay: '3s' }} />
                  </div>

                  <div className="container mx-auto px-4 lg:px-8 relative z-10">
                    <div className="max-w-4xl">
                      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-qx-orange" />
                        <span className="text-sm font-semibold text-white/90 uppercase tracking-wider">
                          IFAC Affiliate Member
                        </span>
                      </div>

                      <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-montserrat font-bold text-white mb-8 leading-[1.1]">
                        {slide.tagline.split(' ').slice(0, 2).join(' ')}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-qx-orange via-amber-400 to-qx-orange">
                          {slide.tagline.split(' ').slice(2, 4).join(' ')}
                        </span>{' '}
                        {slide.tagline.split(' ').slice(4).join(' ')}
                      </h1>

                      <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl leading-relaxed">
                        {slide.subtitle}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          className="bg-gradient-to-r from-qx-orange to-amber-500 hover:from-qx-orange-dark hover:to-amber-600 text-white rounded-full px-10 py-7 text-lg font-semibold shadow-lg shadow-qx-orange/30 hover:shadow-xl hover:shadow-qx-orange/40 transition-all duration-300 hover:-translate-y-1"
                          asChild
                        >
                          <Link to="/contact">
                            Book a Free Consultation
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-full px-10 py-7 text-lg font-semibold backdrop-blur-sm transition-all duration-300"
                          asChild
                        >
                          <Link to="/services">Explore Services</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Enhanced Carousel Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-3 rounded-full transition-all duration-500 ${
                current === index
                  ? "bg-gradient-to-r from-qx-orange to-amber-400 w-12 shadow-lg shadow-qx-orange/40"
                  : "bg-white/30 hover:bg-white/50 w-3"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 right-10 z-20 hidden lg:flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs uppercase tracking-widest rotate-90 origin-center translate-y-8">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
        </div>
      </section>
    );
  }

  // Classic variant
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
        className="w-full h-full"
      >
        <CarouselContent className="-ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="relative min-h-[90vh] flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-hero opacity-90" />
                </div>

                <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
                  <div className="max-w-4xl mx-auto">
                    <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20">
                      <span className="text-xs font-semibold text-gold tracking-widest uppercase">
                        IFAC Affiliate Member
                      </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground mb-6 leading-tight">
                      Welcome to{" "}
                      <span className="text-gradient-gold">Multiverse CPA</span>
                    </h1>

                    <div className="h-20 md:h-16 flex items-center justify-center mb-8">
                      <p className="text-lg md:text-xl text-primary-foreground/80 font-medium tracking-wide">
                        {slide.tagline}
                      </p>
                    </div>

                    <p className="text-base md:text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-10 leading-relaxed">
                      {slide.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button variant="hero" size="xl" asChild>
                        <Link to="/contact">
                          Schedule a Call
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                      <Button variant="heroOutline" size="xl" asChild>
                        <Link to="/services">Explore Services</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === index
                ? "bg-gold w-8"
                : "bg-primary-foreground/40 hover:bg-primary-foreground/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
