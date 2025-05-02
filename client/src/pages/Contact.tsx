import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { insertContactSchema } from '@shared/schema';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

// Extend the insert schema with validation rules
const contactFormSchema = insertContactSchema.extend({
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  subject: z.string().min(3, { message: "Subject must be at least 3 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Contact: React.FC = () => {
  const { toast } = useToast();
  
  // Set up form with validation
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    }
  });

  // Set up mutation for form submission
  const mutation = useMutation({
    mutationFn: (data: ContactFormValues) => {
      return apiRequest('POST', '/api/contact', data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "We've received your message and will get back to you soon.",
        variant: "default",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    }
  });

  // Handle form submission
  const onSubmit = (data: ContactFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div id="main-content" className="py-12 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about urban planning or permits? Our team is here to help.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Your email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="What is your inquiry about?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please provide details about your inquiry..." 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary-700"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Here's how you can reach us directly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mt-1 mr-3 text-primary" />
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-gray-600">
                      123 Government St.<br />
                      Capital City, ST 12345
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mt-1 mr-3 text-primary" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-gray-600">+1-234-567-8900</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mt-1 mr-3 text-primary" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">contact@govagency.gov</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 mt-1 mr-3 text-primary" />
                  <div>
                    <h3 className="font-medium">Office Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 8:00 AM - 5:00 PM<br />
                      Saturday & Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Map Card */}
            <Card className="shadow-md overflow-hidden">
              <div className="aspect-square md:aspect-video h-[300px]">
                {/* In a real implementation, this would be an embedded map */}
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
                  alt="Office location map" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Government Agency Headquarters
                  </div>
                  <Button variant="outline" size="sm">
                    <i className="fas fa-directions mr-2"></i>
                    Get Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What types of permits do you issue?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We issue various types of permits including building permits, demolition permits, 
                  zoning permits, and land use permits. Each permit has specific requirements and 
                  application processes.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How long does the permit process take?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Processing times vary depending on the type of permit and the complexity of the project. 
                  Simple permits may be issued within 5-10 business days, while more complex projects 
                  might take 4-6 weeks for review and approval.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How can I check my property's zoning?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  You can check your property's zoning by using our interactive maps tool, contacting 
                  our office directly, or submitting a zoning verification request through our website.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do I need a permit for small renovations?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Many small renovations still require permits, especially if they involve structural 
                  changes, electrical or plumbing work, or changes to exterior appearances in certain 
                  districts. Contact us for specific guidance on your project.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
