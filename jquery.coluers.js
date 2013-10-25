/* jslint devel: true, unparam: true, sloppy: true, vars: false, nomen: true, plusplus: true, maxerr: 1000, indent: 4 */
/* global window, document, jQuery, $ */
/*
 * jQuery Coluers
 * Copyright 2012 sakistyle
 *
 */

;(function(global, doc, $) {

    var plugname = 'Coluers',
        defaults = {
        };

    /**
     * Constructor.
     *
     *   Constructs an RGB or HSL color object, optionally with an alpha channel.
     *   The RGB values must be between 0 and 255.
     *   The saturation and lightness values must be between 0 and 100.
     *   The alpha value must be between 0 and 1.
     *
     * @param   _attrs
     * @return  Coluers Object
     */
    var Coluers = function (_attrs, allow_both_rgb_and_hsl) {
        var reg = new RegExp('^#(..?)(..?)(..?)$'),
            error = new Error(),
            attrs, r, g, b, hsl, value, tmp;

        if (typeof allow_both_rgb_and_hsl === 'undefined') {
            allow_both_rgb_and_hsl = false;
        }

        if (typeof _attrs === 'string') {
            attrs = _attrs;

            if (attrs.indexOf('rgb') > -1) {
                _attrs = attrs.replace('rgb(', '').replace(')', '').replace(' ', '').split(',');
            } else {
                    if (attrs.replace('#', '').length === 3) {
                    attrs = attrs.replace(reg, '#$1$1$2$2$3$3');
                }

                attrs = attrs.match(reg).splice(1, 3);
                if (attrs === null) {
                    error.name = 'ArgumentError';
                    error.message = 'new Coluers(string) expects a system color format (ex. #ff0000, #f00)';
                    throw error;
                }

                _attrs = attrs.map(hex_to_dec);
            }
        }

        if (typeof _attrs === 'object' && _attrs instanceof Array) {
            if (_attrs.length !== 3 && _attrs.length !== 4) {
                error.name = 'ArgumentError';
                error.message = 'new Coluers(array) expects a three- or four-element RGB(A) array';
                throw error;
            }

            r = parseInt(_attrs[0]);
            g = parseInt(_attrs[1]);
            b = parseInt(_attrs[2]);

            _attrs = {
                'red': r,
                'green': g,
                'blue': b
            };
            this.attrs = _attrs;
            this.attrs.alpha = _attrs[3] ? parseFloat(_attrs[3]) : 1;
        } else {
            hsl = (_attrs.hue !== null && _attrs.saturation !== null && _attrs.lightness !== null) ? ['hue', 'saturation', 'lightness'].filter(function(v) {
                if (_attrs[v] !== null) return v;
            }) : [];
            rgb = (_attrs.red !== null && _attrs.green !== null && _attrs.blue !== null) ? ['hue', 'saturation', 'lightness'].filter(function(v) {
                if (_attrs[v] !== null) return v;
            }) : [];

            if (!allow_both_rgb_and_hsl && hsl.length !== 0 && rgb.length !== 0) {
                error.name = 'ArgumentError';
                error.message = 'new Coluers(hash) may not have both HSL and RGB keys specified';
                throw error;
            } else if (hsl.length === 0 && rgb.length === 0) {
                error.name = 'ArgumentError';
                error.message = 'new Coluers(hash) must have either HSL or RGB keys specified';
                throw error;
            } else if (hsl.length !== 0 && hsl.length !== 3) {
                error.name = 'ArgumentError';
                error.message = 'new Coluers(hash) must have all three HSL values specified';
                throw error;
            } else if (rgb.length !== 0 && rgb.length !== 3) {
                error.name = 'ArgumentError';
                error.message = 'new Coluers(hash) must have all three RGB values specified';
                throw error;
            }

            this.attrs = _attrs;
            this.attrs.hue = this.attrs.hue ? this.attrs.hue % 360 : 0;
            this.attrs.alpha = this.attrs.alpha || 1;
        }

        // RGB値のチェック
        tmp = ['red', 'green', 'blue'];
        for (var i = 0; i < tmp.length; i++) {
            if (this.attrs[tmp[i]] === null) {
                continue;
            }
            this.attrs[tmp[i]] = parseInt(this.attrs[tmp[i]]);
            check_range(tmp[i].charAt(0).toUpperCase() + tmp[i].slice(1) + " value ", 0, 255, this.attrs[tmp[i]]);
        }

        // SL値のチェック
        tmp = ['saturation', 'lightness'];
        for (var i = 0; i < tmp.length; i++) {
            if (this.attrs[tmp[i]] === null) {
                continue;
            }
            value = parseInt(this.attrs[tmp[i]].toString().replace('%', ''));
            this.attrs[tmp[i]] = check_range(tmp[i].charAt(0).toUpperCase() + tmp[i].slice(1) + " value ", 0, 100, value, '%');
        }

        this.attrs.alpha = check_range("Alpha channel ", 0, 1, this.attrs.alpha);

        // プロパティの設定
        this.attrs = _attrs;
    };


    // private methods
    var invert = function (_coluers) {
        if (typeof _coluers === 'object' && _color instanceof $[plugname]) {
            var error = new Error();
            error.name = 'ArgumentError';
            error.message = 'Give an instance of the Coluers class is the parameter.';
            throw error;
        }

        return _coluers.with({
            'red': 255 - parseInt(_coluers.red),
            'green': 255 - parseInt(_coluers.green),
            'blue': 255 - parseInt(_coluers.blue),
        });
    }

    var hex_to_dec = function (_num) {
        var ret = null;

        if (_num !== null) {
            ret = parseInt(_num, 16);
        }

        return ret;
    };

    var dec_to_hex = function (_num) {
        var ret = null;

        if (_num !== null) {
            num = _num.toString(16);
            ret = (num < 10) ? '0' + num : num;
        }

        return ret;
    };

    var check_range = function (_name, _range_first, _range_last, _value, _unit) {
        _unit = _unit || '';

        var grace_first = -0.00001,
            grace_last = 0.00001,
            str = _value,
            error = new Error();

        if (_range_first <= _value && _value <= _range_last) return _value;
        if (grace_first <= (_value - _range_first) && (_value - _range_first) <= grace_last) return _range_first;
        if (grace_first <= (_value - _range_last) && (_value - _range_last) <= grace_last) return _range_last;

        error.name = 'ArgumentError';
        error.message = _name + str + " must be between " + _range_first + _unit + " and " + _range_last + _unit;
        throw error;
    };

    var merge = function () {
        var args = Array.prototype.slice.call(arguments),
            len = args.length,
            ret = {},
            item;

        for (var i = 0; i < len; i++) {
            var arg = args[i];
            for (item in arg) {
                if (arg.hasOwnProperty(item)) ret[item] = arg[item];
            }
        }

        return ret;
    };


    // public methods
    /**
     * The red component of the color.
     *
     * @return  integer
     */
    Coluers.prototype.red = function () {
        this.hsl_to_rgb();
        return this.attrs.red;
    };

    /**
     * The green component of the color.
     *
     * @return  integer
     */
    Coluers.prototype.green = function () {
        this.hsl_to_rgb();
        return this.attrs.green;
    };

    /**
     * The blue component of the color.
     *
     * @return  integer
     */
    Coluers.prototype.blue = function () {
        this.hsl_to_rgb();
        return this.attrs.blue;
    };

    /**
     * The hue component of the color.
     *
     * @return  integer
     */
    Coluers.prototype.hue = function () {
        this.rgb_to_hsl();
        return this.attrs.hue;
    };

    /**
     * The saturation component of the color.
     *
     * @return  integer
     */
    Coluers.prototype.saturation = function () {
        this.rgb_to_hsl();
        return this.attrs.saturation;
    };

    /**
     * The lightness component of the color.
     *
     * @return  integer
     */
    Coluers.prototype.lightness = function () {
        this.rgb_to_hsl();
        return this.attrs.lightness;
    };

    /**
     * The alpha channel (opacity) of the color.
     *
     * @return  integer
     */
    Coluers.prototype.alpha = function () {
        return this.attrs.alpha;
    };

    /**
     * Returns whether this color object is translucent; that is, whether the alpha channel is non-1.
     *
     * @return  boolean
     */
    Coluers.prototype.is_alpha = function () {
        return (this.alpha() < 1);
    };

    /**
     * The red component of the color.
     *
     * @return  integer
     */
    Coluers.prototype.rgb = function () {
        return [this.red(), this.green(), this.blue()];
    };

    /**
     * The red component of the color.
     *
     * @return  integer
     */
    Coluers.prototype.hsl = function () {
        return [this.hue(), this.saturation(), this.lightness()];
    };

    /**
     * The red component of the color.
     *
     * @return  integer
     */
    Coluers.prototype.eq = function(_other) {
        return (_other instanceof Coluers && this.rgb() === _other.rgb() && this.plpha() === _other.alpha());
    };

    /**
     * Returns a copy of this color with one or more channels changed.
     *
     * @return  Coluers Object
     */
    Coluers.prototype.with = function(_attrs) {
        var error = new Error(),
            hsl, rgb, tmp;

        hsl = !! (_attrs.hue !== null || _attrs.saturation !== null || _attrs.lightness !== null);
        rgb = !! (_attrs.red !== null || _attrs.green !== null || _attrs.blue !== null);

        if (hsl && rgb) {
            error.name = 'ArgumentError';
            error.message = 'Cannot specify HSL and RGB values for a color at the same time';
            throw error;
        }

        if (hsl) {
            tmp = ['hue', 'saturation', 'lightness'];
            for (var i = 0; i < tmp.length; i++) {
                _attrs[tmp[i]] = (tmp[i] in _attrs && _attrs[tmp[i]] !== null) ? _attrs[tmp[i]] : this[tmp[i]]();
            }
        } else if (rgb) {
            tmp = ['red', 'green', 'blue'];
            for (var i = 0; i < tmp.length; i++) {
                _attrs[tmp[i]] = (tmp[i] in _attrs && _attrs[tmp[i]] !== null) ? _attrs[tmp[i]] : this[tmp[i]]();
            }
        } else {
            // If we're just changing the alpha channel,
            // keep all the HSL/RGB stuff we've calculated
            _attrs = merge(this.attrs, _attrs);
        }
        _attrs.alpha = _attrs.alpha || this.alpha();

        return new Coluers(_attrs);
    };

    /**
     * Returns a string representation of the color.
     * This is usually the color’s hex value, but if the color has a name that’s used instead.
     *
     * @return  string
     */
    Coluers.prototype.to_s = function(opts) {
        opts = opts || {};
        if (this.is_alpha()) return this.rgba_str();
        if (opts && opts.style === 'compressed') return this.smallest();
        //    if (HTML4_COLORS_REVERSE[rgb])   return HTML4_COLORS_REVERSE[rgb];
        return this.hex_str();
    };

    /**
     * The red component of the color.
     *
     * @return  integer
     */
    Coluers.prototype.rgb_str = function() {
        var split = (this.options && this.options.style === 'compressed') ? ',' : ', ';

        return "rgb(" + this.rgb().join(split) + ")";
    };

    /**
     * The red component of the color.
     *
     * @return  integer
     */
    Coluers.prototype.rgba_str = function() {
        var split = (this.options && this.options.style === 'compressed') ? ',' : ', ';

        return "rgba(" + this.rgb().join(split) + split + Math.round(this.alpha()) + ")";
    };

    /**
     * The red component of the color.
     *
     * @return  integer
     */
    Coluers.prototype.hex_str = function() {
        return "#" + this.rgb().map(dec_to_hex).join('');
    };

    /**
     * The red component of the color.
     *
     * @return  integer
     */
    Coluers.prototype.hue_to_rgb = function (_min, _max, _hue) {
        var h = _hue;

        if (h < 0) h += 1;
        if (h > 1) h -= 1;

        if (h * 6 < 1) return _min + (_max - _min) * h * 6;
        if (h * 2 < 1) return _max;
        if (h * 3 < 2) return _min + (_max - _min) * (2.0 / 3 - h) * 6;

        return _min;
    };

    /**
     * The red component of the color.
     *
     * @return  integer
     */
    Coluers.prototype.hsl_to_rgb = function () {
        if (this.attrs.red !== null && this.attrs.green !== null && this.attrs.blue !== null) {
            return;
        }

        var h = this.attrs.hue / 360.0,
            s = this.attrs.saturation.toString().replace('%', '') / 100.0,
            l = this.attrs.lightness.toString().replace('%', '') / 100.0,
            max = (l <= 0.5) ? l * (s + 1) : l + s - l * s,
            min = l * 2 - max;

        this.attrs.red = Math.round(this.hue_to_rgb(min, max, h + 1.0 / 3) * 0xff);
        this.attrs.green = Math.round(this.hue_to_rgb(min, max, h) * 0xff);
        this.attrs.blue = Math.round(this.hue_to_rgb(min, max, h - 1.0 / 3) * 0xff);
    };

    /**
     * The red component of the color.
     *
     * @return  integer
     */
    Coluers.prototype.rgb_to_hsl = function() {
        if (this.attrs.hue !== null && this.attrs.saturation !== null && this.attrs.lightness !== null) {
            return;
        }

        var r = this.attrs.red / 255.0,
            g = this.attrs.green / 255.0,
            b = this.attrs.blue / 255.0,
            max = Math.max(Math.max(r, g), b),
            min = Math.min(Math.min(r, g), b),
            d = max - min,
            h = 0,
            s = 0,
            l = (max + min) / 2.0;

        if (max === min) {
            h = 0;
        } else if (max === r) {
            h = 60 * (g - b) / d + 0;
        } else if (max === g) {
            h = 60 * (b - r) / d + 120;
        } else {
            h = 60 * (r - g) / d + 240;
        }

        if (max === min) {
            s = 0;
        } else if (l < 0.5) {
            s = d / (2 * l);
        } else {
            s = d / (2 - 2 * l);
        }

        this.attrs.hue = Math.round(h % 360);
        this.attrs.saturation = Math.round(s * 100);
        this.attrs.lightness = Math.round(l * 100);
    };


    $[plugname] = function (options) {
        return new Coluers(options);
    }

})(this, document, jQuery);
