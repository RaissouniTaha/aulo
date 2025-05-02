import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Minus, Crosshair } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

// Mock data for map layers
const mapLayers = [
  { id: 'zoning', name: 'Zoning Districts', checked: true },
  { id: 'development', name: 'Development Projects', checked: false },
  { id: 'historic', name: 'Historic Districts', checked: false }
];

const MapPreview: React.FC = () => {
  const [layers, setLayers] = useState(mapLayers);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Handle layer toggle
  const toggleLayer = (id: string) => {
    setLayers(layers.map(layer => 
      layer.id === id ? { ...layer, checked: !layer.checked } : layer
    ));
  };
  
  // In a real implementation, we would initialize a map library like Mapbox GL JS here
  // For now, we'll just show a preview image with controls
  
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4 text-primary">Interactive Urban Maps</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore zoning information, development projects, and urban planning data through our interactive mapping tools.
          </p>
        </div>
        
        <Card className="overflow-hidden shadow-xl">
          <div className="relative aspect-video max-h-[600px] min-h-[400px]" ref={mapContainerRef}>
            {/* Map placeholder */}
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
                className="w-full h-full object-cover" 
                alt="Interactive map preview" 
              />
              
              {/* Map overlay elements */}
              <div className="absolute top-4 left-4 right-4 flex justify-between">
                <Card className="p-3 rounded-md shadow-md">
                  <h3 className="font-medium text-gray-800 mb-2">Layer Selection</h3>
                  <div className="space-y-2">
                    {layers.map(layer => (
                      <div key={layer.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={layer.id} 
                          checked={layer.checked} 
                          onCheckedChange={() => toggleLayer(layer.id)}
                        />
                        <Label htmlFor={layer.id} className="text-sm">{layer.name}</Label>
                      </div>
                    ))}
                  </div>
                </Card>
                
                <div className="bg-white p-3 rounded-md shadow-md flex flex-col gap-2">
                  <Button variant="outline" size="icon" aria-label="Zoom in">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" aria-label="Zoom out">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" aria-label="Center map">
                    <Crosshair className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-white p-3 rounded-md shadow-md">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="w-4 h-4 bg-blue-500 opacity-50 border border-blue-700"></div>
                    <span className="text-xs text-gray-700">Residential</span>
                  </div>
                  <div>
                    <div className="w-4 h-4 bg-red-500 opacity-50 border border-red-700"></div>
                    <span className="text-xs text-gray-700">Commercial</span>
                  </div>
                  <div>
                    <div className="w-4 h-4 bg-green-500 opacity-50 border border-green-700"></div>
                    <span className="text-xs text-gray-700">Parks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <CardFooter className="bg-gray-50 p-4 flex items-center justify-between">
            <span className="text-sm text-gray-700">
              <i className="fas fa-info-circle mr-2"></i>
              Click on the map to view detailed information about specific areas
            </span>
            <Link to="/maps" className="text-primary hover:text-primary-800 font-medium text-sm inline-flex items-center">
              Open Full Map
              <i className="fas fa-external-link-alt ml-2"></i>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};

export default MapPreview;
