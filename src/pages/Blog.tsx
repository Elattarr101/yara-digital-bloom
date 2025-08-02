import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, ArrowRight, ChevronLeft, ChevronRight, User } from 'lucide-react';
import Layout from '../components/Layout';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string;
  author_name: string;
  author_avatar?: string;
  category: string;
  reading_time: number;
  published_date: string;
  view_count: number;
}

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Latest');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;
  const { toast } = useToast();

  const categories = ['All', 'Digital Marketing', 'Web Design', 'Branding', 'Case Studies'];
  const sortOptions = ['Latest', 'Popular', 'Oldest'];

  const categoryColors = {
    'Digital Marketing': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    'Web Design': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    'Branding': 'bg-pink-100 text-pink-800 hover:bg-pink-200',
    'Case Studies': 'bg-green-100 text-green-800 hover:bg-green-200',
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    filterAndSortPosts();
  }, [blogPosts, searchQuery, selectedCategory, sortBy]);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_date', { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: "Error loading blog posts",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPosts = () => {
    let filtered = [...blogPosts];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'Popular':
          return b.view_count - a.view_count;
        case 'Oldest':
          return new Date(a.published_date).getTime() - new Date(b.published_date).getTime();
        case 'Latest':
        default:
          return new Date(b.published_date).getTime() - new Date(a.published_date).getTime();
      }
    });

    setFilteredPosts(filtered);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCurrentPagePosts = () => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handleReadMore = async (post: BlogPost) => {
    // Increment view count
    try {
      await supabase
        .from('blog_posts')
        .update({ view_count: post.view_count + 1 })
        .eq('id', post.id);
    } catch (error) {
      console.error('Error updating view count:', error);
    }
    
    // Navigate to blog post (placeholder for now)
    toast({
      title: "Coming Soon",
      description: `Individual blog post pages will be available soon. Viewing: ${post.title}`,
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading blog posts...</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Insights & Resources</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest trends in digital marketing and design
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="mb-12">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  {/* Search Input */}
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Category Filter */}
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Sort Dropdown */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-32">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {getCurrentPagePosts().map((post) => (
              <Card key={post.id} className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden">
                {/* Featured Image */}
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.featured_image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <CardContent className="p-6">
                  {/* Category Badge */}
                  <Badge className={`mb-3 ${categoryColors[post.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'}`}>
                    {post.category}
                  </Badge>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-200 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Author & Date */}
                  <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {post.author_avatar ? (
                        <img
                          src={post.author_avatar}
                          alt={post.author_name}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-3 w-3 text-primary" />
                        </div>
                      )}
                      <span>{post.author_name}</span>
                    </div>
                    <span>•</span>
                    <span>{formatDate(post.published_date)}</span>
                  </div>

                  {/* Reading Time */}
                  <div className="flex items-center gap-1 mb-4 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{post.reading_time} min read</span>
                  </div>

                  {/* Excerpt */}
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Read More Link */}
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-semibold text-primary hover:text-primary/80 group/button"
                    onClick={() => handleReadMore(post)}
                  >
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4 group-hover/button:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground mb-4">No articles found</p>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Page Info */}
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * postsPerPage + 1} to{' '}
                    {Math.min(currentPage * postsPerPage, filteredPosts.length)} of{' '}
                    {filteredPosts.length} articles
                  </p>

                  {/* Pagination Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>

                  {/* Load More for Mobile */}
                  <div className="sm:hidden w-full">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Load More Articles
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Blog;