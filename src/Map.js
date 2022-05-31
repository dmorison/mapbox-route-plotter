import React, { useRef, useEffect, useState } from 'react';

import mapboxgl from 'mapbox-gl';

import SideBar from './SideBar';

import './Map.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZG1vcmlzb24iLCJhIjoiY2wzbjRuYTBmMGIwbTNjbDJqdm56NmFrMiJ9.5_-crI72rIyOpqqL14KNqw';

const Map = () => {
	const mapContainer = useRef(null);
	const [map, setMap] = useState(null);
	const [route, setRoute] = useState([]);
	const [markers, setMarkers] = useState([]);

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
				'id': 'route',
				'type': 'line',
				'source': 'route',
				'layout': {
					'line-join': 'round',
					'line-cap': 'round'
				},
				'paint': {
					'line-color': '#0058ca',
					'line-width': 5
				}
			});

			setMap(map);
		});

		return () => map.remove();
  }, []);

	useEffect(() => {
		if (map) {
			data.geometry.coordinates = route;
			console.log(data.geometry.coordinates);
			map.getSource('route').setData(data);
			// drawRouteMarkers();
		}
	}, [route]);

	// const drawRouteMarkers = () => {
	// 	route.map((point, index) => {
	// 		const el = document.createElement('span');
	// 		el.className = 'marker';
	// 		el.innerHTML = `${index + 1}`;
	// 		new mapboxgl.Marker(el).setLngLat(point).addTo(map);
	// 	});
	// }

	const addMarker = (num, p) => {
		const el = document.createElement('span');
		el.className = 'marker';
		el.innerHTML = `${num}`;
		const newMarker = new mapboxgl.Marker(el).setLngLat(p).addTo(map);
		console.log(newMarker);

		let markersArray = [...markers];
		markersArray.push(newMarker);
		setMarkers(markersArray);
	};

	const removeMarker = (i) => {
		console.log(i);
		let markersArray = [...markers];
		const oldMarker = markersArray[i];
		console.log(oldMarker);
		oldMarker.remove();
		markersArray.splice(i, 1);
		setMarkers(markersArray);
	}

	if (map) {
		map.on('click', (e) => {
			console.log(e.lngLat);
			let points = [...route];

			const coords = [e.lngLat.lng, e.lngLat.lat];
			const pointNumber = points.length + 1;
			addMarker(pointNumber, coords);
			// drawRouteMarkers(coords);

			// let points = [...route];
			points.push(coords);
			console.log(points);
			setRoute(points);
		});
	};

	const removePoint = (p) => {
		console.log(p);
		removeMarker(p);
		let points = [...route];
		points.splice(p, 1);
		setRoute(points);
	};

	return (
		<div>
			<SideBar route={route} removePoint={removePoint} />
			<div ref={mapContainer} className="map-container" />
		</div>
	);
};

export default Map;