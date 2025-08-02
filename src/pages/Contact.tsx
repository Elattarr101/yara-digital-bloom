import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from 'lucide-react';

const Contact = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us an email and we\'ll get back to you within 24 hours.',
      contact: 'hello@yara.agency',
      action: 'Send Email'
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak directly with our team during business hours.',
      contact: '+1 (555) 123-4567',
      action: 'Call Now'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team for immediate assistance.',
      contact: 'Available 9 AM - 6 PM EST',
      action: 'Start Chat'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      description: 'Schedule a meeting at our office in downtown Manhattan.',
      contact: '123 Marketing St, New York, NY 10001',
      action: 'Get Directions'
    }
  ];

  const offices = [
    {
      city: 'New York',
      address: '123 Marketing Street\nNew York, NY 10001',
      phone: '+1 (555) 123-4567',
      email: 'ny@yara.agency'
    },
    {
      city: 'Los Angeles',
      address: '456 Creative Ave\nLos Angeles, CA 90210',
      phone: '+1 (555) 234-5678',
      email: 'la@yara.agency'
    },
    {
      city: 'Chicago',
      address: '789 Innovation Blvd\nChicago, IL 60601',
      phone: '+1 (555) 345-6789',
      email: 'chicago@yara.agency'
    }
  ];

  return (
    <Layout>
      <HeroSection
        title="Let's Start Your Success Story"
        subtitle="Ready to transform your marketing and accelerate your growth? We're here to help you achieve your business goals with strategic digital marketing solutions."
        variant="minimal"
        primaryCTA="Schedule Consultation"
        secondaryCTA="Get Pricing"
      />

      {/* Contact Methods */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Get in Touch
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the communication method that works best for you. Our team is ready to discuss your project and answer any questions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <Card key={index} className="border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-2 group">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                      <IconComponent size={24} className="text-secondary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{method.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{method.description}</p>
                    <p className="text-primary font-medium text-sm mb-4">{method.contact}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      {method.action}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and we'll get back to you within 24 hours with a detailed proposal tailored to your needs.
              </p>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" placeholder="John" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" placeholder="Doe" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" placeholder="john@company.com" required />
                </div>

                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" placeholder="Your Company" />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                </div>

                <div>
                  <Label htmlFor="service">Service Interest</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seo">SEO & Search Marketing</SelectItem>
                      <SelectItem value="social">Social Media Marketing</SelectItem>
                      <SelectItem value="content">Content Marketing</SelectItem>
                      <SelectItem value="analytics">Marketing Analytics</SelectItem>
                      <SelectItem value="mobile">Mobile Marketing</SelectItem>
                      <SelectItem value="web">Web Development</SelectItem>
                      <SelectItem value="multiple">Multiple Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="budget">Monthly Budget Range</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                      <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                      <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                      <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
                      <SelectItem value="25000+">$25,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Project Details *</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us about your project, goals, and challenges..."
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <Button type="submit" className="w-full btn-primary group">
                  Send Message
                  <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </div>

            {/* Office Information */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Offices</h2>
              <p className="text-muted-foreground mb-8">
                We have offices in major cities across the United States. Visit us or schedule a virtual meeting.
              </p>

              <div className="space-y-6 mb-8">
                {offices.map((office, index) => (
                  <Card key={index} className="border-0 shadow-soft">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-4 text-primary">{office.city}</h3>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <MapPin size={18} className="text-secondary mt-0.5" />
                          <p className="text-muted-foreground whitespace-pre-line">{office.address}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone size={18} className="text-secondary" />
                          <p className="text-muted-foreground">{office.phone}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail size={18} className="text-secondary" />
                          <p className="text-muted-foreground">{office.email}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Business Hours */}
              <Card className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Clock size={20} className="text-secondary mr-2" />
                    Business Hours
                  </h3>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Quick answers to common questions about our services and process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div>
              <h3 className="font-semibold text-lg mb-3">How quickly can you start my project?</h3>
              <p className="text-muted-foreground">Most projects can begin within 1-2 weeks after contract signing, depending on scope and current workload.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Do you work with small businesses?</h3>
              <p className="text-muted-foreground">Yes! We work with businesses of all sizes, from startups to enterprise companies.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">What's included in your reporting?</h3>
              <p className="text-muted-foreground">Monthly reports include performance metrics, insights, recommendations, and ROI analysis.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Can I cancel my contract anytime?</h3>
              <p className="text-muted-foreground">We offer flexible contracts with 30-day notice periods for most services.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;