import React, { useRef, useEffect, useState } from 'react';

import mapboxgl from 'mapbox-gl';

import SideBar from './SideBar';

import './Map.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZG1vcmlzb24iLCJhIjoiY2wzbjRuYTBmMGIwbTNjbDJqdm56NmFrMiJ9.5_-crI72rIyOpqqL14KNqw';

const Map = () => {
	const mapContainer = useRef(null);
  const [lng, setLng] = useState(-0.4);
  const [lat, setLat] = useState(51.2);
  const [zoom, setZoom] = useState(11);
	const [map, setMap] = useState(null);
	const [route, setRoute] = useState([]);

	const data = {
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'LineString',
			coordinates: route
		}
	};

	useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/cjaudgl840gn32rnrepcb9b9g',
      center: [lng, lat],
      zoom: zoom
    });

		map.on('load', () => {
			map.addSource('dem', {
				'type': 'raster-dem',
				'url': 'mapbox://mapbox.mapbox-terrain-dem-v1'
			});

			map.addLayer(
				{
					'id': 'hillshading',
					'source': 'dem',
					'type': 'hillshade'
				},
				'waterway-river-canal-shadow'
			);

			map.addSource('route', {
				'type': 'geojson',
				'data': data
			});

			map.addLayer({
				'id': 'route',
				'type': 'line',
				'source': 'route',
				'layout': {
					'line-join': 'round',
					'line-cap': 'round'
				},
				'paint': {
					'line-color': '#888',
					'line-width': 8
				}
			});

			setMap(map);
		});

		return () => map.remove();
  }, []);

	const moveMap = () => {
		if (map) {
			console.log(map);
			map.on('move', () => {
				setLng(map.getCenter().lng.toFixed(4));
				setLat(map.getCenter().lat.toFixed(4));
				setZoom(map.getZoom().toFixed(2));
			});
		};
	};

	useEffect(() => {
		if (map) {
			data.geometry.coordinates = route;
			console.log(data.geometry.coordinates);
			map.getSource('route').setData(data);
		}
	}, [route]);

	const addMarker = (p) => {
		const el = document.createElement('span');
		el.className = 'marker';
		new mapboxgl.Marker(el).setLngLat(p).addTo(map);
	};

	if (map) {
		map.on('click', (e) => {
			console.log(e.lngLat);
			const coords = [e.lngLat.lng, e.lngLat.lat];
			addMarker(coords);

			let points = [...route];
			points.push(coords);
			console.log(points);
			setRoute(points);
		});
	};

	const removePoint = (p) => {
		console.log(p);
		let points = [...route];
		points.splice(p, 1);
		setRoute(points);
	};

	return (
		<div>
			<SideBar longitude={lng} latitude={lat} zoom={zoom} route={route} removePoint={removePoint} />
			<div ref={mapContainer} className="map-container" />
		</div>
	);
};

export default Map;