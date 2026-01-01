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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  LogOut,
  UserPlus,
  Shield,
  Activity,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const AdminDashboard = () => {
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

  // User Management State
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userForm, setUserForm] = useState({
    email: '',
    full_name: '',
    password: '',
    role: 'editor',
    department: '',
    phone: '',
    is_active: true
  });

  // Logo Management State
  const [logos, setLogos] = useState({
    header: { url: './images/mopi_logo_20260101_112924.png', alt: 'MOPi Production' },
    footer: { url: './images/mopi_logo_20260101_112924.png', alt: 'MOPi Production' }
  });
  const [showLogoUpload, setShowLogoUpload] = useState(false);
  const [logoType, setLogoType] = useState('header');

  // Load content from database
  useEffect(() => {
    checkAuth();
    loadContent();
    loadPortfolio();
    loadUsers();
    loadRoles();
    loadActivityLogs();
    loadLogos();
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

  const loadUsers = async () => {
    try {
      const { data: usersData } = await supabase
        .from('admin_users_2026_01_01_12_50')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (usersData) {
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadRoles = async () => {
    try {
      const { data: rolesData } = await supabase
        .from('user_roles_2026_01_01_12_50')
        .select('*')
        .order('role_name');
      
      if (rolesData) {
        setRoles(rolesData);
      }
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  };

  const loadActivityLogs = async () => {
    try {
      const { data: logsData } = await supabase
        .from('user_activity_logs_2026_01_01_12_50')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (logsData) {
        setActivityLogs(logsData);
      }
    } catch (error) {
      console.error('Error loading activity logs:', error);
    }
  };

  const loadLogos = async () => {
    try {
      const { data: logoData } = await supabase
        .from('logo_settings_2026_01_01_13_00')
        .select('*');
      
      if (logoData) {
        const logoSettings = {};
        logoData.forEach(logo => {
          logoSettings[logo.logo_type] = {
            url: logo.logo_url,
            alt: logo.alt_text,
            name: logo.logo_name
          };
        });
        setLogos(logoSettings);
      }
    } catch (error) {
      console.error('Error loading logos:', error);
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
      
      // Log activity
      await logActivity('login', 'auth', null, { method: 'email' });
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
  };

  const logActivity = async (action, resourceType = null, resourceId = null, details = null) => {
    try {
      await supabase
        .from('user_activity_logs_2026_01_01_12_50')
        .insert({
          user_email: user?.email || 'unknown',
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details
        });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
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
      
      await logActivity('update_content', 'content', sectionName, { section: sectionName });
      alert('Content saved successfully!');
    } catch (error) {
      alert('Error saving content: ' + error.message);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userForm.email,
        password: userForm.password,
        email_confirm: true
      });
      
      if (authError) throw authError;
      
      // Create user profile in admin_users table
      const { error } = await supabase
        .from('admin_users_2026_01_01_12_50')
        .insert({
          ...userForm,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      await logActivity('create_user', 'user', userForm.email, { role: userForm.role });
      setShowUserModal(false);
      setUserForm({
        email: '',
        full_name: '',
        password: '',
        role: 'editor',
        department: '',
        phone: '',
        is_active: true
      });
      loadUsers();
      alert('User created successfully!');
    } catch (error) {
      alert('Error creating user: ' + error.message);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('admin_users_2026_01_01_12_50')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      await logActivity('toggle_user_status', 'user', userId, { new_status: !currentStatus });
      loadUsers();
    } catch (error) {
      alert('Error updating user status: ' + error.message);
    }
  };

  const deleteUser = async (userId, userEmail) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const { error } = await supabase
        .from('admin_users_2026_01_01_12_50')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
      
      await logActivity('delete_user', 'user', userEmail);
      loadUsers();
      alert('User deleted successfully!');
    } catch (error) {
      alert('Error deleting user: ' + error.message);
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
    const newMedia = {
      id: media.length + 1,
      name: 'new-image.jpg',
      type: 'image',
      size: '1.2 MB',
      url: 'https://images.unsplash.com/photo-1656257683123-fd9cd2f2fb40?w=400&auto=format&fit=crop&q=80'
    };
    setMedia(prev => [...prev, newMedia]);
    logActivity('upload_media', 'media', newMedia.name, { file_size: newMedia.size });
  };

  const handleLogoUpload = async (logoType, file) => {
    try {
      // In a real implementation, you would upload the file to storage
      // For demo purposes, we'll simulate the upload
      const newLogoUrl = URL.createObjectURL(file);
      
      const { error } = await supabase
        .from('logo_settings_2026_01_01_13_00')
        .upsert({
          logo_type: logoType,
          logo_url: newLogoUrl,
          logo_name: file.name,
          file_size: file.size,
          alt_text: `MOPi Production ${logoType} Logo`,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      await logActivity('update_logo', 'logo', logoType, { file_name: file.name });
      loadLogos();
      alert(`${logoType} logo updated successfully!`);
    } catch (error) {
      alert('Error updating logo: ' + error.message);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'editor': return 'bg-green-100 text-green-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'login': return 'bg-green-100 text-green-800';
      case 'create_user': return 'bg-blue-100 text-blue-800';
      case 'delete_user': return 'bg-red-100 text-red-800';
      case 'update_content': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
              <p className="text-muted-foreground">Manage your website content, users, design, and settings</p>
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
            <TabsList className="grid w-full grid-cols-6">
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
              <TabsTrigger value="users" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Users</span>
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
              
              {/* Logo Management Section */}
              <div className="mt-8">
                <h3 className="text-xl font-heading font-bold mb-4">Logo Management</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Header Logo */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Image className="h-5 w-5" />
                        <span>Header Logo</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <img 
                          src={logos.header?.url || './images/mopi_logo_20260101_112924.png'} 
                          alt={logos.header?.alt || 'Header Logo'}
                          className="max-h-20 w-auto"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Current: {logos.header?.name || 'mopi_logo_header.png'}</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleLogoUpload('header', file);
                          }}
                          className="hidden"
                          id="header-logo-upload"
                        />
                        <Button 
                          onClick={() => document.getElementById('header-logo-upload')?.click()}
                          className="w-full gradient-primary text-white"
                        >
                          <Upload className="mr-2 h-4 w-4" /> Upload Header Logo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Footer Logo */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Image className="h-5 w-5" />
                        <span>Footer Logo</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <img 
                          src={logos.footer?.url || './images/mopi_logo_20260101_112924.png'} 
                          alt={logos.footer?.alt || 'Footer Logo'}
                          className="max-h-20 w-auto"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Current: {logos.footer?.name || 'mopi_logo_footer.png'}</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleLogoUpload('footer', file);
                          }}
                          className="hidden"
                          id="footer-logo-upload"
                        />
                        <Button 
                          onClick={() => document.getElementById('footer-logo-upload')?.click()}
                          className="w-full gradient-primary text-white"
                        >
                          <Upload className="mr-2 h-4 w-4" /> Upload Footer Logo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Logo Usage Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Header Logo</h4>
                        <ul className="space-y-1">
                          <li>• Recommended size: 200x80px</li>
                          <li>• Format: PNG with transparent background</li>
                          <li>• Used in navigation bar across all pages</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Footer Logo</h4>
                        <ul className="space-y-1">
                          <li>• Recommended size: 160x64px</li>
                          <li>• Format: PNG with transparent background</li>
                          <li>• Used in footer across all pages</li>
                        </ul>
                      </div>
                    </div>
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

            {/* User Management */}
            <TabsContent value="users" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-heading font-bold">User Management</h2>
                <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
                  <DialogTrigger asChild>
                    <Button className="gradient-primary text-white">
                      <UserPlus className="mr-2 h-4 w-4" /> Add New User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUserSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Email *</label>
                          <Input
                            type="email"
                            value={userForm.email}
                            onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="user@mopiproduction.com"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Full Name</label>
                          <Input
                            value={userForm.full_name}
                            onChange={(e) => setUserForm(prev => ({ ...prev, full_name: e.target.value }))}
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Password *</label>
                        <Input
                          type="password"
                          value={userForm.password}
                          onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Enter secure password"
                          required
                          minLength={6}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Role</label>
                          <Select value={userForm.role} onValueChange={(value) => setUserForm(prev => ({ ...prev, role: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.id} value={role.role_name}>
                                  {role.role_name.replace('_', ' ').toUpperCase()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Department</label>
                          <Input
                            value={userForm.department}
                            onChange={(e) => setUserForm(prev => ({ ...prev, department: e.target.value }))}
                            placeholder="Marketing"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <Input
                          value={userForm.phone}
                          onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={userForm.is_active}
                          onCheckedChange={(checked) => setUserForm(prev => ({ ...prev, is_active: checked }))}
                        />
                        <label className="text-sm font-medium">Active User</label>
                      </div>
                      <Button type="submit" className="w-full gradient-primary text-white">
                        <Save className="mr-2 h-4 w-4" /> Create User
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Users Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>All Users ({users.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{user.full_name || user.email}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getRoleColor(user.role)}>
                                {user.role.replace('_', ' ').toUpperCase()}
                              </Badge>
                              {user.department && (
                                <Badge variant="outline" className="text-xs">
                                  {user.department}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2">
                            {user.is_active ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-sm text-muted-foreground">
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleUserStatus(user.id, user.is_active)}
                          >
                            {user.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteUser(user.id, user.email)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Activity Logs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activityLogs.slice(0, 10).map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Badge className={getActionColor(log.action)}>
                            {log.action.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <div>
                            <p className="text-sm font-medium">{log.user_email}</p>
                            <p className="text-xs text-muted-foreground">
                              {log.resource_type && `${log.resource_type}: ${log.resource_id}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(log.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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

export default AdminDashboard;