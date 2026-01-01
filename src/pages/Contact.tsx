import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navigation from '@/components/Navigation';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare,
  Globe,
  Award,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    budget: '',
    timeline: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: 'Phone',
      details: ['+1 (555) 123-4567', '+1 (555) 123-4568'],
      description: 'Available 24/7 for urgent inquiries'
    },
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: 'Email',
      details: ['info@mopiproduction.com', 'sales@mopiproduction.com'],
      description: 'We respond within 2 hours'
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: 'Headquarters',
      details: ['123 Exhibition Boulevard', 'New York, NY 10001, USA'],
      description: 'Visit our showroom by appointment'
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: 'Business Hours',
      details: ['Mon - Fri: 8:00 AM - 6:00 PM', 'Sat: 9:00 AM - 4:00 PM'],
      description: 'Emergency support available 24/7'
    }
  ];

  const offices = [
    {
      city: 'New York',
      country: 'USA',
      address: '123 Exhibition Boulevard, NY 10001',
      phone: '+1 (555) 123-4567',
      email: 'ny@mopiproduction.com'
    },
    {
      city: 'London',
      country: 'UK',
      address: '456 Design Street, London W1A 0AA',
      phone: '+44 20 7123 4567',
      email: 'london@mopiproduction.com'
    },
    {
      city: 'Singapore',
      country: 'Singapore',
      address: '789 Marina Bay, Singapore 018956',
      phone: '+65 6123 4567',
      email: 'singapore@mopiproduction.com'
    },
    {
      city: 'Dubai',
      country: 'UAE',
      address: '321 Business Bay, Dubai, UAE',
      phone: '+971 4 123 4567',
      email: 'dubai@mopiproduction.com'
    }
  ];

  const faqs = [
    {
      question: 'What is your typical project timeline?',
      answer: 'Project timelines vary based on complexity, but typically range from 4-12 weeks from concept to completion. We provide detailed timelines during the initial consultation.'
    },
    {
      question: 'Do you handle international projects?',
      answer: 'Yes, we have successfully delivered projects in over 50 countries worldwide. Our global network ensures seamless execution regardless of location.'
    },
    {
      question: 'What services are included in your packages?',
      answer: 'Our comprehensive packages include design, fabrication, installation, project management, and post-event support. Custom packages are available based on specific needs.'
    },
    {
      question: 'How do you ensure quality control?',
      answer: 'We maintain ISO 9001 certification and implement rigorous quality control processes at every stage, from design approval to final installation.'
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
            src="https://images.unsplash.com/photo-1758193017781-e3aee6c3e359?w=1920&auto=format&fit=crop&q=80" 
            alt="Contact Us" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center text-white">
            <Badge className="mb-6 gradient-primary text-white">Contact Us</Badge>
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
              Let's Create Something
              <span className="block text-gradient">Extraordinary</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Ready to transform your brand presence? Get in touch with our expert team 
              and let's discuss your next exhibition project.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-heading font-bold mb-6">Get Your Free Quote</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Fill out the form below and we'll get back to you within 2 hours with a 
                custom proposal for your project.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <Input
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <Input
                      type="email"
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name</label>
                    <Input
                      placeholder="Your Company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Service Needed *</label>
                    <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exhibition-booth">Exhibition Booth Design</SelectItem>
                        <SelectItem value="event-production">Event Production</SelectItem>
                        <SelectItem value="custom-structures">Custom Structures</SelectItem>
                        <SelectItem value="branding-fabrication">Branding & Fabrication</SelectItem>
                        <SelectItem value="consultation">Consultation Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Budget Range</label>
                    <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-25k">Under $25,000</SelectItem>
                        <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                        <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                        <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                        <SelectItem value="over-250k">Over $250,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Project Timeline</label>
                  <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="When do you need this completed?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">ASAP (Rush Job)</SelectItem>
                      <SelectItem value="1-month">Within 1 Month</SelectItem>
                      <SelectItem value="2-3-months">2-3 Months</SelectItem>
                      <SelectItem value="3-6-months">3-6 Months</SelectItem>
                      <SelectItem value="6-months-plus">6+ Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Project Details *</label>
                  <Textarea
                    placeholder="Please describe your project requirements, event details, target audience, and any specific needs or preferences..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full gradient-primary text-white shadow-elegant hover:shadow-glow transition-smooth">
                  <Send className="mr-2 h-5 w-5" />
                  Send Quote Request
                </Button>
              </form>
            </div>
            
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-heading font-bold mb-6">Get In Touch</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Have questions? Our expert team is here to help you create the perfect 
                exhibition experience for your brand.
              </p>
              
              <div className="space-y-6 mb-8">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="hover:shadow-elegant transition-smooth">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {info.icon}
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold text-lg mb-2">{info.title}</h3>
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-muted-foreground mb-1">{detail}</p>
                          ))}
                          <p className="text-sm text-primary font-medium">{info.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card className="gradient-primary text-white">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <MessageSquare className="h-6 w-6" />
                    <h3 className="font-heading font-semibold text-lg">Quick Response Guarantee</h3>
                  </div>
                  <p className="text-white/90 mb-4">
                    We understand that exhibition planning is time-sensitive. That's why we guarantee 
                    a response to all inquiries within 2 hours during business hours.
                  </p>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm">Average response time: 45 minutes</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Global Offices */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Global
              <span className="text-gradient block">Presence</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              With offices worldwide, we're always close to your next project. 
              Our global network ensures consistent quality and local expertise.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {offices.map((office, index) => (
              <Card key={index} className="text-center hover:shadow-elegant transition-smooth">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-2">
                    {office.city}, {office.country}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{office.address}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center space-x-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{office.phone}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>{office.email}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Frequently Asked
              <span className="text-gradient block">Questions</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Get quick answers to common questions about our services and processes.
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-elegant transition-smooth">
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-lg mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white transition-smooth">
              Contact Our Support Team
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Ready to Get
            <span className="text-gradient block">Started?</span>
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Don't wait - exhibition spaces book up fast. Contact us today to secure 
            your spot and start planning your next successful event.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gradient-primary text-white shadow-glow hover:shadow-elegant transition-smooth">
              Schedule Free Consultation <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black transition-smooth">
              <Phone className="mr-2 h-5 w-5" /> Call Now: +1 (555) 123-4567
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

export default Contact;