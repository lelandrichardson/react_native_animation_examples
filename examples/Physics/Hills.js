
class HillAnimation extends Animation {
    _hills: Array<number>;
    _hillHeight: number;
    _fromValue: number;
    _velocity: number;
    _onUpdate: (value: number) => void;
    _animationFrame: any;

    constructor(config) {
        super();
        this._hills = config.hills;
        this._velocity = config.velocity;
        this._hillHeight = config.hillHeight;
    }

    start(fromValue, onUpdate, onEnd) {
        this.__active = true;
        this._lastValue = fromValue;
        this._fromValue = fromValue;
        this._onUpdate = onUpdate;
        this.__onEnd = onEnd;
        this._startTime = Date.now();
        this._animationFrame = requestAnimationFrame(this.onUpdate.bind(this));
    }

    onUpdate(): void {
        var now = Date.now();

        var value = this._fromValue +
            (this._velocity / (1 - this._deceleration)) *
            (1 - Math.exp(-(1 - this._deceleration) * (now - this._startTime)));

        this._onUpdate(value);

        if (Math.abs(this._lastValue - value) < 0.1) {
            this.__debouncedOnEnd({finished: true});
            return;
        }

        this._lastValue = value;
        if (this.__active) {
            this._animationFrame = requestAnimationFrame(this.onUpdate.bind(this));
        }
    }

    stop(): void {
        this.__active = false;
        window.cancelAnimationFrame(this._animationFrame);
        this.__debouncedOnEnd({finished: false});
    }
}

module.exports = function AnimateHills(value, config) {
    return {
        start(cb) {
            var singleValue = value;
            var singleConfig = config;
            singleValue.stopTracking();
            singleValue.animate(new HillAnimation(singleConfig), callback);
        },
        stop() {
            value.stopAnimation();
        }
    }
};