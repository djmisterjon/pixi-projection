namespace pixi_projection {
	export function container3dWorldTransform() {
		return this.proj.affine ? this.transform.worldTransform : this.proj.world as any;
	}

	export class Container3d extends PIXI.Container {
		constructor() {
			super();
			this.proj = new Projection3d(this.transform);
		}

		proj: Projection3d;

		isFrontFace(forceUpdate: boolean = true) {
			if (forceUpdate) {
				this._recursivePostUpdateTransform();
				this.displayObjectUpdateTransform();
			}

			const mat4 = this.proj.world.mat4;
			return mat4[10] * mat4[15] > 0;
		}

		toLocal<T extends PIXI.PointLike>(position: PIXI.PointLike, from?: PIXI.DisplayObject,
		        point?: T, skipUpdate?: boolean,
		        step = TRANSFORM_STEP.ALL): T {

			if (from)
			{
				position = from.toGlobal(position, point, skipUpdate);
			}

			if (!skipUpdate)
			{
				this._recursivePostUpdateTransform();
			}

			if (step === TRANSFORM_STEP.ALL) {
				if (this.proj.affine === AFFINE.NONE) {
					return this.transform.worldTransform.applyInverse(point, point) as any;
				}
				return this.proj.world.applyInverse(point, point) as any;
			}

			if (this.parent) {
				point  = this.parent.worldTransform.applyInverse(position, point) as any;
			} else {
				point.copy(position);
			}
			if (step === TRANSFORM_STEP.NONE) {
				return point;
			}

			point = this.transform.localTransform.applyInverse(point, point) as any;
			if (step === TRANSFORM_STEP.PROJ && this.proj.cameraMode) {
				point = this.proj.cameraMatrix.applyInverse(point, point) as any;
			}
			return point;
		}

		get worldTransform() {
			return this.proj.affine ? this.transform.worldTransform : this.proj.world as any;
		}

		get position3d(): PIXI.PointLike {
			return this.proj.position;
		}
		get scale3d(): PIXI.PointLike {
			return this.proj.scale;
		}
		get euler(): Euler {
			return this.proj.euler;
		}
		get pivot3d(): PIXI.PointLike {
			return this.proj.pivot;
		}
		set position3d(value: PIXI.PointLike) {
			this.proj.position.copy(value);
		}
		set scale3d(value: PIXI.PointLike) {
			this.proj.scale.copy(value);
		}
		set euler(value: Euler) {
			this.proj.euler.copy(value);
		}
		set pivot3d(value: PIXI.PointLike) {
			this.proj.pivot.copy(value);
		}
	}

	export let container3dToLocal = Container3d.prototype.toLocal;
}
