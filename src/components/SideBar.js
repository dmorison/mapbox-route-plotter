import React from 'react';

import './SideBar.css';

const SideBar = (props) => {
	return (
		<div className="sidebar">
			<div className="sidebar-title">
				<span>
					Route Builder
				</span>
			</div>
			<ul className="waypoints">
				{props.route.map((item, index) => {
					return (
						<li key={index}>Waypoint {index + 1}<span className="delete-waypoint" onClick={() => props.removePoint(index)}></span></li>
					);
				})}
			</ul>
			<button className="download">Download you Route</button>
		</div>
	);
};

export default SideBar;