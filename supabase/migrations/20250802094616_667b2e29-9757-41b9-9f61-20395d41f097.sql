-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  category TEXT NOT NULL,
  reading_time INTEGER NOT NULL, -- in minutes
  published_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  view_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read published blog posts
CREATE POLICY "Anyone can view published blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (is_published = true);

-- Create policy to allow only authenticated users to manage blog posts
CREATE POLICY "Only authenticated users can manage blog posts" 
ON public.blog_posts 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX idx_blog_posts_published_date ON public.blog_posts(published_date DESC);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);

-- Insert sample blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, featured_image, author_name, category, reading_time, published_date) VALUES
('10 Digital Marketing Trends That Will Dominate 2025', '10-digital-marketing-trends-2025', 'Discover the cutting-edge digital marketing strategies that will shape business success in 2025. From AI-powered personalization to voice search optimization.', 'Full content about digital marketing trends...', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Sarah Johnson', 'Digital Marketing', 5, '2025-01-15T10:00:00Z'),

('How to Choose the Perfect Color Palette for Your Brand', 'perfect-color-palette-branding', 'Learn the psychology behind color choices and how to create a memorable brand identity that resonates with your target audience.', 'Full content about color psychology...', 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Michael Chen', 'Branding', 4, '2025-01-12T14:30:00Z'),

('Case Study: How We Increased Client Sales by 300%', 'case-study-300-percent-sales-increase', 'A detailed breakdown of our strategic approach that transformed a struggling e-commerce business into a market leader.', 'Full case study content...', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Emma Rodriguez', 'Case Studies', 8, '2025-01-10T09:15:00Z'),

('The Future of Web Design: AI and User Experience', 'future-web-design-ai-ux', 'Explore how artificial intelligence is revolutionizing web design and creating more intuitive, personalized user experiences.', 'Full content about AI in web design...', 'https://images.unsplash.com/photo-1469474968028-56623f02e42d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'David Kim', 'Web Design', 6, '2025-01-08T16:45:00Z'),

('Social Media Marketing: Best Practices for Small Businesses', 'social-media-marketing-small-business', 'Practical strategies and actionable tips to help small businesses maximize their social media presence and engagement.', 'Full content about social media marketing...', 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Alex Williams', 'Digital Marketing', 7, '2025-01-05T11:20:00Z'),

('Building Brand Trust in the Digital Age', 'building-brand-trust-digital-age', 'Strategies for establishing and maintaining customer trust in an increasingly digital and competitive marketplace.', 'Full content about brand trust...', 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Lisa Thompson', 'Branding', 5, '2025-01-03T13:10:00Z'),

('Website Speed Optimization: A Complete Guide', 'website-speed-optimization-guide', 'Comprehensive guide to improving your website performance, reducing load times, and enhancing user experience.', 'Full content about website optimization...', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'David Kim', 'Web Design', 10, '2024-12-30T08:00:00Z'),

('Email Marketing That Actually Converts', 'email-marketing-conversion-strategies', 'Proven tactics and psychological triggers that turn email subscribers into paying customers and loyal brand advocates.', 'Full content about email marketing...', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Emma Rodriguez', 'Digital Marketing', 6, '2024-12-28T15:30:00Z'),

('Logo Design Psychology: Colors, Shapes, and Emotions', 'logo-design-psychology-guide', 'Understanding the subconscious impact of design elements and how to create logos that evoke the right emotional response.', 'Full content about logo design psychology...', 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Michael Chen', 'Branding', 8, '2024-12-25T12:00:00Z');