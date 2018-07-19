import Pulp from './Pulp';

class App extends Pulp {
	draw() {
		const tool = new this.scene.Tool();
		const paths = [];
		let path;

		// Only execute onMouseDrag when the mouse
		// has moved at least 10 points:
		tool.minDistance = 10;

		tool.onMouseDown = (event) => {
			// Create a new path every time the mouse is clicked
			path = new this.scene.Path();
			path.add(event.point);
			path.strokeColor = 'black';

			paths.push(path);
		};

		tool.onMouseDrag = (event) => {
			// Add a point to the path every time the mouse is dragged
			path.add(event.point);
			path.smooth();
		};

		this.scene.view.onFrame = () => {
			// paths.forEach((path) => {
			// 	path.segments.forEach((segment, i) => {
			// 		const x = Math.sin(new Date() / 200 + i) * 0.5;
			// 		const y = Math.cos(new Date() / 200 + i) * 0.5;
			// 		segment.point = segment.point.add(new this.scene.Point(x, y));
			// 	});
			// });
		};
	}
}

export default App;
