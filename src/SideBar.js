import React, { useRef, useEffect, useState } from 'react';

const SideBar = (props) => {
	return (
		<div className="sidebar">
			<div>Longitude: {props.longitude} | Latitude: {props.latitude} | Zoom: {props.zoom}</div>
			<ul>
				{props.route.map((item, index) => {
					return (
						<li key={index}><a href="" onClick={() => props.removePoint(index)}>Waypoint {index}</a></li>
					);
				})}
			</ul>
		</div>
	);
};

export default SideBar;