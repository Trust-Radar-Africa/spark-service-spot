import { useState, useCallback, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Quote, Star, Sparkles } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

const testimonials = [
  {
    quote: "Multiverse CPA has transformed our practice. Their dedicated team handles our bookkeeping with exceptional accuracy, allowing us to focus on advisory services and client relationships.",
    author: "Sarah Mitchell",
    role: "Managing Partner",
    company: "Mitchell & Associates CPA",
    location: "California, USA",
    rating: 5,
  },
  {
    quote: "The quality of work and attention to detail is outstanding. We've reduced our operational costs by 40% while improving turnaround times. Highly recommend their services.",
    author: "James Crawford",
    role: "Director",
    company: "Crawford Accounting Group",
    location: "Toronto, Canada",
    rating: 5,
  },
  {
    quote: "Working with Multiverse CPA feels like having an extension of our own team. Their professionals understand our workflows and consistently deliver beyond expectations.",
    author: "Emma Richardson",
    role: "Senior Partner",
    company: "Richardson & Co Chartered Accountants",
    location: "London, UK",
    rating: 5,
  },
  {
    quote: "Their tax preparation team is incredibly knowledgeable about US regulations. The four-eyed review process ensures we never have to worry about quality or compliance.",
    author: "Michael Zhang",
    role: "Founder",
    company: "Zhang Financial Services",
    location: "Sydney, Australia",
    rating: 5,
  },
  {
    quote: "Exceptional service from day one. The onboarding was smooth, communication is seamless, and the cost savings have been remarkable for our growing firm.",
    author: "David Foster",
    role: "Principal",
    company: "Foster & Partners Accounting",
    location: "New York, USA",
    rating: 5,
  },
];

interface TestimonialsCarouselProps {
  variant?: "classic" | "modern";
}

export function TestimonialsCarousel({ variant = "classic" }: TestimonialsCarouselProps) {
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

  if (variant === "modern") {
    return (
      <section className="py-14 md:py-16 bg-gradient-to-b from-qx-light-gray to-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-qx-orange/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-qx-blue/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-qx-orange/10 border border-qx-orange/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-qx-orange" />
              <span className="text-xs font-semibold text-qx-orange">Client Success Stories</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-montserrat font-bold text-qx-blue mb-2">
              What Our <span className="text-qx-orange">Clients</span> Say
            </h2>
            <p className="text-qx-gray max-w-xl mx-auto text-sm md:text-base">
              Trusted by accounting firms worldwide to deliver exceptional results.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Carousel
              setApi={setApi}
              opts={{ loop: true, align: "center" }}
              plugins={[Autoplay({ delay: 6000, stopOnInteraction: false })]}
              className="w-full"
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <div className="glass-card rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 mx-2">
                      {/* Rating stars */}
                      <div className="flex justify-center gap-0.5 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-qx-orange text-qx-orange" />
                        ))}
                      </div>
                      
                      <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-qx-orange to-amber-400 flex items-center justify-center shadow-md">
                          <Quote className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      <blockquote className="text-base md:text-lg text-qx-blue text-center leading-relaxed mb-6 font-medium">
                        "{testimonial.quote}"
                      </blockquote>
                      
                      <div className="text-center">
                        <div className="font-montserrat font-bold text-qx-blue text-base mb-0.5">
                          {testimonial.author}
                        </div>
                        <div className="text-qx-orange font-semibold text-sm">
                          {testimonial.role}
                        </div>
                        <div className="text-qx-gray text-xs mt-1">
                          {testimonial.company} • {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 w-10 h-10 bg-white border-gray-200 hover:bg-gradient-to-r hover:from-qx-orange hover:to-amber-500 hover:text-white hover:border-transparent shadow-md transition-all duration-300" />
              <CarouselNext className="hidden md:flex -right-12 w-10 h-10 bg-white border-gray-200 hover:bg-gradient-to-r hover:from-qx-orange hover:to-amber-500 hover:text-white hover:border-transparent shadow-md transition-all duration-300" />
            </Carousel>

            {/* Enhanced Indicators */}
            <div className="flex justify-center gap-1.5 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    current === index
                      ? "bg-gradient-to-r from-qx-orange to-amber-400 w-8"
                      : "bg-qx-blue/20 hover:bg-qx-blue/40 w-2"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Classic variant
  return (
    <section className="py-14 md:py-16 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-3">
            Client <span className="text-accent">Testimonials</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Hear from accounting firms who have transformed their operations with our services.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Carousel
            setApi={setApi}
            opts={{ loop: true, align: "center" }}
            plugins={[Autoplay({ delay: 6000, stopOnInteraction: false })]}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <div className="bg-card rounded-xl p-6 md:p-8 shadow-card border border-border">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                        <Quote className="w-6 h-6 text-accent" />
                      </div>
                    </div>
                    
                    <blockquote className="text-base md:text-lg text-foreground text-center leading-relaxed mb-6 font-serif">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div className="text-center">
                      <div className="font-serif font-bold text-foreground text-base">
                        {testimonial.author}
                      </div>
                      <div className="text-accent font-medium text-sm">
                        {testimonial.role}
                      </div>
                      <div className="text-muted-foreground text-xs mt-1">
                        {testimonial.company} • {testimonial.location}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-10 bg-card border-border hover:bg-accent hover:text-accent-foreground hover:border-accent" />
            <CarouselNext className="hidden md:flex -right-10 bg-card border-border hover:bg-accent hover:text-accent-foreground hover:border-accent" />
          </Carousel>

          {/* Indicators */}
          <div className="flex justify-center gap-1.5 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  current === index
                    ? "bg-accent w-5"
                    : "bg-foreground/20 hover:bg-foreground/40"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
