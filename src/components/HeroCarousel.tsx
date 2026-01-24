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
    tagline: "Your Trusted Offshore Remote Accountants",
    subtitle: "Exceptional offshore accounting solutions trusted by firms across the US, Canada, Australia and Europe.",
    highlight: "Offshore Remote Accountants",
    image: heroBg,
  },
  {
    tagline: "Professional Bookkeeping Services",
    subtitle: "Expert bookkeeping using Xero, QuickBooks, Sage, and more. Accurate, timely, and cost-effective.",
    highlight: "Bookkeeping",
    image: teamImg,
  },
  {
    tagline: "Expert Tax Preparation & Compliance",
    subtitle: "Comprehensive tax preparation ensuring full compliance and strategic optimization for your clients.",
    highlight: "Tax Preparation",
    image: auditImg,
  },
  {
    tagline: "Audit, Review and Compilation Engagements",
    subtitle: "Thorough audit, review and compilation of financial statements with in-depth analysis.",
    highlight: "Engagements",
    image: heroBg,
  },
  {
    tagline: "Setting the Standards in Consulting Practice",
    subtitle: "Your trusted partner for comprehensive accounting outsourcing requirements.",
    highlight: "Consulting Practice",
    image: teamImg,
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
      <section className="relative min-h-[55vh] md:min-h-[60vh] overflow-hidden">
        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
          className="w-full h-full"
        >
          <CarouselContent className="-ml-0">
            {slides.map((slide, index) => (
              <CarouselItem key={index} className="pl-0">
                <div className="relative min-h-[55vh] md:min-h-[60vh] flex items-center">
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${slide.image})` }}
                  >
                    {/* Multi-layer gradient overlay for vibrancy */}
                    <div className="absolute inset-0 bg-gradient-to-br from-qx-blue via-qx-blue-dark/95 to-qx-blue/90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>

                  {/* Animated decorative elements - reduced size */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-10 right-10 w-64 h-64 md:w-80 md:h-80 bg-qx-orange rounded-full blur-[100px] opacity-15 animate-float" />
                    <div className="absolute bottom-10 left-10 w-48 h-48 md:w-64 md:h-64 bg-cyan-400 rounded-full blur-[80px] opacity-10 animate-float" style={{ animationDelay: '2s' }} />
                  </div>

                  <div className="container mx-auto px-4 lg:px-8 relative z-10 py-8">
                    <div className="max-w-3xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-4 backdrop-blur-sm">
                        <Sparkles className="w-3 h-3 text-qx-orange" />
                        <span className="text-xs text-white/90 uppercase tracking-wider">
                          Offshore Remote Accountants
                        </span>
                      </div>

                      <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-white mb-4 leading-tight">
                        {slide.tagline.split(slide.highlight || '').map((part, i, arr) => (
                          i < arr.length - 1 ? (
                            <span key={i}>
                              {part}
                              <span className="text-qx-orange">{slide.highlight}</span>
                            </span>
                          ) : part
                        ))}
                        {!slide.tagline.includes(slide.highlight || '') && slide.tagline}
                      </h1>

                      <p className="text-base md:text-lg text-white/80 mb-6 max-w-xl">
                        {slide.subtitle}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          className="bg-gradient-to-r from-qx-orange to-amber-500 hover:from-qx-orange-dark hover:to-amber-600 text-white rounded-full px-6 py-2.5 text-sm font-semibold shadow-lg shadow-qx-orange/30 hover:shadow-xl hover:shadow-qx-orange/40 transition-all duration-300 hover:-translate-y-1"
                          asChild
                        >
                          <Link to="/contact">
                            Book a Free Consultation
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          className="bg-white hover:bg-white/90 text-qx-blue rounded-full px-6 py-2.5 text-sm font-semibold shadow-lg transition-all duration-300 hover:-translate-y-1"
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
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                current === index
                  ? "bg-gradient-to-r from-qx-orange to-amber-400 w-10"
                  : "bg-white/30 hover:bg-white/50 w-2.5"
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
    <section className="relative min-h-[55vh] md:min-h-[60vh] overflow-hidden">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
        className="w-full h-full"
      >
        <CarouselContent className="-ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="relative min-h-[55vh] md:min-h-[60vh] flex items-center justify-center">
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

                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-primary-foreground mb-4 leading-tight">
                      Welcome to{" "}
                      <span className="text-gradient-gold">Multiverse CPA</span>
                    </h1>

                    <div className="h-14 md:h-12 flex items-center justify-center mb-6">
                      <p className="text-base md:text-lg text-primary-foreground/80 font-medium">
                        {slide.tagline}
                      </p>
                    </div>

                    <p className="text-sm md:text-base text-primary-foreground/70 max-w-2xl mx-auto mb-6 leading-relaxed">
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
