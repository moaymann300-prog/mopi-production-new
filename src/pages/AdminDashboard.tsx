import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navigation from '@/components/Navigation';
import { 
  Settings, 
  Upload, 
  Save, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Image,
  Type,
  Palette,
  Globe,
  BarChart3,
  Users,
  Mail,
  FileText,
  Monitor,
  Smartphone,
  Tablet,
  LogOut
} from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // Content Management State
  const [content, setContent] = useState({
    hero: {
      title: 'Crafting Exceptional Exhibition Experiences',
      subtitle: 'MOPi Production specializes in creating stunning exhibition booths, memorable events, and custom structures that elevate your brand presence.',
      ctaText: 'Get Started'
    },
    about: {
      title: 'Building Excellence in Exhibition Design',
      description: 'With over 15 years of experience in the exhibition and event industry, MOPi Production has established itself as a leader in creating innovative and impactful brand experiences.'
    }
  });

  // Media Management State
  const [media, setMedia] = useState([
    { id: 1, name: 'hero-booth.jpg', type: 'image', size: '2.4 MB', url: './images/hero_booth_20260101_112925.png' },
    { id: 2, name: 'hero-event.jpg', type: 'image', size: '1.8 MB', url: './images/hero_event_20260101_112925.png' },
    { id: 3, name: 'mopi-logo.png', type: 'image', size: '156 KB', url: './images/mopi_logo_20260101_112924.png' }
  ]);

  // Design System State
  const [designSystem, setDesignSystem] = useState({
    colors: {
      primary: '#F4A300',
      secondary: '#2B2B2B',
      background: '#FFFFFF',
      text: '#000000'
    },
    fonts: {
      heading: 'Poppins',
      body: 'Inter'
    }
  });

  // Portfolio Management State
  const [portfolio, setPortfolio] = useState([]);

  // Load content from database
  useEffect(() => {
    checkAuth();
    loadContent();
    loadPortfolio();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    setUser(session?.user || null);
    setLoading(false);
  };

  const loadContent = async () => {
    try {
      const { data: sections } = await supabase
        .from('content_sections_2026_01_01_12_30')
        .select('*');
      
      if (sections) {
        const contentData = {};
        sections.forEach(section => {
          contentData[section.section_name] = {
            title: section.title,
            subtitle: section.subtitle,
            description: section.description,
            ctaText: section.cta_text
          };
        });
        setContent(prev => ({ ...prev, ...contentData }));
      }
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const loadPortfolio = async () => {
    try {
      const { data: projects } = await supabase
        .from('portfolio_projects_2026_01_01_12_30')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (projects) {
        setPortfolio(projects);
      }
    } catch (error) {
      console.error('Error loading portfolio:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password
      });
      
      if (error) throw error;
      
      setIsAuthenticated(true);
      setUser(data.user);
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleContentUpdate = (section: string, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const saveContent = async (sectionName: string) => {
    try {
      const sectionData = content[sectionName];
      const { error } = await supabase
        .from('content_sections_2026_01_01_12_30')
        .upsert({
          section_name: sectionName,
          title: sectionData.title,
          subtitle: sectionData.subtitle,
          description: sectionData.description,
          cta_text: sectionData.ctaText,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      alert('Content saved successfully!');
    } catch (error) {
      alert('Error saving content: ' + error.message);
    }
  };

  const handleColorChange = (colorType: string, value: string) => {
    setDesignSystem(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: value
      }
    }));
  };

  const handleMediaUpload = () => {
    // Simulate file upload
    const newMedia = {
      id: media.length + 1,
      name: 'new-image.jpg',
      type: 'image',
      size: '1.2 MB',
      url: 'https://images.unsplash.com/photo-1656257683123-fd9cd2f2fb40?w=400&auto=format&fit=crop&q=80'
    };
    setMedia(prev => [...prev, newMedia]);
  };

  // Login form for non-authenticated users
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <section className="pt-16 pb-20">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Admin Login</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="admin@mopiproduction.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <Input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full gradient-primary text-white">
                    Login to Admin Dashboard
                  </Button>
                </form>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    Demo Access: Use any email/password to access the dashboard
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Admin Header */}
      <section className="pt-16 pb-8 bg-muted border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your website content, design, and settings</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="gradient-primary text-white">
                <Settings className="mr-1 h-3 w-3" /> Admin Access - {user?.email}
              </Badge>
              <Button className="gradient-primary text-white">
                <Eye className="mr-2 h-4 w-4" /> Preview Site
              </Button>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="content" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Content</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center space-x-2">
                <Image className="h-4 w-4" />
                <span>Media</span>
              </TabsTrigger>
              <TabsTrigger value="design" className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span>Design</span>
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Portfolio</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Content Management */}
            <TabsContent value="content" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Type className="h-5 w-5" />
                        <span>Hero Section</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Main Title</label>
                        <Input
                          value={content.hero?.title || ''}
                          onChange={(e) => handleContentUpdate('hero', 'title', e.target.value)}
                          placeholder="Enter hero title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Subtitle</label>
                        <Textarea
                          value={content.hero?.subtitle || ''}
                          onChange={(e) => handleContentUpdate('hero', 'subtitle', e.target.value)}
                          placeholder="Enter hero subtitle"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">CTA Button Text</label>
                        <Input
                          value={content.hero?.ctaText || ''}
                          onChange={(e) => handleContentUpdate('hero', 'ctaText', e.target.value)}
                          placeholder="Enter button text"
                        />
                      </div>
                      <Button 
                        onClick={() => saveContent('hero')}
                        className="w-full gradient-primary text-white"
                      >
                        <Save className="mr-2 h-4 w-4" /> Save Hero Content
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>About Section</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Section Title</label>
                        <Input
                          value={content.about?.title || ''}
                          onChange={(e) => handleContentUpdate('about', 'title', e.target.value)}
                          placeholder="Enter about title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Textarea
                          value={content.about?.description || ''}
                          onChange={(e) => handleContentUpdate('about', 'description', e.target.value)}
                          placeholder="Enter about description"
                          rows={4}
                        />
                      </div>
                      <Button 
                        onClick={() => saveContent('about')}
                        className="w-full gradient-primary text-white"
                      >
                        <Save className="mr-2 h-4 w-4" /> Save About Content
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Eye className="h-5 w-5" />
                          <span>Live Preview</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant={previewMode === 'desktop' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPreviewMode('desktop')}
                          >
                            <Monitor className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={previewMode === 'tablet' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPreviewMode('tablet')}
                          >
                            <Tablet className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={previewMode === 'mobile' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPreviewMode('mobile')}
                          >
                            <Smartphone className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`border rounded-lg p-4 bg-white ${
                        previewMode === 'mobile' ? 'max-w-sm mx-auto' : 
                        previewMode === 'tablet' ? 'max-w-2xl mx-auto' : 'w-full'
                      }`}>
                        <div className="text-center space-y-4">
                          <h2 className="text-2xl font-heading font-bold">{content.hero?.title}</h2>
                          <p className="text-muted-foreground">{content.hero?.subtitle}</p>
                          <Button className="gradient-primary text-white">{content.hero?.ctaText}</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Media Management */}
            <TabsContent value="media" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-heading font-bold">Media Library</h2>
                <Button onClick={handleMediaUpload} className="gradient-primary text-white">
                  <Upload className="mr-2 h-4 w-4" /> Upload Media
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {media.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted">
                      <img 
                        src={item.url} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.size}</p>
                      <div className="flex items-center space-x-2 mt-3">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <Badge variant="secondary" className="text-xs">Logo</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload new media</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Design System */}
            <TabsContent value="design" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Palette className="h-5 w-5" />
                      <span>Color Palette</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Primary Color</label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="color"
                            value={designSystem.colors.primary}
                            onChange={(e) => handleColorChange('primary', e.target.value)}
                            className="w-12 h-10 p-1 border rounded"
                          />
                          <Input
                            value={designSystem.colors.primary}
                            onChange={(e) => handleColorChange('primary', e.target.value)}
                            placeholder="#F4A300"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Secondary Color</label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="color"
                            value={designSystem.colors.secondary}
                            onChange={(e) => handleColorChange('secondary', e.target.value)}
                            className="w-12 h-10 p-1 border rounded"
                          />
                          <Input
                            value={designSystem.colors.secondary}
                            onChange={(e) => handleColorChange('secondary', e.target.value)}
                            placeholder="#2B2B2B"
                          />
                        </div>
                      </div>
                    </div>
                    <Button className="w-full gradient-primary text-white">
                      <Save className="mr-2 h-4 w-4" /> Apply Color Changes
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Type className="h-5 w-5" />
                      <span>Typography</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Heading Font</label>
                      <Select value={designSystem.fonts.heading}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Poppins">Poppins</SelectItem>
                          <SelectItem value="Montserrat">Montserrat</SelectItem>
                          <SelectItem value="Inter">Inter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Body Font</label>
                      <Select value={designSystem.fonts.body}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full gradient-primary text-white">
                      <Save className="mr-2 h-4 w-4" /> Apply Font Changes
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Portfolio Management */}
            <TabsContent value="portfolio" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-heading font-bold">Portfolio Management</h2>
                <Button className="gradient-primary text-white">
                  <Plus className="mr-2 h-4 w-4" /> Add New Project
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.map((project) => (
                  <Card key={project.id} className="overflow-hidden">
                    <div className="aspect-video">
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{project.category}</Badge>
                        {project.is_featured && (
                          <Badge className="gradient-primary text-white">Featured</Badge>
                        )}
                      </div>
                      <h3 className="font-heading font-semibold mb-1">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{project.client}</p>
                      <p className="text-xs text-muted-foreground mb-3">{project.location}</p>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <Switch checked={project.is_featured} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings" className="space-y-6">
              <h2 className="text-2xl font-heading font-bold">Website Settings</h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <span>SEO Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Site Title</label>
                      <Input placeholder="MOPi Production - Exhibition Design Experts" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Meta Description</label>
                      <Textarea 
                        placeholder="Professional exhibition booth design and event production services..."
                        rows={3}
                      />
                    </div>
                    <Button className="w-full gradient-primary text-white">
                      <Save className="mr-2 h-4 w-4" /> Save SEO Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5" />
                      <span>General Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Logo Management</p>
                        <p className="text-sm text-muted-foreground">Upload and manage site logos</p>
                      </div>
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" /> Upload Logo
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Contact Form</p>
                        <p className="text-sm text-muted-foreground">Enable contact form submissions</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Analytics Tracking</p>
                        <p className="text-sm text-muted-foreground">Enable Google Analytics</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; 2024 MOPi Production Admin Dashboard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Admin;