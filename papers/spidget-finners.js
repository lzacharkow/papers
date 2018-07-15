import Pulp from './Pulp';

class App extends Pulp {
	draw() {
		this.shapes = [];

		const timeToDuration = () => new Date() / 200;
		const tool = new this.scene.Tool();

		let initialTime;

		tool.onMouseDown = () => {
			initialTime = timeToDuration();
		};

		tool.onMouseUp = (e) => {
			const thisTime = timeToDuration();
			this.makeRectangle(e, thisTime - initialTime);
		};

		this.scene.view.onFrame = () => {
			this.shapes.forEach((shape) => {
				shape.rotate(shape._rotation);
			});
		};
	}

	makeRectangle(e, duration) {
		const size = 20;
		const rect = this.scene.Path.Rectangle(
			new this.scene.Point(
				e.point.x - size / 2,
				e.point.y - size / 2,
			),
			new this.scene.Size(size, size),
		);

		rect._rotation = duration;
		rect.fillColor = 'magenta';

		this.shapes.push(rect);
	}
}

export default App;
