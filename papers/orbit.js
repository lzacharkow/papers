import _ from 'lodash';
import Pulp from './Pulp';

class App extends Pulp {
	draw() {
		console.log(this.scene);

		this.earthShadowLines = this.makeShadowLines(25);
		this.moonShadowLines = this.makeShadowLines(10);

		const iterations = 16;

		// rotate around a circle
		this.circlePoints(
			this.scene.view.center,
			this.scene.view.size.height / 3,
			iterations, // iterations
		)
			.forEach(({ point, angleInDegrees }, i) => {
				const circle = new this.scene.Path.Circle(point, 25);
				circle.strokeColor = 'black';

				const shadow = this.earthShadowLines.clone();
				this.scene.project.activeLayer.addChild(shadow);
				shadow.strokeColor = 'black';
				shadow.position = point;
				shadow.rotate(180 - angleInDegrees);

				const moonAngle = i / iterations * Math.PI * 2;

				const moonPosition = this.getPointFromRotate(point, moonAngle, 25);

				const moon = new this.scene.Path.Circle(moonPosition, 10);
				moon.strokeColor = 'black';
				moon.fillColor = 'white';

				const moonShadow = this.moonShadowLines.clone();
				this.scene.project.activeLayer.addChild(moonShadow);
				moonShadow.position = moonPosition;
				moonShadow.rotate(180 - angleInDegrees);
				moonShadow.strokeColor = 'black';
			});

		// make the sun
		const sun = new this.scene.Path.Circle(this.scene.view.center, 100);
		sun.strokeColor = 'black';
	}

	circlePoints(centerPoint, radius, iterations) {
		return _.range(iterations).map((i) => {
			const angle = i / iterations * Math.PI * 2;
			const angleInDegrees = angle * 180 / Math.PI;
			const point = new this.scene.Point(
				Math.sin(angle) * radius + centerPoint.x,
				Math.cos(angle) * radius * 0.7 + centerPoint.y,
			);
			return { angleInDegrees, point };
		});
	}

	getPointFromRotate(centerPoint, angle, radius) {
		return new this.scene.Point(
			Math.sin(angle) * radius + centerPoint.x,
			Math.cos(angle) * radius * 0.5 + centerPoint.y,
		);
	}

	makeShadowLines(radius) {
		const point = new this.scene.Point(0, 0);

		const circle = new this.scene.Path.Circle(point, radius);

		const finalShape = new this.scene.CompoundPath();

		const numOfLines = Math.floor(15 / 25 * radius);
		_.range(numOfLines + 1).forEach((i) => {
			const x = i / numOfLines * radius * 2;
			const line = new this.scene.Path.Line(
				new this.scene.Point(-radius + x, -radius),
				new this.scene.Point(-radius + x, 0),
			);
			const finalLine = line.intersect(circle, { stroke: true });
			line.remove();
			finalShape.addChild(finalLine);
		});

		circle.remove();

		finalShape.strokeColor = 'red';
		finalShape.remove();

		finalShape.pivot = new this.scene.Point(0, 0);

		return finalShape;
	}
}

export default App;
