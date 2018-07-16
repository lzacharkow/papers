import _ from 'lodash';
import Pulp from './Pulp';

class App extends Pulp {
	draw() {
		this.paths = [];

		const offsetX = 200;
		const offsetY = 100;

		for (let i = offsetX; i < this.scene.view.bounds.right - offsetX; i += 10) {
			const scaleFactor = 0.0115398163;
			const midPoint = this.scene.view.size.height / 2;
			const sin = (this.scene.view.size.height - offsetY * 2) * 0.15;
			const sinMidPoint = Math.sin((i - offsetY) * scaleFactor) * sin;

			const path = new this.scene.Path(
				new this.scene.Point(i, offsetY),
				new this.scene.Point(i, midPoint + sinMidPoint),
				new this.scene.Point(i, this.scene.view.bounds.bottom - offsetY),
			);

			_.first(path.segments).handleOut = new this.scene.Point(-100, 100);
			path.segments[1].handleIn = new this.scene.Point(-50, -50);

			path.segments[1].handleOut = new this.scene.Point(-50, 50);
			_.last(path.segments).handleIn = new this.scene.Point(-100, -100);

			path.strokeColor = 'black';
			this.paths.push(path);
		}
	}
}

export default App;
