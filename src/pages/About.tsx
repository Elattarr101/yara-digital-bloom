import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Lightbulb, Target, Handshake, Sparkles, Linkedin, Twitter } from 'lucide-react';
import { useEffect, useState } from 'react';

const About = () => {
  const [counters, setCounters] = useState({
    experience: 0,
    projects: 0,
    clients: 0,
    awards: 0
  });

  const team = [
    {
      name: 'Sarah Johnson',
      title: 'CEO & Founder',
      bio: 'Visionary leader with 15+ years in digital marketing. Former VP at Fortune 500 companies, passionate about helping businesses achieve breakthrough growth.',
      image: 'photo-1581091226825-a6a2a5aee158',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Michael Chen',
      title: 'Creative Director',
      bio: 'Award-winning designer who transforms complex ideas into compelling visual stories. Expertise in brand identity and user experience design.',
      image: 'photo-1581092795360-fd1ca04f0952',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Emma Rodriguez',
      title: 'Marketing Manager',
      bio: 'Data-driven marketing strategist specializing in performance optimization and customer acquisition across all digital channels.',
      image: 'photo-1581091226825-a6a2a5aee158',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'David Kim',
      title: 'Lead Developer',
      bio: 'Full-stack developer who builds fast, scalable websites and applications. Expert in modern web technologies and performance optimization.',
      image: 'photo-1581092795360-fd1ca04f0952',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Lisa Thompson',
      title: 'Brand Strategist',
      bio: 'Creative strategist who helps brands find their unique voice and positioning. Specialist in brand development and messaging frameworks.',
      image: 'photo-1581091226825-a6a2a5aee158',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Alex Williams',
      title: 'Social Media Manager',
      bio: 'Social media expert who builds engaged communities and drives conversions. Specialist in content strategy and influencer partnerships.',
      image: 'photo-1581092795360-fd1ca04f0952',
      linkedin: '#',
      twitter: '#'
    }
  ];

  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We stay ahead of trends and technology'
    },
    {
      icon: Target,
      title: 'Results-Driven',
      description: 'Every strategy is built for measurable success'
    },
    {
      icon: Handshake,
      title: 'Client-First',
      description: 'Your goals become our mission'
    },
    {
      icon: Sparkles,
      title: 'Creativity',
      description: 'We turn ideas into unforgettable experiences'
    }
  ];

  const achievements = [
    { target: 5, label: 'Years Experience', suffix: '+' },
    { target: 100, label: 'Projects Completed', suffix: '+' },
    { target: 50, label: 'Happy Clients', suffix: '+' },
    { target: 15, label: 'Awards Won', suffix: '+' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate counters
            achievements.forEach((achievement, index) => {
              const duration = 2000; // 2 seconds
              const steps = 50;
              const increment = achievement.target / steps;
              let current = 0;

              const timer = setInterval(() => {
                current += increment;
                if (current >= achievement.target) {
                  current = achievement.target;
                  clearInterval(timer);
                }

                setCounters(prev => ({
                  ...prev,
                  [['experience', 'projects', 'clients', 'awards'][index]]: Math.floor(current)
                }));
              }, duration / steps);
            });

            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    const achievementsSection = document.getElementById('achievements');
    if (achievementsSection) {
      observer.observe(achievementsSection);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Layout>
      {/* Page Hero */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-muted/50 to-background overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-primary rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border-2 border-secondary rounded-full"></div>
          <div className="absolute bottom-20 left-1/3 w-20 h-20 border-2 border-accent rounded-full"></div>
        </div>

        <div className="container-custom relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8 animate-fade-in">
            <a href="/" className="hover:text-secondary transition-colors">Home</a>
            <ChevronRight size={16} />
            <span className="text-primary font-medium">About</span>
          </nav>

          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in [animation-delay:200ms]">
              Meet the Creative Minds Behind Your Success
            </h1>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 right-10 w-64 h-64 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-8 animate-fade-in">
                Our Story
              </h2>
            </div>
            
            <div className="text-2xl lg:text-3xl leading-relaxed text-muted-foreground font-light animate-fade-in [animation-delay:200ms]">
              "Founded in 2019, we're a passionate team of designers, marketers, and strategists dedicated to helping businesses thrive in the digital world. We believe every brand has a unique story to tell, and we're here to help you tell it beautifully."
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 animate-fade-in">
              Our Expert Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in [animation-delay:200ms]">
              Meet the talented individuals who bring creativity, strategy, and expertise to every project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card 
                key={index} 
                className="group border-0 shadow-soft hover:shadow-large transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 100 + 400}ms` }}
              >
                <CardContent className="p-8 text-center">
                  {/* Profile Image */}
                  <div className="w-24 h-24 mx-auto mb-6 relative overflow-hidden rounded-2xl shadow-medium group-hover:shadow-large transition-all duration-300">
                    <img
                      src={`https://images.unsplash.com/${member.image}?w=200&h=200&fit=crop&crop=face`}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <h3 className="font-semibold text-xl mb-2">{member.name}</h3>
                  <p className="text-secondary font-medium mb-4">{member.title}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {member.bio}
                  </p>

                  {/* Social Links */}
                  <div className="flex justify-center space-x-3">
                    <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full hover:bg-secondary/10 group/btn">
                      <Linkedin size={18} className="text-muted-foreground group-hover/btn:text-secondary transition-colors" />
                    </Button>
                    <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full hover:bg-secondary/10 group/btn">
                      <Twitter size={18} className="text-muted-foreground group-hover/btn:text-secondary transition-colors" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 animate-fade-in">
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in [animation-delay:200ms]">
              The principles that guide our work and define our commitment to excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card 
                  key={index} 
                  className="group text-center border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 100 + 400}ms` }}
                >
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/20 group-hover:scale-110 transition-all duration-300">
                      <IconComponent size={32} className="text-secondary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-4">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section id="achievements" className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 animate-fade-in">
              Our Achievements
            </h2>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto animate-fade-in [animation-delay:200ms]">
              Numbers that reflect our commitment to excellence and client success.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const currentValue = [counters.experience, counters.projects, counters.clients, counters.awards][index];
              return (
                <div 
                  key={index} 
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 100 + 400}ms` }}
                >
                  <div className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-2">
                    {currentValue}{achievement.suffix}
                  </div>
                  <div className="text-primary-foreground/80 font-medium text-lg">
                    {achievement.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 animate-fade-in">
              Ready to Work with Our Team?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in [animation-delay:200ms]">
              Let's discuss your project and discover how our expertise can help you achieve your business goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in [animation-delay:400ms]">
              <Button variant="default" size="xl" className="btn-primary">
                Start Your Project
              </Button>
              <Button variant="outline" size="xl">
                Schedule a Call
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;