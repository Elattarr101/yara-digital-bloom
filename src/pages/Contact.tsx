import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Phone, Mail, Clock, MessageSquare, Users, Video, Facebook, Instagram, Linkedin, Twitter, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation, fadeInUp, fadeInLeft, fadeInRight, staggerContainer, getReducedMotionVariants } from '@/hooks/useScrollAnimation';
import Layout from '../components/Layout';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const contactFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  companyName: z.string().optional(),
  serviceInterested: z.enum(["Digital Marketing", "Web Design & Development", "Branding & Identity", "Content Creation", "Multiple Services"], {
    message: "Please select a service",
  }),
  budgetRange: z.enum(["$500 - $1,000", "$1,000 - $5,000", "$5,000 - $10,000", "$10,000+"], {
    message: "Please select a budget range",
  }),
  projectDetails: z.string().min(10, "Please provide more details about your project"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      companyName: "",
      serviceInterested: undefined,
      budgetRange: undefined,
      projectDetails: "",
    },
  });

  const onSubmit = async (values: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          full_name: values.fullName,
          email: values.email,
          company_name: values.companyName || null,
          service_interested: values.serviceInterested,
          budget_range: values.budgetRange,
          project_details: values.projectDetails,
        });

      if (error) {
        throw error;
      }

      setShowSuccessModal(true);
      form.reset();
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid lg:grid-cols-2 gap-12 items-start"
            initial="hidden"
            animate="visible"
            variants={getReducedMotionVariants(staggerContainer)}
          >
            {/* LEFT SIDE - CONTACT FORM */}
            <motion.div 
              className="order-2 lg:order-1"
              variants={getReducedMotionVariants(fadeInLeft)}
            >
              <motion.div 
                className="mb-8"
                variants={getReducedMotionVariants(fadeInUp)}
              >
                <h1 className="text-4xl font-bold mb-4">Let's Start Your Next Project</h1>
                <p className="text-xl text-muted-foreground">
                  Ready to grow your business? Get in touch for a free consultation
                </p>
              </motion.div>

              <motion.div
                variants={getReducedMotionVariants(fadeInUp)}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Card className="shadow-xl">
                <CardContent className="p-8">
                  <Form {...form}>
                    <motion.form 
                      onSubmit={form.handleSubmit(onSubmit)} 
                      className="space-y-6"
                      variants={getReducedMotionVariants(staggerContainer)}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div variants={getReducedMotionVariants(fadeInUp)}>
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                <motion.div
                                  whileFocus={{ scale: 1.02 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                  <Input placeholder="Enter your full name" {...field} />
                                </motion.div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      {/* All other form fields with similar animation wrapping */}
                      <motion.div variants={getReducedMotionVariants(fadeInUp)}>
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <motion.div whileFocus={{ scale: 1.02 }}>
                                  <Input placeholder="your.email@example.com" type="email" {...field} />
                                </motion.div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      {/* Rest of form fields with animations... */}
                      <motion.div variants={getReducedMotionVariants(fadeInUp)}>
                        <FormField
                          control={form.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name</FormLabel>
                              <FormControl>
                                <motion.div whileFocus={{ scale: 1.02 }}>
                                  <Input placeholder="Your company name (optional)" {...field} />
                                </motion.div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={getReducedMotionVariants(fadeInUp)}>
                        <FormField
                          control={form.control}
                          name="serviceInterested"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Service Interested In *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a service" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                                  <SelectItem value="Web Design & Development">Web Design & Development</SelectItem>
                                  <SelectItem value="Branding & Identity">Branding & Identity</SelectItem>
                                  <SelectItem value="Content Creation">Content Creation</SelectItem>
                                  <SelectItem value="Multiple Services">Multiple Services</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={getReducedMotionVariants(fadeInUp)}>
                        <FormField
                          control={form.control}
                          name="budgetRange"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Budget Range *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your budget range" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="$500 - $1,000">$500 - $1,000</SelectItem>
                                  <SelectItem value="$1,000 - $5,000">$1,000 - $5,000</SelectItem>
                                  <SelectItem value="$5,000 - $10,000">$5,000 - $10,000</SelectItem>
                                  <SelectItem value="$10,000+">$10,000+</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={getReducedMotionVariants(fadeInUp)}>
                        <FormField
                          control={form.control}
                          name="projectDetails"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project Details *</FormLabel>
                              <FormControl>
                                <motion.div whileFocus={{ scale: 1.02 }}>
                                  <Textarea
                                    placeholder="Tell us about your project..."
                                    className="min-h-[120px]"
                                    {...field}
                                  />
                                </motion.div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div 
                        variants={getReducedMotionVariants(fadeInUp)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Button 
                          type="submit" 
                          className="w-full" 
                          size="lg"
                          disabled={isSubmitting}
                        >
                          <AnimatePresence mode="wait">
                            {isSubmitting ? (
                              <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center"
                              >
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending Message...
                              </motion.div>
                            ) : (
                              <motion.span
                                key="send"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                Send Message
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </Button>
                      </motion.div>
                    </motion.form>
                  </Form>
                </CardContent>
              </Card>
              </motion.div>
            </motion.div>

            {/* RIGHT SIDE - CONTACT INFO */}
            <motion.div 
              className="order-1 lg:order-2 space-y-8"
              variants={getReducedMotionVariants(fadeInRight)}
            >
              {/* Company Details Card */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-1">Address</h4>
                    <p className="text-muted-foreground">
                      123 Business Street, Suite 100<br />
                      New York, NY 10001
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-muted-foreground">hello@creativagency.com</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Business Hours</h4>
                    <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                  </div>
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              <Card className="shadow-lg">
                <CardContent className="p-0">
                  <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                      <p className="text-muted-foreground">Interactive Map</p>
                      <p className="text-sm text-muted-foreground">Coming Soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media Links */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Follow Us</CardTitle>
                  <CardDescription>Stay connected on social media</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Instagram className="h-4 w-4 mr-2" />
                      Instagram
                    </Button>
                  </div>
                  <div className="flex gap-4 mt-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Special Offer Banner */}
              <Card className="shadow-lg border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Special Offer</h3>
                  <p className="text-muted-foreground mb-4">
                    Free 30-minute consultation for new clients
                  </p>
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    Claim Your Free Consultation
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Thank You!</DialogTitle>
            <DialogDescription className="text-center">
              Your message has been sent successfully. We'll get back to you within 24 hours.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
            <Button onClick={() => setShowSuccessModal(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Contact;