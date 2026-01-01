import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import LogoComponent from '@/components/LogoComponent';
import { 
  ArrowRight, 
  Filter, 
  MapPin, 
  Calendar, 
  Users, 
  Award,
  ExternalLink,
  Play
} from 'lucide-react';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Exhibition', 'Event', 'Booth', 'Corporate'];

  const projects = [
    {
      id: 1,
      title: 'Tech Innovation Expo 2024',
      category: 'Exhibition',
      client: 'TechCorp International',
      location: 'Las Vegas, USA',
      date: 'March 2024',
      size: '2000 sqm',
      visitors: '50,000+',
      image: 'https://images.unsplash.com/photo-1703849222937-8a050e8a0607?w=800&auto=format&fit=crop&q=80',
      description: 'A cutting-edge exhibition booth featuring interactive displays, holographic presentations, and immersive brand experiences.',
      features: ['Interactive Displays', 'Holographic Technology', 'LED Walls', 'VR Experiences'],
      award: 'Best Innovation Award 2024'
    },
    {
      id: 2,
      title: 'Global Healthcare Summit',
      category: 'Event',
      client: 'MedTech Solutions',
      location: 'Geneva, Switzerland',
      date: 'February 2024',
      size: '5000 sqm',
      visitors: '15,000+',
      image: 'https://images.unsplash.com/photo-1761618291331-535983ae4296?w=800&auto=format&fit=crop&q=80',
      description: 'Complete event production for a three-day healthcare summit including main stage, breakout rooms, and networking areas.',
      features: ['Main Stage Design', 'Audio-Visual Systems', 'Lighting Design', 'Live Streaming'],
      award: null
    },
    {
      id: 3,
      title: 'Automotive Excellence Booth',
      category: 'Booth',
      client: 'AutoMax Industries',
      location: 'Detroit, USA',
      date: 'January 2024',
      size: '800 sqm',
      visitors: '25,000+',
      image: 'https://images.unsplash.com/photo-1765872460584-bb3165857ee3?w=800&auto=format&fit=crop&q=80',
      description: 'Premium automotive exhibition booth showcasing luxury vehicles with sophisticated lighting and premium finishes.',
      features: ['Vehicle Display Platforms', 'Premium Lighting', 'Custom Fabrication', 'Brand Integration'],
      award: 'Design Excellence Award'
    },
    {
      id: 4,
      title: 'Corporate Annual Conference',
      category: 'Corporate',
      client: 'Global Finance Corp',
      location: 'New York, USA',
      date: 'December 2023',
      size: '3000 sqm',
      visitors: '8,000+',
      image: 'https://images.unsplash.com/photo-1564980245582-dc1a1af5620e?w=800&auto=format&fit=crop&q=80',
      description: 'Elegant corporate event setup with multiple conference rooms, networking areas, and executive meeting spaces.',
      features: ['Multi-Room Setup', 'Executive Lounges', 'Networking Areas', 'Branding Integration'],
      award: null
    },
    {
      id: 5,
      title: 'International Trade Fair',
      category: 'Exhibition',
      client: 'Trade Connect Ltd',
      location: 'London, UK',
      date: 'November 2023',
      size: '1500 sqm',
      visitors: '35,000+',
      image: 'https://images.unsplash.com/photo-1743119638006-a01d4625745d?w=800&auto=format&fit=crop&q=80',
      description: 'Multi-brand exhibition space featuring modular booth systems and flexible display configurations.',
      features: ['Modular Systems', 'Flexible Layouts', 'Digital Signage', 'Interactive Kiosks'],
      award: null
    },
    {
      id: 6,
      title: 'Product Launch Spectacular',
      category: 'Event',
      client: 'Innovation Labs',
      location: 'San Francisco, USA',
      date: 'October 2023',
      size: '2500 sqm',
      visitors: '12,000+',
      image: 'https://images.unsplash.com/photo-1626342522104-48b9f6885c59?w=800&auto=format&fit=crop&q=80',
      description: 'High-impact product launch event with dramatic staging, special effects, and immersive brand storytelling.',
      features: ['Dramatic Staging', 'Special Effects', 'Product Showcases', 'Media Integration'],
      award: 'Event of the Year 2023'
    },
    {
      id: 7,
      title: 'Sustainable Energy Expo',
      category: 'Booth',
      client: 'GreenTech Solutions',
      location: 'Copenhagen, Denmark',
      date: 'September 2023',
      size: '1200 sqm',
      visitors: '20,000+',
      image: 'https://images.unsplash.com/photo-1633111158093-c51d43175b77?w=800&auto=format&fit=crop&q=80',
      description: 'Eco-friendly exhibition booth built with sustainable materials and featuring renewable energy demonstrations.',
      features: ['Sustainable Materials', 'Energy Demonstrations', 'Green Technology', 'Educational Displays'],
      award: 'Sustainability Award 2023'
    },
    {
      id: 8,
      title: 'Financial Services Summit',
      category: 'Corporate',
      client: 'Banking Alliance',
      location: 'Singapore',
      date: 'August 2023',
      size: '4000 sqm',
      visitors: '10,000+',
      image: 'https://images.unsplash.com/photo-1661356753084-daa80b0e6b3c?w=800&auto=format&fit=crop&q=80',
      description: 'Sophisticated corporate event featuring executive meeting spaces, presentation theaters, and networking lounges.',
      features: ['Executive Spaces', 'Presentation Theaters', 'Networking Lounges', 'Premium Finishes'],
      award: null
    }
  ];

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  const stats = [
    { number: '500+', label: 'Projects Completed' },
    { number: '50+', label: 'Countries Served' },
    { number: '2M+', label: 'Visitors Engaged' },
    { number: '25+', label: 'Industry Awards' }
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
            alt="Portfolio" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center text-white">
            <Badge className="mb-6 gradient-primary text-white">Our Portfolio</Badge>
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
              Showcasing Excellence
              <span className="block text-gradient">Across Industries</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Explore our portfolio of award-winning projects that have transformed 
              brands and created memorable experiences worldwide.
            </p>
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

      {/* Filter Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2 mr-6">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-muted-foreground">Filter by:</span>
            </div>
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeFilter === category ? "default" : "outline"}
                onClick={() => setActiveFilter(category)}
                className={`transition-smooth ${
                  activeFilter === category 
                    ? 'gradient-primary text-white shadow-elegant' 
                    : 'hover:border-primary hover:text-primary'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="group overflow-hidden hover:shadow-elegant transition-smooth cursor-pointer">
                <div className="aspect-video overflow-hidden relative">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                    <Button size="sm" className="gradient-primary text-white">
                      <Play className="mr-2 h-4 w-4" /> View Project
                    </Button>
                  </div>
                  {project.award && (
                    <div className="absolute top-4 left-4">
                      <Badge className="gradient-primary text-white">
                        <Award className="mr-1 h-3 w-3" /> {project.award}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">{project.category}</Badge>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{project.date}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-heading font-bold text-xl mb-2 group-hover:text-primary transition-smooth">
                    {project.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">{project.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">{project.visitors} visitors</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.features.slice(0, 2).map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {project.features.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.features.length - 2} more
                      </Badge>
                    )}
                  </div>
                  
                  <Button variant="ghost" className="w-full justify-between text-primary hover:bg-primary/10">
                    View Details
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Project Spotlight */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Featured Project
              <span className="text-gradient block">Spotlight</span>
            </h2>
          </div>
          
          <Card className="overflow-hidden shadow-elegant">
            <div className="grid lg:grid-cols-2">
              <div className="aspect-video lg:aspect-auto">
                <img 
                  src={projects[0].image} 
                  alt={projects[0].title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 lg:p-12">
                <Badge className="mb-4 gradient-primary text-white">{projects[0].category}</Badge>
                <h3 className="text-3xl font-heading font-bold mb-4">{projects[0].title}</h3>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {projects[0].description}
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Client</div>
                    <div className="font-medium">{projects[0].client}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Location</div>
                    <div className="font-medium">{projects[0].location}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Size</div>
                    <div className="font-medium">{projects[0].size}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Visitors</div>
                    <div className="font-medium">{projects[0].visitors}</div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-heading font-semibold mb-3">Key Features:</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {projects[0].features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button className="gradient-primary text-white shadow-elegant hover:shadow-glow transition-smooth">
                  View Full Case Study <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Ready to Create Your
            <span className="text-gradient block">Success Story?</span>
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Join our portfolio of successful projects and let us bring your 
            exhibition vision to life with our award-winning expertise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gradient-primary text-white shadow-glow hover:shadow-elegant transition-smooth">
              Start Your Project <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black transition-smooth">
              Download Portfolio
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
                <LogoComponent 
                  type="footer" 
                  className="h-16 w-auto"
                  alt="MOPi Production"
                />
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

export default Portfolio;