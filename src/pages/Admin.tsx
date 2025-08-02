import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import SecurityDashboard from '@/components/SecurityDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Eye, Users, FileText, BarChart3, Shield, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  is_published: boolean;
  created_at: string;
  view_count: number;
  author_name: string;
}

interface User {
  id: string;
  email: string;
  created_at: string;
  profiles: {
    display_name: string;
  }[];
  user_roles: {
    role: string;
  }[];
}

const Admin = () => {
  const { userRole } = useAuth();
  const { toast } = useToast();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    totalUsers: 0,
    totalViews: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    try {
      // Fetch blog posts
      const { data: posts, error: postsError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;
      setBlogPosts(posts || []);

      // Fetch users (admin only)
      if (userRole === 'admin') {
        const { data: userData, error: usersError } = await supabase
          .from('profiles')
          .select('user_id, display_name, created_at');

        if (usersError) throw usersError;
        
        // Transform data to match User interface
        const transformedUsers = userData?.map(profile => ({
          id: profile.user_id,
          email: '', // We can't access auth.users email directly
          created_at: profile.created_at,
          profiles: [{ display_name: profile.display_name }],
          user_roles: [{ role: 'user' }] // Default role for display
        })) || [];
        
        setUsers(transformedUsers);
      }

      // Calculate stats
      const totalViews = posts?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;
      setStats({
        totalPosts: posts?.length || 0,
        publishedPosts: posts?.filter(post => post.is_published).length || 0,
        totalUsers: userRole === 'admin' ? users.length : 0,
        totalViews
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load admin data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePostPublish = async (postId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ is_published: !currentStatus })
        .eq('id', postId);

      if (error) throw error;

      setBlogPosts(posts => 
        posts.map(post => 
          post.id === postId 
            ? { ...post, is_published: !currentStatus }
            : post
        )
      );

      toast({
        title: 'Success',
        description: `Post ${!currentStatus ? 'published' : 'unpublished'} successfully`
      });
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to update post',
        variant: 'destructive'
      });
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setBlogPosts(posts => posts.filter(post => post.id !== postId));
      
      toast({
        title: 'Success',
        description: 'Post deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading admin panel...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <ProtectedRoute requiredRole="moderator">
      <Layout>
        <SEO 
          title="Admin Panel - Yara Agency"
          description="Admin panel for managing content and users"
        />
        
        <div className="container-custom py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage your website content and users
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPosts}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.publishedPosts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews}</div>
              </CardContent>
            </Card>

            {userRole === 'admin' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                </CardContent>
              </Card>
            )}
          </div>

          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList>
              <TabsTrigger value="posts">Blog Posts</TabsTrigger>
              {userRole === 'admin' && (
                <TabsTrigger value="users">Users</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="posts" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Blog Posts</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </div>

              <div className="space-y-4">
                {blogPosts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <CardDescription>{post.excerpt}</CardDescription>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>By {post.author_name}</span>
                            <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
                            <span>{post.view_count || 0} views</span>
                            <Badge variant={post.category === 'Technology' ? 'default' : 'secondary'}>
                              {post.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={post.is_published ? 'default' : 'secondary'}>
                            {post.is_published ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => togglePostPublish(post.id, post.is_published)}
                        >
                          {post.is_published ? 'Unpublish' : 'Publish'}
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deletePost(post.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {blogPosts.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No blog posts found</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {userRole === 'admin' && (
              <TabsContent value="users" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Users</h2>
                </div>

                <div className="space-y-4">
                  {users.map((user) => (
                    <Card key={user.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <CardTitle className="text-lg">
                              {user.profiles[0]?.display_name || 'Unknown User'}
                            </CardTitle>
                            <CardDescription>
                              Joined {format(new Date(user.created_at), 'MMM d, yyyy')}
                            </CardDescription>
                          </div>
                          <div className="flex items-center space-x-2">
                            {user.user_roles.map((roleData, index) => (
                              <Badge key={index} variant="outline">
                                {roleData.role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                  
                  {users.length === 0 && (
                    <Card>
                      <CardContent className="text-center py-8">
                        <Users className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No users found</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Admin;