class AnimatedTransformMatrix extends AnimatedWithChildren {
    _transformMatrix: Array<Object>;

    constructor(transformMatrix: Array<Object>) {
        super();
        this._transformMatrix = transformMatrix;
    }

    __getValue(): Array<Number> {
        return this._transformMatrix.map(x => {
            if (x instanceof Animated) {
                return x.__getValue();
            } else {
                return x;
            }
        });
    }

    getAnimatedValue(): Array<Number> {
        return this._transformMatrix.map(x => {
            if (x instanceof Animated) {
                return x.getAnimatedValue();
            } else {
                return x;
            }
        });
    }

    attach(): void {
        this._transformMatrix.forEach(x => {
            if (x instanceof Animated) {
                x.addChild(this);
            }
        });
    }

    detach(): void {
        this._transformMatrix.forEach(x => {
            if (x instanceof Animated) {
                x.removeChild(this);
            }
        });
    }
}


class AnimatedStyle extends AnimatedWithChildren {
    _style: Object;

    constructor(style: any) {
        super();
        style = flattenStyle(style) || {};
        if (style.transform) {
            style = {
                ...style,
                transform: new AnimatedTransform(style.transform),
            };
        }
        if (style.transformMatrix) {
            style = {
                ...style,
                transformMatrix: new AnimatedTransformMatrix(style.transformMatrix),
            };
        }
        this._style = style;
    }

    __getValue(): Object {
        var style = {};
        for (var key in this._style) {
            var value = this._style[key];
            if (value instanceof Animated) {
                style[key] = value.__getValue();
            } else {
                style[key] = value;
            }
        }
        return style;
    }

    getAnimatedValue(): Object {
        var style = {};
        for (var key in this._style) {
            var value = this._style[key];
            if (value instanceof Animated) {
                style[key] = value.getAnimatedValue();
            }
        }
        return style;
    }

    attach(): void {
        for (var key in this._style) {
            var value = this._style[key];
            if (value instanceof Animated) {
                value.addChild(this);
            }
        }
    }

    detach(): void {
        for (var key in this._style) {
            var value = this._style[key];
            if (value instanceof Animated) {
                value.removeChild(this);
            }
        }
    }
}