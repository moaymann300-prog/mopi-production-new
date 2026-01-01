import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import { 
  Award, 
  Users, 
  Target, 
  Lightbulb, 
  Shield, 
  Globe, 
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: 'Innovation',
      description: 'We constantly push the boundaries of design and technology to create cutting-edge exhibition experiences.'
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Quality',
      description: 'Every project meets our rigorous quality standards, ensuring exceptional results that exceed expectations.'
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Collaboration',
      description: 'We work closely with our clients as partners, bringing their vision to life through seamless teamwork.'
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: 'Global Reach',
      description: 'With projects spanning 50+ countries, we bring world-class expertise to every corner of the globe.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Creative Director',
      image: 'https://images.unsplash.com/photo-1541888915364-aaeed51d238b?w=400&auto=format&fit=crop&q=80',
      experience: '12+ years'
    },
    {
      name: 'Michael Chen',
      role: 'Project Manager',
      image: 'https://images.unsplash.com/photo-1574313428745-ea9221d581ee?w=400&auto=format&fit=crop&q=80',
      experience: '10+ years'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Design Lead',
      image: 'https://images.unsplash.com/photo-1687062013633-f2d1a2686f09?w=400&auto=format&fit=crop&q=80',
      experience: '8+ years'
    },
    {
      name: 'David Kim',
      role: 'Technical Director',
      image: 'https://images.unsplash.com/photo-1659353588615-daca46eab6cf?w=400&auto=format&fit=crop&q=80',
      experience: '15+ years'
    }
  ];

  const achievements = [
    {
      year: '2023',
      title: 'Best Exhibition Design Award',
      organization: 'International Trade Show Association',
      description: 'Recognized for innovative booth design at Tech Expo 2023'
    },
    {
      year: '2022',
      title: 'Sustainability Excellence',
      organization: 'Green Events Council',
      description: 'Leading the industry in eco-friendly exhibition solutions'
    },
    {
      year: '2021',
      title: 'Client Choice Award',
      organization: 'Exhibition Industry Alliance',
      description: 'Highest client satisfaction rating for three consecutive years'
    },
    {
      year: '2020',
      title: 'Innovation in Design',
      organization: 'Global Exhibition Awards',
      description: 'Revolutionary modular booth system design'
    }
  ];

  const milestones = [
    { year: '2008', event: 'MOPi Production Founded' },
    { year: '2012', event: 'International Expansion' },
    { year: '2016', event: '100th Project Milestone' },
    { year: '2019', event: 'ISO 9001 Certification' },
    { year: '2021', event: 'Sustainable Practices Initiative' },
    { year: '2024', event: '500+ Projects Completed' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="absolute inset-0 gradient-dark opacity-90"></div>
        <div className="absolute inset-0">
          <img 
            src="./images/about_office_20260101_112926.png" 
            alt="MOPi Production Office" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center text-white">
            <Badge className="mb-6 gradient-primary text-white">About MOPi Production</Badge>
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
              Crafting Excellence
              <span className="block text-gradient">Since 2008</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              We are passionate creators, innovative designers, and meticulous builders 
              dedicated to transforming your brand vision into extraordinary experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Target className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-heading font-bold">Our Mission</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                To revolutionize the exhibition and event industry by creating immersive, 
                innovative experiences that connect brands with their audiences in meaningful ways. 
                We strive to exceed expectations through exceptional design, quality craftsmanship, 
                and unparalleled service.
              </p>
              <div className="space-y-3">
                {[
                  'Deliver world-class exhibition solutions',
                  'Foster long-term client partnerships',
                  'Drive innovation in design and technology',
                  'Maintain the highest quality standards'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Star className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-heading font-bold">Our Vision</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                To be the global leader in exhibition design and event production, 
                recognized for our creativity, sustainability, and ability to transform 
                spaces into powerful brand experiences that inspire and engage audiences worldwide.
              </p>
              <Card className="gradient-primary text-white p-6">
                <CardContent className="p-0">
                  <h3 className="font-heading font-bold text-xl mb-3">Looking Ahead</h3>
                  <p className="text-white/90">
                    By 2030, we aim to be the preferred partner for Fortune 500 companies 
                    seeking innovative exhibition solutions, while leading the industry 
                    in sustainable practices and digital integration.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Our Core
              <span className="text-gradient block">Values</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              These fundamental principles guide every decision we make and every project we undertake.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-elegant transition-smooth">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-4">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Our
              <span className="text-gradient block">Journey</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              From humble beginnings to industry leadership - discover the milestones 
              that shaped MOPi Production.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="hover:shadow-elegant transition-smooth">
                      <CardContent className="p-6">
                        <div className="text-2xl font-heading font-bold text-primary mb-2">
                          {milestone.year}
                        </div>
                        <div className="text-lg font-medium">{milestone.event}</div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Meet Our
              <span className="text-gradient block">Expert Team</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our diverse team of creative professionals brings together decades of 
              experience in design, project management, and technical execution.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="group hover:shadow-elegant transition-smooth">
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                  />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="font-heading font-bold text-xl mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.experience}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Awards &
              <span className="text-gradient block">Recognition</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our commitment to excellence has been recognized by industry leaders 
              and prestigious organizations worldwide.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => (
              <Card key={index} className="hover:shadow-elegant transition-smooth">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-heading font-bold text-primary mb-2">
                        {achievement.year}
                      </div>
                      <h3 className="font-heading font-bold text-xl mb-2">
                        {achievement.title}
                      </h3>
                      <p className="text-muted-foreground font-medium mb-3">
                        {achievement.organization}
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Ready to Work
            <span className="text-gradient block">With Us?</span>
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Join the hundreds of satisfied clients who have trusted MOPi Production 
            to bring their exhibition visions to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gradient-primary text-white shadow-glow hover:shadow-elegant transition-smooth">
              Start Your Project <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black transition-smooth">
              View Our Work
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="./images/mopi_logo_20260101_112924.png" 
                  alt="MOPi Production" 
                  className="h-8 w-auto"
                />
                <span className="font-heading text-xl font-bold">MOPi Production</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Creating exceptional exhibition experiences and memorable events 
                that elevate your brand presence worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="font-heading font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-primary transition-smooth">Exhibition Booths</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Event Production</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Custom Structures</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Branding & Fabrication</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-heading font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-primary transition-smooth">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Portfolio</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Careers</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 MOPi Production. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;