import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Calendar, Send, CheckCircle2, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Message sent successfully!", {
      description: "We'll get back to you as soon as possible.",
    });

    setFormData({
      name: "",
      email: "",
      company: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);
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
      <section className="relative py-24 bg-gradient-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(38_92%_50%/0.1),transparent_70%)]" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground mb-6">
              Let's Have a <span className="text-gradient-gold">Chat</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              We strongly recommend that you schedule a call to discuss further
              on how we can contribute to the mission of your firm.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
                Get in <span className="text-accent">Touch</span>
              </h2>
              <p className="text-muted-foreground mb-10 leading-relaxed">
                Whether you're looking to outsource accounting tasks, need a
                candidate referral, or have questions about our services, we're
                here to help.
              </p>

              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start gap-4 p-6 rounded-xl bg-muted border border-border">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Call Us
                    </h3>
                    <a
                      href="tel:+18885566382"
                      className="text-accent hover:underline"
                    >
                      +1 888 556 6382
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-6 rounded-xl bg-muted border border-border">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Email Us
                    </h3>
                    <a
                      href="mailto:info@multiversecpa.com"
                      className="text-accent hover:underline"
                    >
                      info@multiversecpa.com
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4 p-6 rounded-xl bg-muted border border-border">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Our Address
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      500 Westover Dr #31297<br />
                      Sanford, NC 27330
                    </p>
                  </div>
                </div>

                {/* Schedule Meeting */}
                <div className="flex items-start gap-4 p-6 rounded-xl bg-muted border border-border">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Schedule a Meeting
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Book a time that works for you to discuss your needs.
                    </p>
                  </div>
                </div>
              </div>

              {/* What We Can Help With */}
              <div className="mt-10">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                  How Can We Help?
                </h3>
                <ul className="space-y-3">
                  {[
                    "Discuss outsourced accounting services",
                    "Request a candidate referral",
                    "Learn about our audit support",
                    "Explore bookkeeping solutions",
                    "Inquire about consulting services",
                    "Submit your resume for careers",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-foreground text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-card rounded-2xl p-8 border border-border shadow-card">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Send Us a Message
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
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

                  <div className="grid sm:grid-cols-2 gap-6">
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
                      rows={5}
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
            </div>
          </div>
        </div>
      </section>

      {/* Map/Global Section */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Serving Clients <span className="text-accent">Globally</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
            Our team handles diverse assignments from clients across the USA,
            Canada, Australia, and Europe. Wherever you are, we're ready to
            support your firm.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {["United States", "Canada", "Europe", "Australia"].map(
              (region) => (
                <div
                  key={region}
                  className="p-6 rounded-xl bg-card border border-border"
                >
                  <div className="font-serif text-lg font-semibold text-foreground">
                    {region}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
