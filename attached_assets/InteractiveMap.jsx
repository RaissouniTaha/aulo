import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { useQuery } from 'react-query';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FaLayerGroup, FaInfoCircle, FaSearch, FaDownload, FaPrint, FaExpand, FaCompress } from 'react-icons/fa';

// Import custom components
import MapLegend from './MapLegend';
import MapLayerSelector from './MapLayerSelector';
import MapInfoPanel from './MapInfoPanel';
import MapSearchBox from './MapSearchBox';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorDisplay from '../ui/ErrorDisplay';
import FeatureInfoPopup from './FeatureInfoPopup';
import InfoTooltip from '../ui/InfoTooltip';

// Import API services
import { fetchMapLayers, fetchMapFeatures } from '@/services/mapApi';

// Set Mapbox token from environment variable
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

/**
 * Interactive Map Component
 * Displays a full-featured interactive map with urban planning data,
 * layer controls, search, and information display.
 */
const InteractiveMap = ({
  initialCenter = [-7.62, 33.57], // Default to Morocco coordinates if not specified
  initialZoom = 10,
  height = '600px',
  width = '100%',
  showControls = true,
  showSearch = true,
  showLayerSelector = true,
  showLegend = true,
  showInfoPanel = true,
  categoryId = null,
  preSelectedLayers = []
}) => {
  const { t, i18n } = useTranslation('maps');
  const mapContainer = useRef(null);
  const map = useRef(null);
  const currentLanguage = i18n.language;
  const popupRef = useRef(new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    maxWidth: '300px',
    className: 'custom-popup'
  }));
  
  // State for map interaction
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [activeLayers, setActiveLayers] = useState(preSelectedLayers);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [mapBounds, setMapBounds] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showLayersPanel, setShowLayersPanel] = useState(false);
  
  // Fetch available map layers
  const {
    data: layersData,
    isLoading: isLoadingLayers,
    isError: isLayersError,
    error: layersError
  } = useQuery(
    ['mapLayers', currentLanguage, categoryId],
    () => fetchMapLayers(currentLanguage, categoryId),
    { staleTime: 1000 * 60 * 15 } // Cache for 15 minutes
  );
  
  // Fetch feature data when a feature is selected
  const {
    data: featureData,
    isLoading: isLoadingFeature,
    isError: isFeatureError
  } = useQuery(
    ['mapFeature', selectedFeature?.id, currentLanguage],
    () => fetchMapFeatures(selectedFeature.id, currentLanguage),
    {
      enabled: !!selectedFeature,
      staleTime: 1000 * 60 * 5 // Cache for 5 minutes
    }
  );
  
  // Initialize map on component mount
  useEffect(() => {
    if (map.current) return; // Skip if the map is already initialized
    
    // Create new map instance
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: initialCenter,
      zoom: initialZoom,
      minZoom: 5,
      maxZoom: 18,
      attributionControl: false
    });
    
    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: true, visualizePitch: true }),
      'top-right'
    );
    
    // Add attribution control
    map.current.addControl(
      new mapboxgl.AttributionControl({
        compact: true
      }),
      'bottom-right'
    );
    
    // Add scale control
    map.current.addControl(
      new mapboxgl.ScaleControl({
        maxWidth: 150,
        unit: 'metric'
      }),
      'bottom-left'
    );
    
    // Handle map load event
    map.current.on('load', () => {
      setMapLoaded(true);
      setMapBounds(map.current.getBounds());
      
      // Add urban area source
      map.current.addSource('urban-areas', {
        type: 'vector',
        url: 'mapbox://mapbox.urban-areas'
      });
    });
    
    // Update bounds when the map moves
    map.current.on('moveend', () => {
      setMapBounds(map.current.getBounds());
    });
    
    // Clean up map on component unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialCenter, initialZoom]);
  
  // Handle layer toggling when activeLayers changes
  useEffect(() => {
    if (!mapLoaded || !layersData) return;
    
    // First remove any existing layers
    layersData.forEach(layer => {
      const layerId = `layer-${layer.id}`;
      if (map.current.getLayer(layerId)) {
        map.current.removeLayer(layerId);
      }
      
      // Also remove highlight layer if it exists
      const highlightLayerId = `${layerId}-highlight`;
      if (map.current.getLayer(highlightLayerId)) {
        map.current.removeLayer(highlightLayerId);
      }
    });
    
    // Then add active layers
    activeLayers.forEach(layerId => {
      const layer = layersData.find(l => l.id === layerId);
      if (!layer) return;
      
      // Check if source exists, add if not
      if (!map.current.getSource(`source-${layer.id}`)) {
        map.current.addSource(`source-${layer.id}`, {
          type: 'geojson',
          data: layer.geojson_url
        });
      }
      
      // Add the actual layer
      map.current.addLayer({
        id: `layer-${layer.id}`,
        type: layer.type || 'fill',
        source: `source-${layer.id}`,
        paint: layer.style || {
          'fill-color': layer.color || '#088',
          'fill-opacity': 0.6,
          'fill-outline-color': '#000'
        }
      });
      
      // Add click interaction
      map.current.on('click', `layer-${layer.id}`, (e) => {
        if (e.features.length > 0) {
          setSelectedFeature({
            id: e.features[0].id || e.features[0].properties.id,
            properties: e.features[0].properties,
            layerId: layer.id,
            layerName: layer.name,
            coordinates: e.lngLat
          });
        }
      });
      
      // Change cursor on hover
      map.current.on('mouseenter', `layer-${layer.id}`, () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });
      
      map.current.on('mouseleave', `layer-${layer.id}`, () => {
        map.current.getCanvas().style.cursor = '';
      });
      
      // Show popup on hover if enabled
      if (layer.show_popup_on_hover) {
        map.current.on('mouseenter', `layer-${layer.id}`, (e) => {
          if (e.features.length === 0) return;
          
          const feature = e.features[0];
          const coordinates = e.lngLat;
          
          // Get the title field from properties based on language
          const titleField = currentLanguage === 'ar' ? 'title_ar' : 
                            currentLanguage === 'fr' ? 'title_fr' : 'title_en';
          
          const title = feature.properties[titleField] || feature.properties.name || feature.properties.id;
          
          // Show popup
          popupRef.current
            .setLngLat(coordinates)
            .setHTML(`<div class="font-medium text-sm">${title}</div>`)
            .addTo(map.current);
        });
        
        map.current.on('mouseleave', `layer-${layer.id}`, () => {
          popupRef.current.remove();
        });
      }
    });
    
    // Handle selected feature highlight
    if (selectedFeature) {
      const layer = layersData.find(l => l.id === selectedFeature.layerId);
      if (layer && map.current.getLayer(`layer-${layer.id}`)) {
        // Add highlight filter
        map.current.setFilter(`layer-${layer.id}-highlight`, [
          '==',
          ['get', 'id'],
          selectedFeature.id
        ]);
      }
    }
    
  }, [mapLoaded, layersData, activeLayers, selectedFeature, currentLanguage]);
  
  // Toggle layer visibility
  const handleLayerToggle = (layerId) => {
    setActiveLayers(prev => {
      if (prev.includes(layerId)) {
        return prev.filter(id => id !== layerId);
      } else {
        return [...prev, layerId];
      }
    });
  };
  
  // Reset map view to initial settings
  const handleResetView = () => {
    map.current.flyTo({
      center: initialCenter,
      zoom: initialZoom,
      bearing: 0,
      pitch: 0
    });
  };
  
  // Toggle fullscreen mode
  const handleToggleFullscreen = () => {
    setIsFullScreen(!isFullScreen);
    setTimeout(() => {
      map.current.resize();
    }, 100);
  };
  
  // Export map as image
  const handleExportMap = () => {
    const mapCanvas = map.current.getCanvas();
    const mapImage = mapCanvas.toDataURL();
    
    const downloadLink = document.createElement('a');
    downloadLink.href = mapImage;
    downloadLink.download = `urban-map-export-${new Date().toISOString().slice(0,10)}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  
  // Handle print functionality
  const handlePrintMap = () => {
    const mapCanvas = map.current.getCanvas();
    const mapImage = mapCanvas.toDataURL();
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${t('maps.printTitle')}</title>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .header { margin-bottom: 20px; }
            .map-container { text-align: center; }
            .map-image { max-width: 100%; border: 1px solid #ccc; }
            .footer { margin-top: 20px; font-size: 12px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${t('maps.printTitle')}</h1>
            <p>${t('maps.printDate')}: ${new Date().toLocaleDateString(currentLanguage)}</p>
          </div>
          <div class="map-container">
            <img src="${mapImage}" class="map-image" alt="Map Export" />
          </div>
          <div class="footer">
            <p>${t('maps.printDisclaimer')}</p>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };
  
  // Handle search results selection
  const handleSearchResultSelect = (result) => {
    setSearchResults([]);
    
    if (result && result.center) {
      map.current.flyTo({
        center: result.center,
        zoom: 14
      });
      
      // If the result has a feature ID, select it
      if (result.featureId) {
        setSelectedFeature({
          id: result.featureId,
          layerId: result.layerId,
          layerName: result.layerName,
          coordinates: result.center,
          properties: result.properties || {}
        });
      }
    }
  };
  
  // Close the feature info panel
  const handleCloseFeatureInfo = () => {
    setSelectedFeature(null);
  };
  
  // Show loading state if layers are loading
  if (isLoadingLayers) {
    return <LoadingSpinner text={t('maps.loading')} />;
  }
  
  // Show error state if layer loading failed
  if (isLayersError) {
    return <ErrorDisplay error={layersError} message={t('maps.loadError')} />;
  }
  
  return (
    <div 
      className={`relative overflow-hidden border border-gray-300 rounded-lg ${
        isFullScreen ? 'fixed inset-0 z-50 bg-white' : ''
      }`}
      style={{ height: isFullScreen ? '100vh' : height, width: isFullScreen ? '100vw' : width }}
    >
      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="absolute inset-0 bg-gray-100"
      ></div>
      
      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute top-4 right-16 flex flex-col space-y-2 z-10">
          <button
            onClick={handleToggleFullscreen}
            className="bg-white p-2 rounded-md shadow-md hover:bg-gray-100 transition-colors"
            title={isFullScreen ? t('maps.exitFullscreen') : t('maps.enterFullscreen')}
          >
            {isFullScreen ? <FaCompress /> : <FaExpand />}
          </button>
          <button
            onClick={handleExportMap}
            className="bg-white p-2 rounded-md shadow-md hover:bg-gray-100 transition-colors"
            title={t('maps.exportMap')}
          >
            <FaDownload />
          </button>
          <button
            onClick={handlePrintMap}
            className="bg-white p-2 rounded-md shadow-md hover:bg-gray-100 transition-colors"
            title={t('maps.printMap')}
          >
            <FaPrint />
          </button>
          <button
            onClick={() => setShowLayersPanel(!showLayersPanel)}
            className={`p-2 rounded-md shadow-md transition-colors ${
              showLayersPanel ? 'bg-primary-600 text-white' : 'bg-white hover:bg-gray-100'
            }`}
            title={t('maps.layers')}
          >
            <FaLayerGroup />
          </button>
        </div>
      )}
      
      {/* Search Box */}
      {showSearch && (
        <div className="absolute top-4 left-4 w-64 z-10">
          <MapSearchBox 
            onSearch={setSearchResults}
            onSelect={handleSearchResultSelect}
            placeholder={t('maps.searchPlaceholder')}
            results={searchResults}
          />
        </div>
      )}
      
      {/* Layer Selector Panel */}
      {showLayerSelector && showLayersPanel && (
        <div className="absolute top-4 right-28 w-64 bg-white rounded-md shadow-lg z-10 overflow-hidden transform transition-transform duration-300">
          <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-gray-700">{t('maps.layers')}</h3>
            <button 
              onClick={() => setShowLayersPanel(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <MapLayerSelector 
            layers={layersData || []}
            activeLayers={activeLayers}
            onToggle={handleLayerToggle}
          />
        </div>
      )}
      
      {/* Map Legend */}
      {showLegend && activeLayers.length > 0 && (
        <div className="absolute bottom-8 left-4 bg-white rounded-md shadow-lg z-10 overflow-hidden max-w-xs">
          <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-gray-700">{t('maps.legend')}</h3>
            <InfoTooltip content={t('maps.legendHelp')} />
          </div>
          <MapLegend 
            layers={layersData?.filter(layer => activeLayers.includes(layer.id)) || []}
          />
        </div>
      )}
      
      {/* Feature Info Panel */}
      {showInfoPanel && selectedFeature && (
        <div className="absolute top-4 bottom-4 right-4 w-72 bg-white rounded-md shadow-lg z-20 overflow-y-auto">
          {isLoadingFeature ? (
            <div className="p-4">
              <LoadingSpinner size="small" text={t('maps.loadingFeature')} />
            </div>
          ) : isFeatureError ? (
            <div className="p-4">
              <p className="text-red-500">{t('maps.featureLoadError')}</p>
            </div>
          ) : (
            <MapInfoPanel 
              feature={featureData || selectedFeature}
              onClose={handleCloseFeatureInfo}
            />
          )}
        </div>
      )}
      
      {/* Feature popup on click */}
      {selectedFeature && !showInfoPanel && (
        <FeatureInfoPopup 
          feature={featureData || selectedFeature}
          coordinates={selectedFeature.coordinates}
          map={map.current}
          onClose={handleCloseFeatureInfo}
        />
      )}
    </div>
  );
};

export default InteractiveMap;