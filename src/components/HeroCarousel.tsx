import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ArrowRight } from "lucide-react";
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
                <div className="relative min-h-[90vh] flex items-center">
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${slide.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-qx-blue via-qx-blue-dark/95 to-qx-blue/90" />
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-96 h-96 bg-qx-orange rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-72 h-72 bg-qx-light-blue rounded-full blur-3xl" />
                  </div>

                  <div className="container mx-auto px-4 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
                        <span className="text-xs font-semibold text-qx-orange uppercase tracking-wider">
                          IFAC Affiliate Member
                        </span>
                      </div>

                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-white mb-6 leading-tight">
                        {slide.tagline}
                      </h1>

                      <p className="text-lg text-white/80 mb-8 max-w-xl leading-relaxed">
                        {slide.subtitle}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          className="bg-qx-orange hover:bg-qx-orange-dark text-white rounded-full px-8 py-6 text-base"
                          asChild
                        >
                          <Link to="/contact">
                            Book a Free Consultation
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 text-base"
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

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                current === index
                  ? "bg-qx-orange w-8"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
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
