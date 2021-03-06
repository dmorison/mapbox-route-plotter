import React, { useRef, useEffect, useState } from 'react';

import mapboxgl from 'mapbox-gl';
import SideBar from './SideBar';

import './Map.css';

import { routeData } from '../utils/data';
import { token } from '../utils/token';

mapboxgl.accessToken = token;

const Map = () => {
	const mapContainer = useRef(null);
	const [map, setMap] = useState(null);
	const [route, setRoute] = useState([]);
	const [markers, setMarkers] = useState([]);

	const data = routeData;

	useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/cjaudgl840gn32rnrepcb9b9g',
      center: [-0.4, 51.2],
      zoom: 11
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
				'id': 'path',
				'type': 'line',
				'source': 'route',
				'layout': {
					'line-join': 'round',
					'line-cap': 'round'
				},
				'paint': {
					'line-color': '#0058ca',
					'line-width': 5
				},
				'filter': ['==', '$type', 'LineString']
			});

			setMap(map);
		});

		return () => map.remove();
  }, []);

	useEffect(() => {
		if (map) {
			data.features[0].geometry.coordinates = route;

			if (markers.length) {
				markers.forEach(marker => marker.remove());
				setMarkers([]);
			}

			drawRouteMarkers();

			map.getSource('route').setData(data);
		}
	}, [route]); // run each time the route is updated

	const drawRouteMarkers = () => {
		let markersArray = markers;

		route.forEach((point, index) => {
			const el = document.createElement('span');
			el.className = 'marker';
			el.innerHTML = `${index + 1}`;
			let marker = new mapboxgl.Marker(el).setLngLat(point).addTo(map);
			markersArray.push(marker);
		});

		setMarkers(markersArray);
	}

	if (map) {
		map.on('click', (e) => {
			const coords = [e.lngLat.lng, e.lngLat.lat];

			let points = [...route];
			points.push(coords);

			setRoute(points);
		});
	};

	const removePoint = (p) => {
		let points = [...route];
		points.splice(p, 1);

		setRoute(points);
	};

	return (
		<>
			<SideBar route={route} removePoint={removePoint} />
			<div ref={mapContainer} className="map-container" />
		</>
	);
};

export default Map;