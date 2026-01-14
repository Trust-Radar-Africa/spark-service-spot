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
      <section className="py-24 bg-gradient-to-b from-qx-light-gray to-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-qx-orange/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-qx-blue/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-qx-orange/10 border border-qx-orange/20 mb-4">
              <Sparkles className="w-4 h-4 text-qx-orange" />
              <span className="text-sm font-semibold text-qx-orange">Client Success Stories</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-montserrat font-bold text-qx-blue mb-4">
              What Our <span className="text-qx-orange">Clients</span> Say
            </h2>
            <p className="text-qx-gray max-w-2xl mx-auto text-lg">
              Trusted by accounting firms worldwide to deliver exceptional results.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Carousel
              setApi={setApi}
              opts={{ loop: true, align: "center" }}
              plugins={[Autoplay({ delay: 6000, stopOnInteraction: false })]}
              className="w-full"
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <div className="glass-card rounded-3xl p-10 md:p-14 shadow-xl border border-gray-100 hover-lift mx-2">
                      {/* Rating stars */}
                      <div className="flex justify-center gap-1 mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-qx-orange text-qx-orange" />
                        ))}
                      </div>
                      
                      <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-qx-orange to-amber-400 flex items-center justify-center shadow-lg shadow-qx-orange/30">
                          <Quote className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      
                      <blockquote className="text-xl md:text-2xl text-qx-blue text-center leading-relaxed mb-10 font-medium">
                        "{testimonial.quote}"
                      </blockquote>
                      
                      <div className="text-center">
                        <div className="font-montserrat font-bold text-qx-blue text-xl mb-1">
                          {testimonial.author}
                        </div>
                        <div className="text-qx-orange font-semibold text-lg">
                          {testimonial.role}
                        </div>
                        <div className="text-qx-gray mt-2">
                          {testimonial.company} • {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-14 w-14 h-14 bg-white border-gray-200 hover:bg-gradient-to-r hover:from-qx-orange hover:to-amber-500 hover:text-white hover:border-transparent shadow-lg transition-all duration-300" />
              <CarouselNext className="hidden md:flex -right-14 w-14 h-14 bg-white border-gray-200 hover:bg-gradient-to-r hover:from-qx-orange hover:to-amber-500 hover:text-white hover:border-transparent shadow-lg transition-all duration-300" />
            </Carousel>

            {/* Enhanced Indicators */}
            <div className="flex justify-center gap-2 mt-10">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`h-3 rounded-full transition-all duration-500 ${
                    current === index
                      ? "bg-gradient-to-r from-qx-orange to-amber-400 w-10 shadow-lg shadow-qx-orange/30"
                      : "bg-qx-blue/20 hover:bg-qx-blue/40 w-3"
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
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Client <span className="text-accent">Testimonials</span>
          </h2>
          <p className="text-muted-foreground">
            Hear from accounting firms who have transformed their operations with our services.
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
                  <div className="bg-card rounded-2xl p-8 md:p-12 shadow-card border border-border">
                    <div className="flex justify-center mb-6">
                      <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                        <Quote className="w-7 h-7 text-accent" />
                      </div>
                    </div>
                    
                    <blockquote className="text-lg md:text-xl text-foreground text-center leading-relaxed mb-8 font-serif">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div className="text-center">
                      <div className="font-serif font-bold text-foreground text-lg">
                        {testimonial.author}
                      </div>
                      <div className="text-accent font-medium">
                        {testimonial.role}
                      </div>
                      <div className="text-muted-foreground text-sm mt-1">
                        {testimonial.company} • {testimonial.location}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 bg-card border-border hover:bg-accent hover:text-accent-foreground hover:border-accent" />
            <CarouselNext className="hidden md:flex -right-12 bg-card border-border hover:bg-accent hover:text-accent-foreground hover:border-accent" />
          </Carousel>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  current === index
                    ? "bg-accent w-6"
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
