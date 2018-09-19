/* eslint-disable class-methods-use-this */
import paper from 'paper/dist/paper-core';
import _ from 'lodash';

// Extend this in each sketch.
// - Gives canvas element to paper
// - Makes a new paper environment for us

class Pulp {
	constructor(title = 'Pulpy') {
		this.title = title;

		this.scene = new paper.PaperScope();
		this.canvasElement = document.getElementById('canvas');
		this.scene.setup(this.canvasElement);

		// custom UI
		this.controls = this.setControls();
		if (this.controls) this.drawControls();

		this.createExportToSVGButton();

		this.bindPanAndZoom();

		// run the sketch
		this.draw();
	}

	draw() {
		// Put paper logic here.
	}

	drawAsync(iterations, cb, done = _.noop, counter = 0, id = '') {
		if (!id) this._asyncId = _.uniqueId();

		const timer = window.performance.now();
		while (window.performance.now() - timer < 25 && counter < iterations) {
			cb(counter++);
		}
		if (counter < iterations) {
			window.requestAnimationFrame(() => {
				if (id && id !== this._asyncId) return;
				this.drawAsync(iterations, cb, done, counter, this._asyncId);
			});
		} else {
			return done();
		}
	}

	// for use with controls
	redraw() {
		this.scene.project.clear();
		this.draw();
	}

	// ====================================================================
	// SVG EXPORT
	// ====================================================================

	onExport() {
		// you can do work before running the export using this method
		// (e.g. re-ordering paths for plotting)
	}

	createExportToSVGButton() {
		// We're makin' us a button
		this.exportButton = document.createElement('button');
		this.exportButton.className = 'export';
		this.exportButton.appendChild(document.createTextNode('Export to SVG'));
		document.body.append(this.exportButton);

		// And we're wiring up a click handler
		this.exportButton.addEventListener('click', () => {
			// Call an optional callback if we need to do work before exporting
			this.onExport();
			// Show some feedback before we lock up the browser
			this.exportButton.textContent = 'Building ...';

			// Gross setTimeout to give the browser a chance to render
			// the text into the button before we lock it up generating
			// our svg data.
			setTimeout(() => {
				// Tell paper to generate an SVG to string
				const svgData = this.getControlReadout() + this.scene.project.exportSVG({ asString: true });

				// Now we're going to use an old hack to get the browser
				// to download our data as an SVG file. First make an
				// <a> tag...
				const downloadLink = window.document.createElement('a');
				// Then set its URL to a data blob...
				downloadLink.href = window.URL.createObjectURL(new window.Blob([svgData], { type: 'text/svg' }));
				downloadLink.download = 'paper-sketch.svg';
				// Then put it in the body, click it, and remove it.
				document.body.appendChild(downloadLink);
				downloadLink.click();
				document.body.removeChild(downloadLink);

				// More feedback.
				this.exportButton.textContent = 'Saved ✔︎';

				// And reset it in case you wanna do it again.
				window.setTimeout(() => {
					this.exportButton.textContent = 'Export to SVG';
				}, 1000);
			}, 0);
		});
	}

	getControlReadout() {
		const controlText = Object.keys(this.controls)
			.map(key => `${key}: ${this.controls[key].value}\n`)
			.join('');
		return `<!--\n${controlText}-->\n`;
	}

	// ====================================================================
	// CONTROLS
	// ====================================================================

	setControls() {
		// return an object with controls in it here,
		// e.g. return { angle: this.createControl('float', 0.2) }
		return null;
	}

	createControl(type, value, min, max, extras = {}) {
		return {
			type,
			value,
			// ignore these when the type is boolean maybe
			min,
			max,
			...extras,
		};
	}

	drawControls() {
		const controlsEl = document.createElement('div');
		controlsEl.className = 'controls';
		document.body.appendChild(controlsEl);

		const redraw = document.createElement('button');
		redraw.textContent = 'redraw';
		controlsEl.appendChild(redraw);
		redraw.addEventListener('click', () => this.redraw());

		Object.keys(this.controls).forEach((key) => {
			const c = this.controls[key];

			if (c.type === 'range') {
				const readout = document.createElement('div');
				readout.className = 'readout';
				readout.dataset.name = `${key}:`;
				readout.textContent = c.value;

				const range = document.createElement('input');
				range.type = 'range';
				range.min = c.min;
				range.max = c.max;
				range.step = c.step || '0.01';
				range.value = c.value;

				range.addEventListener('change', () => {
					console.log(`%c${key}:`, 'color: #1566FF; font-weight: bold;', range.value);
					readout.textContent = range.value;
					c.value = +range.value;
					this.redraw();
				});

				range.addEventListener('mousemove', (e) => {
					if (e.buttons === 1) {
						readout.textContent = range.value;
						c.value = +range.value;
						this.redraw();
					}
				});

				controlsEl.appendChild(readout);
				controlsEl.appendChild(range);
			}
		});
	}

	// ====================================================================
	// INTERACTIVE
	// ====================================================================

	bindPanAndZoom() {
		this._zoomLevel = 1;

		document.addEventListener('mousewheel', (e) => {
			const delta = -e.deltaY / 100;
			const { x } = this.scene.view.getScaling();
			// don't let the canvas zoom out smaller than 100%
			if (x * (1 + delta) < 1 && delta < 0) {
				this.scene.view.setScaling(new this.scene.Point(1, 1));
			} else {
				this.scene.view.scale(1 + delta);
			}
		});

		let startPoint;
		let startCenter;
		this.scene.view.onMouseDown = (e) => {
			startPoint = new this.scene.Point(e.event.clientX, e.event.clientY);
			startCenter = this.scene.view.center;
		};

		this.scene.view.onMouseDrag = (e) => {
			const { x, y } = this.scene.view.getScaling();
			// console.log(startPoint.subtract(e.point));
			// this.scene.view.center = startPoint.subtract(e.point);
			this.scene.view.center = startCenter
				.add(startPoint.subtract(new this.scene.Point(e.event.clientX, e.event.clientY)).divide(new this.scene.Point(x, y)));
		};
	}
}

export default Pulp;
