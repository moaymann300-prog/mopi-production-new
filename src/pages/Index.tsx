import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import { ArrowRight, Star, Users, Award, CheckCircle, Phone, Mail, MapPin } from 'lucide-react';

const Index = () => {
  const services = [
    {
      title: 'Exhibition Booth Design',
      description: 'Custom-designed exhibition booths that capture attention and drive engagement at trade shows.',
      image: './images/hero_booth_20260101_112925.png',
      features: ['Custom Design', '3D Visualization', 'Premium Materials']
    },
    {
      title: 'Event Production',
      description: 'Complete event production services from concept to execution for corporate events.',
      image: './images/hero_event_20260101_112925.png',
      features: ['Full Production', 'Technical Support', 'Project Management']
    },
    {
      title: 'Custom Structures',
      description: 'Modular and custom structures tailored to your specific requirements and branding.',
      image: 'https://images.unsplash.com/photo-1656257683123-fd9cd2f2fb40?w=600&auto=format&fit=crop&q=80',
      features: ['Modular Systems', 'Custom Fabrication', 'Installation Support']
    },
    {
      title: 'Branding & Fabrication',
      description: 'Professional branding solutions and high-quality fabrication for all your display needs.',
      image: 'https://images.unsplash.com/photo-1632239336383-5bfb856151f7?w=600&auto=format&fit=crop&q=80',
      features: ['Brand Integration', 'Quality Materials', 'Fast Turnaround']
    }
  ];

  const projects = [
    {
      title: 'Tech Expo 2024',
      category: 'Exhibition',
      image: 'https://images.unsplash.com/photo-1703849222937-8a050e8a0607?w=600&auto=format&fit=crop&q=80'
    },
    {
      title: 'Corporate Summit',
      category: 'Event',
      image: 'https://images.unsplash.com/photo-1761618291331-535983ae4296?w=600&auto=format&fit=crop&q=80'
    },
    {
      title: 'Product Launch',
      category: 'Booth',
      image: 'https://images.unsplash.com/photo-1765872460584-bb3165857ee3?w=600&auto=format&fit=crop&q=80'
    },
    {
      title: 'Trade Show Display',
      category: 'Exhibition',
      image: 'https://images.unsplash.com/photo-1564980245582-dc1a1af5620e?w=600&auto=format&fit=crop&q=80'
    }
  ];

  const clients = [
    'Microsoft', 'Apple', 'Google', 'Amazon', 'Meta', 'Tesla'
  ];

  const stats = [
    { number: '500+', label: 'Projects Completed' },
    { number: '15+', label: 'Years Experience' },
    { number: '200+', label: 'Happy Clients' },
    { number: '50+', label: 'Countries Served' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="absolute inset-0 gradient-dark opacity-90"></div>
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1703849222937-8a050e8a0607?w=1920&auto=format&fit=crop&q=80" 
            alt="Exhibition Hall" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
              Crafting Exceptional
              <span className="block text-gradient">Exhibition Experiences</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              MOPi Production specializes in creating stunning exhibition booths, 
              memorable events, and custom structures that elevate your brand presence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-primary text-white font-medium shadow-glow hover:shadow-elegant transition-smooth">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black transition-smooth">
                View Portfolio
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-heading font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 gradient-primary text-white">About MOPi Production</Badge>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                Building Excellence in
                <span className="text-gradient block">Exhibition Design</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                With over 15 years of experience in the exhibition and event industry, 
                MOPi Production has established itself as a leader in creating innovative 
                and impactful brand experiences.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  'Award-winning design team',
                  'State-of-the-art fabrication facilities',
                  'Global project management',
                  'Sustainable construction practices'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              <Button className="gradient-primary text-white shadow-elegant hover:shadow-glow transition-smooth">
                Learn More About Us
              </Button>
            </div>
            <div className="relative">
              <img 
                src="./images/about_office_20260101_112926.png" 
                alt="MOPi Production Office" 
                className="rounded-2xl shadow-elegant w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-elegant">
                <div className="flex items-center space-x-2">
                  <Award className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-heading font-bold text-lg">ISO Certified</div>
                    <div className="text-sm text-muted-foreground">Quality Assurance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 gradient-primary text-white">Our Services</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Comprehensive Exhibition
              <span className="text-gradient block">Solutions</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              From concept to completion, we provide end-to-end solutions for all your 
              exhibition and event needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-elegant transition-smooth cursor-pointer">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-heading font-bold text-xl mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 gradient-primary text-white">Featured Projects</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Our Latest
              <span className="text-gradient block">Success Stories</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project, index) => (
              <Card key={index} className="group overflow-hidden hover:shadow-elegant transition-smooth cursor-pointer">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                  />
                </div>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2 text-xs">{project.category}</Badge>
                  <h3 className="font-heading font-semibold">{project.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white transition-smooth">
              View All Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-heading font-bold mb-4">Trusted by Industry Leaders</h3>
            <p className="text-muted-foreground">We're proud to work with some of the world's most innovative companies</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
            {clients.map((client, index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-medium text-muted-foreground hover:text-primary transition-smooth cursor-pointer">
                  {client}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Ready to Create Something
            <span className="text-gradient block">Extraordinary?</span>
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Let's discuss your next exhibition project and bring your vision to life 
            with our expert team and innovative solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gradient-primary text-white shadow-glow hover:shadow-elegant transition-smooth">
              Get Free Quote <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black transition-smooth">
              <Phone className="mr-2 h-5 w-5" /> Call Us Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <img 
                  src="./images/mopi_logo_20260101_112924.png" 
                  alt="MOPi Production" 
                  className="h-16 w-auto"
                />
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Creating exceptional exhibition experiences and memorable events 
                that elevate your brand presence worldwide.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">info@mopiproduction.com</span>
                </div>
              </div>
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

export default Index;
