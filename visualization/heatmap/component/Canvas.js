/**
 * Модуль отрисовки тепловой карты на canvas'e. Позволяет получить карту в формате dataURL.
 * @module visualization.heatmap.component.Canvas
 * @requires option.Manager
 * @requires Monitor
 */
ymaps.modules.define('visualization.heatmap.component.Canvas', [
    'option.Manager',
    'Monitor'
],  function (
    provide,
    OptionManager,
    Monitor
) {
    /**
     * @constant DEFAULT_OPTIONS
     * @description Настройки карты по умолчанию.
     */
    var DEFAULT_OPTIONS = {
        opacity: 0.75,
        pointRadius: 5,
        pointBlur: 15,
        gradient: {
            0.1: 'rgba(128, 255, 0, 1)',
            0.4: 'rgba(255, 255, 0, 1)',
            0.8: 'rgba(234, 72, 58, 1)',
            1.0: 'rgba(162, 36, 25, 1)'
        }
    };

    /**
     * @public
     * @function Canvas
     * @description Конструктор модуля отрисовки тепловой карты.
     *
     * @param {Array} size Размер карты: [width, height].
     */
    var Canvas = function (size) {
        this._canvas = document.createElement('canvas');
        this._canvas.width = size[0];
        this._canvas.height = size[1];

        this._context = this._canvas.getContext('2d');

        this.options = new OptionManager({});

        this._setupDrawTools();
        this._setupOptionMonitor();
    };

    /**
     * @public
     * @function getBrushRadius
     * @description Получение размера кисти, которая используется для отрисовки точек.
     *
     * @returns {Number} margin.
     */
    Canvas.prototype.getBrushRadius = function () {
        return this.options.get('pointRadius', DEFAULT_OPTIONS.pointRadius) +
            this.options.get('pointBlur', DEFAULT_OPTIONS.pointBlur);
    };

    /**
     * @public
     * @function generateDataURLHeatmap
     * @description Получение карты в виде dataURL с нанесенными точками.
     *
     * @param {Array} points Массив точек [[x1, y1], [x2, y2], ...].
     * @returns {String} dataURL.
     */
    Canvas.prototype.generateDataURLHeatmap = function (points) {
        this._drawHeatmap(points || []);

        return this._canvas.toDataURL();
    };

    /**
     * @public
     * @function destroy
     * @description Уничтожает внутренние данные.
     */
    Canvas.prototype.destroy = function () {
        this._destoryOptionMonitor();
        this._destroyDrawTools();

        this.options.unsetAll();
        this.options = {};

        this._context = {};
        this._canvas = {};
    };

    /**
     * @private
     * @function _setupOptionMonitor
     * @description Устанавливает монитор на опции тепловой карты.
     *
     * @returns {Monitor} Монитор опций.
     */
    Canvas.prototype._setupOptionMonitor = function () {
        this._optionMonitor = new Monitor(this.options);

        return this._optionMonitor.add(
            ['pointRadius', 'pointBlur', 'opacity', 'gradient'],
            this._setupDrawTools,
            this
        );
    };

    /**
     * @private
     * @function _destoryOptionMonitor
     * @description Уничтожает монитор опций.
     */
    Canvas.prototype._destoryOptionMonitor = function () {
        this._optionMonitor.removeAll();
        this._optionMonitor = {};
    };

    /**
     * @private
     * @function _setupDrawTools
     * @description Устанавливает внутренние опции тепловой карты.
     *
     * @returns {Canvas}
     */
    Canvas.prototype._setupDrawTools = function () {
        this._brush = this._createBrush();
        this._gradient = this._createGradient();

        return this;
    };

    /**
     * @private
     * @function _destroyDrawTools
     * @description Уничтожает внутренние опции тепловой карты.
     */
    Canvas.prototype._destroyDrawTools = function () {
        this._brush = {};
        this._gradient = {};
    };

    /**
     * @private
     * @function _createPointImage
     * @description Создание кисти, которой будут нарисованы точки.
     * Создается круг радиуса pointRadius и с тенью размера pointBlur,
     * после чего сам круг смещается из видимой области, оставляя только тень.
     *
     * @returns {HTMLElement} brush Канвас с отрисованной тенью круга.
     */
    Canvas.prototype._createBrush = function () {
        var brush = document.createElement('canvas'),
            context = brush.getContext('2d'),
            radius = this.getBrushRadius();

        brush.width = brush.height = 2 * radius;

        // Тень смещаем в соседний квадрат.
        context.shadowOffsetX = context.shadowOffsetY = 2 * radius;
        context.shadowBlur = this.options.get('pointBlur', DEFAULT_OPTIONS.pointBlur);
        context.shadowColor = 'black';

        context.beginPath();
        // Круг рисуем вне зоны видимости, фактически от круга оставляем только тень.
        context.arc(
            -1 * radius,
            -1 * radius,
            this.options.get('pointRadius', DEFAULT_OPTIONS.pointRadius),
            0,
            2 * Math.PI,
            true
        );
        context.closePath();
        context.fill();

        return brush;
    };

    /**
     * @private
     * @function _createGradient
     * @description Создание 256x1 градиента, которым будет раскрашена карта.
     *
     * @returns {Array} [r1, g1, b1, a1, r2, ...].
     */
    Canvas.prototype._createGradient = function () {
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            gradient = context.createLinearGradient(0, 0, 0, 256);

        canvas.width = 1;
        canvas.height = 256;

        var gradientOption = this.options.get('gradient', DEFAULT_OPTIONS.gradient);
        for (var i in gradientOption) {
            if (gradientOption.hasOwnProperty(i)) {
                gradient.addColorStop(i, gradientOption[i]);
            }
        }

        context.fillStyle = gradient;
        context.fillRect(0, 0, 1, 256);

        return context.getImageData(0, 0, 1, 256).data;
    };

    /**
     * @private
     * @function _drawHeatmap
     * @description Отрисовка тепловой карты.
     *
     * @returns {Canvas}
     */
    Canvas.prototype._drawHeatmap = function (points) {
        var context = this._context,
            radius = this.getBrushRadius();

        context.clearRect(0, 0, this._canvas.width, this._canvas.height);

        for (var i = 0, length = points.length, point; i < length; i++) {
            point = points[i];
            context.drawImage(this._brush, point[0] - radius, point[1] - radius);
        }

        var heatmapImage = context.getImageData(0, 0, this._canvas.width, this._canvas.height);
        this._colorize(heatmapImage.data);
        context.putImageData(heatmapImage, 0, 0);

        return this;
    };

    /**
     * @private
     * @function _colorize
     * @description Раскрашивание пикселей карты.
     *
     * @param {Array} pixels Бесцветная тепловая карта [r1, g1, b1, a1, r2, ...].
     * @param {Array} gradient Градиент [r1, g1, b1, a1, r2, ...].
     */
    Canvas.prototype._colorize = function (pixels) {
        var opacity = this.options.get('opacity', DEFAULT_OPTIONS.opacity);
        for (var i = 3, length = pixels.length, j; i < length; i += 4) {
            // Получаем цвет в градиенте, по значению прозрачночти.
            j = 4 * pixels[i];
            if (j) {
                pixels[i - 3] = this._gradient[j];
                pixels[i - 2] = this._gradient[j + 1];
                pixels[i - 1] = this._gradient[j + 2];
            }
            pixels[i] = opacity * pixels[i];
        }
    };

    provide(Canvas);
});