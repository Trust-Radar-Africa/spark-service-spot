import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Calendar, Send, CheckCircle2, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { AnimatedSection } from "@/components/AnimatedSection";
import { submitContactForm } from "@/services/publicApi";
import { useApiConfigStore } from "@/stores/apiConfigStore";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLiveMode } = useApiConfigStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLiveMode()) {
        await submitContactForm(formData);
        toast.success("Message sent successfully!", {
          description: "We'll get back to you as soon as possible.",
        });
      } else {
        // Demo mode - simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success("Message sent successfully!", {
          description: "We'll get back to you as soon as possible.",
        });
      }

      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error("Failed to send message", {
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 bg-gradient-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(38_92%_50%/0.1),transparent_70%)]" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary-foreground mb-4">
              Let's Have a <span className="text-gradient-gold">Chat</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              We strongly recommend that you schedule a call to discuss further
              on how we can contribute to the mission of your firm.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-14 md:py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12">
            {/* Contact Info */}
            <AnimatedSection animation="slide-left">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
                  Get in <span className="text-accent">Touch</span>
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed text-sm md:text-base">
                  Whether you're looking to outsource accounting tasks, need a
                  candidate referral, or have questions about our services, we're
                  here to help.
                </p>

                <div className="space-y-4">
                  {/* Phone */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted border border-border">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 text-sm">
                        Call Us
                      </h3>
                      <a
                        href="tel:+18885566382"
                        className="text-accent hover:underline text-sm"
                      >
                        +1 888 556 6382
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted border border-border">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 text-sm">
                        Email Us
                      </h3>
                      <a
                        href="mailto:info@multiversecpa.com"
                        className="text-accent hover:underline text-sm"
                      >
                        info@multiversecpa.com
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted border border-border">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 text-sm">
                        Our Address
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        500 Westover Dr #31297<br />
                        Sanford, NC 27330
                      </p>
                    </div>
                  </div>

                  {/* Schedule Meeting */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted border border-border">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 text-sm">
                        Schedule a Meeting
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        Book a time that works for you to discuss your needs.
                      </p>
                    </div>
                  </div>
                </div>

                {/* What We Can Help With */}
                <div className="mt-8">
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-3">
                    How Can We Help?
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Discuss outsourced accounting services",
                      "Request a candidate referral",
                      "Learn about our audit support",
                      "Explore bookkeeping solutions",
                      "Inquire about consulting services",
                      "Submit your resume for careers",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="text-foreground text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>

            {/* Contact Form */}
            <AnimatedSection animation="slide-right">
              <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-card">
                <h3 className="font-serif text-xl font-bold text-foreground mb-5">
                  Send Us a Message
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company / Firm</Label>
                      <Input
                        id="company"
                        name="company"
                        placeholder="Your Company"
                        value={formData.company}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your needs..."
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Map/Global Section */}
      <AnimatedSection>
        <section className="py-14 md:py-16 bg-muted">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3">
              Serving Clients <span className="text-accent">Globally</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-sm md:text-base">
              Our team handles diverse assignments from clients across the USA,
              Canada, Australia, and Europe. Wherever you are, we're ready to
              support your firm.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["United States", "Canada", "Europe", "Australia"].map(
                (region) => (
                  <div
                    key={region}
                    className="p-4 rounded-xl bg-card border border-border"
                  >
                    <div className="font-serif text-base font-semibold text-foreground">
                      {region}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      </AnimatedSection>
    </Layout>
  );
}
