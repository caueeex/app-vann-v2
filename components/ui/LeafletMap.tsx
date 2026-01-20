/**
 * LeafletMap Component - VANN App
 * Mapa usando Leaflet via WebView com marcadores e rota tracejada
 */

import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface MapMarker {
  id: string;
  coordinate: Coordinate;
  name: string;
  photo?: string;
  order?: number;
  type?: 'student' | 'school' | 'vehicle';
}

interface LeafletMapProps {
  markers: MapMarker[];
  routeCoordinates?: Coordinate[];
  initialCenter?: Coordinate;
  onMarkerPress?: (marker: MapMarker) => void;
}

export function LeafletMap({
  markers,
  routeCoordinates = [],
  initialCenter,
  onMarkerPress,
}: LeafletMapProps) {
  const webViewRef = useRef<WebView>(null);

  // Calcular centro inicial
  const getInitialCenter = (): Coordinate => {
    if (initialCenter) return initialCenter;
    
    if (markers.length === 0) {
      return { latitude: -23.5505, longitude: -46.6333 }; // São Paulo padrão
    }

    const lats = markers.map((m) => m.coordinate.latitude);
    const lngs = markers.map((m) => m.coordinate.longitude);
    
    return {
      latitude: (Math.min(...lats) + Math.max(...lats)) / 2,
      longitude: (Math.min(...lngs) + Math.max(...lngs)) / 2,
    };
  };

  const center = getInitialCenter();

  // Gerar HTML com Leaflet
  const generateMapHTML = () => {
    const studentMarkers = markers
      .filter((m) => m.type === 'student')
      .map((marker) => {
        // Cores diferentes para cada aluno baseado na ordem
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
        const iconColor = marker.order ? colors[(marker.order - 1) % colors.length] : '#FFA500';
        return `
          L.marker([${marker.coordinate.latitude}, ${marker.coordinate.longitude}], {
            icon: L.divIcon({
              className: 'custom-marker',
              html: \`<div style="
                background-color: ${iconColor};
                width: 36px;
                height: 36px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 3px 10px rgba(0,0,0,0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 14px;
                cursor: pointer;
              ">${marker.order || ''}</div>\`,
              iconSize: [36, 36],
              iconAnchor: [18, 36],
            })
          })
          .addTo(map)
          .bindPopup(\`<div style="text-align: center;"><b>${marker.name}</b><br/><small>Ordem de coleta: ${marker.order || 'N/A'}</small></div>\`);
        `;
      })
      .join('\n');

    const schoolMarker = markers
      .filter((m) => m.type === 'school')
      .map((marker) => {
        return `
          L.marker([${marker.coordinate.latitude}, ${marker.coordinate.longitude}], {
            icon: L.divIcon({
              className: 'custom-marker-school',
              html: \`<div style="
                background-color: #28a745;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 20px;
              ">🏫</div>\`,
              iconSize: [40, 40],
              iconAnchor: [20, 40],
            })
          })
          .addTo(map)
          .bindPopup(\`<b>${marker.name}</b><br/>Destino Final\`);
        `;
      })
      .join('\n');

    // Criar linha tracejada conectando os pontos na ordem da rota
    const routePolyline = routeCoordinates.length > 1
      ? `
        const routePath = [${routeCoordinates
          .map((coord) => `[${coord.latitude}, ${coord.longitude}]`)
          .join(', ')}];
        
        // Linha tracejada principal
        L.polyline(routePath, {
          color: '#FFA500',
          weight: 5,
          opacity: 0.9,
          dashArray: '20, 15',
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);
        
        // Adicionar setas na direção da rota (opcional)
        for (let i = 0; i < routePath.length - 1; i++) {
          const start = routePath[i];
          const end = routePath[i + 1];
          const midLat = (start[0] + end[0]) / 2;
          const midLng = (start[1] + end[1]) / 2;
          
          L.marker([midLat, midLng], {
            icon: L.divIcon({
              className: 'route-arrow',
              html: '<div style="color: #FFA500; font-size: 16px;">➤</div>',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })
          }).addTo(map);
        }
      `
      : '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body, html {
              width: 100%;
              height: 100%;
              overflow: hidden;
              touch-action: none;
            }
            #map {
              width: 100%;
              height: 100%;
              position: relative;
            }
            .custom-marker, .custom-marker-school, .route-arrow {
              background: transparent !important;
              border: none !important;
            }
            .leaflet-popup-content-wrapper {
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            const map = L.map('map', {
              zoomControl: true,
              scrollWheelZoom: true,
              doubleClickZoom: true,
              boxZoom: true,
              keyboard: true,
              dragging: true,
            }).setView([${center.latitude}, ${center.longitude}], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors',
              maxZoom: 19,
            }).addTo(map);

            ${studentMarkers}
            ${schoolMarker}
            ${routePolyline}

            // Ajustar zoom para mostrar todos os marcadores e a rota
            if (${markers.length} > 0) {
              const allPoints = [
                ${markers.map((m) => `L.latLng(${m.coordinate.latitude}, ${m.coordinate.longitude})`).join(',\n                ')}
                ${routeCoordinates.length > 0 ? ',\n                ' + routeCoordinates.map((c) => `L.latLng(${c.latitude}, ${c.longitude})`).join(',\n                ') : ''}
              ];
              const bounds = L.latLngBounds(allPoints);
              map.fitBounds(bounds, { padding: [50, 50] });
            }
          </script>
        </body>
      </html>
    `;
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: generateMapHTML() }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        onLoadEnd={() => {
          console.log('Leaflet map loaded successfully');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
