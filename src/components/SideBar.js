import React from 'react';

import createGpx from 'gps-to-gpx';
import { saveAs } from 'file-saver';

import './SideBar.css';

const SideBar = (props) => {

	const routeToGpx = async () => {
		let waypoints = [];

		props.route.forEach((item) => {
			const point = {
				"latitude": item[1],
				"longitude": item[0]
			};
			waypoints.push(point);
		});

		const gpx = await createGpx(waypoints, {
			activityName: "RUN"
		});

		const data = new Blob([gpx], {type: 'text/xml'});
		saveAs(data, "myRoute.gpx");
	};

	return (
		<div className="sidebar">
			<div className="sidebar-title">
				<span>
					Route Builder
				</span>
			</div>
			<div className="waypoints-wrapper">
				<ul className="waypoints">
					{props.route.map((item, index) => {
						return (
							<li key={index}>Waypoint {index + 1}<span className="delete-waypoint" onClick={() => props.removePoint(index)}></span></li>
						);
					})}
				</ul>
			</div>
			<button className="download" onClick={routeToGpx}>Download your Route</button>
		</div>
	);
};

export default SideBar;