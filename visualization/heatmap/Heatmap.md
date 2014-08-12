Heatmap
===

Модуль для нанесения слоя тепловой карты.

Heatmap(data, options) 
-----------------------------
Конструктор тепловой карты.

**Parameters**

**data**: Object, Источник геообъектов.

**options**: Object, Объект с опциями отображения тепловой карты:
 pointRadius - радиус точки;
 pointBlur - радиус размытия вокруг точки на тепловой карте;
 opacity - прозрачность карты;
 gradient - объект, задающий градиент.


addData(data) 
-----------------------------
Добавляет данные (точки), которые будут нанесены
карту. Если слой уже отрисован, то любые последующие манипуляции с
данными приводят к его перерисовке.

**Parameters**

**data**: Object, Источник геообъектов.

**Returns**: Heatmap, Добавляет точки, которые будут нанесены на карту.
Если слой уже отрисован, то любые последующие манипуляции с
точками приводят к его перерисовке.

removeData(data) 
-----------------------------
Удаляет данные (точки), которые не должны быть
отображены на карте. Если слой уже отрисован, то любые последующие
манипуляции с данными приводят к его перерисовке.

**Parameters**

**data**: Object, Источник геообъектов.

**Returns**: Heatmap, Удаляет точки, которые не должны быть отображены на карте.
Если слой уже отрисован, то любые последующие манипуляции с
точками приводят к его перерисовке.

setMap(map) 
-----------------------------
Устанавливает карту, на которой должна отобразиться тепловая карта.

**Parameters**

**map**: Map, Инстанция ymaps.Map, на которую будет добавлен слой тепловой карты.

**Returns**: Heatmap, Устанавливает карту, на которой должна отобразиться тепловая карта.

destroy() 
-----------------------------
Уничтожает внутренние данные слоя тепловой карты.


_refresh() 
-----------------------------
Перегенерирует слой тепловой карты.

**Returns**: Monitor, Монитор опций.

_setupLayer() 
-----------------------------
Установка слоя, в котором будет размещена тепловая карта.

**Returns**: Layer, Слой тепловой карты.

_destroyLayer() 
-----------------------------
Уничтожает this._layer.


_setupTileUrlsGenerator() 
-----------------------------
Устанавливает генератор для тайлов тепловой карты.

**Returns**: TileUrlsGenerator, Генератор тайлов.

_destroyTileUrlsGenerator() 
-----------------------------
Уничтожает this._tileUrlsGenerator.


_setupOptionMonitor() 
-----------------------------
Устанавливает монитор на опции тепловой карты.

**Returns**: Monitor, Монитор опций.

_destroyOptionMonitor() 
-----------------------------
Уничтожает this._optionMonitor.