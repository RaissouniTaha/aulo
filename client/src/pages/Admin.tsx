import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { insertNewsSchema, insertServiceSchema, insertPageSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Government Agency Admin</h1>
      
      <Tabs defaultValue="news" className="space-y-4">
        <TabsList>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="map">Map Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="news" className="space-y-4">
          <NewsForm />
        </TabsContent>
        
        <TabsContent value="services" className="space-y-4">
          <ServiceForm />
        </TabsContent>
        
        <TabsContent value="pages" className="space-y-4">
          <PageForm />
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <DocumentForm />
        </TabsContent>
        
        <TabsContent value="map" className="space-y-4">
          <MapDataForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NewsForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Extend the insertNewsSchema for client-side validation
  const newsFormSchema = insertNewsSchema.extend({
    slug: z.string().min(3, "Slug must be at least 3 characters"),
    title: z.string().min(5, "Title must be at least 5 characters"),
    content: z.string().min(20, "Content must be at least 20 characters"),
    category: z.string().min(2, "Category is required"),
    author: z.number().int().positive("Author ID must be a positive integer"),
  });
  
  // Define form
  const form = useForm<z.infer<typeof newsFormSchema>>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      imageUrl: "",
      category: "Announcement",
      publishDate: new Date(),
      isPublished: true,
      author: 1, // Default to admin user ID
      language: "en",
    },
  });
  
  async function onSubmit(data: z.infer<typeof newsFormSchema>) {
    setIsSubmitting(true);
    try {
      // Ensure publishDate is sent as a proper ISO date string
      const formattedData = {
        ...data,
        // Convert Date object to ISO string for server-side parsing
        publishDate: data.publishDate.toISOString(),
      };
      
      const response = await apiRequest("/api/news", {
        method: "POST",
        body: JSON.stringify(formattedData),
      });
      
      toast({
        title: "Success!",
        description: "News article created successfully",
      });
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error creating news:", error);
      toast({
        title: "Error",
        description: "Failed to create news article. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating news:", error);
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create News Article</CardTitle>
        <CardDescription>
          Add a new news article to the website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="url-friendly-slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter a brief summary..." 
                      {...field} 
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the full article content..." 
                      {...field} 
                      rows={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Announcement">Announcement</SelectItem>
                          <SelectItem value="Public Hearing">Public Hearing</SelectItem>
                          <SelectItem value="Event">Event</SelectItem>
                          <SelectItem value="Press Release">Press Release</SelectItem>
                          <SelectItem value="Project Update">Project Update</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="ar">Arabic</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Publish immediately
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create News Article"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function ServiceForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Extend the insertServiceSchema for client-side validation
  const serviceFormSchema = insertServiceSchema.extend({
    slug: z.string().min(3, "Slug must be at least 3 characters"),
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    content: z.string().min(20, "Content must be at least 20 characters"),
  });
  
  // Define form
  const form = useForm<z.infer<typeof serviceFormSchema>>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      content: "",
      icon: "",
      imageUrl: "",
      order: 1,
      isActive: true,
      language: "en",
    },
  });
  
  async function onSubmit(data: z.infer<typeof serviceFormSchema>) {
    setIsSubmitting(true);
    try {
      const response = await apiRequest("/api/services", {
        method: "POST",
        body: JSON.stringify(data),
      });
      
      toast({
        title: "Success!",
        description: "Service created successfully",
      });
      
      // Reset form
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create service. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating service:", error);
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Service</CardTitle>
        <CardDescription>
          Add a new service to the website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="url-friendly-slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter a brief description..." 
                      {...field} 
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the full service content..." 
                      {...field} 
                      rows={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. fa-building" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        {...field}
                        value={field.value.toString()}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="ar">Arabic</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-8">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Active (display on website)
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Service"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function PageForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Extend the insertPageSchema for client-side validation
  const pageFormSchema = insertPageSchema.extend({
    slug: z.string().min(3, "Slug must be at least 3 characters"),
    title: z.string().min(5, "Title must be at least 5 characters"),
    content: z.string().min(20, "Content must be at least 20 characters"),
  });
  
  // Define form
  const form = useForm<z.infer<typeof pageFormSchema>>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
      isPublished: true,
      publishedAt: new Date(),
      language: "en",
    },
  });
  
  async function onSubmit(data: z.infer<typeof pageFormSchema>) {
    setIsSubmitting(true);
    try {
      // Format dates for API submission
      const formattedData = {
        ...data,
        // Convert Date objects to ISO strings for server-side parsing
        publishedAt: data.publishedAt ? data.publishedAt.toISOString() : null,
      };
      
      const response = await apiRequest("/api/pages", {
        method: "POST",
        body: JSON.stringify(formattedData),
      });
      
      toast({
        title: "Success!",
        description: "Page created successfully",
      });
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error creating page:", error);
      toast({
        title: "Error",
        description: "Failed to create page. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating page:", error);
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Page</CardTitle>
        <CardDescription>
          Add a new page to the website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="url-friendly-slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the page content..." 
                      {...field} 
                      rows={10}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="metaTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Title (SEO)</FormLabel>
                    <FormControl>
                      <Input placeholder="SEO title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="metaDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description (SEO)</FormLabel>
                    <FormControl>
                      <Input placeholder="SEO description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="ar">Arabic</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-8">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Publish immediately
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Page"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function DocumentForm() {
  const { toast } = useToast();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Document</CardTitle>
        <CardDescription>
          Add a new document to the repository
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center p-8">
          <p className="mb-4">Document uploading functionality will be implemented soon.</p>
          <p className="text-sm text-muted-foreground">
            This feature requires file upload capabilities which will be added in the next phase.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function MapDataForm() {
  const { toast } = useToast();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Map Data</CardTitle>
        <CardDescription>
          Add geographic data to the interactive map
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center p-8">
          <p className="mb-4">Map data management will be implemented soon.</p>
          <p className="text-sm text-muted-foreground">
            This feature requires GeoJSON handling which will be added in the next phase.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}