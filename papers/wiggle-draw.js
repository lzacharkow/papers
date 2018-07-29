import Pulp from './Pulp';

class App extends Pulp {
	draw() {
		const tool = new this.scene.Tool();

		let path;
		let pathTop1;
		let pathTop2;
		let pathTop3;
		let pathBot1;
		let pathBot2;
		let pathBot3;

		function perp(e) {
			const spacing = 10;
			const norm = e.delta;
			norm.angle += 90;

			return {
				top1: e.middlePoint.add(norm.normalize(spacing / 2)),
				top2: e.middlePoint.add(norm.normalize(spacing * 1.5)),
				top3: e.middlePoint.add(norm.normalize(spacing * 2.5)),
				bot1: e.middlePoint.subtract(norm.normalize(spacing / 2)),
				bot2: e.middlePoint.subtract(norm.normalize(spacing * 1.5)),
				bot3: e.middlePoint.subtract(norm.normalize(spacing * 2.5)),
			};
		}

		tool.minDistance = 25;

		this.scene.tool.onMouseDown = (e) => {
			path = new this.scene.Path();
			pathTop1 = new this.scene.Path();
			pathTop2 = new this.scene.Path();
			pathTop3 = new this.scene.Path();
			pathBot1 = new this.scene.Path();
			pathBot2 = new this.scene.Path();
			pathBot3 = new this.scene.Path();

			path.add(e.point);

			pathTop1.strokeColor = 'black';
			pathTop2.strokeColor = 'black';
			pathTop3.strokeColor = 'black';
			pathBot1.strokeColor = 'black';
			pathBot2.strokeColor = 'black';
			pathBot3.strokeColor = 'black';
		};

		this.scene.tool.onMouseDrag = (e) => {
			const {
				top1,
				top2,
				top3,
				bot1,
				bot2,
				bot3,
			} = perp(e);

			path.add(e.point);
			pathTop1.add(top1);
			pathTop2.add(top2);
			pathTop3.add(top3);
			pathBot1.add(bot1);
			pathBot2.add(bot2);
			pathBot3.add(bot3);

			path.smooth();
			pathTop1.smooth();
			pathTop2.smooth();
			pathTop3.smooth();
			pathBot1.smooth();
			pathBot2.smooth();
			pathBot3.smooth();
		};
	}
}

export default App;
