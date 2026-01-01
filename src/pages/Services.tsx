import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Clock, 
  Users, 
  Award,
  Lightbulb,
  Settings,
  Truck,
  Phone
} from 'lucide-react';

const Services = () => {
  const mainServices = [
    {
      title: 'Exhibition Booth Design',
      subtitle: 'Custom-designed booths that captivate and convert',
      description: 'From concept to completion, we create stunning exhibition booths that tell your brand story and drive meaningful engagement with your target audience.',
      image: './images/hero_booth_20260101_112925.png',
      features: [
        '3D Design & Visualization',
        'Custom Branding Integration',
        'Interactive Elements',
        'Premium Materials',
        'Modular Systems',
        'On-site Installation'
      ],
      process: [
        'Initial Consultation & Brief',
        '3D Design Development',
        'Client Approval & Refinement',
        'Production & Fabrication',
        'Installation & Setup',
        'Post-Event Support'
      ],
      pricing: 'Starting from $15,000'
    },
    {
      title: 'Event Production',
      subtitle: 'Complete event management from concept to execution',
      description: 'Full-service event production including stage design, lighting, audio-visual systems, and technical support for corporate events, product launches, and conferences.',
      image: './images/hero_event_20260101_112925.png',
      features: [
        'Stage Design & Construction',
        'Professional Lighting Systems',
        'Audio-Visual Integration',
        'Technical Support Team',
        'Project Management',
        'Live Event Coordination'
      ],
      process: [
        'Event Planning & Strategy',
        'Technical Requirements Analysis',
        'Design & Setup Planning',
        'Equipment Installation',
        'Live Event Management',
        'Post-Event Breakdown'
      ],
      pricing: 'Starting from $25,000'
    },
    {
      title: 'Custom Structures',
      subtitle: 'Tailored architectural solutions for any space',
      description: 'Modular and custom structures designed to meet your specific requirements, from temporary installations to permanent displays and architectural elements.',
      image: 'https://images.unsplash.com/photo-1656257683123-fd9cd2f2fb40?w=600&auto=format&fit=crop&q=80',
      features: [
        'Modular Design Systems',
        'Custom Fabrication',
        'Structural Engineering',
        'Weather-Resistant Materials',
        'Quick Assembly Systems',
        'Maintenance Support'
      ],
      process: [
        'Site Assessment & Planning',
        'Structural Design & Engineering',
        'Material Selection & Sourcing',
        'Fabrication & Quality Control',
        'Installation & Testing',
        'Handover & Training'
      ],
      pricing: 'Starting from $10,000'
    },
    {
      title: 'Branding & Fabrication',
      subtitle: 'High-quality fabrication with seamless brand integration',
      description: 'Professional branding solutions and precision fabrication services that ensure your brand message is communicated clearly and effectively across all touchpoints.',
      image: 'https://images.unsplash.com/photo-1632239336383-5bfb856151f7?w=600&auto=format&fit=crop&q=80',
      features: [
        'Brand Guidelines Development',
        'Large Format Printing',
        'Digital Signage Solutions',
        'Custom Fabrication',
        'Material Innovation',
        'Quality Assurance'
      ],
      process: [
        'Brand Analysis & Strategy',
        'Design Development',
        'Material & Process Selection',
        'Production & Fabrication',
        'Quality Control & Testing',
        'Delivery & Installation'
      ],
      pricing: 'Starting from $5,000'
    }
  ];

  const additionalServices = [
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: 'Concept Development',
      description: 'Creative ideation and concept development for unique brand experiences.'
    },
    {
      icon: <Settings className="h-8 w-8 text-primary" />,
      title: 'Technical Support',
      description: '24/7 technical support during events and exhibitions.'
    },
    {
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: 'Logistics Management',
      description: 'Complete logistics coordination including shipping and storage.'
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: 'Project Management',
      description: 'Dedicated project managers ensuring on-time, on-budget delivery.'
    }
  ];

  const industries = [
    'Technology & Software',
    'Healthcare & Pharmaceuticals',
    'Automotive & Manufacturing',
    'Financial Services',
    'Consumer Goods',
    'Energy & Utilities',
    'Education & Training',
    'Government & Public Sector'
  ];

  const whyChooseUs = [
    {
      title: '15+ Years Experience',
      description: 'Proven track record in exhibition and event industry'
    },
    {
      title: 'Global Reach',
      description: 'Projects delivered in 50+ countries worldwide'
    },
    {
      title: 'Award-Winning Design',
      description: 'Multiple industry awards for innovation and excellence'
    },
    {
      title: 'End-to-End Service',
      description: 'Complete solution from concept to post-event support'
    },
    {
      title: 'Quality Guarantee',
      description: 'ISO certified processes and quality assurance'
    },
    {
      title: 'Sustainable Practices',
      description: 'Eco-friendly materials and sustainable construction methods'
    }
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
            alt="Exhibition Services" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center text-white">
            <Badge className="mb-6 gradient-primary text-white">Our Services</Badge>
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
              Comprehensive Exhibition
              <span className="block text-gradient">Solutions</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              From concept to completion, we provide end-to-end solutions that transform 
              your brand vision into powerful, engaging experiences.
            </p>
            <Button size="lg" className="gradient-primary text-white shadow-glow hover:shadow-elegant transition-smooth">
              Get Custom Quote <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {mainServices.map((service, index) => (
              <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <Badge className="mb-4 gradient-primary text-white">{service.title}</Badge>
                  <h2 className="text-4xl font-heading font-bold mb-4">{service.subtitle}</h2>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="mb-8">
                    <h3 className="font-heading font-semibold text-xl mb-4">Key Features:</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="font-heading font-semibold text-xl mb-4">Our Process:</h3>
                    <div className="space-y-3">
                      {service.process.map((step, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {idx + 1}
                          </div>
                          <span className="text-muted-foreground">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-heading font-bold text-primary">{service.pricing}</div>
                      <div className="text-sm text-muted-foreground">Custom pricing available</div>
                    </div>
                    <Button className="gradient-primary text-white shadow-elegant hover:shadow-glow transition-smooth">
                      Learn More
                    </Button>
                  </div>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="relative">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="rounded-2xl shadow-elegant w-full"
                    />
                    <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-elegant">
                      <div className="flex items-center space-x-2">
                        <Star className="h-6 w-6 text-primary" />
                        <div>
                          <div className="font-heading font-bold">Premium Quality</div>
                          <div className="text-sm text-muted-foreground">Guaranteed</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Additional
              <span className="text-gradient block">Services</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive support services to ensure your project's complete success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-elegant transition-smooth">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {service.icon}
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-4">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Industries
              <span className="text-gradient block">We Serve</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our expertise spans across multiple industries, delivering tailored solutions 
              that meet specific sector requirements.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <Card key={index} className="hover:shadow-elegant transition-smooth cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <h3 className="font-heading font-semibold group-hover:text-primary transition-smooth">
                    {industry}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Why Choose
              <span className="text-gradient block">MOPi Production?</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((reason, index) => (
              <Card key={index} className="hover:shadow-elegant transition-smooth">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <h3 className="font-heading font-bold text-xl">{reason.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{reason.description}</p>
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
            Ready to Start
            <span className="text-gradient block">Your Project?</span>
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Let's discuss your exhibition needs and create a custom solution 
            that exceeds your expectations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gradient-primary text-white shadow-glow hover:shadow-elegant transition-smooth">
              Get Free Consultation <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black transition-smooth">
              <Phone className="mr-2 h-5 w-5" /> Call Us: +1 (555) 123-4567
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

export default Services;