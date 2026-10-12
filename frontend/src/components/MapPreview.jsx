import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Info, ExternalLink } from 'lucide-react';
export const MapPreview = ({ providers, userLocation, selectedProviderId, onSelectProvider, heightClass = 'h-96 sm:h-[450px]', }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef(null);
    // Center coordinate determination
    const centerLat = userLocation?.latitude || (providers.length > 0 ? providers[0].latitude : 17.4399);
    const centerLng = userLocation?.longitude || (providers.length > 0 ? providers[0].longitude : 78.3800);
    useEffect(() => {
        if (!mapContainerRef.current)
            return;
        // Initialize map if not created yet
        if (!mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current, {
                zoomControl: true,
                attributionControl: false,
            }).setView([centerLat, centerLng], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
            }).addTo(map);
            const markersGroup = L.layerGroup().addTo(map);
            markersRef.current = markersGroup;
            mapInstanceRef.current = map;
        }
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);
    // Update markers when providers or userLocation change
    useEffect(() => {
        const map = mapInstanceRef.current;
        const markersGroup = markersRef.current;
        if (!map || !markersGroup)
            return;
        markersGroup.clearLayers();
        // Custom HTML Marker for User Location
        if (userLocation?.latitude && userLocation?.longitude) {
            const userIcon = L.divIcon({
                className: 'user-pin-icon',
                html: `
          <div style="position:relative; width:28px; height:28px;">
            <div style="position:absolute; inset:0; border-radius:50%; background:rgba(56, 189, 248, 0.4); animation:ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position:absolute; inset:4px; border-radius:50%; background:#0284c7; border:2px solid #ffffff; box-shadow:0 0 10px #38bdf8;"></div>
          </div>
        `,
                iconSize: [28, 28],
                iconAnchor: [14, 14],
            });
            const userMarker = L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon });
            userMarker.bindPopup(`
        <div style="padding:6px; font-family:inherit;">
          <b style="color:#38bdf8;">Your Location</b><br/>
          <span style="font-size:11px; color:#cbd5e1;">${userLocation.cityName || 'Selected Point'}</span>
        </div>
      `);
            markersGroup.addLayer(userMarker);
        }
        // Provider markers
        providers.forEach((p) => {
            const isSelected = selectedProviderId === p.provider_id;
            const markerColor = isSelected ? '#38bdf8' : '#6366f1';
            const providerIcon = L.divIcon({
                className: 'provider-pin-icon',
                html: `
          <div style="background:${markerColor}; color:#ffffff; padding:5px 8px; border-radius:12px; font-size:11px; font-weight:700; display:flex; align-items:center; gap:4px; box-shadow:0 6px 15px rgba(0,0,0,0.5); border:1.5px solid #ffffff; white-space:nowrap; cursor:pointer;">
            <span>★ ${p.rating_avg.toFixed(1)}</span>
          </div>
        `,
                iconSize: [60, 26],
                iconAnchor: [30, 13],
            });
            const marker = L.marker([p.latitude, p.longitude], { icon: providerIcon });
            const cleanName = p.provider_name.replace(/\[Demo.*?\]/gi, '').trim();
            const popupContent = document.createElement('div');
            popupContent.style.padding = '8px';
            popupContent.style.fontFamily = 'inherit';
            popupContent.innerHTML = `
        <div style="max-width:210px;">
          <img src="${p.image_url}" style="width:100%; height:90px; object-fit:cover; border-radius:8px; margin-bottom:6px;" />
          <h4 style="margin:0 0 4px 0; font-size:13px; font-weight:700; color:#f8fafc;">${cleanName}</h4>
          <p style="margin:0 0 6px 0; font-size:11px; color:#94a3b8;">${p.address}</p>
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px;">
            <span style="color:#fbbf24; font-weight:bold;">★ ${p.rating_avg.toFixed(1)} (${p.review_count})</span>
            <span style="color:#818cf8; font-weight:bold;">${p.price_range}</span>
          </div>
          <button id="view-prov-${p.provider_id}" style="margin-top:8px; width:100%; background:#4f46e5; color:white; border:none; border-radius:6px; padding:6px 8px; font-size:11px; font-weight:bold; cursor:pointer;">
            View Provider Profile
          </button>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}" target="_blank" rel="noopener noreferrer" style="display:block; text-align:center; margin-top:5px; background:#0f172a; color:#94a3b8; border:1px solid rgba(255,255,255,0.15); border-radius:6px; padding:4px 8px; font-size:10px; font-weight:600; text-decoration:none;">
            Directions on Google Maps ↗
          </a>
        </div>
      `;
            marker.bindPopup(popupContent);
            marker.on('click', () => {
                if (onSelectProvider)
                    onSelectProvider(p.provider_id);
            });
            marker.on('popupopen', () => {
                const btn = document.getElementById(`view-prov-${p.provider_id}`);
                if (btn) {
                    btn.onclick = () => {
                        window.location.href = `/providers/${p.provider_id}`;
                    };
                }
            });
            markersGroup.addLayer(marker);
        });
        // If a provider is specifically selected, center on it
        if (selectedProviderId) {
            const selectedProv = providers.find((p) => p.provider_id === selectedProviderId);
            if (selectedProv) {
                map.setView([selectedProv.latitude, selectedProv.longitude], 15);
            }
        }
    }, [providers, userLocation, selectedProviderId]);
    return (<div className="relative rounded-2xl overflow-hidden border border-white/15 bg-navy-900 shadow-2xl">
      <div ref={mapContainerRef} className={`w-full ${heightClass} z-10`}/>

      {/* Map Overlay Badge & Google Maps button */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-navy-950/85 backdrop-blur-md border border-white/15 text-xs text-slate-300 shadow-lg">
          <MapPin className="w-3.5 h-3.5 text-red-400"/>
          <span className="font-semibold text-white">Interactive Discovery Map</span>
          <span className="text-[10px] text-slate-400 border-l border-white/10 pl-2">
            {providers.length} Spots Shown
          </span>
        </div>

        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(userLocation?.cityName || 'Hyderabad')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-950/90 hover:bg-navy-900 border border-white/15 text-xs text-slate-200 transition shadow-lg" title="Open this location in Google Maps">
          <ExternalLink className="w-3.5 h-3.5 text-red-400"/>
          <span className="hidden sm:inline">Open in Google Maps</span>
        </a>
      </div>

      {/* Optional Maps Key / Attribution footer */}
      <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-950/80 backdrop-blur-md border border-white/10 text-[10px] text-slate-400">
        <Info className="w-3 h-3 text-slate-400"/>
        <span>OpenStreetMap + Leaflet Engine • Ready for Google/Mapbox API</span>
      </div>
    </div>);
};
