import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapData } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoaderPinwheel, Plus, Minus, Crosshair, Layers, Map as MapIcon, Info } from 'lucide-react';

const Maps: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('zoning');
  
  // Fetch map data from API
  const { data: mapData, isLoading, error } = useQuery<MapData[]>({
    queryKey: ['/api/map-data'],
  });

  // Layer visibility state
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    zoning: true,
    development: false,
    historic: false
  });

  // Toggle layer visibility
  const toggleLayer = (layerId: string) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  };

  // In a real implementation, we would initialize a map library like Mapbox GL JS here
  // and update the map when visibleLayers or mapData changes
  // For now, we'll just display a map placeholder with controls
  
  return (
    <div id="main-content" className="py-12 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Interactive Urban Maps</h1>
          <p className="text-lg text-gray-600">
            Explore zoning information, development projects, and urban planning data through our interactive mapping tools.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left sidebar with controls */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Layers className="mr-2 h-5 w-5" />
                  Map Layers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="font-medium">Base Maps</div>
                  <Tabs defaultValue="streets" className="w-full">
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="streets">Streets</TabsTrigger>
                      <TabsTrigger value="satellite">Satellite</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <div className="font-medium mt-6">Map Layers</div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="zoning" 
                        checked={visibleLayers.zoning}
                        onCheckedChange={() => toggleLayer('zoning')}
                      />
                      <Label htmlFor="zoning">Zoning Districts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="development" 
                        checked={visibleLayers.development}
                        onCheckedChange={() => toggleLayer('development')}
                      />
                      <Label htmlFor="development">Development Projects</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="historic" 
                        checked={visibleLayers.historic}
                        onCheckedChange={() => toggleLayer('historic')}
                      />
                      <Label htmlFor="historic">Historic Districts</Label>
                    </div>
                  </div>
                  
                  <div className="font-medium mt-6">Legend</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 opacity-50 border border-blue-700"></div>
                      <span>Residential</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 opacity-50 border border-red-700"></div>
                      <span>Commercial</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 opacity-50 border border-green-700"></div>
                      <span>Parks & Open Space</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-yellow-500 opacity-50 border border-yellow-700"></div>
                      <div>Industrial</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main map area */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg overflow-hidden">
              <div className="relative h-[70vh]" ref={mapContainerRef}>
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <LoaderPinwheel className="h-12 w-12 text-primary animate-spin" />
                  </div>
                ) : error ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <p className="text-red-500 font-medium text-lg mb-2">Failed to load map data</p>
                      <p className="text-gray-600">Please try again later</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Map Placeholder - In a real implementation, this would be an actual map component */}
                    <div className="absolute inset-0 bg-gray-200">
                      <img 
                        src="https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
                        className="w-full h-full object-cover" 
                        alt="Map view" 
                      />
                    </div>
                    
                    {/* Map Controls */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <Button variant="secondary" size="icon" aria-label="Zoom in">
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button variant="secondary" size="icon" aria-label="Zoom out">
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button variant="secondary" size="icon" aria-label="Reset view">
                        <Crosshair className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Information panel */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 p-4 rounded-md shadow-md">
                      <div className="flex items-center mb-2">
                        <Info className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="font-medium">Map Information</h3>
                      </div>
                      <p className="text-sm text-gray-700">
                        Click on the map to view detailed information about specific areas. Use the checkboxes 
                        in the sidebar to toggle different map layers.
                      </p>
                    </div>
                  </>
                )}
              </div>
              <CardFooter className="bg-gray-50 flex justify-between items-center p-4">
                <div className="text-sm text-gray-600">
                  <MapIcon className="inline-block mr-2 h-4 w-4" />
                  Data last updated: June 15, 2023
                </div>
                <Button variant="outline" size="sm">
                  Download Map Data
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maps;
