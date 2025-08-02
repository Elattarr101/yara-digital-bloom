import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const About = () => {
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'Former VP of Marketing at Fortune 500 companies with 15+ years of experience.',
      skills: ['Strategy', 'Leadership', 'Growth Hacking']
    },
    {
      name: 'Michael Chen',
      role: 'Creative Director',
      bio: 'Award-winning designer with expertise in brand identity and digital experiences.',
      skills: ['Design', 'Branding', 'UX/UI']
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Analytics',
      bio: 'Data scientist turned marketer, specializing in performance optimization.',
      skills: ['Analytics', 'SEO', 'PPC']
    },
    {
      name: 'David Kim',
      role: 'Content Strategist',
      bio: 'Storyteller who creates compelling content that converts and engages.',
      skills: ['Content', 'Copywriting', 'Social Media']
    }
  ];

  const values = [
    {
      title: 'Results-Driven',
      description: 'Every strategy is designed with clear metrics and measurable outcomes in mind.'
    },
    {
      title: 'Client-First',
      description: 'Your success is our success. We treat your business like our own.'
    },
    {
      title: 'Innovation',
      description: 'We stay ahead of trends and continuously evolve our approaches.'
    },
    {
      title: 'Transparency',
      description: 'Open communication and honest reporting at every step of the journey.'
    }
  ];

  return (
    <Layout>
      <HeroSection
        title="We're More Than Just a Marketing Agency"
        subtitle="We're your strategic partners in growth, combining creativity with data-driven insights to transform your business into a market leader."
        variant="minimal"
        primaryCTA="Meet Our Team"
        secondaryCTA="Our Story"
      />

      {/* Our Story */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                <p>
                  Founded in 2019, Yara began with a simple mission: to help businesses cut through the noise and connect meaningfully with their audiences. We saw too many companies struggling with fragmented marketing efforts and unclear results.
                </p>
                <p>
                  Our founders, coming from backgrounds in Fortune 500 marketing and tech startups, combined their expertise to create a different kind of agency—one that prioritizes strategy over tactics and long-term growth over quick wins.
                </p>
                <p>
                  Today, we've helped over 500 businesses transform their marketing approach, generating over $50M in additional revenue for our clients. But we're just getting started.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                <p className="text-center text-muted-foreground">
                  [Team photo placeholder]
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These principles guide everything we do and shape how we partner with our clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-soft">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4 text-primary">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Passionate experts who bring diverse skills and fresh perspectives to every project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{member.name}</h3>
                  <p className="text-secondary font-medium mb-4">{member.role}</p>
                  <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {member.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;