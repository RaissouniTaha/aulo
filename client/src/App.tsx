import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { LoaderPinwheel } from "lucide-react";

// Lazy-loaded page components
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const Maps = lazy(() => import("@/pages/Maps"));
const Documents = lazy(() => import("@/pages/Documents"));
const News = lazy(() => import("@/pages/News"));
const Contact = lazy(() => import("@/pages/Contact"));
const Admin = lazy(() => import("@/pages/Admin"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Loading component
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Card className="w-[300px]">
      <CardContent className="p-8 flex flex-col items-center">
        <LoaderPinwheel className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-gray-600">Loading content...</p>
      </CardContent>
    </Card>
  </div>
);

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about/*" element={<About />} />
            <Route path="/services/*" element={<Services />} />
            <Route path="/maps" element={<Maps />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/news/*" element={<News />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
