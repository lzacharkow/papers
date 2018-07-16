import Pulp from './Pulp';

class App extends Pulp {
	draw() {
		this.paths = [];

		const offset = 100;

		for (let i = offset; i < this.scene.view.bounds.right - offset; i += 7) {
			const scaleFactor = 0.0115398163;
			const midPoint = this.scene.view.size.height / 2;
			const sin = (this.scene.view.size.height - offset * 2) * 0.25;
			const sinMidPoint = Math.sin((i - offset) * scaleFactor) * sin;

			const path = new this.scene.Path(
				new this.scene.Point(i, offset),
				new this.scene.Point(i - 50, midPoint + sinMidPoint),
				new this.scene.Point(i, this.scene.view.bounds.bottom - offset),
			);

			path.strokeColor = 'black';
			this.paths.push(path);
		}
	}
}

export default App;
