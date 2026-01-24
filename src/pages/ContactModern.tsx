import { useState } from "react";
import { LayoutModern } from "@/components/layout/LayoutModern";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Calendar, Send, CheckCircle2, Phone, MapPin, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { AnimatedSection } from "@/components/AnimatedSection";

export default function ContactModern() {
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
    <LayoutModern>
      {/* Hero Section */}
      <section className="relative py-10 md:py-12 bg-gradient-to-br from-qx-blue to-qx-blue-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-48 h-48 bg-qx-orange rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-36 h-36 bg-cyan-400 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-3">
              <MessageCircle className="w-3 h-3 text-qx-orange" />
              <span className="text-xs text-white uppercase tracking-wider">
                Contact Us
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3">
              Let's Have a{" "}
              <span className="text-qx-orange">Chat!</span>
            </h1>
            <p className="text-sm md:text-base text-white/80 max-w-xl mx-auto">
              We would love to hear from you. Schedule a meeting, give us a call, or send us an email.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto -mt-20 relative z-10">
            {/* Schedule Meeting - For Accounting Firms Only */}
            <AnimatedSection delay={0}>
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 text-center hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-qx-orange to-amber-400 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-job-title text-qx-blue mb-2">Schedule a Meeting</h3>
                <p className="text-body-paragraph text-qx-gray text-sm mb-4 flex-grow">
                  For accounting firms only
                </p>
                <Button 
                  className="bg-gradient-to-r from-qx-orange to-amber-500 hover:from-qx-orange-dark hover:to-amber-600 text-white rounded-full w-full mt-auto"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('calendly-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Book Now
                </Button>
              </div>
            </AnimatedSection>

            {/* Call Us */}
            <AnimatedSection delay={100}>
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 text-center hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-qx-blue to-qx-blue-dark flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-job-title text-qx-blue mb-2">Call Us</h3>
                <a
                  href="tel:+18885566382"
                  className="text-body-paragraph text-qx-orange hover:underline block mb-4 flex-grow"
                >
                  +1 888 556 6382
                </a>
                <Button 
                  variant="outline"
                  className="border-qx-blue text-qx-blue hover:bg-qx-blue hover:text-white rounded-full w-full mt-auto"
                  asChild
                >
                  <a href="tel:+18885566382">Call Now</a>
                </Button>
              </div>
            </AnimatedSection>

            {/* Email Us */}
            <AnimatedSection delay={200}>
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 text-center hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-qx-blue to-qx-blue-dark flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-job-title text-qx-blue mb-2">Email Us</h3>
                <a
                  href="mailto:info@multiversecpa.com"
                  className="text-body-paragraph text-qx-orange hover:underline block mb-4 flex-grow"
                >
                  info@multiversecpa.com
                </a>
                <Button 
                  variant="outline"
                  className="border-qx-blue text-qx-blue hover:bg-qx-blue hover:text-white rounded-full w-full mt-auto"
                  asChild
                >
                  <a href="mailto:info@multiversecpa.com">Send Email</a>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Calendly Embed Section */}
      <section id="calendly-section" className="py-10 md:py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-qx-orange/10 border border-qx-orange/20 mb-3">
                  <Calendar className="w-3 h-3 text-qx-orange" />
                  <span className="text-xs text-qx-orange uppercase tracking-wider font-medium">
                    For Accounting Firms Only
                  </span>
                </div>
                <h2 className="text-section-title text-qx-blue mb-2">
                  Schedule a Meeting With Us
                </h2>
                <p className="text-body-paragraph text-qx-gray max-w-xl mx-auto">
                  Select a convenient time to discuss your outsourcing needs. This booking is exclusively for accounting firms and employers.
                </p>
              </div>
              
              {/* Calendly Inline Widget */}
              <div className="bg-qx-light-gray rounded-2xl p-4 md:p-6 border border-gray-100">
                <iframe
                  src="https://calendly.com/YOUR_CALENDLY_LINK?hide_gdpr_banner=1&background_color=f8fafc&text_color=0a2342&primary_color=f26522"
                  width="100%"
                  height="650"
                  frameBorder="0"
                  title="Schedule a meeting with Multiverse CPA"
                  className="rounded-xl"
                ></iframe>
                <p className="text-xs text-qx-gray text-center mt-4">
                  Please replace YOUR_CALENDLY_LINK with your actual Calendly scheduling link
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Form & Address Section */}
      <section className="py-10 md:py-12 bg-qx-light-gray">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
            {/* Contact Form */}
            <AnimatedSection animation="slide-left">
              <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-heading font-bold text-qx-blue mb-1.5">
                  Send Us a Message
                </h3>
                <p className="text-body-paragraph text-qx-gray mb-6">
                  Have a question or want to learn more? Fill out the form below and we'll get back to you promptly.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-form-label text-qx-blue">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-qx-light-gray border-gray-200 focus:border-qx-orange focus:ring-qx-orange"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-form-label text-qx-blue">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-qx-light-gray border-gray-200 focus:border-qx-orange focus:ring-qx-orange"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-form-label text-qx-blue">Company / Firm</Label>
                      <Input
                        id="company"
                        name="company"
                        placeholder="Your Company"
                        value={formData.company}
                        onChange={handleChange}
                        className="bg-qx-light-gray border-gray-200 focus:border-qx-orange focus:ring-qx-orange"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-form-label text-qx-blue">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="bg-qx-light-gray border-gray-200 focus:border-qx-orange focus:ring-qx-orange"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-form-label text-qx-blue">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your needs..."
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="bg-qx-light-gray border-gray-200 focus:border-qx-orange focus:ring-qx-orange"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-qx-orange to-amber-500 hover:from-qx-orange-dark hover:to-amber-600 text-white rounded-full py-6"
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

            {/* Address & Info */}
            <AnimatedSection animation="slide-right">
              <div className="space-y-6">
                {/* Address Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-qx-blue to-qx-blue-dark flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-job-title text-qx-blue mb-2">Multiverse CPA</h3>
                      <p className="text-body-paragraph text-qx-gray leading-relaxed">
                        500 Westover Dr #31297<br />
                        Sanford, NC 27330<br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>

                {/* How We Can Help */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-job-title text-qx-blue mb-4">
                    How Can We Help?
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Discuss outsourced accounting services",
                      "Request a candidate referral",
                      "Learn about our audit support",
                      "Explore bookkeeping solutions",
                      "Inquire about taxation services",
                      "Inquire about consulting services",
                      "Submit your resume for careers",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-qx-orange flex-shrink-0" />
                        <span className="text-body-paragraph text-qx-gray">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Global Presence */}
                <div className="bg-gradient-to-br from-qx-blue to-qx-blue-dark rounded-2xl p-6 text-white">
                  <h3 className="text-job-title text-white mb-3">
                    Serving Clients Globally
                  </h3>
                  <p className="text-body-paragraph text-white/80 mb-4">
                    Our team handles diverse assignments from clients across multiple continents.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {["United States", "Canada", "Europe", "Australia"].map((region) => (
                      <div
                        key={region}
                        className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-center"
                      >
                        <span className="text-sm font-medium">{region}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </LayoutModern>
  );
}
