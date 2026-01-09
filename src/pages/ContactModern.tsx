import { useState } from "react";
import { LayoutModern } from "@/components/layout/LayoutModern";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Calendar, Send, CheckCircle2, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

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
      <section className="relative py-20 bg-gradient-to-br from-qx-blue to-qx-blue-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-qx-orange rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
              <span className="text-xs font-semibold text-qx-orange uppercase tracking-wider">
                Contact Us
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-white mb-6">
              Book a{" "}
              <span className="text-qx-orange">Free Consultation</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              We strongly recommend that you schedule a call to discuss how we can contribute to the mission of your firm.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-montserrat font-bold text-qx-blue mb-6">
                Get in Touch
              </h2>
              <p className="text-qx-gray mb-10 leading-relaxed">
                Whether you're looking to outsource accounting tasks, need a candidate referral, or have questions about our services, we're here to help.
              </p>

              <div className="space-y-4">
                {/* Phone */}
                <div className="flex items-start gap-4 p-5 rounded-xl bg-qx-light-gray border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-qx-orange flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-qx-blue mb-1">Call Us</h3>
                    <a
                      href="tel:+18885566382"
                      className="text-qx-orange hover:underline text-sm"
                    >
                      +1 888 556 6382
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-5 rounded-xl bg-qx-light-gray border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-qx-orange flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-qx-blue mb-1">Email Us</h3>
                    <a
                      href="mailto:info@multiversecpa.com"
                      className="text-qx-orange hover:underline text-sm"
                    >
                      info@multiversecpa.com
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4 p-5 rounded-xl bg-qx-light-gray border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-qx-orange flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-qx-blue mb-1">Our Address</h3>
                    <p className="text-sm text-qx-gray">
                      500 Westover Dr #31297<br />
                      Sanford, NC 27330
                    </p>
                  </div>
                </div>

                {/* Schedule Meeting */}
                <div className="flex items-start gap-4 p-5 rounded-xl bg-qx-light-gray border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-qx-orange flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-qx-blue mb-1">Book a Meeting</h3>
                    <p className="text-sm text-qx-gray">
                      Schedule a time to discuss your outsourcing needs.
                    </p>
                  </div>
                </div>
              </div>

              {/* What We Can Help With */}
              <div className="mt-10">
                <h3 className="text-lg font-bold text-qx-blue mb-4">
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
                      <CheckCircle2 className="w-4 h-4 text-qx-orange flex-shrink-0" />
                      <span className="text-sm text-qx-gray">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-qx-light-gray rounded-2xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-qx-blue mb-6">
                  Send Us a Message
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-qx-blue">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-white border-gray-200 focus:border-qx-orange focus:ring-qx-orange"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-qx-blue">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-white border-gray-200 focus:border-qx-orange focus:ring-qx-orange"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-qx-blue">Company / Firm</Label>
                      <Input
                        id="company"
                        name="company"
                        placeholder="Your Company"
                        value={formData.company}
                        onChange={handleChange}
                        className="bg-white border-gray-200 focus:border-qx-orange focus:ring-qx-orange"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-qx-blue">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="bg-white border-gray-200 focus:border-qx-orange focus:ring-qx-orange"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-qx-blue">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your needs..."
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="bg-white border-gray-200 focus:border-qx-orange focus:ring-qx-orange"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-qx-orange hover:bg-qx-orange-dark text-white rounded-full py-6"
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

      {/* Global Section */}
      <section className="py-20 bg-qx-light-gray">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-qx-blue mb-4">
            Serving Clients Globally
          </h2>
          <p className="text-qx-gray max-w-2xl mx-auto mb-10">
            Our team handles diverse assignments from clients across the USA, Canada, Australia, and Europe.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["United States", "Canada", "Europe", "Australia"].map((region) => (
              <div
                key={region}
                className="p-5 rounded-xl bg-white border border-gray-100"
              >
                <div className="font-bold text-qx-blue">{region}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </LayoutModern>
  );
}
