import _ from 'lodash';
import Pulp from './Pulp';

class App extends Pulp {
	draw() {
		this.paths = [];

		const offset = 100;

		const circleSize = this.scene.view.bounds.height - offset * 2;

		const rect = new this.scene.Rectangle(
			new this.scene.Point(
				this.scene.view.bounds.width / 2 - circleSize / 2,
				this.scene.view.bounds.height / 2 - circleSize / 2,
			),
			new this.scene.Size(circleSize),
		);

		const circle = new this.scene.Path.Rectangle(
			rect,
			new this.scene.Size((this.scene.view.bounds.height) / 2),
		);

		for (let i = offset; i < this.scene.view.bounds.right - offset; i += 15) {
			const scaleFactor = 0.0115398163;
			const midPoint = this.scene.view.size.height / 2;
			const sin = (this.scene.view.size.height - offset * 2) * 0.25;
			const sinMidPoint = Math.sin((i - offset) * scaleFactor) * sin;

			const path = new this.scene.Path(
				new this.scene.Point(i, offset),
				new this.scene.Point(i - 70, midPoint + sinMidPoint),
				new this.scene.Point(i, this.scene.view.bounds.bottom - offset),
			);

			_.first(path.segments).handleOut = new this.scene.Point(-10, 30);
			_.last(path.segments).handleIn = new this.scene.Point(-10, -30);

			path.strokeColor = 'black';

			const croppedPath = path.exclude(circle);
			croppedPath.strokeColor = 'black';

			path.remove();

			this.paths.push(croppedPath);
		}
	}
}

export default App;
