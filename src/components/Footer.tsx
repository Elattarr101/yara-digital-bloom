import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Contact', href: '/contact' },
    { name: 'Blog', href: '/blog' },
    { name: 'Privacy Policy', href: '/privacy' },
  ];

  const services = [
    'Digital Marketing',
    'SEO Optimization',
    'Social Media',
    'Web Development',
    'Content Creation',
    'Brand Strategy',
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">Yara</h3>
              <p className="text-primary-foreground/80 text-lg leading-relaxed">
                We're a modern digital marketing agency that helps businesses grow through innovative strategies and creative solutions.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-secondary" />
                <span className="text-primary-foreground/80">hello@yara.agency</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-secondary" />
                <span className="text-primary-foreground/80">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={18} className="text-secondary" />
                <span className="text-primary-foreground/80">New York, NY</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-secondary transition-smooth hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-primary-foreground/80">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Stay Updated</h4>
            <p className="text-primary-foreground/80 mb-6">
              Subscribe to our newsletter for the latest insights and updates.
            </p>
            
            <form className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button className="btn-secondary w-full">
                Subscribe
              </Button>
            </form>

            {/* Social Links */}
            <div className="mt-8">
              <h5 className="text-lg font-medium mb-4">Follow Us</h5>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="p-2 bg-primary-foreground/10 rounded-lg hover:bg-secondary hover:scale-110 transition-all duration-300"
                      aria-label={social.name}
                    >
                      <IconComponent size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-primary-foreground/80 text-center md:text-left">
              © 2024 Yara Marketing Agency. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="/terms" className="text-primary-foreground/80 hover:text-secondary transition-smooth">
                Terms of Service
              </a>
              <a href="/privacy" className="text-primary-foreground/80 hover:text-secondary transition-smooth">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;