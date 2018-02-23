(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('leaflet')) :
	typeof define === 'function' && define.amd ? define(['leaflet'], factory) :
	(global.lrm = factory(global.L));
}(this, (function (L$1) { 'use strict';

L$1 = L$1 && L$1.hasOwnProperty('default') ? L$1['default'] : L$1;

function noop() {}

function assign(target) {
	var k,
		source,
		i = 1,
		len = arguments.length;
	for (; i < len; i++) {
		source = arguments[i];
		for (k in source) target[k] = source[k];
	}

	return target;
}

function appendNode(node, target) {
	target.appendChild(node);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function destroyEach(iterations) {
	for (var i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].d();
	}
}

function createElement(name) {
	return document.createElement(name);
}

function createText(data) {
	return document.createTextNode(data);
}

function addListener(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function removeListener(node, event, handler) {
	node.removeEventListener(event, handler, false);
}

function setAttribute(node, attribute, value) {
	node.setAttribute(attribute, value);
}

function blankObject() {
	return Object.create(null);
}

function destroy(detach) {
	this.destroy = noop;
	this.fire('destroy');
	this.set = this.get = noop;

	if (detach !== false) this._fragment.u();
	this._fragment.d();
	this._fragment = this._state = null;
}

function _differs(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function dispatchObservers(component, group, changed, newState, oldState) {
	for (var key in group) {
		if (!changed[key]) continue;

		var newValue = newState[key];
		var oldValue = oldState[key];

		var callbacks = group[key];
		if (!callbacks) continue;

		for (var i = 0; i < callbacks.length; i += 1) {
			var callback = callbacks[i];
			if (callback.__calling) continue;

			callback.__calling = true;
			callback.call(component, newValue, oldValue);
			callback.__calling = false;
		}
	}
}

function fire(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		handlers[i].call(this, data);
	}
}

function get(key) {
	return key ? this._state[key] : this._state;
}

function init(component, options) {
	component._observers = { pre: blankObject(), post: blankObject() };
	component._handlers = blankObject();
	component._bind = options._bind;

	component.options = options;
	component.root = options.root || component;
	component.store = component.root.store || options.store;
}

function observe(key, callback, options) {
	var group = options && options.defer
		? this._observers.post
		: this._observers.pre;

	(group[key] || (group[key] = [])).push(callback);

	if (!options || options.init !== false) {
		callback.__calling = true;
		callback.call(this, this._state[key]);
		callback.__calling = false;
	}

	return {
		cancel: function() {
			var index = group[key].indexOf(callback);
			if (~index) group[key].splice(index, 1);
		}
	};
}

function on(eventName, handler) {
	if (eventName === 'teardown') return this.on('destroy', handler);

	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set(newState) {
	this._set(assign({}, newState));
	if (this.root._lock) return;
	this.root._lock = true;
	callAll(this.root._beforecreate);
	callAll(this.root._oncreate);
	callAll(this.root._aftercreate);
	this.root._lock = false;
}

function _set(newState) {
	var oldState = this._state,
		changed = {},
		dirty = false;

	for (var key in newState) {
		if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
	}
	if (!dirty) return;

	this._state = assign({}, oldState, newState);
	this._recompute(changed, this._state);
	if (this._bind) this._bind(changed, this._state);

	if (this._fragment) {
		dispatchObservers(this, this._observers.pre, changed, this._state, oldState);
		this._fragment.p(changed, this._state);
		dispatchObservers(this, this._observers.post, changed, this._state, oldState);
	}
}

function callAll(fns) {
	while (fns && fns.length) fns.shift()();
}

function _mount(target, anchor) {
	this._fragment.m(target, anchor);
}

function _unmount() {
	if (this._fragment) this._fragment.u();
}

var proto = {
	destroy: destroy,
	get: get,
	fire: fire,
	observe: observe,
	on: on,
	set: set,
	teardown: destroy,
	_recompute: noop,
	_set: _set,
	_mount: _mount,
	_unmount: _unmount,
	_differs: _differs
};

function toLatLng(lngLat) {
  return L.latLng(lngLat[1], lngLat[0])
}

function toLngLat(latLng) {
  return [latLng.lng, latLng.lat]
}

/* src/components/Marker.html generated by Svelte v1.55.0 */

function oncreate() {
  this.marker =
    L$1.marker(this.get('lngLat'), {draggable: true})
    .on('drag dragend', e => this.fire('drag', {lngLat: toLngLat(this.marker.getLatLng())}))
    .addTo(this.get('map'));
  this.observe('lngLat', lngLat => this.marker.setLatLng(toLatLng(lngLat)));
}
function ondestroy() {
  this.map.removeLayer(this.marker);
}
function create_main_fragment(state, component) {
	var div;

	return {
		c: function create() {
			div = createElement("div");
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);
		},

		p: noop,

		u: function unmount() {
			detachNode(div);
		},

		d: noop
	};
}

function Marker(options) {
	init(this, options);
	this._state = assign({}, options.data);

	this._handlers.destroy = [ondestroy];

	var _oncreate = oncreate.bind(this);

	if (!options.root) {
		this._oncreate = [];
	}

	this._fragment = create_main_fragment(this._state, this);

	this.root._oncreate.push(_oncreate);

	if (options.target) {
		this._fragment.c();
		this._fragment.m(options.target, options.anchor || null);

		callAll(this._oncreate);
	}
}

assign(Marker.prototype, proto);

/* src/components/RouteLine.html generated by Svelte v1.55.0 */

function style(selected) {
	return {
  weight: selected ? 9 : 6,
  opacity: selected ? 1 : 0.5
};
}

function oncreate$1() {
  this.observe('route', route => {
    var latLngs = route.coordinates.map(c => L$1.latLng(c[1], c[0]));

    if (!this.line) {
      this.line = 
        L$1.polyline(latLngs, this.get('style'))
        .on('click', () => this.fire('selected'))
        .addTo(this.get('map'));
    } else {
      this.line.setLatLngs(latLngs);
    }
  });
  this.observe('selected', selected => {
    if (this.line) {
      this.line.setStyle(this.get('style'));
    }
  });
}
function ondestroy$1() {
  if (this.line) {
    this.get('map').removeLayer(this.line);
  }
}
function create_main_fragment$1(state, component) {
	var div;

	return {
		c: function create() {
			div = createElement("div");
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);
		},

		p: noop,

		u: function unmount() {
			detachNode(div);
		},

		d: noop
	};
}

function RouteLine(options) {
	init(this, options);
	this._state = assign({}, options.data);
	this._recompute({ selected: 1 }, this._state);

	this._handlers.destroy = [ondestroy$1];

	var _oncreate = oncreate$1.bind(this);

	if (!options.root) {
		this._oncreate = [];
	}

	this._fragment = create_main_fragment$1(this._state, this);

	this.root._oncreate.push(_oncreate);

	if (options.target) {
		this._fragment.c();
		this._fragment.m(options.target, options.anchor || null);

		callAll(this._oncreate);
	}
}

assign(RouteLine.prototype, proto);

RouteLine.prototype._recompute = function _recompute(changed, state) {
	if (changed.selected) {
		if (this._differs(state.style, (state.style = style(state.selected)))) changed.style = true;
	}
};

var nargs = /\{([0-9a-zA-Z_]+)\}/g;

var stringTemplate = template;

function template(string) {
    var args;

    if (arguments.length === 2 && typeof arguments[1] === "object") {
        args = arguments[1];
    } else {
        args = new Array(arguments.length - 1);
        for (var i = 1; i < arguments.length; ++i) {
            args[i - 1] = arguments[i];
        }
    }

    if (!args || !args.hasOwnProperty) {
        args = {};
    }

    return string.replace(nargs, function replaceArg(match, i, index) {
        var result;

        if (string[index - 1] === "{" &&
            string[index + match.length] === "}") {
            return i
        } else {
            result = args.hasOwnProperty(i) ? args[i] : null;
            if (result === null || result === undefined) {
                return ""
            }

            return result
        }
    })
}

const defaults = {
  unitNames: {
    meters: 'm',
    kilometers: 'km',
    miles: 'mi',
    yards: 'yd',
    hours: 'h',
    minutes: 'min',
    seconds: 's',
  },
  roundingSensitivity: 1,
  distanceTemplate: '{value} {unit}'
};

function formatDistance (d /* Number (meters) */, sensitivity, options) {
  options = options || defaults;
  sensitivity = sensitivity || options.roundingSensitivity;
  const un = options.unitNames;
  const simpleRounding = sensitivity <= 0;
  const roundFn = simpleRounding ? function(v) { return v; } : round;
  var data;

  if (options.units === 'imperial') {
    const yards = d / 0.9144;
    if (yards >= 1000) {
      data = {
        value: roundFn(d / 1609.344, sensitivity),
        unit: un.miles
      };
    } else {
      data = {
        value: roundFn(yards, sensitivity),
        unit: un.yards
      };
    }
  } else {
    var v = roundFn(d, sensitivity);
    data = {
      value: v >= 1000 ? (v / 1000) : v,
      unit: v >= 1000 ? un.kilometers : un.meters
    };
  }

  if (simpleRounding) {
    data.value = data.value.toFixed(-sensitivity);
  }

  return stringTemplate(options.distanceTemplate, data);
}

function round (d, sensitivity) {
  var s = sensitivity,
    pow10 = Math.pow(10, (Math.floor(d / s) + '').length - 1),
    r = Math.floor(d / pow10),
    p = (r > 5) ? pow10 : pow10 / 2;

  return Math.round(d / p) * p;
}

function formatDuration (t /* Number (seconds) */, options) {
  options = options || defaults;
  var un = options.unitNames;
  // More than 30 seconds precision looks ridiculous
  t = Math.round(t / 30) * 30;

  if (t > 86400) {
    return Math.round(t / 3600) + ' ' + un.hours;
  } else if (t > 3600) {
    return Math.floor(t / 3600) + ' ' + un.hours + ' ' +
      Math.round((t % 3600) / 60) + ' ' + un.minutes;
  } else if (t > 300) {
    return Math.round(t / 60) + ' ' + un.minutes;
  } else if (t > 60) {
    return Math.floor(t / 60) + ' ' + un.minutes +
      (t % 60 !== 0 ? ' ' + (t % 60) + ' ' + un.seconds : '');
  } else {
    return t + ' ' + un.seconds;
  }
}

/* src/components/Itinerary.html generated by Svelte v1.55.0 */



function encapsulateStyles(node) {
	setAttribute(node, "svelte-2641600560", "");
}

function create_main_fragment$2(state, component) {
	var div, div_1, h1, a, text_value = state.route.name, text, text_2, div_2, text_3_value = formatDistance(state.route.summary.totalDistance), text_3, text_4, text_5_value = formatDuration(state.route.summary.totalTime), text_5, text_8, div_3, table, tbody, div_class_value;

	function click_handler(event) {
		component.fire("selected");
	}

	var instructions = state.route.instructions;

	var each_blocks = [];

	for (var i = 0; i < instructions.length; i += 1) {
		each_blocks[i] = create_each_block(state, instructions, instructions[i], i, component);
	}

	return {
		c: function create() {
			div = createElement("div");
			div_1 = createElement("div");
			h1 = createElement("h1");
			a = createElement("a");
			text = createText(text_value);
			text_2 = createText("\n    ");
			div_2 = createElement("div");
			text_3 = createText(text_3_value);
			text_4 = createText(",\n      ");
			text_5 = createText(text_5_value);
			text_8 = createText("\n  ");
			div_3 = createElement("div");
			table = createElement("table");
			tbody = createElement("tbody");

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}
			this.h();
		},

		h: function hydrate() {
			encapsulateStyles(div);
			a.href = "#";
			addListener(a, "click", click_handler);
			div_2.className = "routing-route-summary";
			div_3.className = "routing-route-itinerary";
			div.className = div_class_value = 'routing-alternative' + (state.selected ? ' routing-selected' : '');
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);
			appendNode(div_1, div);
			appendNode(h1, div_1);
			appendNode(a, h1);
			appendNode(text, a);
			appendNode(text_2, div_1);
			appendNode(div_2, div_1);
			appendNode(text_3, div_2);
			appendNode(text_4, div_2);
			appendNode(text_5, div_2);
			appendNode(text_8, div);
			appendNode(div_3, div);
			appendNode(table, div_3);
			appendNode(tbody, table);

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(tbody, null);
			}
		},

		p: function update(changed, state) {
			if ((changed.route) && text_value !== (text_value = state.route.name)) {
				text.data = text_value;
			}

			if ((changed.route) && text_3_value !== (text_3_value = formatDistance(state.route.summary.totalDistance))) {
				text_3.data = text_3_value;
			}

			if ((changed.route) && text_5_value !== (text_5_value = formatDuration(state.route.summary.totalTime))) {
				text_5.data = text_5_value;
			}

			var instructions = state.route.instructions;

			if (changed.route) {
				for (var i = 0; i < instructions.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].p(changed, state, instructions, instructions[i], i);
					} else {
						each_blocks[i] = create_each_block(state, instructions, instructions[i], i, component);
						each_blocks[i].c();
						each_blocks[i].m(tbody, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].u();
					each_blocks[i].d();
				}
				each_blocks.length = instructions.length;
			}

			if ((changed.selected) && div_class_value !== (div_class_value = 'routing-alternative' + (state.selected ? ' routing-selected' : ''))) {
				div.className = div_class_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].u();
			}
		},

		d: function destroy$$1() {
			removeListener(a, "click", click_handler);

			destroyEach(each_blocks);
		}
	};
}

// (14:8) {{#each route.instructions as instr}}
function create_each_block(state, instructions, instr, instr_index, component) {
	var tr, td, text_value = instr.text, text;

	return {
		c: function create() {
			tr = createElement("tr");
			td = createElement("td");
			text = createText(text_value);
		},

		m: function mount(target, anchor) {
			insertNode(tr, target, anchor);
			appendNode(td, tr);
			appendNode(text, td);
		},

		p: function update(changed, state, instructions, instr, instr_index) {
			if ((changed.route) && text_value !== (text_value = instr.text)) {
				text.data = text_value;
			}
		},

		u: function unmount() {
			detachNode(tr);
		},

		d: noop
	};
}

function Itinerary(options) {
	init(this, options);
	this._state = assign({}, options.data);

	this._fragment = create_main_fragment$2(this._state, this);

	if (options.target) {
		this._fragment.c();
		this._fragment.m(options.target, options.anchor || null);
	}
}

assign(Itinerary.prototype, proto);

/* src/components/Control.html generated by Svelte v1.55.0 */

function data() {
  return {
    routes: []
  }
}
var methods = {
  routeReceived (err, routes) {
    if (err) {
      // TODO: error handling
      console.error(err);
      return
    }

    this.set({routes, selectedRoute: routes[0]});
  },
  dragWaypoint (e, i, debounce) {
    if (this.routeDebounce) {
      clearTimeout(this.routeDebounce);
    }
    var now = +new Date();
    var firstNextRun = (this.lastRouteTimestamp || now) + 250;
    var timeout = debounce ? Math.max(0, firstNextRun - now) : 0;
    this.routeDebounce = setTimeout(() => {
      const waypoints = this.get('waypoints');
      waypoints[i].lngLat = e.lngLat;
      this.set({waypoints});
    }, debounce ? timeout : 0);
  },
  selectRoute (route) {
    this.set({selectedRoute: route});
  }
};

function oncreate$2() {
  this.observe('waypoints', waypoints => {
    this.lastRouteTimestamp = +new Date();
    this.get('router').route(waypoints, this.routeReceived.bind(this));
  });
}
function encapsulateStyles$1(node) {
	setAttribute(node, "svelte-3250868710", "");
}

function create_main_fragment$3(state, component) {
	var div, text, div_1;

	var waypoints = state.waypoints;

	var each_blocks = [];

	for (var i = 0; i < waypoints.length; i += 1) {
		each_blocks[i] = create_each_block$1(state, waypoints, waypoints[i], i, component);
	}

	var routes = state.routes;

	var each_1_blocks = [];

	for (var i = 0; i < routes.length; i += 1) {
		each_1_blocks[i] = create_each_block_1(state, routes, routes[i], i, component);
	}

	return {
		c: function create() {
			div = createElement("div");

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			text = createText("\n  ");
			div_1 = createElement("div");

			for (var i = 0; i < each_1_blocks.length; i += 1) {
				each_1_blocks[i].c();
			}
			this.h();
		},

		h: function hydrate() {
			encapsulateStyles$1(div);
			div.className = "routing-control";
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			appendNode(text, div);
			appendNode(div_1, div);

			for (var i = 0; i < each_1_blocks.length; i += 1) {
				each_1_blocks[i].m(div_1, null);
			}
		},

		p: function update(changed, state) {
			var waypoints = state.waypoints;

			if (changed.map || changed.waypoints) {
				for (var i = 0; i < waypoints.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].p(changed, state, waypoints, waypoints[i], i);
					} else {
						each_blocks[i] = create_each_block$1(state, waypoints, waypoints[i], i, component);
						each_blocks[i].c();
						each_blocks[i].m(div, text);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].u();
					each_blocks[i].d();
				}
				each_blocks.length = waypoints.length;
			}

			var routes = state.routes;

			if (changed.map || changed.routes || changed.selectedRoute) {
				for (var i = 0; i < routes.length; i += 1) {
					if (each_1_blocks[i]) {
						each_1_blocks[i].p(changed, state, routes, routes[i], i);
					} else {
						each_1_blocks[i] = create_each_block_1(state, routes, routes[i], i, component);
						each_1_blocks[i].c();
						each_1_blocks[i].m(div_1, null);
					}
				}

				for (; i < each_1_blocks.length; i += 1) {
					each_1_blocks[i].u();
					each_1_blocks[i].d();
				}
				each_1_blocks.length = routes.length;
			}
		},

		u: function unmount() {
			detachNode(div);

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].u();
			}

			for (var i = 0; i < each_1_blocks.length; i += 1) {
				each_1_blocks[i].u();
			}
		},

		d: function destroy$$1() {
			destroyEach(each_blocks);

			destroyEach(each_1_blocks);
		}
	};
}

// (2:2) {{#each waypoints as waypoint, i}}
function create_each_block$1(state, waypoints, waypoint, i, component) {

	var marker = new Marker({
		root: component.root,
		data: { map: state.map, lngLat: waypoint.lngLat }
	});

	marker.on("drag", function(event) {
		var waypoints = marker_context.waypoints, i = marker_context.i, waypoint = waypoints[i];;;

		component.dragWaypoint(event, i, true);
	});
	marker.on("dragend", function(event) {
		var waypoints = marker_context.waypoints, i = marker_context.i, waypoint = waypoints[i];;;

		component.dragWaypoint(event, i);
	});

	var marker_context = {
		waypoints: waypoints,
		i: i
	};

	return {
		c: function create() {
			marker._fragment.c();
		},

		m: function mount(target, anchor) {
			marker._mount(target, anchor);
		},

		p: function update(changed, state, waypoints, waypoint, i) {
			var marker_changes = {};
			if (changed.map) marker_changes.map = state.map;
			if (changed.waypoints) marker_changes.lngLat = waypoint.lngLat;
			marker._set(marker_changes);

			marker_context.waypoints = waypoints;
			marker_context.i = i;
		},

		u: function unmount() {
			marker._unmount();
		},

		d: function destroy$$1() {
			marker.destroy(false);
		}
	};
}

// (10:4) {{#each routes as route}}
function create_each_block_1(state, routes, route, route_index, component) {
	var text;

	var routeline = new RouteLine({
		root: component.root,
		data: {
			map: state.map,
			route: route,
			selected: route === state.selectedRoute
		}
	});

	routeline.on("selected", function(event) {
		var routes = routeline_context.routes, route_index = routeline_context.route_index, route = routes[route_index];;;

		component.selectRoute(route);
	});

	var routeline_context = {
		routes: routes,
		route_index: route_index
	};

	var itinerary = new Itinerary({
		root: component.root,
		data: {
			route: route,
			selected: route === state.selectedRoute
		}
	});

	itinerary.on("selected", function(event) {
		var routes = itinerary_context.routes, route_index = itinerary_context.route_index, route = routes[route_index];;;

		component.selectRoute(route);
	});

	var itinerary_context = {
		routes: routes,
		route_index: route_index
	};

	return {
		c: function create() {
			routeline._fragment.c();
			text = createText("\n      ");
			itinerary._fragment.c();
		},

		m: function mount(target, anchor) {
			routeline._mount(target, anchor);
			insertNode(text, target, anchor);
			itinerary._mount(target, anchor);
		},

		p: function update(changed, state, routes, route, route_index) {
			var routeline_changes = {};
			if (changed.map) routeline_changes.map = state.map;
			if (changed.routes) routeline_changes.route = route;
			if (changed.routes || changed.selectedRoute) routeline_changes.selected = route === state.selectedRoute;
			routeline._set(routeline_changes);

			routeline_context.routes = routes;
			routeline_context.route_index = route_index;

			var itinerary_changes = {};
			if (changed.routes) itinerary_changes.route = route;
			if (changed.routes || changed.selectedRoute) itinerary_changes.selected = route === state.selectedRoute;
			itinerary._set(itinerary_changes);

			itinerary_context.routes = routes;
			itinerary_context.route_index = route_index;
		},

		u: function unmount() {
			routeline._unmount();
			detachNode(text);
			itinerary._unmount();
		},

		d: function destroy$$1() {
			routeline.destroy(false);
			itinerary.destroy(false);
		}
	};
}

function Control(options) {
	init(this, options);
	this._state = assign(data(), options.data);

	var _oncreate = oncreate$2.bind(this);

	if (!options.root) {
		this._oncreate = [];
		this._beforecreate = [];
		this._aftercreate = [];
	}

	this._fragment = create_main_fragment$3(this._state, this);

	this.root._oncreate.push(_oncreate);

	if (options.target) {
		this._fragment.c();
		this._fragment.m(options.target, options.anchor || null);

		this._lock = true;
		callAll(this._beforecreate);
		callAll(this._oncreate);
		callAll(this._aftercreate);
		this._lock = false;
	}
}

assign(Control.prototype, methods, proto);

class Waypoint {
  constructor(lngLat, name, options) {
    this.lngLat = lngLat;
    this.name = name;
    this.options = options;
  }
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var polyline_1 = createCommonjsModule(function (module) {

/**
 * Based off of [the offical Google document](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
 *
 * Some parts from [this implementation](http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/PolylineEncoder.js)
 * by [Mark McClure](http://facstaff.unca.edu/mcmcclur/)
 *
 * @module polyline
 */

var polyline = {};

function py2_round(value) {
    // Google's polyline algorithm uses the same rounding strategy as Python 2, which is different from JS for negative values
    return Math.floor(Math.abs(value) + 0.5) * Math.sign(value);
}

function encode(current, previous, factor) {
    current = py2_round(current * factor);
    previous = py2_round(previous * factor);
    var coordinate = current - previous;
    coordinate <<= 1;
    if (current - previous < 0) {
        coordinate = ~coordinate;
    }
    var output = '';
    while (coordinate >= 0x20) {
        output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 63);
        coordinate >>= 5;
    }
    output += String.fromCharCode(coordinate + 63);
    return output;
}

/**
 * Decodes to a [latitude, longitude] coordinates array.
 *
 * This is adapted from the implementation in Project-OSRM.
 *
 * @param {String} str
 * @param {Number} precision
 * @returns {Array}
 *
 * @see https://github.com/Project-OSRM/osrm-frontend/blob/master/WebContent/routing/OSRM.RoutingGeometry.js
 */
polyline.decode = function(str, precision) {
    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 5);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
};

/**
 * Encodes the given [latitude, longitude] coordinates array.
 *
 * @param {Array.<Array.<Number>>} coordinates
 * @param {Number} precision
 * @returns {String}
 */
polyline.encode = function(coordinates, precision) {
    if (!coordinates.length) { return ''; }

    var factor = Math.pow(10, precision || 5),
        output = encode(coordinates[0][0], 0, factor) + encode(coordinates[0][1], 0, factor);

    for (var i = 1; i < coordinates.length; i++) {
        var a = coordinates[i], b = coordinates[i - 1];
        output += encode(a[0], b[0], factor);
        output += encode(a[1], b[1], factor);
    }

    return output;
};

function flipped(coords) {
    var flipped = [];
    for (var i = 0; i < coords.length; i++) {
        flipped.push(coords[i].slice().reverse());
    }
    return flipped;
}

/**
 * Encodes a GeoJSON LineString feature/geometry.
 *
 * @param {Object} geojson
 * @param {Number} precision
 * @returns {String}
 */
polyline.fromGeoJSON = function(geojson, precision) {
    if (geojson && geojson.type === 'Feature') {
        geojson = geojson.geometry;
    }
    if (!geojson || geojson.type !== 'LineString') {
        throw new Error('Input must be a GeoJSON LineString');
    }
    return polyline.encode(flipped(geojson.coordinates), precision);
};

/**
 * Decodes to a GeoJSON LineString geometry.
 *
 * @param {String} str
 * @param {Number} precision
 * @returns {Object}
 */
polyline.toGeoJSON = function(str, precision) {
    var coords = polyline.decode(str, precision);
    return {
        type: 'LineString',
        coordinates: flipped(coords)
    };
};

if ('object' === 'object' && module.exports) {
    module.exports = polyline;
}
});

const meta = {"capitalizeFirstLetter":true};
const v5 = {"constants":{"ordinalize":{"1":"første","2":"anden","3":"tredje","4":"fjerde","5":"femte","6":"sjette","7":"syvende","8":"ottende","9":"niende","10":"tiende"},"direction":{"north":"Nord","northeast":"Nordøst","east":"Øst","southeast":"Sydøst","south":"Syd","southwest":"Sydvest","west":"Vest","northwest":"Nordvest"},"modifier":{"left":"venstresving","right":"højresving","sharp left":"skarpt venstresving","sharp right":"skarpt højresving","slight left":"svagt venstresving","slight right":"svagt højresving","straight":"ligeud","uturn":"U-vending"},"lanes":{"xo":"Hold til højre","ox":"Hold til venstre","xox":"Benyt midterste spor","oxo":"Hold til højre eller venstre"}},"modes":{"ferry":{"default":"Tag færgen","name":"Tag færgen {way_name}","destination":"Tag færgen i retning {destination}"}},"phrase":{"two linked by distance":"{instruction_one} derefter, efter {distance}, {instruction_two}","two linked":"{instruction_one}, derefter {instruction_two}","one in distance":"Efter {distance} {instruction_one}","name and ref":"{name} ({ref})","exit with number":"exit {exit}"},"arrive":{"default":{"default":"Du er ankommet til din {nth} destination","upcoming":"Du vil ankomme til din {nth} destination","short":"Du er ankommet","short-upcoming":"Du vil ankomme"},"left":{"default":"Du er ankommet til din {nth} destination, som befinder sig til venstre","upcoming":"Du vil ankomme til din {nth} destination på venstre hånd","short":"Du er ankommet","short-upcoming":"Du vil ankomme"},"right":{"default":"Du er ankommet til din {nth} destination, som befinder sig til højre","upcoming":"Du vil ankomme til din {nth} destination på højre hånd","short":"Du er ankommet","short-upcoming":"Du vil ankomme"},"sharp left":{"default":"Du er ankommet til din {nth} destination, som befinder sig til venstre","upcoming":"Du vil ankomme til din {nth} destination på venstre hånd","short":"Du er ankommet","short-upcoming":"Du vil ankomme"},"sharp right":{"default":"Du er ankommet til din {nth} destination, som befinder sig til højre","upcoming":"Du vil ankomme til din {nth} destination på højre hånd","short":"Du er ankommet","short-upcoming":"Du vil ankomme"},"slight right":{"default":"Du er ankommet til din {nth} destination, som befinder sig til højre","upcoming":"Du vil ankomme til din {nth} destination på højre hånd","short":"Du er ankommet","short-upcoming":"Du vil ankomme"},"slight left":{"default":"Du er ankommet til din {nth} destination, som befinder sig til venstre","upcoming":"Du vil ankomme til din {nth} destination på venstre hånd","short":"Du er ankommet","short-upcoming":"Du vil ankomme"},"straight":{"default":"Du er ankommet til din {nth} destination, der befinder sig lige frem","upcoming":"Du vil ankomme til din {nth} destination foran dig","short":"Du er ankommet","short-upcoming":"Du vil ankomme"}},"continue":{"default":{"default":"Drej til {modifier}","name":"Drej til {modifier} videre ad {way_name}","destination":"Drej til {modifier} mod {destination}","exit":"Drej til {modifier} ad {way_name}"},"straight":{"default":"Fortsæt ligeud","name":"Fortsæt ligeud ad {way_name}","destination":"Fortsæt mod {destination}","distance":"Fortsæt {distance} ligeud","namedistance":"Fortsæt {distance} ad {way_name}"},"sharp left":{"default":"Drej skarpt til venstre","name":"Drej skarpt til venstre videre ad {way_name}","destination":"Drej skarpt til venstre mod {destination}"},"sharp right":{"default":"Drej skarpt til højre","name":"Drej skarpt til højre videre ad {way_name}","destination":"Drej skarpt til højre mod {destination}"},"slight left":{"default":"Drej left til venstre","name":"Drej let til venstre videre ad {way_name}","destination":"Drej let til venstre mod {destination}"},"slight right":{"default":"Drej let til højre","name":"Drej let til højre videre ad {way_name}","destination":"Drej let til højre mod {destination}"},"uturn":{"default":"Foretag en U-vending","name":"Foretag en U-vending tilbage ad {way_name}","destination":"Foretag en U-vending mod {destination}"}},"depart":{"default":{"default":"Kør mod {direction}","name":"Kør mod {direction} ad {way_name}","namedistance":"Fortsæt {distance} ad {way_name}mod {direction}"}},"end of road":{"default":{"default":"Drej til {modifier}","name":"Drej til {modifier} ad {way_name}","destination":"Drej til {modifier} mof {destination}"},"straight":{"default":"Fortsæt ligeud","name":"Fortsæt ligeud ad {way_name}","destination":"Fortsæt ligeud mod {destination}"},"uturn":{"default":"Foretag en U-vending for enden af vejen","name":"Foretag en U-vending ad {way_name} for enden af vejen","destination":"Foretag en U-vending mod {destination} for enden af vejen"}},"fork":{"default":{"default":"Hold til {modifier} ved udfletningen","name":"Hold mod {modifier} på {way_name}","destination":"Hold mod {modifier} mod {destination}"},"slight left":{"default":"Hold til venstre ved udfletningen","name":"Hold til venstre på {way_name}","destination":"Hold til venstre mod {destination}"},"slight right":{"default":"Hold til højre ved udfletningen","name":"Hold til højre på {way_name}","destination":"Hold til højre mod {destination}"},"sharp left":{"default":"Drej skarpt til venstre ved udfletningen","name":"Drej skarpt til venstre ad {way_name}","destination":"Drej skarpt til venstre mod {destination}"},"sharp right":{"default":"Drej skarpt til højre ved udfletningen","name":"Drej skarpt til højre ad {way_name}","destination":"Drej skarpt til højre mod {destination}"},"uturn":{"default":"Foretag en U-vending","name":"Foretag en U-vending ad {way_name}","destination":"Foretag en U-vending mod {destination}"}},"merge":{"default":{"default":"Flet til {modifier}","name":"Flet til {modifier} ad {way_name}","destination":"Flet til {modifier} mod {destination}"},"straight":{"default":"Flet","name":"Flet ind på {way_name}","destination":"Flet ind mod {destination}"},"slight left":{"default":"Flet til venstre","name":"Flet til venstre ad {way_name}","destination":"Flet til venstre mod {destination}"},"slight right":{"default":"Flet til højre","name":"Flet til højre ad {way_name}","destination":"Flet til højre mod {destination}"},"sharp left":{"default":"Flet til venstre","name":"Flet til venstre ad {way_name}","destination":"Flet til venstre mod {destination}"},"sharp right":{"default":"Flet til højre","name":"Flet til højre ad {way_name}","destination":"Flet til højre mod {destination}"},"uturn":{"default":"Foretag en U-vending","name":"Foretag en U-vending ad {way_name}","destination":"Foretag en U-vending mod {destination}"}},"new name":{"default":{"default":"Fortsæt {modifier}","name":"Fortsæt {modifier} ad {way_name}","destination":"Fortsæt {modifier} mod {destination}"},"straight":{"default":"Fortsæt ligeud","name":"Fortsæt ad {way_name}","destination":"Fortsæt mod {destination}"},"sharp left":{"default":"Drej skarpt til venstre","name":"Drej skarpt til venstre ad {way_name}","destination":"Drej skarpt til venstre mod {destination}"},"sharp right":{"default":"Drej skarpt til højre","name":"Drej skarpt til højre ad {way_name}","destination":"Drej skarpt til højre mod {destination}"},"slight left":{"default":"Fortsæt til venstre","name":"Fortsæt til venstre ad {way_name}","destination":"Fortsæt til venstre mod {destination}"},"slight right":{"default":"Fortsæt til højre","name":"Fortsæt til højre ad {way_name}","destination":"Fortsæt til højre mod {destination}"},"uturn":{"default":"Foretag en U-vending","name":"Foretag en U-vending ad {way_name}","destination":"Foretag en U-vending mod {destination}"}},"notification":{"default":{"default":"Fortsæt {modifier}","name":"Fortsæt {modifier} ad {way_name}","destination":"Fortsæt {modifier} mod {destination}"},"uturn":{"default":"Foretag en U-vending","name":"Foretag en U-vending ad {way_name}","destination":"Foretag en U-vending mod {destination}"}},"off ramp":{"default":{"default":"Tag afkørslen","name":"Tag afkørslen ad {way_name}","destination":"Tag afkørslen mod {destination}","exit":"Vælg afkørsel {exit}","exit_destination":"Vælg afkørsel {exit} mod {destination}"},"left":{"default":"Tag afkørslen til venstre","name":"Tag afkørslen til venstre ad {way_name}","destination":"Tag afkørslen til venstre mod {destination}","exit":"Vælg afkørsel {exit} til venstre","exit_destination":"Vælg afkørsel {exit} til venstre mod {destination}\n"},"right":{"default":"Tag afkørslen til højre","name":"Tag afkørslen til højre ad {way_name}","destination":"Tag afkørslen til højre mod {destination}","exit":"Vælg afkørsel {exit} til højre","exit_destination":"Vælg afkørsel {exit} til højre mod {destination}"},"sharp left":{"default":"Tag afkørslen til venstre","name":"Tag afkørslen til venstre ad {way_name}","destination":"Tag afkørslen til venstre mod {destination}","exit":"Vælg afkørsel {exit} til venstre","exit_destination":"Vælg afkørsel {exit} til venstre mod {destination}\n"},"sharp right":{"default":"Tag afkørslen til højre","name":"Tag afkørslen til højre ad {way_name}","destination":"Tag afkørslen til højre mod {destination}","exit":"Vælg afkørsel {exit} til højre","exit_destination":"Vælg afkørsel {exit} til højre mod {destination}"},"slight left":{"default":"Tag afkørslen til venstre","name":"Tag afkørslen til venstre ad {way_name}","destination":"Tag afkørslen til venstre mod {destination}","exit":"Vælg afkørsel {exit} til venstre","exit_destination":"Vælg afkørsel {exit} til venstre mod {destination}\n"},"slight right":{"default":"Tag afkørslen til højre","name":"Tag afkørslen til højre ad {way_name}","destination":"Tag afkørslen til højre mod {destination}","exit":"Vælg afkørsel {exit} til højre","exit_destination":"Vælg afkørsel {exit} til højre mod {destination}"}},"on ramp":{"default":{"default":"Tag afkørslen","name":"Tag afkørslen ad {way_name}","destination":"Tag afkørslen mod {destination}"},"left":{"default":"Tag afkørslen til venstre","name":"Tag afkørslen til venstre ad {way_name}","destination":"Tag afkørslen til venstre mod {destination}"},"right":{"default":"Tag afkørslen til højre","name":"Tag afkørslen til højre ad {way_name}","destination":"Tag afkørslen til højre mod {destination}"},"sharp left":{"default":"Tag afkørslen til venstre","name":"Tag afkørslen til venstre ad {way_name}","destination":"Tag afkørslen til venstre mod {destination}"},"sharp right":{"default":"Tag afkørslen til højre","name":"Tag afkørslen til højre ad {way_name}","destination":"Tag afkørslen til højre mod {destination}"},"slight left":{"default":"Tag afkørslen til venstre","name":"Tag afkørslen til venstre ad {way_name}","destination":"Tag afkørslen til venstre mod {destination}"},"slight right":{"default":"Tag afkørslen til højre","name":"Tag afkørslen til højre ad {way_name}","destination":"Tag afkørslen til højre mod {destination}"}},"rotary":{"default":{"default":{"default":"Kør ind i rundkørslen","name":"Tag rundkørslen og kør fra ad {way_name}","destination":"Tag rundkørslen og kør mod {destination}"},"name":{"default":"Kør ind i {rotary_name}","name":"Kør ind i {rotary_name} og kør ad {way_name} ","destination":"Kør ind i {rotary_name} og kør mod {destination}"},"exit":{"default":"Tag rundkørslen og forlad ved {exit_number} afkørsel","name":"Tag rundkørslen og forlad ved {exit_number} afkørsel ad {way_name}","destination":"Tag rundkørslen og forlad ved {exit_number} afkørsel mod {destination}"},"name_exit":{"default":"Kør ind i {rotary_name} og forlad ved {exit_number} afkørsel","name":"Kør ind i {rotary_name} og forlad ved {exit_number} afkørsel ad {way_name}","destination":"Kør ind i {rotary_name} og forlad ved {exit_number} afkørsel mod {destination}"}}},"roundabout":{"default":{"exit":{"default":"Tag rundkørslen og forlad ved {exit_number} afkørsel","name":"Tag rundkørslen og forlad ved {exit_number} afkørsel ad {way_name}","destination":"Tag rundkørslen og forlad ved {exit_number} afkørsel mod {destination}"},"default":{"default":"Kør ind i rundkørslen","name":"Tag rundkørslen og kør fra ad {way_name}","destination":"Tag rundkørslen og kør mod {destination}"}}},"roundabout turn":{"default":{"default":"Foretag et {modifier}","name":"Foretag et {modifier} ad {way_name}","destination":"Foretag et {modifier} mod {destination}"},"left":{"default":"Drej til venstre","name":"Drej til venstre ad {way_name}","destination":"Drej til venstre mod {destination}"},"right":{"default":"Drej til højre","name":"Drej til højre ad {way_name}","destination":"Drej til højre mod {destination}"},"straight":{"default":"Fortsæt ligeud","name":"Fortsæt ligeud ad {way_name}","destination":"Fortsæt ligeud mod {destination}"}},"exit roundabout":{"default":{"default":"Forlad rundkørslen","name":"Forlad rundkørslen ad {way_name}","destination":"Forlad rundkørslen mod  {destination}"}},"exit rotary":{"default":{"default":"Forlad rundkørslen","name":"Forlad rundkørslen ad {way_name}","destination":"Forlad rundkørslen mod {destination}"}},"turn":{"default":{"default":"Foretag et {modifier}","name":"Foretag et {modifier} ad {way_name}","destination":"Foretag et {modifier} mod {destination}"},"left":{"default":"Drej til venstre","name":"Drej til venstre ad {way_name}","destination":"Drej til venstre mod {destination}"},"right":{"default":"Drej til højre","name":"Drej til højre ad {way_name}","destination":"Drej til højre mod {destination}"},"straight":{"default":"Fortsæt ligeud","name":"Kør ligeud ad {way_name}","destination":"Kør ligeud mod {destination}"}},"use lane":{"no_lanes":{"default":"Fortsæt ligeud"},"default":{"default":"{lane_instruction}"}}};
var da = {
	meta: meta,
	v5: v5
};

var da$1 = Object.freeze({
	meta: meta,
	v5: v5,
	default: da
});

const meta$1 = {"capitalizeFirstLetter":true};
const v5$1 = {"constants":{"ordinalize":{"1":"erste","2":"zweite","3":"dritte","4":"vierte","5":"fünfte","6":"sechste","7":"siebente","8":"achte","9":"neunte","10":"zehnte"},"direction":{"north":"Norden","northeast":"Nordosten","east":"Osten","southeast":"Südosten","south":"Süden","southwest":"Südwesten","west":"Westen","northwest":"Nordwesten"},"modifier":{"left":"links","right":"rechts","sharp left":"scharf links","sharp right":"scharf rechts","slight left":"leicht links","slight right":"leicht rechts","straight":"geradeaus","uturn":"180°-Wendung"},"lanes":{"xo":"Rechts halten","ox":"Links halten","xox":"Mittlere Spur nutzen","oxo":"Rechts oder links halten"}},"modes":{"ferry":{"default":"Fähre nehmen","name":"Fähre nehmen {way_name}","destination":"Fähre nehmen Richtung {destination}"}},"phrase":{"two linked by distance":"{instruction_one} danach in {distance} {instruction_two}","two linked":"{instruction_one} danach {instruction_two}","one in distance":"In {distance}, {instruction_one}","name and ref":"{name} ({ref})","exit with number":"exit {exit}"},"arrive":{"default":{"default":"Sie haben Ihr {nth} Ziel erreicht","upcoming":"Sie haben Ihr {nth} Ziel erreicht","short":"Sie haben Ihr {nth} Ziel erreicht","short-upcoming":"Sie haben Ihr {nth} Ziel erreicht"},"left":{"default":"Sie haben Ihr {nth} Ziel erreicht, es befindet sich links","upcoming":"Sie haben Ihr {nth} Ziel erreicht, es befindet sich links","short":"Sie haben Ihr {nth} Ziel erreicht","short-upcoming":"Sie haben Ihr {nth} Ziel erreicht"},"right":{"default":"Sie haben Ihr {nth} Ziel erreicht, es befindet sich rechts","upcoming":"Sie haben Ihr {nth} Ziel erreicht, es befindet sich rechts","short":"Sie haben Ihr {nth} Ziel erreicht","short-upcoming":"Sie haben Ihr {nth} Ziel erreicht"},"sharp left":{"default":"Sie haben Ihr {nth} Ziel erreicht, es befindet sich links","upcoming":"Sie haben Ihr {nth} Ziel erreicht, es befindet sich links","short":"Sie haben Ihr {nth} Ziel erreicht","short-upcoming":"Sie haben Ihr {nth} Ziel erreicht"},"sharp right":{"default":"Sie haben Ihr {nth} Ziel erreicht, es befindet sich rechts","upcoming":"Sie haben Ihr {nth} Ziel erreicht, es befindet sich rechts","short":"Sie haben Ihr {nth} Ziel erreicht","short-upcoming":"Sie haben Ihr {nth} Ziel erreicht"},"slight right":{"default":"Sie haben Ihr {nth} Ziel erreicht, es befindet sich rechts","upcoming":"Sie haben Ihr {nth} Ziel erreicht, es befindet sich rechts","short":"Sie haben Ihr {nth} Ziel erreicht","short-upcoming":"Sie haben Ihr {nth} Ziel erreicht"},"slight left":{"default":"Sie haben Ihr {nth} Ziel erreicht, es befindet sich links","upcoming":"Sie haben Ihr {nth} Ziel erreicht, es befindet sich links","short":"Sie haben Ihr {nth} Ziel erreicht","short-upcoming":"Sie haben Ihr {nth} Ziel erreicht"},"straight":{"default":"Sie haben Ihr {nth} Ziel erreicht, es befindet sich geradeaus","upcoming":"Sie haben Ihr {nth} Ziel erreicht, es befindet sich geradeaus","short":"Sie haben Ihr {nth} Ziel erreicht","short-upcoming":"Sie haben Ihr {nth} Ziel erreicht"}},"continue":{"default":{"default":"{modifier} abbiegen","name":"{modifier} weiterfahren auf {way_name}","destination":"{modifier} abbiegen Richtung {destination}","exit":"{modifier} abbiegen auf {way_name}"},"straight":{"default":"Geradeaus weiterfahren","name":"Geradeaus weiterfahren auf {way_name}","destination":"Weiterfahren in Richtung {destination}","distance":"Geradeaus weiterfahren für {distance}","namedistance":"Geradeaus weiterfahren auf {way_name} für {distance}"},"sharp left":{"default":"Scharf links","name":"Scharf links weiterfahren auf {way_name}","destination":"Scharf links Richtung {destination}"},"sharp right":{"default":"Scharf rechts","name":"Scharf rechts weiterfahren auf {way_name}","destination":"Scharf rechts Richtung {destination}"},"slight left":{"default":"Leicht links","name":"Leicht links weiter auf {way_name}","destination":"Leicht links weiter Richtung {destination}"},"slight right":{"default":"Leicht rechts weiter","name":"Leicht rechts weiter auf {way_name}","destination":"Leicht rechts weiter Richtung {destination}"},"uturn":{"default":"180°-Wendung","name":"180°-Wendung auf {way_name}","destination":"180°-Wendung Richtung {destination}"}},"depart":{"default":{"default":"Fahren Sie Richtung {direction}","name":"Fahren Sie Richtung {direction} auf {way_name}","namedistance":"Head {direction} on {way_name} for {distance}"}},"end of road":{"default":{"default":"{modifier} abbiegen","name":"{modifier} abbiegen auf {way_name}","destination":"{modifier} abbiegen Richtung {destination}"},"straight":{"default":"Geradeaus weiterfahren","name":"Geradeaus weiterfahren auf {way_name}","destination":"Geradeaus weiterfahren Richtung {destination}"},"uturn":{"default":"180°-Wendung am Ende der Straße","name":"180°-Wendung auf {way_name} am Ende der Straße","destination":"180°-Wendung Richtung {destination} am Ende der Straße"}},"fork":{"default":{"default":"{modifier} halten an der Gabelung","name":"{modifier} halten an der Gabelung auf {way_name}","destination":"{modifier}  halten an der Gabelung Richtung {destination}"},"slight left":{"default":"Links halten an der Gabelung","name":"Links halten an der Gabelung auf {way_name}","destination":"Links halten an der Gabelung Richtung {destination}"},"slight right":{"default":"Rechts halten an der Gabelung","name":"Rechts halten an der Gabelung auf {way_name}","destination":"Rechts halten an der Gabelung Richtung {destination}"},"sharp left":{"default":"Scharf links abbiegen an der Gabelung","name":"Scharf links abbiegen an der Gabelung auf {way_name}","destination":"Scharf links abbiegen an der Gabelung Richtung {destination}"},"sharp right":{"default":"Scharf rechts abbiegen an der Gabelung","name":"Scharf rechts abbiegen an der Gabelung auf {way_name}","destination":"Scharf rechts abbiegen an der Gabelung Richtung {destination}"},"uturn":{"default":"180°-Wendung","name":"180°-Wendung auf {way_name}","destination":"180°-Wendung Richtung {destination}"}},"merge":{"default":{"default":"{modifier} auffahren","name":"{modifier} auffahren auf {way_name}","destination":"{modifier} auffahren Richtung {destination}"},"straight":{"default":"geradeaus auffahren","name":"geradeaus auffahren auf {way_name}","destination":"geradeaus auffahren Richtung {destination}"},"slight left":{"default":"Leicht links auffahren","name":"Leicht links auffahren auf {way_name}","destination":"Leicht links auffahren Richtung {destination}"},"slight right":{"default":"Leicht rechts auffahren","name":"Leicht rechts auffahren auf {way_name}","destination":"Leicht rechts auffahren Richtung {destination}"},"sharp left":{"default":"Scharf links auffahren","name":"Scharf links auffahren auf {way_name}","destination":"Scharf links auffahren Richtung {destination}"},"sharp right":{"default":"Scharf rechts auffahren","name":"Scharf rechts auffahren auf {way_name}","destination":"Scharf rechts auffahren Richtung {destination}"},"uturn":{"default":"180°-Wendung","name":"180°-Wendung auf {way_name}","destination":"180°-Wendung Richtung {destination}"}},"new name":{"default":{"default":"{modifier} weiterfahren","name":"{modifier} weiterfahren auf {way_name}","destination":"{modifier} weiterfahren Richtung {destination}"},"straight":{"default":"Geradeaus weiterfahren","name":"Weiterfahren auf {way_name}","destination":"Weiterfahren in Richtung {destination}"},"sharp left":{"default":"Scharf links","name":"Scharf links auf {way_name}","destination":"Scharf links Richtung {destination}"},"sharp right":{"default":"Scharf rechts","name":"Scharf rechts auf {way_name}","destination":"Scharf rechts Richtung {destination}"},"slight left":{"default":"Leicht links weiter","name":"Leicht links weiter auf {way_name}","destination":"Leicht links weiter Richtung {destination}"},"slight right":{"default":"Leicht rechts weiter","name":"Leicht rechts weiter auf {way_name}","destination":"Leicht rechts weiter Richtung {destination}"},"uturn":{"default":"180°-Wendung","name":"180°-Wendung auf {way_name}","destination":"180°-Wendung Richtung {destination}"}},"notification":{"default":{"default":"{modifier} weiterfahren","name":"{modifier} weiterfahren auf {way_name}","destination":"{modifier} weiterfahren Richtung {destination}"},"uturn":{"default":"180°-Wendung","name":"180°-Wendung auf {way_name}","destination":"180°-Wendung Richtung {destination}"}},"off ramp":{"default":{"default":"Ausfahrt nehmen","name":"Ausfahrt nehmen auf {way_name}","destination":"Ausfahrt nehmen Richtung {destination}","exit":"Ausfahrt {exit} nehmen","exit_destination":"Ausfahrt {exit} nehmen Richtung {destination}"},"left":{"default":"Ausfahrt links nehmen","name":"Ausfahrt links nehmen auf {way_name}","destination":"Ausfahrt links nehmen Richtung {destination}","exit":"Ausfahrt {exit} links nehmen","exit_destination":"Ausfahrt {exit} links nehmen Richtung {destination}"},"right":{"default":"Ausfahrt rechts nehmen","name":"Ausfahrt rechts nehmen Richtung {way_name}","destination":"Ausfahrt rechts nehmen Richtung {destination}","exit":"Ausfahrt {exit} rechts nehmen","exit_destination":"Ausfahrt {exit} nehmen Richtung {destination}"},"sharp left":{"default":"Ausfahrt links nehmen","name":"Ausfahrt links Seite nehmen auf {way_name}","destination":"Ausfahrt links nehmen Richtung {destination}","exit":"Ausfahrt {exit} links nehmen","exit_destination":"Ausfahrt{exit} links nehmen Richtung {destination}"},"sharp right":{"default":"Ausfahrt rechts nehmen","name":"Ausfahrt rechts nehmen auf {way_name}","destination":"Ausfahrt rechts nehmen Richtung {destination}","exit":"Ausfahrt {exit} rechts nehmen","exit_destination":"Ausfahrt {exit} nehmen Richtung {destination}"},"slight left":{"default":"Ausfahrt links nehmen","name":"Ausfahrt links nehmen auf {way_name}","destination":"Ausfahrt links nehmen Richtung {destination}","exit":"Ausfahrt {exit} nehmen","exit_destination":"Ausfahrt {exit} links nehmen Richtung {destination}"},"slight right":{"default":"Ausfahrt rechts nehmen","name":"Ausfahrt rechts nehmen auf {way_name}","destination":"Ausfahrt rechts nehmen Richtung {destination}","exit":"Ausfahrt {exit} rechts nehmen","exit_destination":"Ausfahrt {exit} nehmen Richtung {destination}"}},"on ramp":{"default":{"default":"Auffahrt nehmen","name":"Auffahrt nehmen auf {way_name}","destination":"Auffahrt nehmen Richtung {destination}"},"left":{"default":"Auffahrt links nehmen","name":"Auffahrt links nehmen auf {way_name}","destination":"Auffahrt links nehmen Richtung {destination}"},"right":{"default":"Auffahrt rechts nehmen","name":"Auffahrt rechts nehmen auf {way_name}","destination":"Auffahrt rechts nehmen Richtung {destination}"},"sharp left":{"default":"Auffahrt links nehmen","name":"Auffahrt links nehmen auf {way_name}","destination":"Auffahrt links nehmen Richtung {destination}"},"sharp right":{"default":"Auffahrt rechts nehmen","name":"Auffahrt rechts nehmen auf {way_name}","destination":"Auffahrt rechts nehmen Richtung {destination}"},"slight left":{"default":"Auffahrt links Seite nehmen","name":"Auffahrt links nehmen auf {way_name}","destination":"Auffahrt links nehmen Richtung {destination}"},"slight right":{"default":"Auffahrt rechts nehmen","name":"Auffahrt rechts nehmen auf {way_name}","destination":"Auffahrt rechts nehmen Richtung {destination}"}},"rotary":{"default":{"default":{"default":"In den Kreisverkehr fahren","name":"Im Kreisverkehr die Ausfahrt auf {way_name} nehmen","destination":"Im Kreisverkehr die Ausfahrt Richtung {destination} nehmen"},"name":{"default":"In {rotary_name} fahren","name":"In {rotary_name} die Ausfahrt auf {way_name} nehmen","destination":"In {rotary_name} die Ausfahrt Richtung {destination} nehmen"},"exit":{"default":"Im Kreisverkehr die {exit_number} Ausfahrt nehmen","name":"Im Kreisverkehr die {exit_number} Ausfahrt nehmen auf {way_name}","destination":"Im Kreisverkehr die {exit_number} Ausfahrt nehmen Richtung {destination}"},"name_exit":{"default":"In den Kreisverkehr fahren und {exit_number} Ausfahrt nehmen","name":"In den Kreisverkehr fahren und {exit_number} Ausfahrt nehmen auf {way_name}","destination":"In den Kreisverkehr fahren und {exit_number} Ausfahrt nehmen Richtung {destination}"}}},"roundabout":{"default":{"exit":{"default":"Im Kreisverkehr die {exit_number} Ausfahrt nehmen","name":"Im Kreisverkehr die {exit_number} Ausfahrt nehmen auf {way_name}","destination":"Im Kreisverkehr die {exit_number} Ausfahrt nehmen Richtung {destination}"},"default":{"default":"In den Kreisverkehr fahren","name":"Im Kreisverkehr die Ausfahrt auf {way_name} nehmen","destination":"Im Kreisverkehr die Ausfahrt Richtung {destination} nehmen"}}},"roundabout turn":{"default":{"default":"Am Kreisverkehr {modifier}","name":"Am Kreisverkehr {modifier} auf {way_name}","destination":"Am Kreisverkehr {modifier} Richtung {destination}"},"left":{"default":"Am Kreisverkehr links abbiegen","name":"Am Kreisverkehr links auf {way_name}","destination":"Am Kreisverkehr links Richtung {destination}"},"right":{"default":"Am Kreisverkehr rechts abbiegen","name":"Am Kreisverkehr rechts auf {way_name}","destination":"Am Kreisverkehr rechts Richtung {destination}"},"straight":{"default":"Am Kreisverkehr geradeaus weiterfahren","name":"Am Kreisverkehr geradeaus weiterfahren auf {way_name}","destination":"Am Kreisverkehr geradeaus weiterfahren Richtung {destination}"}},"exit roundabout":{"default":{"default":"{modifier} abbiegen","name":"{modifier} abbiegen auf {way_name}","destination":"{modifier} abbiegen Richtung {destination}"},"left":{"default":"Links abbiegen","name":"Links abbiegen auf {way_name}","destination":"Links abbiegen Richtung {destination}"},"right":{"default":"Rechts abbiegen","name":"Rechts abbiegen auf {way_name}","destination":"Rechts abbiegen Richtung {destination}"},"straight":{"default":"Geradeaus weiterfahren","name":"Geradeaus weiterfahren auf {way_name}","destination":"Geradeaus weiterfahren Richtung {destination}"}},"exit rotary":{"default":{"default":"{modifier} abbiegen","name":"{modifier} abbiegen auf {way_name}","destination":"{modifier} abbiegen Richtung {destination}"},"left":{"default":"Links abbiegen","name":"Links abbiegen auf {way_name}","destination":"Links abbiegen Richtung {destination}"},"right":{"default":"Rechts abbiegen","name":"Rechts abbiegen auf {way_name}","destination":"Rechts abbiegen Richtung {destination}"},"straight":{"default":"Geradeaus weiterfahren","name":"Geradeaus weiterfahren auf {way_name}","destination":"Geradeaus weiterfahren Richtung {destination}"}},"turn":{"default":{"default":"{modifier} abbiegen","name":"{modifier} abbiegen auf {way_name}","destination":"{modifier} abbiegen Richtung {destination}"},"left":{"default":"Links abbiegen","name":"Links abbiegen auf {way_name}","destination":"Links abbiegen Richtung {destination}"},"right":{"default":"Rechts abbiegen","name":"Rechts abbiegen auf {way_name}","destination":"Rechts abbiegen Richtung {destination}"},"straight":{"default":"Geradeaus weiterfahren","name":"Geradeaus weiterfahren auf {way_name}","destination":"Geradeaus weiterfahren Richtung {destination}"}},"use lane":{"no_lanes":{"default":"Geradeaus weiterfahren"},"default":{"default":"{lane_instruction}"}}};
var de = {
	meta: meta$1,
	v5: v5$1
};

var de$1 = Object.freeze({
	meta: meta$1,
	v5: v5$1,
	default: de
});

const meta$2 = {"capitalizeFirstLetter":true};
const v5$2 = {"constants":{"ordinalize":{"1":"1st","2":"2nd","3":"3rd","4":"4th","5":"5th","6":"6th","7":"7th","8":"8th","9":"9th","10":"10th"},"direction":{"north":"north","northeast":"northeast","east":"east","southeast":"southeast","south":"south","southwest":"southwest","west":"west","northwest":"northwest"},"modifier":{"left":"left","right":"right","sharp left":"sharp left","sharp right":"sharp right","slight left":"slight left","slight right":"slight right","straight":"straight","uturn":"U-turn"},"lanes":{"xo":"Keep right","ox":"Keep left","xox":"Keep in the middle","oxo":"Keep left or right"}},"modes":{"ferry":{"default":"Take the ferry","name":"Take the ferry {way_name}","destination":"Take the ferry towards {destination}"}},"phrase":{"two linked by distance":"{instruction_one}, then, in {distance}, {instruction_two}","two linked":"{instruction_one}, then {instruction_two}","one in distance":"In {distance}, {instruction_one}","name and ref":"{name} ({ref})","exit with number":"exit {exit}"},"arrive":{"default":{"default":"You have arrived at your {nth} destination","upcoming":"You will arrive at your {nth} destination","short":"You have arrived","short-upcoming":"You will arrive"},"left":{"default":"You have arrived at your {nth} destination, on the left","upcoming":"You will arrive at your {nth} destination, on the left","short":"You have arrived","short-upcoming":"You will arrive"},"right":{"default":"You have arrived at your {nth} destination, on the right","upcoming":"You will arrive at your {nth} destination, on the right","short":"You have arrived","short-upcoming":"You will arrive"},"sharp left":{"default":"You have arrived at your {nth} destination, on the left","upcoming":"You will arrive at your {nth} destination, on the left","short":"You have arrived","short-upcoming":"You will arrive"},"sharp right":{"default":"You have arrived at your {nth} destination, on the right","upcoming":"You will arrive at your {nth} destination, on the right","short":"You have arrived","short-upcoming":"You will arrive"},"slight right":{"default":"You have arrived at your {nth} destination, on the right","upcoming":"You will arrive at your {nth} destination, on the right","short":"You have arrived","short-upcoming":"You will arrive"},"slight left":{"default":"You have arrived at your {nth} destination, on the left","upcoming":"You will arrive at your {nth} destination, on the left","short":"You have arrived","short-upcoming":"You will arrive"},"straight":{"default":"You have arrived at your {nth} destination, straight ahead","upcoming":"You will arrive at your {nth} destination, straight ahead","short":"You have arrived","short-upcoming":"You will arrive"}},"continue":{"default":{"default":"Turn {modifier}","name":"Turn {modifier} to stay on {way_name}","destination":"Turn {modifier} towards {destination}","exit":"Turn {modifier} onto {way_name}"},"straight":{"default":"Continue straight","name":"Continue straight to stay on {way_name}","destination":"Continue towards {destination}","distance":"Continue straight for {distance}","namedistance":"Continue on {way_name} for {distance}"},"sharp left":{"default":"Make a sharp left","name":"Make a sharp left to stay on {way_name}","destination":"Make a sharp left towards {destination}"},"sharp right":{"default":"Make a sharp right","name":"Make a sharp right to stay on {way_name}","destination":"Make a sharp right towards {destination}"},"slight left":{"default":"Make a slight left","name":"Make a slight left to stay on {way_name}","destination":"Make a slight left towards {destination}"},"slight right":{"default":"Make a slight right","name":"Make a slight right to stay on {way_name}","destination":"Make a slight right towards {destination}"},"uturn":{"default":"Make a U-turn","name":"Make a U-turn and continue on {way_name}","destination":"Make a U-turn towards {destination}"}},"depart":{"default":{"default":"Head {direction}","name":"Head {direction} on {way_name}","namedistance":"Head {direction} on {way_name} for {distance}"}},"end of road":{"default":{"default":"Turn {modifier}","name":"Turn {modifier} onto {way_name}","destination":"Turn {modifier} towards {destination}"},"straight":{"default":"Continue straight","name":"Continue straight onto {way_name}","destination":"Continue straight towards {destination}"},"uturn":{"default":"Make a U-turn at the end of the road","name":"Make a U-turn onto {way_name} at the end of the road","destination":"Make a U-turn towards {destination} at the end of the road"}},"fork":{"default":{"default":"Keep {modifier} at the fork","name":"Keep {modifier} onto {way_name}","destination":"Keep {modifier} towards {destination}"},"slight left":{"default":"Keep left at the fork","name":"Keep left onto {way_name}","destination":"Keep left towards {destination}"},"slight right":{"default":"Keep right at the fork","name":"Keep right onto {way_name}","destination":"Keep right towards {destination}"},"sharp left":{"default":"Take a sharp left at the fork","name":"Take a sharp left onto {way_name}","destination":"Take a sharp left towards {destination}"},"sharp right":{"default":"Take a sharp right at the fork","name":"Take a sharp right onto {way_name}","destination":"Take a sharp right towards {destination}"},"uturn":{"default":"Make a U-turn","name":"Make a U-turn onto {way_name}","destination":"Make a U-turn towards {destination}"}},"merge":{"default":{"default":"Merge {modifier}","name":"Merge {modifier} onto {way_name}","destination":"Merge {modifier} towards {destination}"},"straight":{"default":"Merge","name":"Merge onto {way_name}","destination":"Merge towards {destination}"},"slight left":{"default":"Merge left","name":"Merge left onto {way_name}","destination":"Merge left towards {destination}"},"slight right":{"default":"Merge right","name":"Merge right onto {way_name}","destination":"Merge right towards {destination}"},"sharp left":{"default":"Merge left","name":"Merge left onto {way_name}","destination":"Merge left towards {destination}"},"sharp right":{"default":"Merge right","name":"Merge right onto {way_name}","destination":"Merge right towards {destination}"},"uturn":{"default":"Make a U-turn","name":"Make a U-turn onto {way_name}","destination":"Make a U-turn towards {destination}"}},"new name":{"default":{"default":"Continue {modifier}","name":"Continue {modifier} onto {way_name}","destination":"Continue {modifier} towards {destination}"},"straight":{"default":"Continue straight","name":"Continue onto {way_name}","destination":"Continue towards {destination}"},"sharp left":{"default":"Take a sharp left","name":"Take a sharp left onto {way_name}","destination":"Take a sharp left towards {destination}"},"sharp right":{"default":"Take a sharp right","name":"Take a sharp right onto {way_name}","destination":"Take a sharp right towards {destination}"},"slight left":{"default":"Continue slightly left","name":"Continue slightly left onto {way_name}","destination":"Continue slightly left towards {destination}"},"slight right":{"default":"Continue slightly right","name":"Continue slightly right onto {way_name}","destination":"Continue slightly right towards {destination}"},"uturn":{"default":"Make a U-turn","name":"Make a U-turn onto {way_name}","destination":"Make a U-turn towards {destination}"}},"notification":{"default":{"default":"Continue {modifier}","name":"Continue {modifier} onto {way_name}","destination":"Continue {modifier} towards {destination}"},"uturn":{"default":"Make a U-turn","name":"Make a U-turn onto {way_name}","destination":"Make a U-turn towards {destination}"}},"off ramp":{"default":{"default":"Take the ramp","name":"Take the ramp onto {way_name}","destination":"Take the ramp towards {destination}","exit":"Take exit {exit}","exit_destination":"Take exit {exit} towards {destination}"},"left":{"default":"Take the ramp on the left","name":"Take the ramp on the left onto {way_name}","destination":"Take the ramp on the left towards {destination}","exit":"Take exit {exit} on the left","exit_destination":"Take exit {exit} on the left towards {destination}"},"right":{"default":"Take the ramp on the right","name":"Take the ramp on the right onto {way_name}","destination":"Take the ramp on the right towards {destination}","exit":"Take exit {exit} on the right","exit_destination":"Take exit {exit} on the right towards {destination}"},"sharp left":{"default":"Take the ramp on the left","name":"Take the ramp on the left onto {way_name}","destination":"Take the ramp on the left towards {destination}","exit":"Take exit {exit} on the left","exit_destination":"Take exit {exit} on the left towards {destination}"},"sharp right":{"default":"Take the ramp on the right","name":"Take the ramp on the right onto {way_name}","destination":"Take the ramp on the right towards {destination}","exit":"Take exit {exit} on the right","exit_destination":"Take exit {exit} on the right towards {destination}"},"slight left":{"default":"Take the ramp on the left","name":"Take the ramp on the left onto {way_name}","destination":"Take the ramp on the left towards {destination}","exit":"Take exit {exit} on the left","exit_destination":"Take exit {exit} on the left towards {destination}"},"slight right":{"default":"Take the ramp on the right","name":"Take the ramp on the right onto {way_name}","destination":"Take the ramp on the right towards {destination}","exit":"Take exit {exit} on the right","exit_destination":"Take exit {exit} on the right towards {destination}"}},"on ramp":{"default":{"default":"Take the ramp","name":"Take the ramp onto {way_name}","destination":"Take the ramp towards {destination}"},"left":{"default":"Take the ramp on the left","name":"Take the ramp on the left onto {way_name}","destination":"Take the ramp on the left towards {destination}"},"right":{"default":"Take the ramp on the right","name":"Take the ramp on the right onto {way_name}","destination":"Take the ramp on the right towards {destination}"},"sharp left":{"default":"Take the ramp on the left","name":"Take the ramp on the left onto {way_name}","destination":"Take the ramp on the left towards {destination}"},"sharp right":{"default":"Take the ramp on the right","name":"Take the ramp on the right onto {way_name}","destination":"Take the ramp on the right towards {destination}"},"slight left":{"default":"Take the ramp on the left","name":"Take the ramp on the left onto {way_name}","destination":"Take the ramp on the left towards {destination}"},"slight right":{"default":"Take the ramp on the right","name":"Take the ramp on the right onto {way_name}","destination":"Take the ramp on the right towards {destination}"}},"rotary":{"default":{"default":{"default":"Enter the traffic circle","name":"Enter the traffic circle and exit onto {way_name}","destination":"Enter the traffic circle and exit towards {destination}"},"name":{"default":"Enter {rotary_name}","name":"Enter {rotary_name} and exit onto {way_name}","destination":"Enter {rotary_name} and exit towards {destination}"},"exit":{"default":"Enter the traffic circle and take the {exit_number} exit","name":"Enter the traffic circle and take the {exit_number} exit onto {way_name}","destination":"Enter the traffic circle and take the {exit_number} exit towards {destination}"},"name_exit":{"default":"Enter {rotary_name} and take the {exit_number} exit","name":"Enter {rotary_name} and take the {exit_number} exit onto {way_name}","destination":"Enter {rotary_name} and take the {exit_number} exit towards {destination}"}}},"roundabout":{"default":{"exit":{"default":"Enter the traffic circle and take the {exit_number} exit","name":"Enter the traffic circle and take the {exit_number} exit onto {way_name}","destination":"Enter the traffic circle and take the {exit_number} exit towards {destination}"},"default":{"default":"Enter the traffic circle","name":"Enter the traffic circle and exit onto {way_name}","destination":"Enter the traffic circle and exit towards {destination}"}}},"roundabout turn":{"default":{"default":"Make a {modifier}","name":"Make a {modifier} onto {way_name}","destination":"Make a {modifier} towards {destination}"},"left":{"default":"Turn left","name":"Turn left onto {way_name}","destination":"Turn left towards {destination}"},"right":{"default":"Turn right","name":"Turn right onto {way_name}","destination":"Turn right towards {destination}"},"straight":{"default":"Continue straight","name":"Continue straight onto {way_name}","destination":"Continue straight towards {destination}"}},"exit roundabout":{"default":{"default":"Exit the traffic circle","name":"Exit the traffic circle onto {way_name}","destination":"Exit the traffic circle towards {destination}"}},"exit rotary":{"default":{"default":"Exit the traffic circle","name":"Exit the traffic circle onto {way_name}","destination":"Exit the traffic circle towards {destination}"}},"turn":{"default":{"default":"Make a {modifier}","name":"Make a {modifier} onto {way_name}","destination":"Make a {modifier} towards {destination}"},"left":{"default":"Turn left","name":"Turn left onto {way_name}","destination":"Turn left towards {destination}"},"right":{"default":"Turn right","name":"Turn right onto {way_name}","destination":"Turn right towards {destination}"},"straight":{"default":"Go straight","name":"Go straight onto {way_name}","destination":"Go straight towards {destination}"}},"use lane":{"no_lanes":{"default":"Continue straight"},"default":{"default":"{lane_instruction}"}}};
var en = {
	meta: meta$2,
	v5: v5$2
};

var en$1 = Object.freeze({
	meta: meta$2,
	v5: v5$2,
	default: en
});

const meta$3 = {"capitalizeFirstLetter":true};
const v5$3 = {"constants":{"ordinalize":{"1":"1.","2":"2.","3":"3.","4":"4.","5":"5.","6":"6.","7":"7.","8":"8.","9":"9.","10":"10."},"direction":{"north":"norden","northeast":"nord-orienten","east":"orienten","southeast":"sud-orienten","south":"suden","southwest":"sud-okcidenten","west":"okcidenten","northwest":"nord-okcidenten"},"modifier":{"left":"maldekstren","right":"dekstren","sharp left":"maldekstregen","sharp right":"dekstregen","slight left":"maldekstreten","slight right":"dekstreten","straight":"rekten","uturn":"turniĝu malantaŭen"},"lanes":{"xo":"Veturu dekstre","ox":"Veturu maldekstre","xox":"Veturu meze","oxo":"Veturu dekstre aŭ maldekstre"}},"modes":{"ferry":{"default":"Enpramiĝu","name":"Enpramiĝu {way_name}","destination":"Enpramiĝu direkte al {destination}"}},"phrase":{"two linked by distance":"{instruction_one} kaj post {distance} {instruction_two}","two linked":"{instruction_one} kaj sekve {instruction_two}","one in distance":"Post {distance}, {instruction_one}","name and ref":"{name} ({ref})","exit with number":"exit {exit}"},"arrive":{"default":{"default":"Vi atingis vian {nth} celon","upcoming":"Vi atingos vian {nth} celon","short":"Vi atingis","short-upcoming":"Vi atingos"},"left":{"default":"Vi atingis vian {nth} celon ĉe maldekstre","upcoming":"Vi atingos vian {nth} celon ĉe maldekstre","short":"Vi atingis","short-upcoming":"Vi atingos"},"right":{"default":"Vi atingis vian {nth} celon ĉe dekstre","upcoming":"Vi atingos vian {nth} celon ĉe dekstre","short":"Vi atingis","short-upcoming":"Vi atingos"},"sharp left":{"default":"Vi atingis vian {nth} celon ĉe maldekstre","upcoming":"Vi atingos vian {nth} celon ĉe maldekstre","short":"Vi atingis","short-upcoming":"Vi atingos"},"sharp right":{"default":"Vi atingis vian {nth} celon ĉe dekstre","upcoming":"Vi atingos vian {nth} celon ĉe dekstre","short":"Vi atingis","short-upcoming":"Vi atingos"},"slight right":{"default":"Vi atingis vian {nth} celon ĉe dekstre","upcoming":"Vi atingos vian {nth} celon ĉe dekstre","short":"Vi atingis","short-upcoming":"Vi atingos"},"slight left":{"default":"Vi atingis vian {nth} celon ĉe maldekstre","upcoming":"Vi atingos vian {nth} celon ĉe maldekstre","short":"Vi atingis","short-upcoming":"Vi atingos"},"straight":{"default":"Vi atingis vian {nth} celon","upcoming":"Vi atingos vian {nth} celon rekte","short":"Vi atingis","short-upcoming":"Vi atingos"}},"continue":{"default":{"default":"Veturu {modifier}","name":"Veturu {modifier} al {way_name}","destination":"Veturu {modifier} direkte al {destination}","exit":"Veturu {modifier} direkte al {way_name}"},"straight":{"default":"Veturu rekten","name":"Veturu rekten al {way_name}","destination":"Veturu rekten direkte al {destination}","distance":"Veturu rekten dum {distance}","namedistance":"Veturu rekten al {way_name} dum {distance}"},"sharp left":{"default":"Turniĝu ege maldekstren","name":"Turniĝu ege maldekstren al {way_name}","destination":"Turniĝu ege maldekstren direkte al {destination}"},"sharp right":{"default":"Turniĝu ege dekstren","name":"Turniĝu ege dekstren al {way_name}","destination":"Turniĝu ege dekstren direkte al {destination}"},"slight left":{"default":"Turniĝu ete maldekstren","name":"Turniĝu ete maldekstren al {way_name}","destination":"Turniĝu ete maldekstren direkte al {destination}"},"slight right":{"default":"Turniĝu ete dekstren","name":"Turniĝu ete dekstren al {way_name}","destination":"Turniĝu ete dekstren direkte al {destination}"},"uturn":{"default":"Turniĝu malantaŭen","name":"Turniĝu malantaŭen al {way_name}","destination":"Turniĝu malantaŭen direkte al {destination}"}},"depart":{"default":{"default":"Direktiĝu {direction}","name":"Direktiĝu {direction} al {way_name}","namedistance":"Direktiĝu {direction} al {way_name} tra {distance}"}},"end of road":{"default":{"default":"Veturu {modifier}","name":"Veturu {modifier} direkte al {way_name}","destination":"Veturu {modifier} direkte al {destination}"},"straight":{"default":"Veturu rekten","name":"Veturu rekten al {way_name}","destination":"Veturu rekten direkte al {destination}"},"uturn":{"default":"Turniĝu malantaŭen ĉe fino de la vojo","name":"Turniĝu malantaŭen al {way_name} ĉe fino de la vojo","destination":"Turniĝu malantaŭen direkte al {destination} ĉe fino de la vojo"}},"fork":{"default":{"default":"Daŭru {modifier} ĉe la vojforko","name":"Pluu {modifier} al {way_name}","destination":"Pluu {modifier} direkte al {destination}"},"slight left":{"default":"Maldekstren ĉe la vojforko","name":"Pluu maldekstren al {way_name}","destination":"Pluu maldekstren direkte al {destination}"},"slight right":{"default":"Dekstren ĉe la vojforko","name":"Pluu dekstren al {way_name}","destination":"Pluu dekstren direkte al {destination}"},"sharp left":{"default":"Ege maldekstren ĉe la vojforko","name":"Turniĝu ege maldekstren al {way_name}","destination":"Turniĝu ege maldekstren direkte al {destination}"},"sharp right":{"default":"Ege dekstren ĉe la vojforko","name":"Turniĝu ege dekstren al {way_name}","destination":"Turniĝu ege dekstren direkte al {destination}"},"uturn":{"default":"Turniĝu malantaŭen","name":"Turniĝu malantaŭen al {way_name}","destination":"Turniĝu malantaŭen direkte al {destination}"}},"merge":{"default":{"default":"Enveturu {modifier}","name":"Enveturu {modifier} al {way_name}","destination":"Enveturu {modifier} direkte al {destination}"},"straight":{"default":"Enveturu","name":"Enveturu al {way_name}","destination":"Enveturu direkte al {destination}"},"slight left":{"default":"Enveturu de maldekstre","name":"Enveturu de maldekstre al {way_name}","destination":"Enveturu de maldekstre direkte al {destination}"},"slight right":{"default":"Enveturu de dekstre","name":"Enveturu de dekstre al {way_name}","destination":"Enveturu de dekstre direkte al {destination}"},"sharp left":{"default":"Enveturu de maldekstre","name":"Enveture de maldekstre al {way_name}","destination":"Enveturu de maldekstre direkte al {destination}"},"sharp right":{"default":"Enveturu de dekstre","name":"Enveturu de dekstre al {way_name}","destination":"Enveturu de dekstre direkte al {destination}"},"uturn":{"default":"Turniĝu malantaŭen","name":"Turniĝu malantaŭen al {way_name}","destination":"Turniĝu malantaŭen direkte al {destination}"}},"new name":{"default":{"default":"Pluu {modifier}","name":"Pluu {modifier} al {way_name}","destination":"Pluu {modifier} direkte al {destination}"},"straight":{"default":"Veturu rekten","name":"Veturu rekten al {way_name}","destination":"Veturu rekten direkte al {destination}"},"sharp left":{"default":"Turniĝu ege maldekstren","name":"Turniĝu ege maldekstren al {way_name}","destination":"Turniĝu ege maldekstren direkte al {destination}"},"sharp right":{"default":"Turniĝu ege dekstren","name":"Turniĝu ege dekstren al {way_name}","destination":"Turniĝu ege dekstren direkte al {destination}"},"slight left":{"default":"Pluu ete maldekstren","name":"Pluu ete maldekstren al {way_name}","destination":"Pluu ete maldekstren direkte al {destination}"},"slight right":{"default":"Pluu ete dekstren","name":"Pluu ete dekstren al {way_name}","destination":"Pluu ete dekstren direkte al {destination}"},"uturn":{"default":"Turniĝu malantaŭen","name":"Turniĝu malantaŭen al {way_name}","destination":"Turniĝu malantaŭen direkte al {destination}"}},"notification":{"default":{"default":"Pluu {modifier}","name":"Pluu {modifier} al {way_name}","destination":"Pluu {modifier} direkte al {destination}"},"uturn":{"default":"Turniĝu malantaŭen","name":"Turniĝu malantaŭen al {way_name}","destination":"Turniĝu malantaŭen direkte al {destination}"}},"off ramp":{"default":{"default":"Direktiĝu al enveturejo","name":"Direktiĝu al enveturejo al {way_name}","destination":"Direktiĝu al enveturejo direkte al {destination}","exit":"Direktiĝu al elveturejo {exit}","exit_destination":"Direktiĝu al elveturejo {exit} direkte al {destination}"},"left":{"default":"Direktiĝu al enveturejo ĉe maldekstre","name":"Direktiĝu al enveturejo ĉe maldekstre al {way_name}","destination":"Direktiĝu al enveturejo ĉe maldekstre al {destination}","exit":"Direktiĝu al elveturejo {exit} ĉe maldekstre","exit_destination":"Direktiĝu al elveturejo {exit} ĉe maldekstre direkte al {destination}"},"right":{"default":"Direktiĝu al enveturejo ĉe dekstre","name":"Direktiĝu al enveturejo ĉe dekstre al {way_name}","destination":"Direktiĝu al enveturejo ĉe dekstre al {destination}","exit":"Direktiĝu al {exit} elveturejo ĉe ldekstre","exit_destination":"Direktiĝu al elveturejo {exit} ĉe dekstre direkte al {destination}"},"sharp left":{"default":"Direktiĝu al enveturejo ĉe maldekstre","name":"Direktiĝu al enveturejo ĉe maldekstre al {way_name}","destination":"Direktiĝu al enveturejo ĉe maldekstre al {destination}","exit":"Direktiĝu al {exit} elveturejo ĉe maldekstre","exit_destination":"Direktiĝu al elveturejo {exit} ĉe maldekstre direkte al {destination}"},"sharp right":{"default":"Direktiĝu al enveturejo ĉe dekstre","name":"Direktiĝu al enveturejo ĉe dekstre al {way_name}","destination":"Direktiĝu al enveturejo ĉe dekstre al {destination}","exit":"Direktiĝu al elveturejo {exit} ĉe dekstre","exit_destination":"Direktiĝu al elveturejo {exit} ĉe dekstre direkte al {destination}"},"slight left":{"default":"Direktiĝu al enveturejo ĉe maldekstre","name":"Direktiĝu al enveturejo ĉe maldekstre al {way_name}","destination":"Direktiĝu al enveturejo ĉe maldekstre al {destination}","exit":"Direktiĝu al {exit} elveturejo ĉe maldekstre","exit_destination":"Direktiĝu al elveturejo {exit} ĉe maldekstre direkte al {destination}"},"slight right":{"default":"Direktiĝu al enveturejo ĉe dekstre","name":"Direktiĝu al enveturejo ĉe dekstre al {way_name}","destination":"Direktiĝu al enveturejo ĉe dekstre al {destination}","exit":"Direktiĝu al {exit} elveturejo ĉe ldekstre","exit_destination":"Direktiĝu al elveturejo {exit} ĉe dekstre direkte al {destination}"}},"on ramp":{"default":{"default":"Direktiĝu al enveturejo","name":"Direktiĝu al enveturejo al {way_name}","destination":"Direktiĝu al enveturejo direkte al {destination}"},"left":{"default":"Direktiĝu al enveturejo ĉe maldekstre","name":"Direktiĝu al enveturejo ĉe maldekstre al {way_name}","destination":"Direktiĝu al enveturejo ĉe maldekstre al {destination}"},"right":{"default":"Direktiĝu al enveturejo ĉe dekstre","name":"Direktiĝu al enveturejo ĉe dekstre al {way_name}","destination":"Direktiĝu al enveturejo ĉe dekstre al {destination}"},"sharp left":{"default":"Direktiĝu al enveturejo ĉe maldekstre","name":"Direktiĝu al enveturejo ĉe maldekstre al {way_name}","destination":"Direktiĝu al enveturejo ĉe maldekstre al {destination}"},"sharp right":{"default":"Direktiĝu al enveturejo ĉe dekstre","name":"Direktiĝu al enveturejo ĉe dekstre al {way_name}","destination":"Direktiĝu al enveturejo ĉe dekstre al {destination}"},"slight left":{"default":"Direktiĝu al enveturejo ĉe maldekstre","name":"Direktiĝu al enveturejo ĉe maldekstre al {way_name}","destination":"Direktiĝu al enveturejo ĉe maldekstre al {destination}"},"slight right":{"default":"Direktiĝu al enveturejo ĉe dekstre","name":"Direktiĝu al enveturejo ĉe dekstre al {way_name}","destination":"Direktiĝu al enveturejo ĉe dekstre al {destination}"}},"rotary":{"default":{"default":{"default":"Enveturu trafikcirklegon","name":"Enveturu trafikcirklegon kaj elveturu al {way_name}","destination":"Enveturu trafikcirklegon kaj elveturu direkte al {destination}"},"name":{"default":"Enveturu {rotary_name}","name":"Enveturu {rotary_name} kaj elveturu al {way_name}","destination":"Enveturu {rotary_name} kaj elveturu direkte al {destination}"},"exit":{"default":"Enveturu trafikcirklegon kaj sekve al {exit_number} elveturejo","name":"Enveturu trafikcirklegon kaj sekve al {exit_number} elveturejo al {way_name}","destination":"Enveturu trafikcirklegon kaj sekve al {exit_number} elveturejo direkte al {destination}"},"name_exit":{"default":"Enveturu {rotary_name} kaj sekve al {exit_number} elveturejo","name":"Enveturu {rotary_name} kaj sekve al {exit_number} elveturejo al {way_name}","destination":"Enveturu {rotary_name} kaj sekve al {exit_number} elveturejo direkte al {destination}"}}},"roundabout":{"default":{"exit":{"default":"Enveturu trafikcirklegon kaj sekve al {exit_number} elveturejo","name":"Enveturu trafikcirklegon kaj sekve al {exit_number} elveturejo al {way_name}","destination":"Enveturu trafikcirklegon kaj sekve al {exit_number} elveturejo direkte al {destination}"},"default":{"default":"Enveturu trafikcirklegon","name":"Enveturu trafikcirklegon kaj elveturu al {way_name}","destination":"Enveturu trafikcirklegon kaj elveturu direkte al {destination}"}}},"roundabout turn":{"default":{"default":"Veturu {modifier}","name":"Veturu {modifier} al {way_name}","destination":"Veturu {modifier} direkte al {destination}"},"left":{"default":"Turniĝu maldekstren","name":"Turniĝu maldekstren al {way_name}","destination":"Turniĝu maldekstren direkte al {destination}"},"right":{"default":"Turniĝu dekstren","name":"Turniĝu dekstren al {way_name}","destination":"Turniĝu dekstren direkte al {destination}"},"straight":{"default":"Pluu rekten","name":"Veturu rekten al {way_name}","destination":"Veturu rekten direkte al {destination}"}},"exit roundabout":{"default":{"default":"Elveturu trafikcirklegon","name":"Elveturu trafikcirklegon al {way_name}","destination":"Elveturu trafikcirklegon direkte al {destination}"}},"exit rotary":{"default":{"default":"Eliru trafikcirklegon","name":"Elveturu trafikcirklegon al {way_name}","destination":"Elveturu trafikcirklegon direkte al {destination}"}},"turn":{"default":{"default":"Veturu {modifier}","name":"Veturu {modifier} al {way_name}","destination":"Veturu {modifier} direkte al {destination}"},"left":{"default":"Turniĝu maldekstren","name":"Turniĝu maldekstren al {way_name}","destination":"Turniĝu maldekstren direkte al {destination}"},"right":{"default":"Turniĝu dekstren","name":"Turniĝu dekstren al {way_name}","destination":"Turniĝu dekstren direkte al {destination}"},"straight":{"default":"Veturu rekten","name":"Veturu rekten al {way_name}","destination":"Veturu rekten direkte al {destination}"}},"use lane":{"no_lanes":{"default":"Pluu rekten"},"default":{"default":"{lane_instruction}"}}};
var eo = {
	meta: meta$3,
	v5: v5$3
};

var eo$1 = Object.freeze({
	meta: meta$3,
	v5: v5$3,
	default: eo
});

const meta$4 = {"capitalizeFirstLetter":true};
const v5$4 = {"constants":{"ordinalize":{"1":"1ª","2":"2ª","3":"3ª","4":"4ª","5":"5ª","6":"6ª","7":"7ª","8":"8ª","9":"9ª","10":"10ª"},"direction":{"north":"norte","northeast":"noreste","east":"este","southeast":"sureste","south":"sur","southwest":"suroeste","west":"oeste","northwest":"noroeste"},"modifier":{"left":"izquierda","right":"derecha","sharp left":"cerrada a la izquierda","sharp right":"cerrada a la derecha","slight left":"ligeramente a la izquierda","slight right":"ligeramente a la derecha","straight":"recto","uturn":"cambio de sentido"},"lanes":{"xo":"Mantengase a la derecha","ox":"Mantengase a la izquierda","xox":"Mantengase en el medio","oxo":"Mantengase a la izquierda o derecha"}},"modes":{"ferry":{"default":"Coge el ferry","name":"Coge el ferry {way_name}","destination":"Coge el ferry a {destination}"}},"phrase":{"two linked by distance":"{instruction_one} y luego en {distance}, {instruction_two}","two linked":"{instruction_one} y luego {instruction_two}","one in distance":"A {distance}, {instruction_one}","name and ref":"{name} ({ref})","exit with number":"salida {exit}"},"arrive":{"default":{"default":"Has llegado a tu {nth} destino","upcoming":"Vas a llegar a tu {nth} destino","short":"Has llegado a tu {nth} destino","short-upcoming":"Vas a llegar a tu {nth} destino"},"left":{"default":"Has llegado a tu {nth} destino, a la izquierda","upcoming":"Vas a llegar a tu {nth} destino, a la izquierda","short":"Has llegado a tu {nth} destino","short-upcoming":"Vas a llegar a tu {nth} destino"},"right":{"default":"Has llegado a tu {nth} destino, a la derecha","upcoming":"Vas a llegar a tu {nth} destino, a la derecha","short":"Has llegado a tu {nth} destino","short-upcoming":"Vas a llegar a tu {nth} destino"},"sharp left":{"default":"Has llegado a tu {nth} destino, a la izquierda","upcoming":"Vas a llegar a tu {nth} destino, a la izquierda","short":"Has llegado a tu {nth} destino","short-upcoming":"Vas a llegar a tu {nth} destino"},"sharp right":{"default":"Has llegado a tu {nth} destino, a la derecha","upcoming":"Vas a llegar a tu {nth} destino, a la derecha","short":"Has llegado a tu {nth} destino","short-upcoming":"Vas a llegar a tu {nth} destino"},"slight right":{"default":"Has llegado a tu {nth} destino, a la derecha","upcoming":"Vas a llegar a tu {nth} destino, a la derecha","short":"Has llegado a tu {nth} destino","short-upcoming":"Vas a llegar a tu {nth} destino"},"slight left":{"default":"Has llegado a tu {nth} destino, a la izquierda","upcoming":"Vas a llegar a tu {nth} destino, a la izquierda","short":"Has llegado a tu {nth} destino","short-upcoming":"Vas a llegar a tu {nth} destino"},"straight":{"default":"Has llegado a tu {nth} destino, en frente","upcoming":"Vas a llegar a tu {nth} destino, en frente","short":"Has llegado a tu {nth} destino","short-upcoming":"Vas a llegar a tu {nth} destino"}},"continue":{"default":{"default":"Gire a {modifier}","name":"Cruce a la{modifier}  en {way_name}","destination":"Gire a {modifier} hacia {destination}","exit":"Gire a {modifier} en {way_name}"},"straight":{"default":"Continúe recto","name":"Continúe en {way_name}","destination":"Continúe hacia {destination}","distance":"Continúe recto por {distance}","namedistance":"Continúe recto en {way_name} por {distance}"},"sharp left":{"default":"Gire a la izquierda","name":"Gire a la izquierda en {way_name}","destination":"Gire a la izquierda hacia {destination}"},"sharp right":{"default":"Gire a la derecha","name":"Gire a la derecha en {way_name}","destination":"Gire a la derecha hacia {destination}"},"slight left":{"default":"Gire a la izquierda","name":"Doble levemente a la izquierda en {way_name}","destination":"Gire a la izquierda hacia {destination}"},"slight right":{"default":"Gire a la izquierda","name":"Doble levemente a la derecha en {way_name}","destination":"Gire a la izquierda hacia {destination}"},"uturn":{"default":"Haz un cambio de sentido","name":"Haz un cambio de sentido y continúe en {way_name}","destination":"Haz un cambio de sentido hacia {destination}"}},"depart":{"default":{"default":"Ve a {direction}","name":"Ve a {direction} en {way_name}","namedistance":"Ve a {direction} en {way_name} por {distance}"}},"end of road":{"default":{"default":"Gire  a {modifier}","name":"Gire a {modifier} en {way_name}","destination":"Gire a {modifier} hacia {destination}"},"straight":{"default":"Continúe recto","name":"Continúe recto en {way_name}","destination":"Continúe recto hacia {destination}"},"uturn":{"default":"Haz un cambio de sentido al final de la via","name":"Haz un cambio de sentido en {way_name} al final de la via","destination":"Haz un cambio de sentido hacia {destination} al final de la via"}},"fork":{"default":{"default":"Mantengase  {modifier} en el cruce","name":"Mantengase  {modifier} en el cruce en {way_name}","destination":"Mantengase  {modifier} en el cruce hacia {destination}"},"slight left":{"default":"Mantengase a la izquierda en el cruce","name":"Mantengase a la izquierda en el cruce en {way_name}","destination":"Mantengase a la izquierda en el cruce hacia {destination}"},"slight right":{"default":"Mantengase a la derecha en el cruce","name":"Mantengase a la derecha en el cruce en {way_name}","destination":"Mantengase a la derecha en el cruce hacia {destination}"},"sharp left":{"default":"Gire a la izquierda en el cruce","name":"Gire a la izquierda en el cruce en {way_name}","destination":"Gire a la izquierda en el cruce hacia {destination}"},"sharp right":{"default":"Gire a la derecha en el cruce","name":"Gire a la derecha en el cruce en {way_name}","destination":"Gire a la derecha en el cruce hacia {destination}"},"uturn":{"default":"Haz un cambio de sentido","name":"Haz un cambio de sentido en {way_name}","destination":"Haz un cambio de sentido hacia {destination}"}},"merge":{"default":{"default":"Gire  a {modifier}","name":"Gire a {modifier} en {way_name}","destination":"Gire a {modifier} hacia {destination}"},"straight":{"default":"Gire  a recto","name":"Gire a recto en {way_name}","destination":"Gire a recto hacia {destination}"},"slight left":{"default":"Gire a la izquierda","name":"Gire a la izquierda en {way_name}","destination":"Gire a la izquierda hacia {destination}"},"slight right":{"default":"Gire a la derecha","name":"Gire a la derecha en {way_name}","destination":"Gire a la derecha hacia {destination}"},"sharp left":{"default":"Gire a la izquierda","name":"Gire a la izquierda en {way_name}","destination":"Gire a la izquierda hacia {destination}"},"sharp right":{"default":"Gire a la derecha","name":"Gire a la derecha en {way_name}","destination":"Gire a la derecha hacia {destination}"},"uturn":{"default":"Haz un cambio de sentido","name":"Haz un cambio de sentido en {way_name}","destination":"Haz un cambio de sentido hacia {destination}"}},"new name":{"default":{"default":"Continúe {modifier}","name":"Continúe {modifier} en {way_name}","destination":"Continúe {modifier} hacia {destination}"},"straight":{"default":"Continúe recto","name":"Continúe en {way_name}","destination":"Continúe hacia {destination}"},"sharp left":{"default":"Gire a la izquierda","name":"Gire a la izquierda en {way_name}","destination":"Gire a la izquierda hacia {destination}"},"sharp right":{"default":"Gire a la derecha","name":"Gire a la derecha en {way_name}","destination":"Gire a la derecha hacia {destination}"},"slight left":{"default":"Continúe ligeramente a la izquierda","name":"Continúe ligeramente a la izquierda en {way_name}","destination":"Continúe ligeramente a la izquierda hacia {destination}"},"slight right":{"default":"Continúe ligeramente a la derecha","name":"Continúe ligeramente a la derecha en {way_name}","destination":"Continúe ligeramente a la derecha hacia {destination}"},"uturn":{"default":"Haz un cambio de sentido","name":"Haz un cambio de sentido en {way_name}","destination":"Haz un cambio de sentido hacia {destination}"}},"notification":{"default":{"default":"Continúe {modifier}","name":"Continúe {modifier} en {way_name}","destination":"Continúe {modifier} hacia {destination}"},"uturn":{"default":"Haz un cambio de sentido","name":"Haz un cambio de sentido en {way_name}","destination":"Haz un cambio de sentido hacia {destination}"}},"off ramp":{"default":{"default":"Tome la salida","name":"Tome la salida en {way_name}","destination":"Tome la salida hacia {destination}","exit":"Tome la salida {exit}","exit_destination":"Tome la salida {exit} hacia {destination}"},"left":{"default":"Tome la salida en la izquierda","name":"Tome la salida en la izquierda en {way_name}","destination":"Tome la salida en la izquierda en {destination}","exit":"Tome la salida {exit} en la izquierda","exit_destination":"Tome la salida {exit} en la izquierda hacia {destination}"},"right":{"default":"Tome la salida en la derecha","name":"Tome la salida en la derecha en {way_name}","destination":"Tome la salida en la derecha hacia {destination}","exit":"Tome la salida {exit} en la derecha","exit_destination":"Tome la salida {exit} en la derecha hacia {destination}"},"sharp left":{"default":"Ve cuesta abajo en la izquierda","name":"Ve cuesta abajo en la izquierda en {way_name}","destination":"Ve cuesta abajo en la izquierda hacia {destination}","exit":"Tome la salida {exit} en la izquierda","exit_destination":"Tome la salida {exit} en la izquierda hacia {destination}"},"sharp right":{"default":"Ve cuesta abajo en la derecha","name":"Ve cuesta abajo en la derecha en {way_name}","destination":"Ve cuesta abajo en la derecha hacia {destination}","exit":"Tome la salida {exit} en la derecha","exit_destination":"Tome la salida {exit} en la derecha hacia {destination}"},"slight left":{"default":"Ve cuesta abajo en la izquierda","name":"Ve cuesta abajo en la izquierda en {way_name}","destination":"Ve cuesta abajo en la izquierda hacia {destination}","exit":"Tome la salida {exit} en la izquierda","exit_destination":"Tome la salida {exit} en la izquierda hacia {destination}"},"slight right":{"default":"Tome la salida en la derecha","name":"Tome la salida en la derecha en {way_name}","destination":"Tome la salida en la derecha hacia {destination}","exit":"Tome la salida {exit} en la derecha","exit_destination":"Tome la salida {exit} en la derecha hacia {destination}"}},"on ramp":{"default":{"default":"Tome la rampa","name":"Tome la rampa en {way_name}","destination":"Tome la rampa hacia {destination}"},"left":{"default":"Tome la rampa en la izquierda","name":"Tome la rampa en la izquierda en {way_name}","destination":"Tome la rampa en la izquierda hacia {destination}"},"right":{"default":"Tome la rampa en la derecha","name":"Tome la rampa en la derecha en {way_name}","destination":"Tome la rampa en la derecha hacia {destination}"},"sharp left":{"default":"Tome la rampa en la izquierda","name":"Tome la rampa en la izquierda en {way_name}","destination":"Tome la rampa en la izquierda hacia {destination}"},"sharp right":{"default":"Tome la rampa en la derecha","name":"Tome la rampa en la derecha en {way_name}","destination":"Tome la rampa en la derecha hacia {destination}"},"slight left":{"default":"Tome la rampa en la izquierda","name":"Tome la rampa en la izquierda en {way_name}","destination":"Tome la rampa en la izquierda hacia {destination}"},"slight right":{"default":"Tome la rampa en la derecha","name":"Tome la rampa en la derecha en {way_name}","destination":"Tome la rampa en la derecha hacia {destination}"}},"rotary":{"default":{"default":{"default":"Entra en la rotonda","name":"Entra en la rotonda y sal en {way_name}","destination":"Entra en la rotonda y sal hacia {destination}"},"name":{"default":"Entra en {rotary_name}","name":"Entra en {rotary_name} y sal en {way_name}","destination":"Entra en {rotary_name} y sal hacia {destination}"},"exit":{"default":"Entra en la rotonda y toma la {exit_number} salida","name":"Entra en la rotonda y toma la {exit_number} salida a {way_name}","destination":"Entra en la rotonda y toma la {exit_number} salida hacia {destination}"},"name_exit":{"default":"Entra en {rotary_name} y coge la {exit_number} salida","name":"Entra en {rotary_name} y coge la {exit_number} salida en {way_name}","destination":"Entra en {rotary_name} y coge la {exit_number} salida hacia {destination}"}}},"roundabout":{"default":{"exit":{"default":"Entra en la rotonda y toma la {exit_number} salida","name":"Entra en la rotonda y toma la {exit_number} salida a {way_name}","destination":"Entra en la rotonda y toma la {exit_number} salida hacia {destination}"},"default":{"default":"Entra en la rotonda","name":"Entra en la rotonda y sal en {way_name}","destination":"Entra en la rotonda y sal hacia {destination}"}}},"roundabout turn":{"default":{"default":"En la rotonda siga {modifier}","name":"En la rotonda siga {modifier} en {way_name}","destination":"En la rotonda siga {modifier} hacia {destination}"},"left":{"default":"En la rotonda gira a la izquierda","name":"En la rotonda gira a la izquierda en {way_name}","destination":"En la rotonda gira a la izquierda hacia {destination}"},"right":{"default":"En la rotonda gira a la derecha","name":"En la rotonda gira a la derecha en {way_name}","destination":"En la rotonda gira a la derecha hacia {destination}"},"straight":{"default":"En la rotonda continúe recto","name":"En la rotonda continúe recto en {way_name}","destination":"En la rotonda continúe recto hacia {destination}"}},"exit roundabout":{"default":{"default":"Sal la rotonda","name":"Sal la rotonda en {way_name}","destination":"Sal la rotonda hacia {destination}"}},"exit rotary":{"default":{"default":"Sal la rotonda","name":"Sal la rotonda en {way_name}","destination":"Sal la rotonda hacia {destination}"}},"turn":{"default":{"default":"Siga {modifier}","name":"Siga {modifier} en {way_name}","destination":"Siga {modifier} hacia {destination}"},"left":{"default":"Gire a la izquierda","name":"Gire a la izquierda en {way_name}","destination":"Gire a la izquierda hacia {destination}"},"right":{"default":"Gire a la derecha","name":"Gire a la derecha en {way_name}","destination":"Gire a la derecha hacia {destination}"},"straight":{"default":"Ve recto","name":"Ve recto en {way_name}","destination":"Ve recto hacia {destination}"}},"use lane":{"no_lanes":{"default":"Continúe recto"},"default":{"default":"{lane_instruction}"}}};
var es = {
	meta: meta$4,
	v5: v5$4
};

var es$1 = Object.freeze({
	meta: meta$4,
	v5: v5$4,
	default: es
});

const meta$5 = {"capitalizeFirstLetter":true};
const v5$5 = {"constants":{"ordinalize":{"1":"1ª","2":"2ª","3":"3ª","4":"4ª","5":"5ª","6":"6ª","7":"7ª","8":"8ª","9":"9ª","10":"10ª"},"direction":{"north":"norte","northeast":"noreste","east":"este","southeast":"sureste","south":"sur","southwest":"suroeste","west":"oeste","northwest":"noroeste"},"modifier":{"left":"a la izquierda","right":"a la derecha","sharp left":"cerrada a la izquierda","sharp right":"cerrada a la derecha","slight left":"ligeramente a la izquierda","slight right":"ligeramente a la derecha","straight":"recto","uturn":"cambio de sentido"},"lanes":{"xo":"Mantente a la derecha","ox":"Mantente a la izquierda","xox":"Mantente en el medio","oxo":"Mantente a la izquierda o a la derecha"}},"modes":{"ferry":{"default":"Coge el ferry","name":"Coge el ferry {way_name}","destination":"Coge el ferry hacia {destination}"}},"phrase":{"two linked by distance":"{instruction_one} y luego en {distance}, {instruction_two}","two linked":"{instruction_one} y luego {instruction_two}","one in distance":"A {distance}, {instruction_one}","name and ref":"{name} ({ref})","exit with number":"salida {exit}"},"arrive":{"default":{"default":"Has llegado a tu {nth} destino","upcoming":"Vas a llegar a tu {nth} destino","short":"Has llegado a tu {nth} destino","short-upcoming":"Vas a llegar a tu {nth} destino"},"left":{"default":"Has llegado a tu {nth} destino, a la izquierda","upcoming":"Vas a llegar a tu {nth} destino, a la izquierda","short":"Has llegado a tu {nth} destino","short-upcoming":"Vas a llegar a tu {nth} destino"},"right":{"default":"Has llegado a tu {nth} destino, a la derecha","upcoming":"Vas a llegar a tu {nth} destino, a la derecha","short":"Has llegado a tu {nth} destino","short-upcoming":"Vas a llegar a tu {nth} destino"},"sharp left":{"default":"Has llegado a tu {nth} destino, a la izquierda","upcoming":"Vas a llegar a tu {nth} destino, a la izquierda","short":"Has llegado a tu {nth} destino","short-upcoming":"Vas a llegar a tu {nth} destino"},"sharp right":{"default":"Has llegado a tu {nth} destino, a la derecha","upcoming":"Vas a llegar a tu {nth} destino, a la derecha","short":"Has llegado a tu {nth} destino","short-upcoming":"Vas a llegar a tu {nth} destino"},"slight right":{"default":"Has llegado a tu {nth} destino, a la derecha","upcoming":"Vas a llegar a tu {nth} destino, a la derecha","short":"Has llegado a tu {nth} destino","short-upcoming":"Vas a llegar a tu {nth} destino"},"slight left":{"default":"Has llegado a tu {nth} destino, a la izquierda","upcoming":"Vas a llegar a tu {nth} destino, a la izquierda","short":"Has llegado a tu {nth} destino","short-upcoming":"Vas a llegar a tu {nth} destino"},"straight":{"default":"Has llegado a tu {nth} destino, en frente","upcoming":"Vas a llegar a tu {nth} destino, en frente","short":"Has llegado a tu {nth} destino","short-upcoming":"Vas a llegar a tu {nth} destino"}},"continue":{"default":{"default":"Gire {modifier}","name":"Cruce {modifier} en {way_name}","destination":"Gire {modifier} hacia {destination}","exit":"Gire {modifier} en {way_name}"},"straight":{"default":"Continúe recto","name":"Continúe en {way_name}","destination":"Continúe hacia {destination}","distance":"Continúe recto por {distance}","namedistance":"Continúe recto en {way_name} por {distance}"},"sharp left":{"default":"Gire a la izquierda","name":"Gire a la izquierda en {way_name}","destination":"Gire a la izquierda hacia {destination}"},"sharp right":{"default":"Gire a la derecha","name":"Gire a la derecha en {way_name}","destination":"Gire a la derecha hacia {destination}"},"slight left":{"default":"Gire a la izquierda","name":"Doble levemente a la izquierda en {way_name}","destination":"Gire a la izquierda hacia {destination}"},"slight right":{"default":"Gire a la izquierda","name":"Doble levemente a la derecha en {way_name}","destination":"Gire a la izquierda hacia {destination}"},"uturn":{"default":"Haz un cambio de sentido","name":"Haz un cambio de sentido y continúe en {way_name}","destination":"Haz un cambio de sentido hacia {destination}"}},"depart":{"default":{"default":"Dirígete al {direction}","name":"Dirígete al {direction} por {way_name}","namedistance":"Dirígete al {direction} en {way_name} por {distance}"}},"end of road":{"default":{"default":"Al final de la calle gira {modifier}","name":"Al final de la calle gira {modifier} por {way_name}","destination":"Al final de la calle gira {modifier} hacia {destination}"},"straight":{"default":"Al final de la calle continúa recto","name":"Al final de la calle continúa recto por {way_name}","destination":"Al final de la calle continúa recto hacia {destination}"},"uturn":{"default":"Al final de la calle haz un cambio de sentido","name":"Al final de la calle haz un cambio de sentido en {way_name}","destination":"Al final de la calle haz un cambio de sentido hacia {destination}"}},"fork":{"default":{"default":"Mantente {modifier} en el cruce","name":"Mantente {modifier} en el cruce por {way_name}","destination":"Mantente {modifier} en el cruce hacia {destination}"},"slight left":{"default":"Mantente a la izquierda en el cruce","name":"Mantente a la izquierda en el cruce por {way_name}","destination":"Mantente a la izquierda en el cruce hacia {destination}"},"slight right":{"default":"Mantente a la derecha en el cruce","name":"Mantente a la derecha en el cruce por {way_name}","destination":"Mantente a la derecha en el cruce hacia {destination}"},"sharp left":{"default":"Gira la izquierda en el cruce","name":"Gira a la izquierda en el cruce por {way_name}","destination":"Gira a la izquierda en el cruce hacia {destination}"},"sharp right":{"default":"Gira a la derecha en el cruce","name":"Gira a la derecha en el cruce por {way_name}","destination":"Gira a la derecha en el cruce hacia {destination}"},"uturn":{"default":"Haz un cambio de sentido","name":"Haz un cambio de sentido en {way_name}","destination":"Haz un cambio de sentido hacia {destination}"}},"merge":{"default":{"default":"Incorpórate {modifier}","name":"Incorpórate {modifier} por {way_name}","destination":"Incorpórate {modifier} hacia {destination}"},"straight":{"default":"Incorpórate","name":"Incorpórate por {way_name}","destination":"Incorpórate hacia {destination}"},"slight left":{"default":"Incorpórate a la izquierda","name":"Incorpórate a la izquierda por {way_name}","destination":"Incorpórate a la izquierda hacia {destination}"},"slight right":{"default":"Incorpórate a la derecha","name":"Incorpórate a la derecha por {way_name}","destination":"Incorpórate a la derecha hacia {destination}"},"sharp left":{"default":"Incorpórate a la izquierda","name":"Incorpórate a la izquierda por {way_name}","destination":"Incorpórate a la izquierda hacia {destination}"},"sharp right":{"default":"Incorpórate a la derecha","name":"Incorpórate a la derecha por {way_name}","destination":"Incorpórate a la derecha hacia {destination}"},"uturn":{"default":"Haz un cambio de sentido","name":"Haz un cambio de sentido en {way_name}","destination":"Haz un cambio de sentido hacia {destination}"}},"new name":{"default":{"default":"Continúa {modifier}","name":"Continúa {modifier} por {way_name}","destination":"Continúa {modifier} hacia {destination}"},"straight":{"default":"Continúa recto","name":"Continúa por {way_name}","destination":"Continúa hacia {destination}"},"sharp left":{"default":"Gira a la izquierda","name":"Gira a la izquierda por {way_name}","destination":"Gira a la izquierda hacia {destination}"},"sharp right":{"default":"Gira a la derecha","name":"Gira a la derecha por {way_name}","destination":"Gira a la derecha hacia {destination}"},"slight left":{"default":"Continúa ligeramente por la izquierda","name":"Continúa ligeramente por la izquierda por {way_name}","destination":"Continúa ligeramente por la izquierda hacia {destination}"},"slight right":{"default":"Continúa ligeramente por la derecha","name":"Continúa ligeramente por la derecha por {way_name}","destination":"Continúa ligeramente por la derecha hacia {destination}"},"uturn":{"default":"Haz un cambio de sentido","name":"Haz un cambio de sentido en {way_name}","destination":"Haz un cambio de sentido hacia {destination}"}},"notification":{"default":{"default":"Continúa {modifier}","name":"Continúa {modifier} por {way_name}","destination":"Continúa {modifier} hacia {destination}"},"uturn":{"default":"Haz un cambio de sentido","name":"Haz un cambio de sentido en {way_name}","destination":"Haz un cambio de sentido hacia {destination}"}},"off ramp":{"default":{"default":"Coge la cuesta abajo","name":"Coge la cuesta abajo por {way_name}","destination":"Coge la cuesta abajo hacia {destination}","exit":"Coge la cuesta abajo {exit}","exit_destination":"Coge la cuesta abajo {exit} hacia {destination}"},"left":{"default":"Coge la cuesta abajo de la izquierda","name":"Coge la cuesta abajo de la izquierda por {way_name}","destination":"Coge la cuesta abajo de la izquierda hacia {destination}","exit":"Coge la cuesta abajo {exit} a tu izquierda","exit_destination":"Coge la cuesta abajo {exit} a tu izquierda hacia {destination}"},"right":{"default":"Coge la cuesta abajo de la derecha","name":"Coge la cuesta abajo de la derecha por {way_name}","destination":"Coge la cuesta abajo de la derecha hacia {destination}","exit":"Coge la cuesta abajo {exit}","exit_destination":"Coge la cuesta abajo {exit} hacia {destination}"},"sharp left":{"default":"Coge la cuesta abajo de la izquierda","name":"Coge la cuesta abajo de la izquierda por {way_name}","destination":"Coge la cuesta abajo de la izquierda hacia {destination}","exit":"Coge la cuesta abajo {exit} a tu izquierda","exit_destination":"Coge la cuesta abajo {exit} a tu izquierda hacia {destination}"},"sharp right":{"default":"Coge la cuesta abajo de la derecha","name":"Coge la cuesta abajo de la derecha por {way_name}","destination":"Coge la cuesta abajo de la derecha hacia {destination}","exit":"Coge la cuesta abajo {exit}","exit_destination":"Coge la cuesta abajo {exit} hacia {destination}"},"slight left":{"default":"Coge la cuesta abajo de la izquierda","name":"Coge la cuesta abajo de la izquierda por {way_name}","destination":"Coge la cuesta abajo de la izquierda hacia {destination}","exit":"Coge la cuesta abajo {exit} a tu izquierda","exit_destination":"Coge la cuesta abajo {exit} a tu izquierda hacia {destination}"},"slight right":{"default":"Coge la cuesta abajo de la derecha","name":"Coge la cuesta abajo de la derecha por {way_name}","destination":"Coge la cuesta abajo de la derecha hacia {destination}","exit":"Coge la cuesta abajo {exit}","exit_destination":"Coge la cuesta abajo {exit} hacia {destination}"}},"on ramp":{"default":{"default":"Coge la cuesta","name":"Coge la cuesta por {way_name}","destination":"Coge la cuesta hacia {destination}"},"left":{"default":"Coge la cuesta de la izquierda","name":"Coge la cuesta de la izquierda por {way_name}","destination":"Coge la cuesta de la izquierda hacia {destination}"},"right":{"default":"Coge la cuesta de la derecha","name":"Coge la cuesta de la derecha por {way_name}","destination":"Coge la cuesta de la derecha hacia {destination}"},"sharp left":{"default":"Coge la cuesta de la izquierda","name":"Coge la cuesta de la izquierda por {way_name}","destination":"Coge la cuesta de la izquierda hacia {destination}"},"sharp right":{"default":"Coge la cuesta de la derecha","name":"Coge la cuesta de la derecha por {way_name}","destination":"Coge la cuesta de la derecha hacia {destination}"},"slight left":{"default":"Coge la cuesta de la izquierda","name":"Coge la cuesta de la izquierda por {way_name}","destination":"Coge la cuesta de la izquierda hacia {destination}"},"slight right":{"default":"Coge la cuesta de la derecha","name":"Coge la cuesta de la derecha por {way_name}","destination":"Coge la cuesta de la derecha hacia {destination}"}},"rotary":{"default":{"default":{"default":"Incorpórate en la rotonda","name":"En la rotonda sal por {way_name}","destination":"En la rotonda sal hacia {destination}"},"name":{"default":"En {rotary_name}","name":"En {rotary_name} sal por {way_name}","destination":"En {rotary_name} sal hacia {destination}"},"exit":{"default":"En la rotonda toma la {exit_number} salida","name":"En la rotonda toma la {exit_number} salida por {way_name}","destination":"En la rotonda toma la {exit_number} salida hacia {destination}"},"name_exit":{"default":"En {rotary_name} toma la {exit_number} salida","name":"En {rotary_name} toma la {exit_number} salida por {way_name}","destination":"En {rotary_name} toma la {exit_number} salida hacia {destination}"}}},"roundabout":{"default":{"exit":{"default":"En la rotonda toma la {exit_number} salida","name":"En la rotonda toma la {exit_number} salida por {way_name}","destination":"En la rotonda toma la {exit_number} salida hacia {destination}"},"default":{"default":"Incorpórate en la rotonda","name":"Incorpórate en la rotonda y sal en {way_name}","destination":"Incorpórate en la rotonda y sal hacia {destination}"}}},"roundabout turn":{"default":{"default":"En la rotonda siga {modifier}","name":"En la rotonda siga {modifier} por {way_name}","destination":"En la rotonda siga {modifier} hacia {destination}"},"left":{"default":"En la rotonda gira a la izquierda","name":"En la rotonda gira a la izquierda por {way_name}","destination":"En la rotonda gira a la izquierda hacia {destination}"},"right":{"default":"En la rotonda gira a la derecha","name":"En la rotonda gira a la derecha por {way_name}","destination":"En la rotonda gira a la derecha hacia {destination}"},"straight":{"default":"En la rotonda continúa recto","name":"En la rotonda continúa recto por {way_name}","destination":"En la rotonda continúa recto hacia {destination}"}},"exit roundabout":{"default":{"default":"Sal la rotonda","name":"Toma la salida por {way_name}","destination":"Toma la salida hacia {destination}"}},"exit rotary":{"default":{"default":"Sal la rotonda","name":"Toma la salida por {way_name}","destination":"Toma la salida hacia {destination}"}},"turn":{"default":{"default":"Gira {modifier}","name":"Gira {modifier} por {way_name}","destination":"Gira {modifier} hacia {destination}"},"left":{"default":"Gira a la izquierda","name":"Gira a la izquierda por {way_name}","destination":"Gira a la izquierda hacia {destination}"},"right":{"default":"Gira a la derecha","name":"Gira a la derecha por {way_name}","destination":"Gira a la derecha hacia {destination}"},"straight":{"default":"Continúa recto","name":"Continúa recto por {way_name}","destination":"Continúa recto hacia {destination}"}},"use lane":{"no_lanes":{"default":"Continúa recto"},"default":{"default":"{lane_instruction}"}}};
var esES = {
	meta: meta$5,
	v5: v5$5
};

var esES$1 = Object.freeze({
	meta: meta$5,
	v5: v5$5,
	default: esES
});

const meta$6 = {"capitalizeFirstLetter":true};
const v5$6 = {"constants":{"ordinalize":{"1":"première","2":"seconde","3":"troisième","4":"quatrième","5":"cinquième","6":"sixième","7":"septième","8":"huitième","9":"neuvième","10":"dixième"},"direction":{"north":"le nord","northeast":"le nord-est","east":"l’est","southeast":"le sud-est","south":"le sud","southwest":"le sud-ouest","west":"l’ouest","northwest":"le nord-ouest"},"modifier":{"left":"à gauche","right":"à droite","sharp left":"franchement à gauche","sharp right":"franchement à droite","slight left":"légèrement à gauche","slight right":"légèrement à droite","straight":"tout droit","uturn":"demi-tour"},"lanes":{"xo":"Serrer à droite","ox":"Serrer à gauche","xox":"Rester au milieu","oxo":"Rester à gauche ou à droite"}},"modes":{"ferry":{"default":"Prendre le ferry","name":"Prendre le ferry {way_name}","destination":"Prendre le ferry en direction de {destination}"}},"phrase":{"two linked by distance":"{instruction_one}, puis, dans {distance}, {instruction_two}","two linked":"{instruction_one}, puis {instruction_two}","one in distance":"Dans {distance}, {instruction_one}","name and ref":"{name} ({ref})","exit with number":"sortie {exit}"},"arrive":{"default":{"default":"Vous êtes arrivés à votre {nth} destination","upcoming":"Vous arriverez à votre {nth} destination","short":"Vous êtes arrivés","short-upcoming":"Vous arriverez"},"left":{"default":"Vous êtes arrivés à votre {nth} destination, sur la gauche","upcoming":"Vous arriverez à votre {nth} destination, sur la gauche","short":"Vous êtes arrivés","short-upcoming":"Vous arriverez"},"right":{"default":"Vous êtes arrivés à votre {nth} destination, sur la droite","upcoming":"Vous arriverez à votre {nth} destination, sur la droite","short":"Vous êtes arrivés","short-upcoming":"Vous arriverez"},"sharp left":{"default":"Vous êtes arrivés à votre {nth} destination, sur la gauche","upcoming":"Vous arriverez à votre {nth} destination, sur la gauche","short":"Vous êtes arrivés","short-upcoming":"Vous arriverez"},"sharp right":{"default":"Vous êtes arrivés à votre {nth} destination, sur la droite","upcoming":"Vous arriverez à votre {nth} destination, sur la droite","short":"Vous êtes arrivés","short-upcoming":"Vous arriverez"},"slight right":{"default":"Vous êtes arrivés à votre {nth} destination, sur la droite","upcoming":"Vous arriverez à votre {nth} destination, sur la droite","short":"Vous êtes arrivés","short-upcoming":"Vous arriverez"},"slight left":{"default":"Vous êtes arrivés à votre {nth} destination, sur la gauche","upcoming":"Vous arriverez à votre {nth} destination, sur la gauche","short":"Vous êtes arrivés","short-upcoming":"Vous arriverez"},"straight":{"default":"Vous êtes arrivés à votre {nth} destination, droit devant","upcoming":"Vous arriverez à votre {nth} destination, droit devant","short":"Vous êtes arrivés","short-upcoming":"Vous arriverez"}},"continue":{"default":{"default":"Tourner {modifier}","name":"Tourner {modifier} pour rester {way_name}","destination":"Tourner {modifier} en direction de {destination}","exit":"Tourner {modifier} sur {way_name}"},"straight":{"default":"Continuer tout droit","name":"Continuer tout droit pour rester sur {way_name}","destination":"Continuer tout droit en direction de {destination}","distance":"Continuer tout droit sur {distance}","namedistance":"Continuer sur {way_name} sur {distance}"},"sharp left":{"default":"Braquer à gauche","name":"Braquer à gauche pour rester sur {way_name}","destination":"Braquer à gauche en direction de {destination}"},"sharp right":{"default":"Braquer à droite","name":"Braquer à droite pour rester sur {way_name}","destination":"Braquer à droite en direction de {destination}"},"slight left":{"default":"S’aligner légèrement à gauche","name":"S’aligner légèrement à gauche pour rester sur {way_name}","destination":"S’aligner légèrement à gauche en direction de {destination}"},"slight right":{"default":"S’aligner légèrement à droite","name":"S’aligner légèrement à droite pour rester sur {way_name}","destination":"S’aligner légèrement à droite en direction de {destination}"},"uturn":{"default":"Faire demi-tour","name":"Faire demi-tour et continuer sur {way_name}","destination":"Faire demi-tour en direction de {destination}"}},"depart":{"default":{"default":"Rouler vers {direction}","name":"Rouler vers {direction} sur {way_name}","namedistance":"Rouler vers {direction} sur {way_name} sur {distance}"}},"end of road":{"default":{"default":"Tourner {modifier}","name":"Tourner {modifier} sur {way_name}","destination":"Tourner {modifier} en direction de {destination}"},"straight":{"default":"Continuer tout droit","name":"Continuer tout droit sur {way_name}","destination":"Continuer tout droit en direction de {destination}"},"uturn":{"default":"Faire demi-tour à la fin de la route","name":"Faire demi-tour à la fin de la route {way_name}","destination":"Faire demi-tour à la fin de la route en direction de {destination}"}},"fork":{"default":{"default":"Rester {modifier} à l’embranchement","name":"Rester {modifier} à l’embranchement sur {way_name}","destination":"Rester {modifier} à l’embranchement en direction de {destination}"},"slight left":{"default":"Rester à gauche à l’embranchement","name":"Rester à gauche à l’embranchement sur {way_name}","destination":"Rester à gauche à l’embranchement en direction de {destination}"},"slight right":{"default":"Rester à droite à l’embranchement","name":"Rester à droite à l’embranchement sur {way_name}","destination":"Rester à droite à l’embranchement en direction de {destination}"},"sharp left":{"default":"Prendre franchement à gauche à l’embranchement","name":"Prendre franchement à gauche à l’embranchement sur {way_name}","destination":"Prendre franchement à gauche à l’embranchement en direction de {destination}"},"sharp right":{"default":"Prendre franchement à droite à l’embranchement","name":"Prendre franchement à droite à l’embranchement sur {way_name}","destination":"Prendre franchement à droite à l’embranchement en direction de {destination}"},"uturn":{"default":"Faire demi-tour","name":"Faire demi-tour sur {way_name}","destination":"Faire demi-tour en direction de {destination}"}},"merge":{"default":{"default":"Rejoindre {modifier}","name":"Rejoindre {modifier} sur {way_name}","destination":"Rejoindre {modifier} en direction de {destination}"},"straight":{"default":"S’insérer","name":"S’insérer sur {way_name}","destination":"S’insérer en direction de {destination}"},"slight left":{"default":"S’insérer légèrement à gauche","name":"S’insérer légèrement à gauche sur {way_name}","destination":"S’insérer légèrement à gauche en direction de {destination}"},"slight right":{"default":"S’insérer légèrement à droite","name":"S’insérer légèrement à droite sur {way_name}","destination":"S’insérer à droite en direction de {destination}"},"sharp left":{"default":"S’insérer à gauche","name":"S’insérer à gauche sur {way_name}","destination":"S’insérer à gauche en direction de {destination}"},"sharp right":{"default":"S’insérer à droite","name":"S’insérer à droite sur {way_name}","destination":"S’insérer à droite en direction de {destination}"},"uturn":{"default":"Faire demi-tour","name":"Faire demi-tour sur {way_name}","destination":"Faire demi-tour en direction de {destination}"}},"new name":{"default":{"default":"Continuer {modifier}","name":"Continuer {modifier} sur {way_name}","destination":"Continuer {modifier} en direction de {destination}"},"straight":{"default":"Continuer tout droit","name":"Continuer tout droit sur {way_name}","destination":"Continuer tout droit en direction de {destination}"},"sharp left":{"default":"Prendre franchement à gauche","name":"Prendre franchement à gauche sur {way_name}","destination":"Prendre franchement à gauche en direction de {destination}"},"sharp right":{"default":"Prendre franchement à droite","name":"Prendre franchement à droite sur {way_name}","destination":"Prendre franchement à droite en direction de {destination}"},"slight left":{"default":"Continuer légèrement à gauche","name":"Continuer légèrement à gauche sur {way_name}","destination":"Continuer légèrement à gauche en direction de {destination}"},"slight right":{"default":"Continuer légèrement à droite","name":"Continuer légèrement à droite sur {way_name}","destination":"Continuer légèrement à droite en direction de {destination}"},"uturn":{"default":"Faire demi-tour","name":"Faire demi-tour sur {way_name}","destination":"Faire demi-tour en direction de {destination}"}},"notification":{"default":{"default":"Continuer {modifier}","name":"Continuer {modifier} sur {way_name}","destination":"Continuer {modifier} en direction de {destination}"},"uturn":{"default":"Faire demi-tour","name":"Faire demi-tour sur {way_name}","destination":"Faire demi-tour en direction de {destination}"}},"off ramp":{"default":{"default":"Prendre la sortie","name":"Prendre la sortie sur {way_name}","destination":"Prendre la sortie en direction de {destination}","exit":"Prendre la sortie {exit}","exit_destination":"Prendre la sortie {exit} en direction de {destination}"},"left":{"default":"Prendre la sortie à gauche","name":"Prendre la sortie à gauche sur {way_name}","destination":"Prendre la sortie à gauche en direction de {destination}","exit":"Prendre la sortie {exit} sur la gauche","exit_destination":"Prendre la sortie {exit} sur la gauche en direction de {destination}"},"right":{"default":"Prendre la sortie à droite","name":"Prendre la sortie à droite sur {way_name}","destination":"Prendre la sortie à droite en direction de {destination}","exit":"Prendre la sortie {exit} sur la droite","exit_destination":"Prendre la sortie {exit} sur la droite en direction de {destination}"},"sharp left":{"default":"Prendre la sortie à gauche","name":"Prendre la sortie à gauche sur {way_name}","destination":"Prendre la sortie à gauche en direction de {destination}","exit":"Prendre la sortie {exit} sur la gauche","exit_destination":"Prendre la sortie {exit} sur la gauche en direction de {destination}"},"sharp right":{"default":"Prendre la sortie à droite","name":"Prendre la sortie à droite sur {way_name}","destination":"Prendre la sortie à droite en direction de {destination}","exit":"Prendre la sortie {exit} sur la droite","exit_destination":"Prendre la sortie {exit} sur la droite en direction de {destination}"},"slight left":{"default":"Prendre la sortie à gauche","name":"Prendre la sortie à gauche sur {way_name}","destination":"Prendre la sortie à gauche en direction de {destination}","exit":"Prendre la sortie {exit} sur la gauche","exit_destination":"Prendre la sortie {exit} sur la gauche en direction de {destination}"},"slight right":{"default":"Prendre la sortie à droite","name":"Prendre la sortie à droite sur {way_name}","destination":"Prendre la sortie à droite en direction de {destination}","exit":"Prendre la sortie {exit} sur la droite","exit_destination":"Prendre la sortie {exit} sur la droite en direction de {destination}"}},"on ramp":{"default":{"default":"Prendre la sortie","name":"Prendre la sortie sur {way_name}","destination":"Prendre la sortie en direction de {destination}"},"left":{"default":"Prendre la sortie à gauche","name":"Prendre la sortie à gauche sur {way_name}","destination":"Prendre la sortie à gauche en direction de {destination}"},"right":{"default":"Prendre la sortie à droite","name":"Prendre la sortie à droite sur {way_name}","destination":"Prendre la sortie à droite en direction de {destination}"},"sharp left":{"default":"Prendre la sortie à gauche","name":"Prendre la sortie à gauche sur {way_name}","destination":"Prendre la sortie à gauche en direction de {destination}"},"sharp right":{"default":"Prendre la sortie à droite","name":"Prendre la sortie à droite sur {way_name}","destination":"Prendre la sortie à droite en direction de {destination}"},"slight left":{"default":"Prendre la sortie à gauche","name":"Prendre la sortie à gauche sur {way_name}","destination":"Prendre la sortie à gauche en direction de {destination}"},"slight right":{"default":"Prendre la sortie à droite","name":"Prendre la sortie à droite sur {way_name}","destination":"Prendre la sortie à droite en direction de {destination}"}},"rotary":{"default":{"default":{"default":"Prendre le rond-point","name":"Prendre le rond-point et sortir sur {way_name}","destination":"Prendre le rond-point et sortir en direction de {destination}"},"name":{"default":"Prendre le rond-point {rotary_name}","name":"Prendre le rond-point {rotary_name} et sortir par {way_name}","destination":"Prendre le rond-point {rotary_name} et sortir en direction de {destination}"},"exit":{"default":"Prendre le rond-point et prendre la {exit_number} sortie","name":"Prendre le rond-point et prendre la {exit_number} sortie sur {way_name}","destination":"Prendre le rond-point et prendre la {exit_number} sortie en direction de {destination}"},"name_exit":{"default":"Prendre le rond-point {rotary_name} et prendre la {exit_number} sortie","name":"Prendre le rond-point {rotary_name} et prendre la {exit_number} sortie sur {way_name}","destination":"Prendre le rond-point {rotary_name} et prendre la {exit_number} sortie en direction de {destination}"}}},"roundabout":{"default":{"exit":{"default":"Prendre le rond-point et prendre la {exit_number} sortie","name":"Prendre le rond-point et prendre la {exit_number} sortie sur {way_name}","destination":"Prendre le rond-point et prendre la {exit_number} sortie en direction de {destination}"},"default":{"default":"Prendre le rond-point","name":"Prendre le rond-point et sortir sur {way_name}","destination":"Prendre le rond-point et sortir en direction de {destination}"}}},"roundabout turn":{"default":{"default":"Au rond-point, tourner {modifier}","name":"Au rond-point, tourner {modifier} sur {way_name}","destination":"Au rond-point, tourner {modifier} en direction de {destination}"},"left":{"default":"Au rond-point, tourner à gauche","name":"Au rond-point, tourner à gauche sur {way_name}","destination":"Au rond-point, tourner à gauche en direction de {destination}"},"right":{"default":"Au rond-point, tourner à droite","name":"Au rond-point, tourner à droite sur {way_name}","destination":"Au rond-point, tourner à droite en direction de {destination}"},"straight":{"default":"Au rond-point, continuer tout droit","name":"Au rond-point, continuer tout droit sur {way_name}","destination":"Au rond-point, continuer tout droit en direction de {destination}"}},"exit roundabout":{"default":{"default":"Sortir du rond-point","name":"Sortir du rond-point sur {way_name}","destination":"Sortir du rond-point en direction de {destination}"}},"exit rotary":{"default":{"default":"Sortir du rond-point","name":"Sortir du rond-point sur {way_name}","destination":"Sortir du rond-point en direction de {destination}"}},"turn":{"default":{"default":"Tourner {modifier}","name":"Tourner {modifier} sur {way_name}","destination":"Tourner {modifier} en direction de {destination}"},"left":{"default":"Tourner à gauche","name":"Tourner à gauche sur {way_name}","destination":"Tourner à gauche en direction de {destination}"},"right":{"default":"Tourner à droite","name":"Tourner à droite sur {way_name}","destination":"Tourner à droite en direction de {destination}"},"straight":{"default":"Aller tout droit","name":"Aller tout droit sur {way_name}","destination":"Aller tout droit en direction de {destination}"}},"use lane":{"no_lanes":{"default":"Continuer tout droit"},"default":{"default":"{lane_instruction}"}}};
var fr = {
	meta: meta$6,
	v5: v5$6
};

var fr$1 = Object.freeze({
	meta: meta$6,
	v5: v5$6,
	default: fr
});

const meta$7 = {"capitalizeFirstLetter":true};
const v5$7 = {"constants":{"ordinalize":{"1":"ראשונה","2":"שניה","3":"שלישית","4":"רביעית","5":"חמישית","6":"שישית","7":"שביעית","8":"שמינית","9":"תשיעית","10":"עשירית"},"direction":{"north":"צפון","northeast":"צפון מזרח","east":"מזרח","southeast":"דרום מזרח","south":"דרום","southwest":"דרום מערב","west":"מערב","northwest":"צפון מערב"},"modifier":{"left":"שמאלה","right":"ימינה","sharp left":"חדה שמאלה","sharp right":"חדה ימינה","slight left":"קלה שמאלה","slight right":"קלה ימינה","straight":"ישר","uturn":"פניית פרסה"},"lanes":{"xo":"היצמד לימין","ox":"היצמד לשמאל","xox":"המשך בנתיב האמצעי","oxo":"היצמד לימין או לשמאל"}},"modes":{"ferry":{"default":"עלה על המעבורת","name":"עלה על המעבורת {way_name}","destination":"עלה על המעבורת לכיוון {destination}"}},"phrase":{"two linked by distance":"{instruction_one}, ואז, בעוד{distance}, {instruction_two}","two linked":"{instruction_one}, ואז {instruction_two}","one in distance":"בעוד {distance}, {instruction_one}","name and ref":"{name} ({ref})","exit with number":"exit {exit}"},"arrive":{"default":{"default":"הגעת אל היעד ה{nth} שלך","upcoming":"אתה תגיע אל היעד ה{nth} שלך","short":"הגעת","short-upcoming":"תגיע"},"left":{"default":"הגעת אל היעד ה{nth} שלך משמאלך","upcoming":"אתה תגיע אל היעד ה{nth} שלך משמאלך","short":"הגעת","short-upcoming":"תגיע"},"right":{"default":"הגעת אל היעד ה{nth} שלך מימינך","upcoming":"אתה תגיע אל היעד ה{nth} שלך מימינך","short":"הגעת","short-upcoming":"תגיע"},"sharp left":{"default":"הגעת אל היעד ה{nth} שלך משמאלך","upcoming":"אתה תגיע אל היעד ה{nth} שלך משמאלך","short":"הגעת","short-upcoming":"תגיע"},"sharp right":{"default":"הגעת אל היעד ה{nth} שלך מימינך","upcoming":"אתה תגיע אל היעד ה{nth} שלך מימינך","short":"הגעת","short-upcoming":"תגיע"},"slight right":{"default":"הגעת אל היעד ה{nth} שלך מימינך","upcoming":"אתה תגיע אל היעד ה{nth} שלך מימינך","short":"הגעת","short-upcoming":"תגיע"},"slight left":{"default":"הגעת אל היעד ה{nth} שלך משמאלך","upcoming":"אתה תגיע אל היעד ה{nth} שלך משמאלך","short":"הגעת","short-upcoming":"תגיע"},"straight":{"default":"הגעת אל היעד ה{nth} שלך, בהמשך","upcoming":"אתה תגיע אל היעד ה{nth} שלך, בהמשך","short":"הגעת","short-upcoming":"תגיע"}},"continue":{"default":{"default":"פנה {modifier}","name":"פנה {modifier} כדי להישאר ב{way_name}","destination":"פנה {modifier} לכיוון {destination}","exit":"פנה {modifier} על {way_name}"},"straight":{"default":"המשך ישר","name":"המשך ישר כדי להישאר על {way_name}","destination":"המשך לכיוון {destination}","distance":"המשך ישר לאורך {distance}","namedistance":"המשך על {way_name} לאורך {distance}"},"sharp left":{"default":"פנה בחדות שמאלה","name":"פנה בחדות שמאלה כדי להישאר על {way_name}","destination":"פנה בחדות שמאלה לכיוון {destination}"},"sharp right":{"default":"פנה בחדות ימינה","name":"פנה בחדות ימינה כדי להישאר על {way_name}","destination":"פנה בחדות ימינה לכיוון {destination}"},"slight left":{"default":"פנה קלות שמאלה","name":"פנה קלות שמאלה כדי להישאר על {way_name}","destination":"פנה קלות שמאלה לכיוון {destination}"},"slight right":{"default":"פנה קלות ימינה","name":"פנה קלות ימינה כדי להישאר על {way_name}","destination":"פנה קלות ימינה לכיוון {destination}"},"uturn":{"default":"פנה פניית פרסה","name":"פנה פניית פרסה והמשך על {way_name}","destination":"פנה פניית פרסה לכיוון {destination}"}},"depart":{"default":{"default":"התכוונן {direction}","name":"התכוונן {direction} על {way_name}","namedistance":"התכוונן {direction} על {way_name} לאורך {distance}"}},"end of road":{"default":{"default":"פנה {modifier}","name":"פנה {modifier} על {way_name}","destination":"פנה {modifier} לכיוון {destination}"},"straight":{"default":"המשך ישר","name":"המשך ישר על {way_name}","destination":"המשך ישר לכיוון {destination}"},"uturn":{"default":"פנה פניית פרסה בסוף הדרך","name":"פנה פניית פרסה על {way_name} בסוף הדרך","destination":"פנה פניית פרסה לכיוון {destination} בסוף הדרך"}},"fork":{"default":{"default":"היצמד {modifier} בהתפצלות","name":"היצמד {modifier} על {way_name}","destination":"היצמד {modifier} לכיוון {destination}"},"slight left":{"default":"היצמד לשמאל בהתפצלות","name":"היצמד לשמאל על {way_name}","destination":"היצמד לשמאל לכיוון {destination}"},"slight right":{"default":"היצמד ימינה בהתפצלות","name":"היצמד לימין על {way_name}","destination":"היצמד לימין לכיוון {destination}"},"sharp left":{"default":"פנה בחדות שמאלה בהתפצלות","name":"פנה בחדות שמאלה על {way_name}","destination":"פנה בחדות שמאלה לכיוון {destination}"},"sharp right":{"default":"פנה בחדות ימינה בהתפצלות","name":"פנה בחדות ימינה על {way_name}","destination":"פנה בחדות ימינה לכיוון {destination}"},"uturn":{"default":"פנה פניית פרסה","name":"פנה פניית פרסה על {way_name}","destination":"פנה פניית פרסה לכיוון {destination}"}},"merge":{"default":{"default":"השתלב {modifier}","name":"השתלב {modifier} על {way_name}","destination":"השתלב {modifier} לכיוון {destination}"},"straight":{"default":"השתלב","name":"השתלב על {way_name}","destination":"השתלב לכיוון {destination}"},"slight left":{"default":"השתלב שמאלה","name":"השתלב שמאלה על {way_name}","destination":"השתלב שמאלה לכיוון {destination}"},"slight right":{"default":"השתלב ימינה","name":"השתלב ימינה על {way_name}","destination":"השתלב ימינה לכיוון {destination}"},"sharp left":{"default":"השתלב שמאלה","name":"השתלב שמאלה על {way_name}","destination":"השתלב שמאלה לכיוון {destination}"},"sharp right":{"default":"השתלב ימינה","name":"השתלב ימינה על {way_name}","destination":"השתלב ימינה לכיוון {destination}"},"uturn":{"default":"פנה פניית פרסה","name":"פנה פניית פרסה על {way_name}","destination":"פנה פניית פרסה לכיוון {destination}"}},"new name":{"default":{"default":"המשך {modifier}","name":"המשך {modifier} על {way_name}","destination":"המשך {modifier} לכיוון {destination}"},"straight":{"default":"המשך ישר","name":"המשך על {way_name}","destination":"המשך לכיוון {destination}"},"sharp left":{"default":"פנה בחדות שמאלה","name":"פנה בחדות שמאלה על {way_name}","destination":"פנה בחדות שמאלה לכיוון {destination}"},"sharp right":{"default":"פנה בחדות ימינה","name":"פנה בחדות ימינה על {way_name}","destination":"פנה בחדות ימינה לכיוון {destination}"},"slight left":{"default":"המשך בנטייה קלה שמאלה","name":"המשך בנטייה קלה שמאלה על {way_name}","destination":"המשך בנטייה קלה שמאלה לכיוון {destination}"},"slight right":{"default":"המשך בנטייה קלה ימינה","name":"המשך בנטייה קלה ימינה על {way_name}","destination":"המשך בנטייה קלה ימינה לכיוון {destination}"},"uturn":{"default":"פנה פניית פרסה","name":"פנה פניית פרסה על {way_name}","destination":"פנה פניית פרסה לכיוון {destination}"}},"notification":{"default":{"default":"המשך {modifier}","name":"המשך {modifier} על {way_name}","destination":"המשך {modifier} לכיוון {destination}"},"uturn":{"default":"פנה פניית פרסה","name":"פנה פניית פרסה על {way_name}","destination":"פנה פניית פרסה לכיוון {destination}"}},"off ramp":{"default":{"default":"צא ביציאה","name":"צא ביציאה על {way_name}","destination":"צא ביציאה לכיוון {destination}","exit":"צא ביציאה {exit}","exit_destination":"צא ביציאה {exit} לכיוון {destination}"},"left":{"default":"צא ביציאה שמשמאלך","name":"צא ביציאה שמשמאלך על {way_name}","destination":"צא ביציאה שמשמאלך לכיוון {destination}","exit":"צא ביציאה {exit} משמאלך","exit_destination":"צא ביציאה {exit} משמאלך לכיוון {destination}"},"right":{"default":"צא ביציאה שמימינך","name":"צא ביציאה שמימינך על {way_name}","destination":"צא ביציאה שמימינך לכיוון {destination}","exit":"צא ביציאה {exit} מימינך","exit_destination":"צא ביציאה {exit} מימינך לכיוון {destination}"},"sharp left":{"default":"צא ביציאה שבשמאלך","name":"צא ביציאה שמשמאלך על {way_name}","destination":"צא ביציאה שמשמאלך לכיוון {destination}","exit":"צא ביציאה {exit} משמאלך","exit_destination":"צא ביציאה {exit} משמאלך לכיוון {destination}"},"sharp right":{"default":"צא ביציאה שמימינך","name":"צא ביציאה שמימינך על {way_name}","destination":"צא ביציאה שמימינך לכיוון {destination}","exit":"צא ביציאה {exit} מימינך","exit_destination":"צא ביציאה {exit} מימינך לכיוון {destination}"},"slight left":{"default":"צא ביציאה שבשמאלך","name":"צא ביציאה שמשמאלך על {way_name}","destination":"צא ביציאה שמשמאלך לכיוון {destination}","exit":"צא ביציאה {exit} משמאלך","exit_destination":"צא ביציאה {exit} משמאלך לכיוון {destination}"},"slight right":{"default":"צא ביציאה שמימינך","name":"צא ביציאה שמימינך על {way_name}","destination":"צא ביציאה שמימינך לכיוון {destination}","exit":"צא ביציאה {exit} מימינך","exit_destination":"צא ביציאה {exit} מימינך לכיוון {destination}"}},"on ramp":{"default":{"default":"צא ביציאה","name":"צא ביציאה על {way_name}","destination":"צא ביציאה לכיוון {destination}"},"left":{"default":"צא ביציאה שבשמאלך","name":"צא ביציאה שמשמאלך על {way_name}","destination":"צא ביציאה שמשמאלך לכיוון {destination}"},"right":{"default":"צא ביציאה שמימינך","name":"צא ביציאה שמימינך על {way_name}","destination":"צא ביציאה שמימינך לכיוון {destination}"},"sharp left":{"default":"צא ביציאה שבשמאלך","name":"צא ביציאה שמשמאלך על {way_name}","destination":"צא ביציאה שמשמאלך לכיוון {destination}"},"sharp right":{"default":"צא ביציאה שמימינך","name":"צא ביציאה שמימינך על {way_name}","destination":"צא ביציאה שמימינך לכיוון {destination}"},"slight left":{"default":"צא ביציאה שבשמאלך","name":"צא ביציאה שמשמאלך על {way_name}","destination":"צא ביציאה שמשמאלך לכיוון {destination}"},"slight right":{"default":"צא ביציאה שמימינך","name":"צא ביציאה שמימינך על {way_name}","destination":"צא ביציאה שמימינך לכיוון {destination}"}},"rotary":{"default":{"default":{"default":"השתלב במעגל התנועה","name":"השתלב במעגל התנועה וצא על {way_name}","destination":"השתלב במעגל התנועה וצא לכיוון {destination}"},"name":{"default":"היכנס ל{rotary_name}","name":"היכנס ל{rotary_name} וצא על {way_name}","destination":"היכנס ל{rotary_name} וצא לכיוון {destination}"},"exit":{"default":"השתלב במעגל התנועה וצא ביציאה {exit_number}","name":"השתלב במעגל התנועה וצא ביציאה {exit_number} ל{way_name}","destination":"השתלב במעגל התנועה וצא ביציאה {exit_number} לכיוון {destination}"},"name_exit":{"default":"היכנס ל{rotary_name} וצא ביציאה ה{exit_number}","name":"היכנס ל{rotary_name} וצא ביציאה ה{exit_number} ל{way_name}","destination":"היכנס ל{rotary_name} וצא ביציאה ה{exit_number} לכיוון {destination}"}}},"roundabout":{"default":{"exit":{"default":"השתלב במעגל התנועה וצא ביציאה {exit_number}","name":"השתלב במעגל התנועה וצא ביציאה {exit_number} ל{way_name}","destination":"השתלב במעגל התנועה וצא ביציאה {exit_number} לכיוון {destination}"},"default":{"default":"השתלב במעגל התנועה","name":"השתלב במעגל התנועה וצא על {way_name}","destination":"השתלב במעגל התנועה וצא לכיוון {destination}"}}},"roundabout turn":{"default":{"default":"פנה {modifier}","name":"פנה {modifier} על {way_name}","destination":"פנה {modifier} לכיוון {destination}"},"left":{"default":"פנה שמאלה","name":"פנה שמאלה ל{way_name}","destination":"פנה שמאלה לכיוון {destination}"},"right":{"default":"פנה ימינה","name":"פנה ימינה ל{way_name}","destination":"פנה ימינה לכיוון {destination}"},"straight":{"default":"המשך ישר","name":"המשך ישר על {way_name}","destination":"המשך ישר לכיוון {destination}"}},"exit roundabout":{"default":{"default":"צא ממעגל התנועה","name":"צא ממעגל התנועה ל{way_name}","destination":"צא ממעגל התנועה לכיוון {destination}"}},"exit rotary":{"default":{"default":"צא ממעגל התנועה","name":"צא ממעגל התנועה ל{way_name}","destination":"צא ממעגל התנועה לכיוון {destination}"}},"turn":{"default":{"default":"פנה {modifier}","name":"פנה {modifier} על {way_name}","destination":"פנה {modifier} לכיוון {destination}"},"left":{"default":"פנה שמאלה","name":"פנה שמאלה ל{way_name}","destination":"פנה שמאלה לכיוון {destination}"},"right":{"default":"פנה ימינה","name":"פנה ימינה ל{way_name}","destination":"פנה ימינה לכיוון {destination}"},"straight":{"default":"המשך ישר","name":"המשך ישר ל{way_name}","destination":"המשך ישר לכיוון {destination}"}},"use lane":{"no_lanes":{"default":"המשך ישר"},"default":{"default":"{lane_instruction}"}}};
var he = {
	meta: meta$7,
	v5: v5$7
};

var he$1 = Object.freeze({
	meta: meta$7,
	v5: v5$7,
	default: he
});

const meta$8 = {"capitalizeFirstLetter":true};
const v5$8 = {"constants":{"ordinalize":{"1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","10":"10"},"direction":{"north":"utara","northeast":"timur laut","east":"timur","southeast":"tenggara","south":"selatan","southwest":"barat daya","west":"barat","northwest":"barat laut"},"modifier":{"left":"kiri","right":"kanan","sharp left":"tajam kiri","sharp right":"tajam kanan","slight left":"agak ke kiri","slight right":"agak ke kanan","straight":"lurus","uturn":"putar balik"},"lanes":{"xo":"Tetap di kanan","ox":"Tetap di kiri","xox":"Tetap di tengah","oxo":"Tetap di kiri atau kanan"}},"modes":{"ferry":{"default":"Naik ferry","name":"Naik ferry di {way_name}","destination":"Naik ferry menuju {destination}"}},"phrase":{"two linked by distance":"{instruction_one}, then, in {distance}, {instruction_two}","two linked":"{instruction_one}, then {instruction_two}","one in distance":"In {distance}, {instruction_one}","name and ref":"{name} ({ref})","exit with number":"exit {exit}"},"arrive":{"default":{"default":"Anda telah tiba di tujuan ke-{nth}","upcoming":"Anda telah tiba di tujuan ke-{nth}","short":"Anda telah tiba di tujuan ke-{nth}","short-upcoming":"Anda telah tiba di tujuan ke-{nth}"},"left":{"default":"Anda telah tiba di tujuan ke-{nth}, di sebelah kiri","upcoming":"Anda telah tiba di tujuan ke-{nth}, di sebelah kiri","short":"Anda telah tiba di tujuan ke-{nth}","short-upcoming":"Anda telah tiba di tujuan ke-{nth}"},"right":{"default":"Anda telah tiba di tujuan ke-{nth}, di sebelah kanan","upcoming":"Anda telah tiba di tujuan ke-{nth}, di sebelah kanan","short":"Anda telah tiba di tujuan ke-{nth}","short-upcoming":"Anda telah tiba di tujuan ke-{nth}"},"sharp left":{"default":"Anda telah tiba di tujuan ke-{nth}, di sebelah kiri","upcoming":"Anda telah tiba di tujuan ke-{nth}, di sebelah kiri","short":"Anda telah tiba di tujuan ke-{nth}","short-upcoming":"Anda telah tiba di tujuan ke-{nth}"},"sharp right":{"default":"Anda telah tiba di tujuan ke-{nth}, di sebelah kanan","upcoming":"Anda telah tiba di tujuan ke-{nth}, di sebelah kanan","short":"Anda telah tiba di tujuan ke-{nth}","short-upcoming":"Anda telah tiba di tujuan ke-{nth}"},"slight right":{"default":"Anda telah tiba di tujuan ke-{nth}, di sebelah kanan","upcoming":"Anda telah tiba di tujuan ke-{nth}, di sebelah kanan","short":"Anda telah tiba di tujuan ke-{nth}","short-upcoming":"Anda telah tiba di tujuan ke-{nth}"},"slight left":{"default":"Anda telah tiba di tujuan ke-{nth}, di sebelah kiri","upcoming":"Anda telah tiba di tujuan ke-{nth}, di sebelah kiri","short":"Anda telah tiba di tujuan ke-{nth}","short-upcoming":"Anda telah tiba di tujuan ke-{nth}"},"straight":{"default":"Anda telah tiba di tujuan ke-{nth}, lurus saja","upcoming":"Anda telah tiba di tujuan ke-{nth}, lurus saja","short":"Anda telah tiba di tujuan ke-{nth}","short-upcoming":"Anda telah tiba di tujuan ke-{nth}"}},"continue":{"default":{"default":"Belok {modifier}","name":"Terus {modifier} ke {way_name}","destination":"Belok {modifier} menuju {destination}","exit":"Belok {modifier} ke {way_name}"},"straight":{"default":"Lurus terus","name":"Terus ke {way_name}","destination":"Terus menuju {destination}","distance":"Continue straight for {distance}","namedistance":"Continue on {way_name} for {distance}"},"sharp left":{"default":"Belok kiri tajam","name":"Make a sharp left to stay on {way_name}","destination":"Belok kiri tajam menuju {destination}"},"sharp right":{"default":"Belok kanan tajam","name":"Make a sharp right to stay on {way_name}","destination":"Belok kanan tajam menuju {destination}"},"slight left":{"default":"Tetap agak di kiri","name":"Tetap agak di kiri ke {way_name}","destination":"Tetap agak di kiri menuju {destination}"},"slight right":{"default":"Tetap agak di kanan","name":"Tetap agak di kanan ke {way_name}","destination":"Tetap agak di kanan menuju {destination}"},"uturn":{"default":"Putar balik","name":"Putar balik ke arah {way_name}","destination":"Putar balik menuju {destination}"}},"depart":{"default":{"default":"Arah {direction}","name":"Arah {direction} di {way_name}","namedistance":"Head {direction} on {way_name} for {distance}"}},"end of road":{"default":{"default":"Belok {modifier}","name":"Belok {modifier} ke {way_name}","destination":"Belok {modifier} menuju {destination}"},"straight":{"default":"Lurus terus","name":"Tetap lurus ke {way_name} ","destination":"Tetap lurus menuju {destination}"},"uturn":{"default":"Putar balik di akhir jalan","name":"Putar balik di {way_name} di akhir jalan","destination":"Putar balik menuju {destination} di akhir jalan"}},"fork":{"default":{"default":"Tetap {modifier} di pertigaan","name":"Tetap {modifier} di pertigaan ke {way_name}","destination":"Tetap {modifier} di pertigaan menuju {destination}"},"slight left":{"default":"Tetap di kiri pada pertigaan","name":"Tetap di kiri pada pertigaan ke arah {way_name}","destination":"Tetap di kiri pada pertigaan menuju {destination}"},"slight right":{"default":"Tetap di kanan pada pertigaan","name":"Tetap di kanan pada pertigaan ke arah {way_name}","destination":"Tetap di kanan pada pertigaan menuju {destination}"},"sharp left":{"default":"Belok kiri pada pertigaan","name":"Belok kiri pada pertigaan ke arah {way_name}","destination":"Belok kiri pada pertigaan menuju {destination}"},"sharp right":{"default":"Belok kanan pada pertigaan","name":"Belok kanan pada pertigaan ke arah {way_name}","destination":"Belok kanan pada pertigaan menuju {destination}"},"uturn":{"default":"Putar balik","name":"Putar balik ke arah {way_name}","destination":"Putar balik menuju {destination}"}},"merge":{"default":{"default":"Bergabung {modifier}","name":"Bergabung {modifier} ke arah {way_name}","destination":"Bergabung {modifier} menuju {destination}"},"straight":{"default":"Bergabung lurus","name":"Bergabung lurus ke arah {way_name}","destination":"Bergabung lurus menuju {destination}"},"slight left":{"default":"Bergabung di kiri","name":"Bergabung di kiri ke arah {way_name}","destination":"Bergabung di kiri menuju {destination}"},"slight right":{"default":"Bergabung di kanan","name":"Bergabung di kanan ke arah {way_name}","destination":"Bergabung di kanan menuju {destination}"},"sharp left":{"default":"Bergabung di kiri","name":"Bergabung di kiri ke arah {way_name}","destination":"Bergabung di kiri menuju {destination}"},"sharp right":{"default":"Bergabung di kanan","name":"Bergabung di kanan ke arah {way_name}","destination":"Bergabung di kanan menuju {destination}"},"uturn":{"default":"Putar balik","name":"Putar balik ke arah {way_name}","destination":"Putar balik menuju {destination}"}},"new name":{"default":{"default":"Lanjutkan {modifier}","name":"Lanjutkan {modifier} menuju {way_name}","destination":"Lanjutkan {modifier} menuju {destination}"},"straight":{"default":"Lurus terus","name":"Terus ke {way_name}","destination":"Terus menuju {destination}"},"sharp left":{"default":"Belok kiri tajam","name":"Belok kiri tajam ke arah {way_name}","destination":"Belok kiri tajam menuju {destination}"},"sharp right":{"default":"Belok kanan tajam","name":"Belok kanan tajam ke arah {way_name}","destination":"Belok kanan tajam menuju {destination}"},"slight left":{"default":"Lanjut dengan agak ke kiri","name":"Lanjut dengan agak di kiri ke {way_name}","destination":"Tetap agak di kiri menuju {destination}"},"slight right":{"default":"Tetap agak di kanan","name":"Tetap agak di kanan ke {way_name}","destination":"Tetap agak di kanan menuju {destination}"},"uturn":{"default":"Putar balik","name":"Putar balik ke arah {way_name}","destination":"Putar balik menuju {destination}"}},"notification":{"default":{"default":"Lanjutkan {modifier}","name":"Lanjutkan {modifier} menuju {way_name}","destination":"Lanjutkan {modifier} menuju {destination}"},"uturn":{"default":"Putar balik","name":"Putar balik ke arah {way_name}","destination":"Putar balik menuju {destination}"}},"off ramp":{"default":{"default":"Ambil jalan melandai","name":"Ambil jalan melandai ke {way_name}","destination":"Ambil jalan melandai menuju {destination}","exit":"Take exit {exit}","exit_destination":"Take exit {exit} towards {destination}"},"left":{"default":"Ambil jalan yang melandai di sebelah kiri","name":"Ambil jalan melandai di sebelah kiri ke arah {way_name}","destination":"Ambil jalan melandai di sebelah kiri menuju {destination}","exit":"Take exit {exit} on the left","exit_destination":"Take exit {exit} on the left towards {destination}"},"right":{"default":"Ambil jalan melandai di sebelah kanan","name":"Ambil jalan melandai di sebelah kanan ke {way_name}","destination":"Ambil jalan melandai di sebelah kanan menuju {destination}","exit":"Take exit {exit} on the right","exit_destination":"Take exit {exit} on the right towards {destination}"},"sharp left":{"default":"Ambil jalan yang melandai di sebelah kiri","name":"Ambil jalan melandai di sebelah kiri ke arah {way_name}","destination":"Ambil jalan melandai di sebelah kiri menuju {destination}","exit":"Take exit {exit} on the left","exit_destination":"Take exit {exit} on the left towards {destination}"},"sharp right":{"default":"Ambil jalan melandai di sebelah kanan","name":"Ambil jalan melandai di sebelah kanan ke {way_name}","destination":"Ambil jalan melandai di sebelah kanan menuju {destination}","exit":"Take exit {exit} on the right","exit_destination":"Take exit {exit} on the right towards {destination}"},"slight left":{"default":"Ambil jalan yang melandai di sebelah kiri","name":"Ambil jalan melandai di sebelah kiri ke arah {way_name}","destination":"Ambil jalan melandai di sebelah kiri menuju {destination}","exit":"Take exit {exit} on the left","exit_destination":"Take exit {exit} on the left towards {destination}"},"slight right":{"default":"Ambil jalan melandai di sebelah kanan","name":"Ambil jalan melandai di sebelah kanan ke {way_name}","destination":"Ambil jalan melandai di sebelah kanan  menuju {destination}","exit":"Take exit {exit} on the right","exit_destination":"Take exit {exit} on the right towards {destination}"}},"on ramp":{"default":{"default":"Ambil jalan melandai","name":"Ambil jalan melandai ke {way_name}","destination":"Ambil jalan melandai menuju {destination}"},"left":{"default":"Ambil jalan yang melandai di sebelah kiri","name":"Ambil jalan melandai di sebelah kiri ke arah {way_name}","destination":"Ambil jalan melandai di sebelah kiri menuju {destination}"},"right":{"default":"Ambil jalan melandai di sebelah kanan","name":"Ambil jalan melandai di sebelah kanan ke {way_name}","destination":"Ambil jalan melandai di sebelah kanan  menuju {destination}"},"sharp left":{"default":"Ambil jalan yang melandai di sebelah kiri","name":"Ambil jalan melandai di sebelah kiri ke arah {way_name}","destination":"Ambil jalan melandai di sebelah kiri menuju {destination}"},"sharp right":{"default":"Ambil jalan melandai di sebelah kanan","name":"Ambil jalan melandai di sebelah kanan ke {way_name}","destination":"Ambil jalan melandai di sebelah kanan  menuju {destination}"},"slight left":{"default":"Ambil jalan yang melandai di sebelah kiri","name":"Ambil jalan melandai di sebelah kiri ke arah {way_name}","destination":"Ambil jalan melandai di sebelah kiri menuju {destination}"},"slight right":{"default":"Ambil jalan melandai di sebelah kanan","name":"Ambil jalan melandai di sebelah kanan ke {way_name}","destination":"Ambil jalan melandai di sebelah kanan  menuju {destination}"}},"rotary":{"default":{"default":{"default":"Masuk bundaran","name":"Masuk bundaran dan keluar arah {way_name}","destination":"Masuk bundaran dan keluar menuju {destination}"},"name":{"default":"Masuk {rotary_name}","name":"Masuk {rotary_name} dan keluar arah {way_name}","destination":"Masuk {rotary_name} dan keluar menuju {destination}"},"exit":{"default":"Masuk bundaran dan ambil jalan keluar {exit_number}","name":"Masuk bundaran dan ambil jalan keluar {exit_number} arah {way_name}","destination":"Masuk bundaran dan ambil jalan keluar {exit_number} menuju {destination}"},"name_exit":{"default":"Masuk {rotary_name} dan ambil jalan keluar {exit_number}","name":"Masuk {rotary_name} dan ambil jalan keluar {exit_number} arah {way_name}","destination":"Masuk {rotary_name} dan ambil jalan keluar {exit_number} menuju {destination}"}}},"roundabout":{"default":{"exit":{"default":"Masuk bundaran dan ambil jalan keluar {exit_number}","name":"Masuk bundaran dan ambil jalan keluar {exit_number} arah {way_name}","destination":"Masuk bundaran dan ambil jalan keluar {exit_number} menuju {destination}"},"default":{"default":"Masuk bundaran","name":"Masuk bundaran dan keluar arah {way_name}","destination":"Masuk bundaran dan keluar menuju {destination}"}}},"roundabout turn":{"default":{"default":"Di bundaran, lakukan {modifier}","name":"Di bundaran, lakukan {modifier} ke arah {way_name}","destination":"Di bundaran, lakukan {modifier} menuju {destination}"},"left":{"default":"Di bundaran belok kiri","name":"Di bundaran, belok kiri arah {way_name}","destination":"Di bundaran, belok kiri menuju {destination}"},"right":{"default":"Di bundaran belok kanan","name":"Di bundaran belok kanan ke arah {way_name}","destination":"Di bundaran belok kanan menuju {destination}"},"straight":{"default":"Di bundaran tetap lurus","name":"Di bundaran tetap lurus ke arah {way_name}","destination":"Di bundaran tetap lurus menuju {destination}"}},"exit roundabout":{"default":{"default":"Lakukan {modifier}","name":"Lakukan {modifier} ke arah {way_name}","destination":"Lakukan {modifier} menuju {destination}"},"left":{"default":"Belok kiri","name":"Belok kiri ke {way_name}","destination":"Belok kiri menuju {destination}"},"right":{"default":"Belok kanan","name":"Belok kanan ke {way_name}","destination":"Belok kanan menuju {destination}"},"straight":{"default":"Lurus","name":"Lurus arah {way_name}","destination":"Lurus menuju {destination}"}},"exit rotary":{"default":{"default":"Lakukan {modifier}","name":"Lakukan {modifier} ke arah {way_name}","destination":"Lakukan {modifier} menuju {destination}"},"left":{"default":"Belok kiri","name":"Belok kiri ke {way_name}","destination":"Belok kiri menuju {destination}"},"right":{"default":"Belok kanan","name":"Belok kanan ke {way_name}","destination":"Belok kanan menuju {destination}"},"straight":{"default":"Lurus","name":"Lurus arah {way_name}","destination":"Lurus menuju {destination}"}},"turn":{"default":{"default":"Lakukan {modifier}","name":"Lakukan {modifier} ke arah {way_name}","destination":"Lakukan {modifier} menuju {destination}"},"left":{"default":"Belok kiri","name":"Belok kiri ke {way_name}","destination":"Belok kiri menuju {destination}"},"right":{"default":"Belok kanan","name":"Belok kanan ke {way_name}","destination":"Belok kanan menuju {destination}"},"straight":{"default":"Lurus","name":"Lurus arah {way_name}","destination":"Lurus menuju {destination}"}},"use lane":{"no_lanes":{"default":"Lurus terus"},"default":{"default":"{lane_instruction}"}}};
var id = {
	meta: meta$8,
	v5: v5$8
};

var id$1 = Object.freeze({
	meta: meta$8,
	v5: v5$8,
	default: id
});

const meta$9 = {"capitalizeFirstLetter":true};
const v5$9 = {"constants":{"ordinalize":{"1":"1ª","2":"2ª","3":"3ª","4":"4ª","5":"5ª","6":"6ª","7":"7ª","8":"8ª","9":"9ª","10":"10ª"},"direction":{"north":"nord","northeast":"nord-est","east":"est","southeast":"sud-est","south":"sud","southwest":"sud-ovest","west":"ovest","northwest":"nord-ovest"},"modifier":{"left":"sinistra","right":"destra","sharp left":"sinistra","sharp right":"destra","slight left":"sinistra leggermente","slight right":"destra leggermente","straight":"dritto","uturn":"inversione a U"},"lanes":{"xo":"Mantieni la destra","ox":"Mantieni la sinistra","xox":"Rimani in mezzo","oxo":"Mantieni la destra o la sinistra"}},"modes":{"ferry":{"default":"Prendi il traghetto","name":"Prendi il traghetto {way_name}","destination":"Prendi il traghetto verso {destination}"}},"phrase":{"two linked by distance":"{instruction_one}, poi tra {distance},{instruction_two}","two linked":"{instruction_one}, poi {instruction_two}","one in distance":"tra {distance} {instruction_one}","name and ref":"{name} ({ref})","exit with number":"exit {exit}"},"arrive":{"default":{"default":"Sei arrivato alla tua {nth} destinazione","upcoming":"Sei arrivato alla tua {nth} destinazione","short":"Sei arrivato alla tua {nth} destinazione","short-upcoming":"Sei arrivato alla tua {nth} destinazione"},"left":{"default":"sei arrivato alla tua {nth} destinazione, sulla sinistra","upcoming":"sei arrivato alla tua {nth} destinazione, sulla sinistra","short":"Sei arrivato alla tua {nth} destinazione","short-upcoming":"Sei arrivato alla tua {nth} destinazione"},"right":{"default":"sei arrivato alla tua {nth} destinazione, sulla destra","upcoming":"sei arrivato alla tua {nth} destinazione, sulla destra","short":"Sei arrivato alla tua {nth} destinazione","short-upcoming":"Sei arrivato alla tua {nth} destinazione"},"sharp left":{"default":"sei arrivato alla tua {nth} destinazione, sulla sinistra","upcoming":"sei arrivato alla tua {nth} destinazione, sulla sinistra","short":"Sei arrivato alla tua {nth} destinazione","short-upcoming":"Sei arrivato alla tua {nth} destinazione"},"sharp right":{"default":"sei arrivato alla tua {nth} destinazione, sulla destra","upcoming":"sei arrivato alla tua {nth} destinazione, sulla destra","short":"Sei arrivato alla tua {nth} destinazione","short-upcoming":"Sei arrivato alla tua {nth} destinazione"},"slight right":{"default":"sei arrivato alla tua {nth} destinazione, sulla destra","upcoming":"sei arrivato alla tua {nth} destinazione, sulla destra","short":"Sei arrivato alla tua {nth} destinazione","short-upcoming":"Sei arrivato alla tua {nth} destinazione"},"slight left":{"default":"sei arrivato alla tua {nth} destinazione, sulla sinistra","upcoming":"sei arrivato alla tua {nth} destinazione, sulla sinistra","short":"Sei arrivato alla tua {nth} destinazione","short-upcoming":"Sei arrivato alla tua {nth} destinazione"},"straight":{"default":"sei arrivato alla tua {nth} destinazione, si trova davanti a te","upcoming":"sei arrivato alla tua {nth} destinazione, si trova davanti a te","short":"Sei arrivato alla tua {nth} destinazione","short-upcoming":"Sei arrivato alla tua {nth} destinazione"}},"continue":{"default":{"default":"Gira a {modifier}","name":"Gira a {modifier} per stare su {way_name}","destination":"Gira a {modifier} verso {destination}","exit":"Gira a {modifier} in {way_name}"},"straight":{"default":"Continua dritto","name":"Continua dritto per stare su {way_name}","destination":"Continua verso {destination}","distance":"Continua dritto per {distance}","namedistance":"Continua su {way_name} per {distance}"},"sharp left":{"default":"Svolta a sinistra","name":"Fai una stretta curva a sinistra per stare su {way_name}","destination":"Svolta a sinistra verso {destination}"},"sharp right":{"default":"Svolta a destra","name":"Fau una stretta curva a destra per stare su {way_name}","destination":"Svolta a destra verso {destination}"},"slight left":{"default":"Fai una leggera curva a sinistra","name":"Fai una leggera curva a sinistra per stare su {way_name}","destination":"Fai una leggera curva a sinistra verso {destination}"},"slight right":{"default":"Fai una leggera curva a destra","name":"Fai una leggera curva a destra per stare su {way_name}","destination":"Fai una leggera curva a destra verso {destination}"},"uturn":{"default":"Fai un'inversione a U","name":"Fai un'inversione ad U poi continua su {way_name}","destination":"Fai un'inversione a U verso {destination}"}},"depart":{"default":{"default":"Continua verso {direction}","name":"Continua verso {direction} in {way_name}","namedistance":"Head {direction} on {way_name} for {distance}"}},"end of road":{"default":{"default":"Gira a {modifier}","name":"Gira a {modifier} in {way_name}","destination":"Gira a {modifier} verso {destination}"},"straight":{"default":"Continua dritto","name":"Continua dritto in {way_name}","destination":"Continua dritto verso {destination}"},"uturn":{"default":"Fai un'inversione a U alla fine della strada","name":"Fai un'inversione a U in {way_name} alla fine della strada","destination":"Fai un'inversione a U verso {destination} alla fine della strada"}},"fork":{"default":{"default":"Mantieni la {modifier} al bivio","name":"Mantieni la {modifier} al bivio in {way_name}","destination":"Mantieni la {modifier} al bivio verso {destination}"},"slight left":{"default":"Mantieni la sinistra al bivio","name":"Mantieni la sinistra al bivio in {way_name}","destination":"Mantieni la sinistra al bivio verso {destination}"},"slight right":{"default":"Mantieni la destra al bivio","name":"Mantieni la destra al bivio in {way_name}","destination":"Mantieni la destra al bivio verso {destination}"},"sharp left":{"default":"Svolta a sinistra al bivio","name":"Svolta a sinistra al bivio in {way_name}","destination":"Svolta a sinistra al bivio verso {destination}"},"sharp right":{"default":"Svolta a destra al bivio","name":"Svolta a destra al bivio in {way_name}","destination":"Svolta a destra al bivio verso {destination}"},"uturn":{"default":"Fai un'inversione a U","name":"Fai un'inversione a U in {way_name}","destination":"Fai un'inversione a U verso {destination}"}},"merge":{"default":{"default":"Immettiti a {modifier}","name":"Immettiti {modifier} in {way_name}","destination":"Immettiti {modifier} verso {destination}"},"straight":{"default":"Immettiti a dritto","name":"Immettiti dritto in {way_name}","destination":"Immettiti dritto verso {destination}"},"slight left":{"default":"Immettiti a sinistra","name":"Immettiti a sinistra in {way_name}","destination":"Immettiti a sinistra verso {destination}"},"slight right":{"default":"Immettiti a destra","name":"Immettiti a destra in {way_name}","destination":"Immettiti a destra verso {destination}"},"sharp left":{"default":"Immettiti a sinistra","name":"Immettiti a sinistra in {way_name}","destination":"Immettiti a sinistra verso {destination}"},"sharp right":{"default":"Immettiti a destra","name":"Immettiti a destra in {way_name}","destination":"Immettiti a destra verso {destination}"},"uturn":{"default":"Fai un'inversione a U","name":"Fai un'inversione a U in {way_name}","destination":"Fai un'inversione a U verso {destination}"}},"new name":{"default":{"default":"Continua a {modifier}","name":"Continua a {modifier} in {way_name}","destination":"Continua a {modifier} verso {destination}"},"straight":{"default":"Continua dritto","name":"Continua in {way_name}","destination":"Continua verso {destination}"},"sharp left":{"default":"Svolta a sinistra","name":"Svolta a sinistra in {way_name}","destination":"Svolta a sinistra verso {destination}"},"sharp right":{"default":"Svolta a destra","name":"Svolta a destra in {way_name}","destination":"Svolta a destra verso {destination}"},"slight left":{"default":"Continua leggermente a sinistra","name":"Continua leggermente a sinistra in {way_name}","destination":"Continua leggermente a sinistra verso {destination}"},"slight right":{"default":"Continua leggermente a destra","name":"Continua leggermente a destra in {way_name} ","destination":"Continua leggermente a destra verso {destination}"},"uturn":{"default":"Fai un'inversione a U","name":"Fai un'inversione a U in {way_name}","destination":"Fai un'inversione a U verso {destination}"}},"notification":{"default":{"default":"Continua a {modifier}","name":"Continua a {modifier} in {way_name}","destination":"Continua a {modifier} verso {destination}"},"uturn":{"default":"Fai un'inversione a U","name":"Fai un'inversione a U in {way_name}","destination":"Fai un'inversione a U verso {destination}"}},"off ramp":{"default":{"default":"Prendi la rampa","name":"Prendi la rampa in {way_name}","destination":"Prendi la rampa verso {destination}","exit":"Prendi l'uscita {exit}","exit_destination":"Prendi l'uscita  {exit} verso {destination}"},"left":{"default":"Prendi la rampa a sinistra","name":"Prendi la rampa a sinistra in {way_name}","destination":"Prendi la rampa a sinistra verso {destination}","exit":"Prendi l'uscita {exit} a sinistra","exit_destination":"Prendi la {exit}  uscita a sinistra verso {destination}"},"right":{"default":"Prendi la rampa a destra","name":"Prendi la rampa a destra in {way_name}","destination":"Prendi la rampa a destra verso {destination}","exit":"Prendi la {exit} uscita a destra","exit_destination":"Prendi la {exit} uscita a destra verso {destination}"},"sharp left":{"default":"Prendi la rampa a sinistra","name":"Prendi la rampa a sinistra in {way_name}","destination":"Prendi la rampa a sinistra verso {destination}","exit":"Prendi l'uscita {exit} a sinistra","exit_destination":"Prendi la {exit}  uscita a sinistra verso {destination}"},"sharp right":{"default":"Prendi la rampa a destra","name":"Prendi la rampa a destra in {way_name}","destination":"Prendi la rampa a destra verso {destination}","exit":"Prendi la {exit} uscita a destra","exit_destination":"Prendi la {exit} uscita a destra verso {destination}"},"slight left":{"default":"Prendi la rampa a sinistra","name":"Prendi la rampa a sinistra in {way_name}","destination":"Prendi la rampa a sinistra verso {destination}","exit":"Prendi l'uscita {exit} a sinistra","exit_destination":"Prendi la {exit}  uscita a sinistra verso {destination}"},"slight right":{"default":"Prendi la rampa a destra","name":"Prendi la rampa a destra in {way_name}","destination":"Prendi la rampa a destra verso {destination}","exit":"Prendi la {exit} uscita a destra","exit_destination":"Prendi la {exit} uscita a destra verso {destination}"}},"on ramp":{"default":{"default":"Prendi la rampa","name":"Prendi la rampa in {way_name}","destination":"Prendi la rampa verso {destination}"},"left":{"default":"Prendi la rampa a sinistra","name":"Prendi la rampa a sinistra in {way_name}","destination":"Prendi la rampa a sinistra verso {destination}"},"right":{"default":"Prendi la rampa a destra","name":"Prendi la rampa a destra in {way_name}","destination":"Prendi la rampa a destra verso {destination}"},"sharp left":{"default":"Prendi la rampa a sinistra","name":"Prendi la rampa a sinistra in {way_name}","destination":"Prendi la rampa a sinistra verso {destination}"},"sharp right":{"default":"Prendi la rampa a destra","name":"Prendi la rampa a destra in {way_name}","destination":"Prendi la rampa a destra verso {destination}"},"slight left":{"default":"Prendi la rampa a sinistra","name":"Prendi la rampa a sinistra in {way_name}","destination":"Prendi la rampa a sinistra verso {destination}"},"slight right":{"default":"Prendi la rampa a destra","name":"Prendi la rampa a destra in {way_name}","destination":"Prendi la rampa a destra verso {destination}"}},"rotary":{"default":{"default":{"default":"Immettiti nella rotonda","name":"Immettiti nella ritonda ed esci in {way_name}","destination":"Immettiti nella ritonda ed esci verso {destination}"},"name":{"default":"Immettiti in {rotary_name}","name":"Immettiti in {rotary_name} ed esci su {way_name}","destination":"Immettiti in {rotary_name} ed esci verso {destination}"},"exit":{"default":"Immettiti nella rotonda e prendi la {exit_number} uscita","name":"Immettiti nella rotonda e prendi la {exit_number} uscita in {way_name}","destination":"Immettiti nella rotonda e prendi la {exit_number} uscita verso   {destination}"},"name_exit":{"default":"Immettiti in {rotary_name} e prendi la {exit_number} uscita","name":"Immettiti in {rotary_name} e prendi la {exit_number} uscita in {way_name}","destination":"Immettiti in {rotary_name} e prendi la {exit_number}  uscita verso {destination}"}}},"roundabout":{"default":{"exit":{"default":"Immettiti nella rotonda e prendi la {exit_number} uscita","name":"Immettiti nella rotonda e prendi la {exit_number} uscita in {way_name}","destination":"Immettiti nella rotonda e prendi la {exit_number} uscita verso {destination}"},"default":{"default":"Entra nella rotonda","name":"Entra nella rotonda e prendi l'uscita in {way_name}","destination":"Entra nella rotonda e prendi l'uscita verso {destination}"}}},"roundabout turn":{"default":{"default":"Alla rotonda fai una {modifier}","name":"Alla rotonda fai una {modifier} in {way_name}","destination":"Alla rotonda fai una {modifier} verso {destination}"},"left":{"default":"Alla rotonda svolta a sinistra","name":"Alla rotonda svolta a sinistra in {way_name}","destination":"Alla rotonda svolta a sinistra verso {destination}"},"right":{"default":"Alla rotonda svolta a destra","name":"Alla rotonda svolta a destra in {way_name}","destination":"Alla rotonda svolta a destra verso {destination}"},"straight":{"default":"Alla rotonda prosegui dritto","name":"Alla rotonda prosegui dritto in {way_name}","destination":"Alla rotonda prosegui dritto verso {destination}"}},"exit roundabout":{"default":{"default":"Fai una {modifier}","name":"Fai una {modifier} in {way_name}","destination":"Fai una {modifier} verso {destination}"},"left":{"default":"Svolta a sinistra","name":"Svolta a sinistra in {way_name}","destination":"Svolta a sinistra verso {destination}"},"right":{"default":"Gira a destra","name":"Svolta a destra in {way_name}","destination":"Svolta a destra verso {destination}"},"straight":{"default":"Prosegui dritto","name":"Continua su {way_name}","destination":"Continua verso {destination}"}},"exit rotary":{"default":{"default":"Fai una {modifier}","name":"Fai una {modifier} in {way_name}","destination":"Fai una {modifier} verso {destination}"},"left":{"default":"Svolta a sinistra","name":"Svolta a sinistra in {way_name}","destination":"Svolta a sinistra verso {destination}"},"right":{"default":"Gira a destra","name":"Svolta a destra in {way_name}","destination":"Svolta a destra verso {destination}"},"straight":{"default":"Prosegui dritto","name":"Continua su {way_name}","destination":"Continua verso {destination}"}},"turn":{"default":{"default":"Fai una {modifier}","name":"Fai una {modifier} in {way_name}","destination":"Fai una {modifier} verso {destination}"},"left":{"default":"Svolta a sinistra","name":"Svolta a sinistra in {way_name}","destination":"Svolta a sinistra verso {destination}"},"right":{"default":"Gira a destra","name":"Svolta a destra in {way_name}","destination":"Svolta a destra verso {destination}"},"straight":{"default":"Prosegui dritto","name":"Continua su {way_name}","destination":"Continua verso {destination}"}},"use lane":{"no_lanes":{"default":"Continua dritto"},"default":{"default":"{lane_instruction}"}}};
var it = {
	meta: meta$9,
	v5: v5$9
};

var it$1 = Object.freeze({
	meta: meta$9,
	v5: v5$9,
	default: it
});

const meta$10 = {"capitalizeFirstLetter":true};
const v5$10 = {"constants":{"ordinalize":{"1":"1e","2":"2e","3":"3e","4":"4e","5":"5e","6":"6e","7":"7e","8":"8e","9":"9e","10":"10e"},"direction":{"north":"noord","northeast":"noordoost","east":"oost","southeast":"zuidoost","south":"zuid","southwest":"zuidwest","west":"west","northwest":"noordwest"},"modifier":{"left":"links","right":"rechts","sharp left":"linksaf","sharp right":"rechtsaf","slight left":"links","slight right":"rechts","straight":"rechtdoor","uturn":"omkeren"},"lanes":{"xo":"Rechts aanhouden","ox":"Links aanhouden","xox":"In het midden blijven","oxo":"Links of rechts blijven"}},"modes":{"ferry":{"default":"Neem het veer","name":"Neem het veer {way_name}","destination":"Neem het veer naar {destination}"}},"phrase":{"two linked by distance":"{instruction_one}, then, in {distance}, {instruction_two}","two linked":"{instruction_one}, then {instruction_two}","one in distance":"In {distance}, {instruction_one}","name and ref":"{name} ({ref})","exit with number":"exit {exit}"},"arrive":{"default":{"default":"Je bent gearriveerd op de {nth} bestemming.","upcoming":"Je bent gearriveerd op de {nth} bestemming.","short":"Je bent gearriveerd op de {nth} bestemming.","short-upcoming":"Je bent gearriveerd op de {nth} bestemming."},"left":{"default":"Je bent gearriveerd. De {nth} bestemming bevindt zich links.","upcoming":"Je bent gearriveerd. De {nth} bestemming bevindt zich links.","short":"Je bent gearriveerd op de {nth} bestemming.","short-upcoming":"Je bent gearriveerd op de {nth} bestemming."},"right":{"default":"Je bent gearriveerd. De {nth} bestemming bevindt zich rechts.","upcoming":"Je bent gearriveerd. De {nth} bestemming bevindt zich rechts.","short":"Je bent gearriveerd op de {nth} bestemming.","short-upcoming":"Je bent gearriveerd op de {nth} bestemming."},"sharp left":{"default":"Je bent gearriveerd. De {nth} bestemming bevindt zich links.","upcoming":"Je bent gearriveerd. De {nth} bestemming bevindt zich links.","short":"Je bent gearriveerd op de {nth} bestemming.","short-upcoming":"Je bent gearriveerd op de {nth} bestemming."},"sharp right":{"default":"Je bent gearriveerd. De {nth} bestemming bevindt zich rechts.","upcoming":"Je bent gearriveerd. De {nth} bestemming bevindt zich rechts.","short":"Je bent gearriveerd op de {nth} bestemming.","short-upcoming":"Je bent gearriveerd op de {nth} bestemming."},"slight right":{"default":"Je bent gearriveerd. De {nth} bestemming bevindt zich rechts.","upcoming":"Je bent gearriveerd. De {nth} bestemming bevindt zich rechts.","short":"Je bent gearriveerd op de {nth} bestemming.","short-upcoming":"Je bent gearriveerd op de {nth} bestemming."},"slight left":{"default":"Je bent gearriveerd. De {nth} bestemming bevindt zich links.","upcoming":"Je bent gearriveerd. De {nth} bestemming bevindt zich links.","short":"Je bent gearriveerd op de {nth} bestemming.","short-upcoming":"Je bent gearriveerd op de {nth} bestemming."},"straight":{"default":"Je bent gearriveerd. De {nth} bestemming bevindt zich voor je.","upcoming":"Je bent gearriveerd. De {nth} bestemming bevindt zich voor je.","short":"Je bent gearriveerd op de {nth} bestemming.","short-upcoming":"Je bent gearriveerd op de {nth} bestemming."}},"continue":{"default":{"default":"Ga {modifier}","name":"Ga {modifier} naar {way_name}","destination":"Ga {modifier} richting {destination}","exit":"Ga {modifier} naar {way_name}"},"straight":{"default":"Ga rechtdoor","name":"Ga rechtdoor naar {way_name}","destination":"Ga rechtdoor richting {destination}","distance":"Continue straight for {distance}","namedistance":"Continue on {way_name} for {distance}"},"sharp left":{"default":"Linksaf","name":"Make a sharp left to stay on {way_name}","destination":"Linksaf richting {destination}"},"sharp right":{"default":"Rechtsaf","name":"Make a sharp right to stay on {way_name}","destination":"Rechtsaf richting {destination}"},"slight left":{"default":"Links aanhouden","name":"Links aanhouden naar {way_name}","destination":"Links aanhouden richting {destination}"},"slight right":{"default":"Rechts aanhouden","name":"Rechts aanhouden naar {way_name}","destination":"Rechts aanhouden richting {destination}"},"uturn":{"default":"Keer om","name":"Keer om naar {way_name}","destination":"Keer om richting {destination}"}},"depart":{"default":{"default":"Vertrek in {direction}elijke richting","name":"Neem {way_name} in {direction}elijke richting","namedistance":"Head {direction} on {way_name} for {distance}"}},"end of road":{"default":{"default":"Ga {modifier}","name":"Ga {modifier} naar {way_name}","destination":"Ga {modifier} richting {destination}"},"straight":{"default":"Ga in de aangegeven richting","name":"Ga naar {way_name}","destination":"Ga richting {destination}"},"uturn":{"default":"Keer om","name":"Keer om naar {way_name}","destination":"Keer om richting {destination}"}},"fork":{"default":{"default":"Ga {modifier} op de splitsing","name":"Ga {modifier} op de splitsing naar {way_name}","destination":"Ga {modifier} op de splitsing richting {destination}"},"slight left":{"default":"Links aanhouden op de splitsing","name":"Links aanhouden op de splitsing naar {way_name}","destination":"Links aanhouden op de splitsing richting {destination}"},"slight right":{"default":"Rechts aanhouden op de splitsing","name":"Rechts aanhouden op de splitsing naar {way_name}","destination":"Rechts aanhouden op de splitsing richting {destination}"},"sharp left":{"default":"Linksaf op de splitsing","name":"Linksaf op de splitsing naar {way_name}","destination":"Linksaf op de splitsing richting {destination}"},"sharp right":{"default":"Rechtsaf op de splitsing","name":"Rechtsaf op de splitsing naar {way_name}","destination":"Rechtsaf op de splitsing richting {destination}"},"uturn":{"default":"Keer om","name":"Keer om naar {way_name}","destination":"Keer om richting {destination}"}},"merge":{"default":{"default":"Bij de splitsing {modifier}","name":"Bij de splitsing {modifier} naar {way_name}","destination":"Bij de splitsing {modifier} richting {destination}"},"straight":{"default":"Bij de splitsing rechtdoor","name":"Bij de splitsing rechtdoor naar {way_name}","destination":"Bij de splitsing rechtdoor richting {destination}"},"slight left":{"default":"Bij de splitsing links aanhouden","name":"Bij de splitsing links aanhouden naar {way_name}","destination":"Bij de splitsing links aanhouden richting {destination}"},"slight right":{"default":"Bij de splitsing rechts aanhouden","name":"Bij de splitsing rechts aanhouden naar {way_name}","destination":"Bij de splitsing rechts aanhouden richting {destination}"},"sharp left":{"default":"Bij de splitsing linksaf","name":"Bij de splitsing linksaf naar {way_name}","destination":"Bij de splitsing linksaf richting {destination}"},"sharp right":{"default":"Bij de splitsing rechtsaf","name":"Bij de splitsing rechtsaf naar {way_name}","destination":"Bij de splitsing rechtsaf richting {destination}"},"uturn":{"default":"Keer om","name":"Keer om naar {way_name}","destination":"Keer om richting {destination}"}},"new name":{"default":{"default":"Ga {modifier}","name":"Ga {modifier} naar {way_name}","destination":"Ga {modifier} richting {destination}"},"straight":{"default":"Ga in de aangegeven richting","name":"Ga rechtdoor naar {way_name}","destination":"Ga rechtdoor richting {destination}"},"sharp left":{"default":"Linksaf","name":"Linksaf naar {way_name}","destination":"Linksaf richting {destination}"},"sharp right":{"default":"Rechtsaf","name":"Rechtsaf naar {way_name}","destination":"Rechtsaf richting {destination}"},"slight left":{"default":"Links aanhouden","name":"Links aanhouden naar {way_name}","destination":"Links aanhouden richting {destination}"},"slight right":{"default":"Rechts aanhouden","name":"Rechts aanhouden naar {way_name}","destination":"Rechts aanhouden richting {destination}"},"uturn":{"default":"Keer om","name":"Keer om naar {way_name}","destination":"Keer om richting {destination}"}},"notification":{"default":{"default":"Ga {modifier}","name":"Ga {modifier} naar {way_name}","destination":"Ga {modifier} richting {destination}"},"uturn":{"default":"Keer om","name":"Keer om naar {way_name}","destination":"Keer om richting {destination}"}},"off ramp":{"default":{"default":"Neem de afrit","name":"Neem de afrit naar {way_name}","destination":"Neem de afrit richting {destination}","exit":"Take exit {exit}","exit_destination":"Take exit {exit} towards {destination}"},"left":{"default":"Neem de afrit links","name":"Neem de afrit links naar {way_name}","destination":"Neem de afrit links richting {destination}","exit":"Take exit {exit} on the left","exit_destination":"Take exit {exit} on the left towards {destination}"},"right":{"default":"Neem de afrit rechts","name":"Neem de afrit rechts naar {way_name}","destination":"Neem de afrit rechts richting {destination}","exit":"Take exit {exit} on the right","exit_destination":"Take exit {exit} on the right towards {destination}"},"sharp left":{"default":"Neem de afrit links","name":"Neem de afrit links naar {way_name}","destination":"Neem de afrit links richting {destination}","exit":"Take exit {exit} on the left","exit_destination":"Take exit {exit} on the left towards {destination}"},"sharp right":{"default":"Neem de afrit rechts","name":"Neem de afrit rechts naar {way_name}","destination":"Neem de afrit rechts richting {destination}","exit":"Take exit {exit} on the right","exit_destination":"Take exit {exit} on the right towards {destination}"},"slight left":{"default":"Neem de afrit links","name":"Neem de afrit links naar {way_name}","destination":"Neem de afrit links richting {destination}","exit":"Take exit {exit} on the left","exit_destination":"Take exit {exit} on the left towards {destination}"},"slight right":{"default":"Neem de afrit rechts","name":"Neem de afrit rechts naar {way_name}","destination":"Neem de afrit rechts richting {destination}","exit":"Take exit {exit} on the right","exit_destination":"Take exit {exit} on the right towards {destination}"}},"on ramp":{"default":{"default":"Neem de oprit","name":"Neem de oprit naar {way_name}","destination":"Neem de oprit richting {destination}"},"left":{"default":"Neem de oprit links","name":"Neem de oprit links naar {way_name}","destination":"Neem de oprit links richting {destination}"},"right":{"default":"Neem de oprit rechts","name":"Neem de oprit rechts naar {way_name}","destination":"Neem de oprit rechts richting {destination}"},"sharp left":{"default":"Neem de oprit links","name":"Neem de oprit links naar {way_name}","destination":"Neem de oprit links richting {destination}"},"sharp right":{"default":"Neem de oprit rechts","name":"Neem de oprit rechts naar {way_name}","destination":"Neem de oprit rechts richting {destination}"},"slight left":{"default":"Neem de oprit links","name":"Neem de oprit links naar {way_name}","destination":"Neem de oprit links richting {destination}"},"slight right":{"default":"Neem de oprit rechts","name":"Neem de oprit rechts naar {way_name}","destination":"Neem de oprit rechts richting {destination}"}},"rotary":{"default":{"default":{"default":"Ga het knooppunt op","name":"Verlaat het knooppunt naar {way_name}","destination":"Verlaat het knooppunt richting {destination}"},"name":{"default":"Ga het knooppunt {rotary_name} op","name":"Verlaat het knooppunt {rotary_name} naar {way_name}","destination":"Verlaat het knooppunt {rotary_name} richting {destination}"},"exit":{"default":"Ga het knooppunt op en neem afslag {exit_number}","name":"Ga het knooppunt op en neem afslag {exit_number} naar {way_name}","destination":"Ga het knooppunt op en neem afslag {exit_number} richting {destination}"},"name_exit":{"default":"Ga het knooppunt {rotary_name} op en neem afslag {exit_number}","name":"Ga het knooppunt {rotary_name} op en neem afslag {exit_number} naar {way_name}","destination":"Ga het knooppunt {rotary_name} op en neem afslag {exit_number} richting {destination}"}}},"roundabout":{"default":{"exit":{"default":"Ga de rotonde op en neem afslag {exit_number}","name":"Ga de rotonde op en neem afslag {exit_number} naar {way_name}","destination":"Ga de rotonde op en neem afslag {exit_number} richting {destination}"},"default":{"default":"Ga de rotonde op","name":"Verlaat de rotonde naar {way_name}","destination":"Verlaat de rotonde richting {destination}"}}},"roundabout turn":{"default":{"default":"Ga {modifier} op de rotonde","name":"Ga {modifier} op de rotonde naar {way_name}","destination":"Ga {modifier} op de rotonde richting {destination}"},"left":{"default":"Ga links op de rotonde","name":"Ga links op de rotonde naar {way_name}","destination":"Ga links op de rotonde richting {destination}"},"right":{"default":"Ga rechts op de rotonde","name":"Ga rechts op de rotonde naar {way_name}","destination":"Ga rechts op de rotonde richting {destination}"},"straight":{"default":"Rechtdoor op de rotonde","name":"Rechtdoor op de rotonde naar {way_name}","destination":"Rechtdoor op de rotonde richting {destination}"}},"exit roundabout":{"default":{"default":"Ga {modifier}","name":"Ga {modifier} naar {way_name}","destination":"Ga {modifier} richting {destination}"},"left":{"default":"Ga linksaf","name":"Ga linksaf naar {way_name}","destination":"Ga linksaf richting {destination}"},"right":{"default":"Ga rechtsaf","name":"Ga rechtsaf naar {way_name}","destination":"Ga rechtsaf richting {destination}"},"straight":{"default":"Ga rechtdoor","name":"Ga rechtdoor naar {way_name}","destination":"Ga rechtdoor richting {destination}"}},"exit rotary":{"default":{"default":"Ga {modifier}","name":"Ga {modifier} naar {way_name}","destination":"Ga {modifier} richting {destination}"},"left":{"default":"Ga linksaf","name":"Ga linksaf naar {way_name}","destination":"Ga linksaf richting {destination}"},"right":{"default":"Ga rechtsaf","name":"Ga rechtsaf naar {way_name}","destination":"Ga rechtsaf richting {destination}"},"straight":{"default":"Ga rechtdoor","name":"Ga rechtdoor naar {way_name}","destination":"Ga rechtdoor richting {destination}"}},"turn":{"default":{"default":"Ga {modifier}","name":"Ga {modifier} naar {way_name}","destination":"Ga {modifier} richting {destination}"},"left":{"default":"Ga linksaf","name":"Ga linksaf naar {way_name}","destination":"Ga linksaf richting {destination}"},"right":{"default":"Ga rechtsaf","name":"Ga rechtsaf naar {way_name}","destination":"Ga rechtsaf richting {destination}"},"straight":{"default":"Ga rechtdoor","name":"Ga rechtdoor naar {way_name}","destination":"Ga rechtdoor richting {destination}"}},"use lane":{"no_lanes":{"default":"Rechtdoor"},"default":{"default":"{lane_instruction}"}}};
var nl = {
	meta: meta$10,
	v5: v5$10
};

var nl$1 = Object.freeze({
	meta: meta$10,
	v5: v5$10,
	default: nl
});

const meta$11 = {"capitalizeFirstLetter":true};
const v5$11 = {"constants":{"ordinalize":{"1":"1.","2":"2.","3":"3.","4":"4.","5":"5.","6":"6.","7":"7.","8":"8.","9":"9.","10":"10."},"direction":{"north":"północ","northeast":"północny wschód","east":"wschód","southeast":"południowy wschód","south":"południe","southwest":"południowy zachód","west":"zachód","northwest":"północny zachód"},"modifier":{"left":"lewo","right":"prawo","sharp left":"ostro w lewo","sharp right":"ostro w prawo","slight left":"łagodnie w lewo","slight right":"łagodnie w prawo","straight":"prosto","uturn":"zawróć"},"lanes":{"xo":"Trzymaj się prawej strony","ox":"Trzymaj się lewej strony","xox":"Trzymaj się środka","oxo":"Trzymaj się lewej lub prawej strony"}},"modes":{"ferry":{"default":"Weź prom","name":"Weź prom {way_name}","destination":"Weź prom w kierunku {destination}"}},"phrase":{"two linked by distance":"{instruction_one}, następnie za {distance} {instruction_two}","two linked":"{instruction_one}, następnie {instruction_two}","one in distance":"Za {distance}, {instruction_one}","name and ref":"{name} ({ref})","exit with number":"exit {exit}"},"arrive":{"default":{"default":"Dojechano do miejsca docelowego {nth}","upcoming":"Dojechano do miejsca docelowego {nth}","short":"Dojechano do miejsca docelowego {nth}","short-upcoming":"Dojechano do miejsca docelowego {nth}"},"left":{"default":"Dojechano do miejsca docelowego {nth}, po lewej stronie","upcoming":"Dojechano do miejsca docelowego {nth}, po lewej stronie","short":"Dojechano do miejsca docelowego {nth}","short-upcoming":"Dojechano do miejsca docelowego {nth}"},"right":{"default":"Dojechano do miejsca docelowego {nth}, po prawej stronie","upcoming":"Dojechano do miejsca docelowego {nth}, po prawej stronie","short":"Dojechano do miejsca docelowego {nth}","short-upcoming":"Dojechano do miejsca docelowego {nth}"},"sharp left":{"default":"Dojechano do miejsca docelowego {nth}, po lewej stronie","upcoming":"Dojechano do miejsca docelowego {nth}, po lewej stronie","short":"Dojechano do miejsca docelowego {nth}","short-upcoming":"Dojechano do miejsca docelowego {nth}"},"sharp right":{"default":"Dojechano do miejsca docelowego {nth}, po prawej stronie","upcoming":"Dojechano do miejsca docelowego {nth}, po prawej stronie","short":"Dojechano do miejsca docelowego {nth}","short-upcoming":"Dojechano do miejsca docelowego {nth}"},"slight right":{"default":"Dojechano do miejsca docelowego {nth}, po prawej stronie","upcoming":"Dojechano do miejsca docelowego {nth}, po prawej stronie","short":"Dojechano do miejsca docelowego {nth}","short-upcoming":"Dojechano do miejsca docelowego {nth}"},"slight left":{"default":"Dojechano do miejsca docelowego {nth}, po lewej stronie","upcoming":"Dojechano do miejsca docelowego {nth}, po lewej stronie","short":"Dojechano do miejsca docelowego {nth}","short-upcoming":"Dojechano do miejsca docelowego {nth}"},"straight":{"default":"Dojechano do miejsca docelowego {nth} , prosto","upcoming":"Dojechano do miejsca docelowego {nth} , prosto","short":"Dojechano do miejsca docelowego {nth}","short-upcoming":"Dojechano do miejsca docelowego {nth}"}},"continue":{"default":{"default":"Skręć {modifier}","name":"Skręć w {modifier}, aby pozostać na {way_name}","destination":"Skręć {modifier} w kierunku {destination}","exit":"Skręć {modifier} na {way_name}"},"straight":{"default":"Kontynuuj prosto","name":"Jedź dalej prosto, aby pozostać na {way_name}","destination":"Kontynuuj w kierunku {destination}","distance":"Jedź dalej prosto przez {distance}","namedistance":"Jedź dalej {way_name} przez {distance}"},"sharp left":{"default":"Skręć ostro w lewo","name":"Skręć w lewo w ostry zakręt, aby pozostać na {way_name}","destination":"Skręć ostro w lewo w kierunku {destination}"},"sharp right":{"default":"Skręć ostro w prawo","name":"Skręć w prawo w ostry zakręt, aby pozostać na {way_name}","destination":"Skręć ostro w prawo w kierunku {destination}"},"slight left":{"default":"Skręć w lewo w łagodny zakręt","name":"Skręć w lewo w łagodny zakręt, aby pozostać na {way_name}","destination":"Skręć w lewo w łagodny zakręt na {destination}"},"slight right":{"default":"Skręć w prawo w łagodny zakręt","name":"Skręć w prawo w łagodny zakręt, aby pozostać na {way_name}","destination":"Skręć w prawo w łagodny zakręt na {destination}"},"uturn":{"default":"Zawróć","name":"Zawróć i jedź dalej {way_name}","destination":"Zawróć w kierunku {destination}"}},"depart":{"default":{"default":"Kieruj się {direction}","name":"Kieruj się {direction} na {way_name}","namedistance":"Head {direction} on {way_name} for {distance}"}},"end of road":{"default":{"default":"Skręć {modifier}","name":"Skręć {modifier} na {way_name}","destination":"Skręć {modifier} w kierunku {destination}"},"straight":{"default":"Kontynuuj prosto","name":"Kontynuuj prosto na {way_name}","destination":"Kontynuuj prosto w kierunku {destination}"},"uturn":{"default":"Zawróć na końcu ulicy","name":"Zawróć na końcu ulicy na {way_name}","destination":"Zawróć na końcu ulicy w kierunku {destination}"}},"fork":{"default":{"default":"Na rozwidleniu trzymaj się {modifier}","name":"Na rozwidleniu trzymaj się {modifier} na {way_name}","destination":"Na rozwidleniu trzymaj się {modifier} w kierunku {destination}"},"slight left":{"default":"Na rozwidleniu trzymaj się lewej strony","name":"Na rozwidleniu trzymaj się lewej strony w {way_name}","destination":"Na rozwidleniu trzymaj się lewej strony w kierunku {destination}"},"slight right":{"default":"Na rozwidleniu trzymaj się prawej strony","name":"Na rozwidleniu trzymaj się prawej strony na {way_name}","destination":"Na rozwidleniu trzymaj się prawej strony w kierunku {destination}"},"sharp left":{"default":"Na rozwidleniu skręć ostro w lewo","name":"Na rozwidleniu skręć ostro w lew na {way_name}","destination":"Na rozwidleniu skręć ostro w lewo w kierunku {destination}"},"sharp right":{"default":"Na rozwidleniu skręć ostro w prawo","name":"Na rozwidleniu skręć ostro w prawo na {way_name}","destination":"Na rozwidleniu skręć ostro w prawo w kierunku {destination}"},"uturn":{"default":"Zawróć","name":"Zawróć na {way_name}","destination":"Zawróć w kierunku {destination}"}},"merge":{"default":{"default":"Włącz się {modifier}","name":"Włącz się {modifier} na {way_name}","destination":"Włącz się {modifier} w kierunku {destination}"},"straight":{"default":"Włącz się prosto","name":"Włącz się prosto na {way_name}","destination":"Włącz się prosto w kierunku {destination}"},"slight left":{"default":"Włącz się z lewej strony","name":"Włącz się z lewej strony na {way_name}","destination":"Włącz się z lewej strony w kierunku {destination}"},"slight right":{"default":"Włącz się z prawej strony","name":"Włącz się z prawej strony na {way_name}","destination":"Włącz się z prawej strony w kierunku {destination}"},"sharp left":{"default":"Włącz się z lewej strony","name":"Włącz się z lewej strony na {way_name}","destination":"Włącz się z lewej strony w kierunku {destination}"},"sharp right":{"default":"Włącz się z prawej strony","name":"Włącz się z prawej strony na {way_name}","destination":"Włącz się z prawej strony w kierunku {destination}"},"uturn":{"default":"Zawróć","name":"Zawróć na {way_name}","destination":"Zawróć w kierunku {destination}"}},"new name":{"default":{"default":"Kontynuuj {modifier}","name":"Kontynuuj {modifier} na {way_name}","destination":"Kontynuuj {modifier} w kierunku {destination}"},"straight":{"default":"Kontynuuj prosto","name":"Kontynuuj na {way_name}","destination":"Kontynuuj w kierunku {destination}"},"sharp left":{"default":"Skręć ostro w lewo","name":"Skręć ostro w lewo w {way_name}","destination":"Skręć ostro w lewo w kierunku {destination}"},"sharp right":{"default":"Skręć ostro w prawo","name":"Skręć ostro w prawo na {way_name}","destination":"Skręć ostro w prawo w kierunku {destination}"},"slight left":{"default":"Kontynuuj łagodnie w lewo","name":"Kontynuuj łagodnie w lewo na {way_name}","destination":"Kontynuuj łagodnie w lewo w kierunku {destination}"},"slight right":{"default":"Kontynuuj łagodnie w prawo","name":"Kontynuuj łagodnie w prawo na {way_name}","destination":"Kontynuuj łagodnie w prawo w kierunku {destination}"},"uturn":{"default":"Zawróć","name":"Zawróć na {way_name}","destination":"Zawróć w kierunku {destination}"}},"notification":{"default":{"default":"Kontynuuj {modifier}","name":"Kontynuuj {modifier} na {way_name}","destination":"Kontynuuj {modifier} w kierunku {destination}"},"uturn":{"default":"Zawróć","name":"Zawróć na {way_name}","destination":"Zawróć w kierunku {destination}"}},"off ramp":{"default":{"default":"Zjedź","name":"Weź zjazd na {way_name}","destination":"Weź zjazd w kierunku {destination}","exit":"Zjedź zjazdem {exit}","exit_destination":"Zjedź zjazdem {exit} na {destination}"},"left":{"default":"Weź zjazd po lewej","name":"Weź zjazd po lewej na {way_name}","destination":"Weź zjazd po lewej w kierunku {destination}","exit":"Zjedź zjazdem {exit} po lewej stronie","exit_destination":"Zjedź zjazdem {exit} po lewej stronie na {destination}"},"right":{"default":"Weź zjazd po prawej","name":"Weź zjazd po prawej na {way_name}","destination":"Weź zjazd po prawej w kierunku {destination}","exit":"Zjedź zjazdem {exit} po prawej stronie","exit_destination":"Zjedź zjazdem {exit} po prawej stronie na {destination}"},"sharp left":{"default":"Weź zjazd po lewej","name":"Weź zjazd po lewej na {way_name}","destination":"Weź zjazd po lewej w kierunku {destination}","exit":"Zjedź zjazdem {exit} po lewej stronie","exit_destination":"Zjedź zjazdem {exit} po lewej stronie na {destination}"},"sharp right":{"default":"Weź zjazd po prawej","name":"Weź zjazd po prawej na {way_name}","destination":"Weź zjazd po prawej w kierunku {destination}","exit":"Zjedź zjazdem {exit} po prawej stronie","exit_destination":"Zjedź zjazdem {exit} po prawej stronie na {destination}"},"slight left":{"default":"Weź zjazd po lewej","name":"Weź zjazd po lewej na {way_name}","destination":"Weź zjazd po lewej w kierunku {destination}","exit":"Zjedź zjazdem {exit} po lewej stronie","exit_destination":"Zjedź zjazdem {exit} po lewej stronie na {destination}"},"slight right":{"default":"Weź zjazd po prawej","name":"Weź zjazd po prawej na {way_name}","destination":"Weź zjazd po prawej w kierunku {destination}","exit":"Zjedź zjazdem {exit} po prawej stronie","exit_destination":"Zjedź zjazdem {exit} po prawej stronie na {destination}"}},"on ramp":{"default":{"default":"Weź zjazd","name":"Weź zjazd na {way_name}","destination":"Weź zjazd w kierunku {destination}"},"left":{"default":"Weź zjazd po lewej","name":"Weź zjazd po lewej na {way_name}","destination":"Weź zjazd po lewej w kierunku {destination}"},"right":{"default":"Weź zjazd po prawej","name":"Weź zjazd po prawej na {way_name}","destination":"Weź zjazd po prawej w kierunku {destination}"},"sharp left":{"default":"Weź zjazd po lewej","name":"Weź zjazd po lewej na {way_name}","destination":"Weź zjazd po lewej w kierunku {destination}"},"sharp right":{"default":"Weź zjazd po prawej","name":"Weź zjazd po prawej na {way_name}","destination":"Weź zjazd po prawej w kierunku {destination}"},"slight left":{"default":"Weź zjazd po lewej","name":"Weź zjazd po lewej na {way_name}","destination":"Weź zjazd po lewej w kierunku {destination}"},"slight right":{"default":"Weź zjazd po prawej","name":"Weź zjazd po prawej na {way_name}","destination":"Weź zjazd po prawej w kierunku {destination}"}},"rotary":{"default":{"default":{"default":"Wjedź na rondo","name":"Wjedź na rondo i skręć na {way_name}","destination":"Wjedź na rondo i skręć w kierunku {destination}"},"name":{"default":"Wjedź na {rotary_name}","name":"Wjedź na {rotary_name} i skręć na {way_name}","destination":"Wjedź na {rotary_name} i skręć w kierunku {destination}"},"exit":{"default":"Wjedź na rondo i wyjedź {exit_number} zjazdem","name":"Wjedź na rondo i wyjedź {exit_number} zjazdem na {way_name}","destination":"Wjedź na rondo i wyjedź {exit_number} zjazdem w kierunku {destination}"},"name_exit":{"default":"Wjedź na {rotary_name} i wyjedź {exit_number} zjazdem","name":"Wjedź na {rotary_name} i wyjedź {exit_number} zjazdem na {way_name}","destination":"Wjedź na {rotary_name} i wyjedź {exit_number} zjazdem w kierunku {destination}"}}},"roundabout":{"default":{"exit":{"default":"Wjedź na rondo i wyjedź {exit_number} zjazdem","name":"Wjedź na rondo i wyjedź {exit_number} zjazdem na {way_name}","destination":"Wjedź na rondo i wyjedź {exit_number} zjazdem w kierunku {destination}"},"default":{"default":"Wjedź na rondo","name":"Wjedź na rondo i wyjedź na {way_name}","destination":"Wjedź na rondo i wyjedź w kierunku {destination}"}}},"roundabout turn":{"default":{"default":"Na rondzie weź {modifier}","name":"Na rondzie weź {modifier} na {way_name}","destination":"Na rondzie weź {modifier} w kierunku {destination}"},"left":{"default":"Na rondzie skręć w lewo","name":"Na rondzie skręć lewo na {way_name}","destination":"Na rondzie skręć w lewo w kierunku {destination}"},"right":{"default":"Na rondzie skręć w prawo","name":"Na rondzie skręć w prawo na {way_name}","destination":"Na rondzie skręć w prawo w kierunku {destination}"},"straight":{"default":"Na rondzie kontynuuj prosto","name":"Na rondzie kontynuuj prosto na {way_name}","destination":"Na rondzie kontynuuj prosto w kierunku {destination}"}},"exit roundabout":{"default":{"default":"{modifier}","name":"{modifier} na {way_name}","destination":"{modifier} w kierunku {destination}"},"left":{"default":"Skręć w lewo","name":"Skręć w lewo na {way_name}","destination":"Skręć w lewo w kierunku {destination}"},"right":{"default":"Skręć w prawo","name":"Skręć w prawo na {way_name}","destination":"Skręć w prawo w kierunku {destination}"},"straight":{"default":"Jedź prosto","name":"Jedź prosto na {way_name}","destination":"Jedź prosto w kierunku {destination}"}},"exit rotary":{"default":{"default":"{modifier}","name":"{modifier} na {way_name}","destination":"{modifier} w kierunku {destination}"},"left":{"default":"Skręć w lewo","name":"Skręć w lewo na {way_name}","destination":"Skręć w lewo w kierunku {destination}"},"right":{"default":"Skręć w prawo","name":"Skręć w prawo na {way_name}","destination":"Skręć w prawo w kierunku {destination}"},"straight":{"default":"Jedź prosto","name":"Jedź prosto na {way_name}","destination":"Jedź prosto w kierunku {destination}"}},"turn":{"default":{"default":"{modifier}","name":"{modifier} na {way_name}","destination":"{modifier} w kierunku {destination}"},"left":{"default":"Skręć w lewo","name":"Skręć w lewo na {way_name}","destination":"Skręć w lewo w kierunku {destination}"},"right":{"default":"Skręć w prawo","name":"Skręć w prawo na {way_name}","destination":"Skręć w prawo w kierunku {destination}"},"straight":{"default":"Jedź prosto","name":"Jedź prosto na {way_name}","destination":"Jedź prosto w kierunku {destination}"}},"use lane":{"no_lanes":{"default":"Kontynuuj prosto"},"default":{"default":"{lane_instruction}"}}};
var pl = {
	meta: meta$11,
	v5: v5$11
};

var pl$1 = Object.freeze({
	meta: meta$11,
	v5: v5$11,
	default: pl
});

const meta$12 = {"capitalizeFirstLetter":true};
const v5$12 = {"constants":{"ordinalize":{"1":"1º","2":"2º","3":"3º","4":"4º","5":"5º","6":"6º","7":"7º","8":"8º","9":"9º","10":"10º"},"direction":{"north":"norte","northeast":"nordeste","east":"leste","southeast":"sudeste","south":"sul","southwest":"sudoeste","west":"oeste","northwest":"noroeste"},"modifier":{"left":"à esquerda","right":"à direita","sharp left":"fechada à esquerda","sharp right":"fechada à direita","slight left":"suave à esquerda","slight right":"suave à direita","straight":"em frente","uturn":"retorno"},"lanes":{"xo":"Mantenha-se à direita","ox":"Mantenha-se à esquerda","xox":"Mantenha-se ao centro","oxo":"Mantenha-se à esquerda ou direita"}},"modes":{"ferry":{"default":"Pegue a balsa","name":"Pegue a balsa {way_name}","destination":"Pegue a balsa sentido {destination}"}},"phrase":{"two linked by distance":"{instruction_one}, então, em {distance}, {instruction_two}","two linked":"{instruction_one}, então {instruction_two}","one in distance":"Em {distance}, {instruction_one}","name and ref":"{name} ({ref})","exit with number":"exit {exit}"},"arrive":{"default":{"default":"Você chegou ao seu {nth} destino","upcoming":"Você chegou ao seu {nth} destino","short":"Você chegou ao seu {nth} destino","short-upcoming":"Você chegou ao seu {nth} destino"},"left":{"default":"Você chegou ao seu {nth} destino, à esquerda","upcoming":"Você chegou ao seu {nth} destino, à esquerda","short":"Você chegou ao seu {nth} destino","short-upcoming":"Você chegou ao seu {nth} destino"},"right":{"default":"Você chegou ao seu {nth} destino, à direita","upcoming":"Você chegou ao seu {nth} destino, à direita","short":"Você chegou ao seu {nth} destino","short-upcoming":"Você chegou ao seu {nth} destino"},"sharp left":{"default":"Você chegou ao seu {nth} destino, à esquerda","upcoming":"Você chegou ao seu {nth} destino, à esquerda","short":"Você chegou ao seu {nth} destino","short-upcoming":"Você chegou ao seu {nth} destino"},"sharp right":{"default":"Você chegou ao seu {nth} destino, à direita","upcoming":"Você chegou ao seu {nth} destino, à direita","short":"Você chegou ao seu {nth} destino","short-upcoming":"Você chegou ao seu {nth} destino"},"slight right":{"default":"Você chegou ao seu {nth} destino, à direita","upcoming":"Você chegou ao seu {nth} destino, à direita","short":"Você chegou ao seu {nth} destino","short-upcoming":"Você chegou ao seu {nth} destino"},"slight left":{"default":"Você chegou ao seu {nth} destino, à esquerda","upcoming":"Você chegou ao seu {nth} destino, à esquerda","short":"Você chegou ao seu {nth} destino","short-upcoming":"Você chegou ao seu {nth} destino"},"straight":{"default":"Você chegou ao seu {nth} destino, em frente","upcoming":"Você chegou ao seu {nth} destino, em frente","short":"Você chegou ao seu {nth} destino","short-upcoming":"Você chegou ao seu {nth} destino"}},"continue":{"default":{"default":"Vire {modifier}","name":"Vire {modifier} para manter-se na {way_name}","destination":"Vire {modifier} sentido {destination}","exit":"Vire {modifier} em {way_name}"},"straight":{"default":"Continue em frente","name":"Continue em frente para manter-se na {way_name}","destination":"Continue em direção à {destination}","distance":"Continue em frente por {distance}","namedistance":"Continue na {way_name} por {distance}"},"sharp left":{"default":"Faça uma curva fechada a esquerda","name":"Faça uma curva fechada a esquerda para manter-se na {way_name}","destination":"Faça uma curva fechada a esquerda sentido {destination}"},"sharp right":{"default":"Faça uma curva fechada a direita","name":"Faça uma curva fechada a direita para manter-se na {way_name}","destination":"Faça uma curva fechada a direita sentido {destination}"},"slight left":{"default":"Faça uma curva suave a esquerda","name":"Faça uma curva suave a esquerda para manter-se na {way_name}","destination":"Faça uma curva suave a esquerda em direção a {destination}"},"slight right":{"default":"Faça uma curva suave a direita","name":"Faça uma curva suave a direita para manter-se na {way_name}","destination":"Faça uma curva suave a direita em direção a {destination}"},"uturn":{"default":"Faça o retorno","name":"Faça o retorno e continue em {way_name}","destination":"Faça o retorno sentido {destination}"}},"depart":{"default":{"default":"Siga {direction}","name":"Siga {direction} em {way_name}","namedistance":"Siga {direction} na {way_name} por {distance}"}},"end of road":{"default":{"default":"Vire {modifier}","name":"Vire {modifier} em {way_name}","destination":"Vire {modifier} sentido {destination}"},"straight":{"default":"Continue em frente","name":"Continue em frente em {way_name}","destination":"Continue em frente sentido {destination}"},"uturn":{"default":"Faça o retorno no fim da rua","name":"Faça o retorno em {way_name} no fim da rua","destination":"Faça o retorno sentido {destination} no fim da rua"}},"fork":{"default":{"default":"Mantenha-se {modifier} na bifurcação","name":"Mantenha-se {modifier} na bifurcação em {way_name}","destination":"Mantenha-se {modifier} na bifurcação sentido {destination}"},"slight left":{"default":"Mantenha-se à esquerda na bifurcação","name":"Mantenha-se à esquerda na bifurcação em {way_name}","destination":"Mantenha-se à esquerda na bifurcação sentido {destination}"},"slight right":{"default":"Mantenha-se à direita na bifurcação","name":"Mantenha-se à direita na bifurcação em {way_name}","destination":"Mantenha-se à direita na bifurcação sentido {destination}"},"sharp left":{"default":"Faça uma curva fechada à esquerda na bifurcação","name":"Faça uma curva fechada à esquerda na bifurcação em {way_name}","destination":"Faça uma curva fechada à esquerda na bifurcação sentido {destination}"},"sharp right":{"default":"Faça uma curva fechada à direita na bifurcação","name":"Faça uma curva fechada à direita na bifurcação em {way_name}","destination":"Faça uma curva fechada à direita na bifurcação sentido {destination}"},"uturn":{"default":"Faça o retorno","name":"Faça o retorno em {way_name}","destination":"Faça o retorno sentido {destination}"}},"merge":{"default":{"default":"Entre {modifier}","name":"Entre {modifier} na {way_name}","destination":"Entre {modifier} em direção à {destination}"},"straight":{"default":"Entre reto","name":"Entre reto na {way_name}","destination":"Entre reto em direção à {destination}"},"slight left":{"default":"Entre à esquerda","name":"Entre à esquerda na {way_name}","destination":"Entre à esquerda em direção à {destination}"},"slight right":{"default":"Entre à direita","name":"Entre à direita na {way_name}","destination":"Entre à direita em direção à {destination}"},"sharp left":{"default":"Entre à esquerda","name":"Entre à esquerda na {way_name}","destination":"Entre à esquerda em direção à {destination}"},"sharp right":{"default":"Entre à direita","name":"Entre à direita na {way_name}","destination":"Entre à direita em direção à {destination}"},"uturn":{"default":"Faça o retorno","name":"Faça o retorno em {way_name}","destination":"Faça o retorno sentido {destination}"}},"new name":{"default":{"default":"Continue {modifier}","name":"Continue {modifier} em {way_name}","destination":"Continue {modifier} sentido {destination}"},"straight":{"default":"Continue em frente","name":"Continue em {way_name}","destination":"Continue em direção à {destination}"},"sharp left":{"default":"Faça uma curva fechada à esquerda","name":"Faça uma curva fechada à esquerda em {way_name}","destination":"Faça uma curva fechada à esquerda sentido {destination}"},"sharp right":{"default":"Faça uma curva fechada à direita","name":"Faça uma curva fechada à direita em {way_name}","destination":"Faça uma curva fechada à direita sentido {destination}"},"slight left":{"default":"Continue ligeiramente à esquerda","name":"Continue ligeiramente à esquerda em {way_name}","destination":"Continue ligeiramente à esquerda sentido {destination}"},"slight right":{"default":"Continue ligeiramente à direita","name":"Continue ligeiramente à direita em {way_name}","destination":"Continue ligeiramente à direita sentido {destination}"},"uturn":{"default":"Faça o retorno","name":"Faça o retorno em {way_name}","destination":"Faça o retorno sentido {destination}"}},"notification":{"default":{"default":"Continue {modifier}","name":"Continue {modifier} em {way_name}","destination":"Continue {modifier} sentido {destination}"},"uturn":{"default":"Faça o retorno","name":"Faça o retorno em {way_name}","destination":"Faça o retorno sentido {destination}"}},"off ramp":{"default":{"default":"Pegue a rampa","name":"Pegue a rampa em {way_name}","destination":"Pegue a rampa sentido {destination}","exit":"Pegue a saída {exit}","exit_destination":"Pegue a saída {exit} em direção à {destination}"},"left":{"default":"Pegue a rampa à esquerda","name":"Pegue a rampa à esquerda em {way_name}","destination":"Pegue a rampa à esquerda sentido {destination}","exit":"Pegue a saída {exit} à esquerda","exit_destination":"Pegue a saída {exit}  à esquerda em direção à {destination}"},"right":{"default":"Pegue a rampa à direita","name":"Pegue a rampa à direita em {way_name}","destination":"Pegue a rampa à direita sentido {destination}","exit":"Pegue a saída {exit} à direita","exit_destination":"Pegue a saída {exit} à direita em direção à {destination}"},"sharp left":{"default":"Pegue a rampa à esquerda","name":"Pegue a rampa à esquerda em {way_name}","destination":"Pegue a rampa à esquerda sentido {destination}","exit":"Pegue a saída {exit} à esquerda","exit_destination":"Pegue a saída {exit}  à esquerda em direção à {destination}"},"sharp right":{"default":"Pegue a rampa à direita","name":"Pegue a rampa à direita em {way_name}","destination":"Pegue a rampa à direita sentido {destination}","exit":"Pegue a saída {exit} à direita","exit_destination":"Pegue a saída {exit} à direita em direção à {destination}"},"slight left":{"default":"Pegue a rampa à esquerda","name":"Pegue a rampa à esquerda em {way_name}","destination":"Pegue a rampa à esquerda sentido {destination}","exit":"Pegue a saída {exit} à esquerda","exit_destination":"Pegue a saída {exit}  à esquerda em direção à {destination}"},"slight right":{"default":"Pegue a rampa à direita","name":"Pegue a rampa à direita em {way_name}","destination":"Pegue a rampa à direita sentido {destination}","exit":"Pegue a saída {exit} à direita","exit_destination":"Pegue a saída {exit} à direita em direção à {destination}"}},"on ramp":{"default":{"default":"Pegue a rampa","name":"Pegue a rampa em {way_name}","destination":"Pegue a rampa sentido {destination}"},"left":{"default":"Pegue a rampa à esquerda","name":"Pegue a rampa à esquerda em {way_name}","destination":"Pegue a rampa à esquerda sentido {destination}"},"right":{"default":"Pegue a rampa à direita","name":"Pegue a rampa à direita em {way_name}","destination":"Pegue a rampa à direita sentid {destination}"},"sharp left":{"default":"Pegue a rampa à esquerda","name":"Pegue a rampa à esquerda em {way_name}","destination":"Pegue a rampa à esquerda sentido {destination}"},"sharp right":{"default":"Pegue a rampa à direita","name":"Pegue a rampa à direita em {way_name}","destination":"Pegue a rampa à direita sentido {destination}"},"slight left":{"default":"Pegue a rampa à esquerda","name":"Pegue a rampa à esquerda em {way_name}","destination":"Pegue a rampa à esquerda sentido {destination}"},"slight right":{"default":"Pegue a rampa à direita","name":"Pegue a rampa à direita em {way_name}","destination":"Pegue a rampa à direita sentido {destination}"}},"rotary":{"default":{"default":{"default":"Entre na rotatória","name":"Entre na rotatória e saia na {way_name}","destination":"Entre na rotatória e saia sentido {destination}"},"name":{"default":"Entre em {rotary_name}","name":"Entre em {rotary_name} e saia em {way_name}","destination":"Entre em {rotary_name} e saia sentido {destination}"},"exit":{"default":"Entre na rotatória e pegue a {exit_number} saída","name":"Entre na rotatória e pegue a {exit_number} saída na {way_name}","destination":"Entre na rotatória e pegue a {exit_number} saída sentido {destination}"},"name_exit":{"default":"Entre em {rotary_name} e saia na {exit_number} saída","name":"Entre em {rotary_name} e saia na {exit_number} saída em {way_name}","destination":"Entre em {rotary_name} e saia na {exit_number} saída sentido {destination}"}}},"roundabout":{"default":{"exit":{"default":"Entre na rotatória e pegue a {exit_number} saída","name":"Entre na rotatória e pegue a {exit_number} saída na {way_name}","destination":"Entre na rotatória e pegue a {exit_number} saída sentido {destination}"},"default":{"default":"Entre na rotatória","name":"Entre na rotatória e saia na {way_name}","destination":"Entre na rotatória e saia sentido {destination}"}}},"roundabout turn":{"default":{"default":"Na rotatória, vire {modifier}","name":"Na rotatória, vire {modifier} na {way_name}","destination":"Na rotatória, vire {modifier} em direção à {destination}"},"left":{"default":"Na rotatória vire à esquerda","name":"Na rotatória vire à esquerda em {way_name}","destination":"Na rotatória vire à esquerda sentido {destination}"},"right":{"default":"Na rotatória vire à direita","name":"Na rotatória vire à direita em {way_name}","destination":"Na rotatória vire à direita sentido {destination}"},"straight":{"default":"Na rotatória siga em frente","name":"Na rotatória siga em frente pela {way_name}","destination":"Na rotatória siga em frente sentido {destination}"}},"exit roundabout":{"default":{"default":"Siga {modifier}","name":"Siga {modifier} em {way_name}","destination":"Siga {modifier} sentido {destination}"},"left":{"default":"Vire à esquerda","name":"Vire à esquerda em {way_name}","destination":"Vire à esquerda sentido {destination}"},"right":{"default":"Vire à direita","name":"Vire à direita em {way_name}","destination":"Vire à direita sentido {destination}"},"straight":{"default":"Siga reto","name":"Siga reto em {way_name}","destination":"Siga reto sentido {destination}"}},"exit rotary":{"default":{"default":"Siga {modifier}","name":"Siga {modifier} em {way_name}","destination":"Siga {modifier} sentido {destination}"},"left":{"default":"Vire à esquerda","name":"Vire à esquerda em {way_name}","destination":"Vire à esquerda sentido {destination}"},"right":{"default":"Vire à direita","name":"Vire à direita em {way_name}","destination":"Vire à direita sentido {destination}"},"straight":{"default":"Siga reto","name":"Siga reto em {way_name}","destination":"Siga reto sentido {destination}"}},"turn":{"default":{"default":"Siga {modifier}","name":"Siga {modifier} em {way_name}","destination":"Siga {modifier} sentido {destination}"},"left":{"default":"Vire à esquerda","name":"Vire à esquerda em {way_name}","destination":"Vire à esquerda sentido {destination}"},"right":{"default":"Vire à direita","name":"Vire à direita em {way_name}","destination":"Vire à direita sentido {destination}"},"straight":{"default":"Siga em frente","name":"Siga em frente em {way_name}","destination":"Siga em frente sentido {destination}"}},"use lane":{"no_lanes":{"default":"Continue em frente"},"default":{"default":"{lane_instruction}"}}};
var ptBR = {
	meta: meta$12,
	v5: v5$12
};

var ptBR$1 = Object.freeze({
	meta: meta$12,
	v5: v5$12,
	default: ptBR
});

const meta$13 = {"capitalizeFirstLetter":true};
const v5$13 = {"constants":{"ordinalize":{"1":"prima","2":"a 2-a","3":"a 3-a","4":"a 4-a","5":"a 5-a","6":"a 6-a","7":"a 7-a","8":"a 8-a","9":"a 9-a","10":"a 10-a"},"direction":{"north":"nord","northeast":"nord-est","east":"est","southeast":"sud-est","south":"sud","southwest":"sud-vest","west":"vest","northwest":"nord-vest"},"modifier":{"left":"stânga","right":"dreapta","sharp left":"brusc stânga","sharp right":"brusc dreapta","slight left":"ușor stânga","slight right":"ușor dreapta","straight":"înainte","uturn":"întoarcere"},"lanes":{"xo":"Menține dreapta","ox":"Menține dreapta","xox":"Menține pe interior","oxo":"Menține pe laterale"}},"modes":{"ferry":{"default":"Ia feribotul","name":"Ia feribotul {way_name}","destination":"Ia feribotul spre {destination}"}},"phrase":{"two linked by distance":"{instruction_one}, then, in {distance}, {instruction_two}","two linked":"{instruction_one} apoi {instruction_two}","one in distance":"În {distance}, {instruction_one}","name and ref":"{name} ({ref})","exit with number":"exit {exit}"},"arrive":{"default":{"default":"Ați ajuns la {nth} destinație","upcoming":"Ați ajuns la {nth} destinație","short":"Ați ajuns la {nth} destinație","short-upcoming":"Ați ajuns la {nth} destinație"},"left":{"default":"Ați ajuns la {nth} destinație, pe stânga","upcoming":"Ați ajuns la {nth} destinație, pe stânga","short":"Ați ajuns la {nth} destinație","short-upcoming":"Ați ajuns la {nth} destinație"},"right":{"default":"Ați ajuns la {nth} destinație, pe dreapta","upcoming":"Ați ajuns la {nth} destinație, pe dreapta","short":"Ați ajuns la {nth} destinație","short-upcoming":"Ați ajuns la {nth} destinație"},"sharp left":{"default":"Ați ajuns la {nth} destinație, pe stânga","upcoming":"Ați ajuns la {nth} destinație, pe stânga","short":"Ați ajuns la {nth} destinație","short-upcoming":"Ați ajuns la {nth} destinație"},"sharp right":{"default":"Ați ajuns la {nth} destinație, pe dreapta","upcoming":"Ați ajuns la {nth} destinație, pe dreapta","short":"Ați ajuns la {nth} destinație","short-upcoming":"Ați ajuns la {nth} destinație"},"slight right":{"default":"Ați ajuns la {nth} destinație, pe dreapta","upcoming":"Ați ajuns la {nth} destinație, pe dreapta","short":"Ați ajuns la {nth} destinație","short-upcoming":"Ați ajuns la {nth} destinație"},"slight left":{"default":"Ați ajuns la {nth} destinație, pe stânga","upcoming":"Ați ajuns la {nth} destinație, pe stânga","short":"Ați ajuns la {nth} destinație","short-upcoming":"Ați ajuns la {nth} destinație"},"straight":{"default":"Ați ajuns la {nth} destinație, în față","upcoming":"Ați ajuns la {nth} destinație, în față","short":"Ați ajuns la {nth} destinație","short-upcoming":"Ați ajuns la {nth} destinație"}},"continue":{"default":{"default":"Virează {modifier}","name":"Virați {modifier} pe {way_name}","destination":"Virați {modifier} spre {destination}","exit":"Virați {modifier} pe {way_name}"},"straight":{"default":"Mergeți înainte","name":"Continuați înainte pe {way_name}","destination":"Continuați spre {destination}","distance":"Continuați înainte {distance}","namedistance":"Continuați pe {way_name} {distance}"},"sharp left":{"default":"Virați brusc stânga","name":"Virați brusc stânga pe {way_name}","destination":"Virați brusc stânga spre {destination}"},"sharp right":{"default":"Virați brusc dreapta","name":"Virați brusc stânga pe {way_name}","destination":"Virați brusc dreapta spre {destination}"},"slight left":{"default":"Virați ușor stânga","name":"Virați ușor stânga pe {way_name}","destination":"Virați ușor stânga spre {destination}"},"slight right":{"default":"Virați ușor dreapta","name":"Virați ușor dreapta pe {way_name}","destination":"Virați ușor dreapta spre {destination}"},"uturn":{"default":"Întoarceți-vă","name":"Întoarceți-vă și continuați pe {way_name}","destination":"Întoarceți-vă spre {destination}"}},"depart":{"default":{"default":"Mergeți {direction}","name":"Mergeți {direction} pe {way_name}","namedistance":"Head {direction} on {way_name} for {distance}"}},"end of road":{"default":{"default":"Virați {modifier}","name":"Virați {modifier} pe {way_name}","destination":"Virați {modifier} spre {destination}"},"straight":{"default":"Continuați înainte","name":"Continuați înainte pe {way_name}","destination":"Continuați înainte spre {destination}"},"uturn":{"default":"Întoarceți-vă la sfârșitul drumului","name":"Întoarceți-vă pe {way_name} la sfârșitul drumului","destination":"Întoarceți-vă spre {destination} la sfârșitul drumului"}},"fork":{"default":{"default":"Mențineți {modifier} la bifurcație","name":"Mențineți {modifier} la bifurcație pe {way_name}","destination":"Mențineți {modifier} la bifurcație spre {destination}"},"slight left":{"default":"Mențineți stânga la bifurcație","name":"Mențineți stânga la bifurcație pe {way_name}","destination":"Mențineți stânga la bifurcație spre {destination}"},"slight right":{"default":"Mențineți dreapta la bifurcație","name":"Mențineți dreapta la bifurcație pe {way_name}","destination":"Mențineți dreapta la bifurcație spre {destination}"},"sharp left":{"default":"Virați brusc stânga la bifurcație","name":"Virați brusc stânga la bifurcație pe {way_name}","destination":"Virați brusc stânga la bifurcație spre {destination}"},"sharp right":{"default":"Virați brusc dreapta la bifurcație","name":"Virați brusc dreapta la bifurcație pe {way_name}","destination":"Virați brusc dreapta la bifurcație spre {destination}"},"uturn":{"default":"Întoarceți-vă","name":"Întoarceți-vă pe {way_name}","destination":"Întoarceți-vă spre {destination}"}},"merge":{"default":{"default":"Intrați în {modifier}","name":"Intrați în {modifier} pe {way_name}","destination":"Intrați în {modifier} spre {destination}"},"straight":{"default":"Intrați în înainte","name":"Intrați în înainte pe {way_name}","destination":"Intrați în înainte spre {destination}"},"slight left":{"default":"Intrați în stânga","name":"Intrați în stânga pe {way_name}","destination":"Intrați în stânga spre {destination}"},"slight right":{"default":"Intrați în dreapta","name":"Intrați în dreapta pe {way_name}","destination":"Intrați în dreapta spre {destination}"},"sharp left":{"default":"Intrați în stânga","name":"Intrați în stânga pe {way_name}","destination":"Intrați în stânga spre {destination}"},"sharp right":{"default":"Intrați în dreapta","name":"Intrați în dreapta pe {way_name}","destination":"Intrați în dreapta spre {destination}"},"uturn":{"default":"Întoarceți-vă","name":"Întoarceți-vă pe {way_name}","destination":"Întoarceți-vă spre {destination}"}},"new name":{"default":{"default":"Continuați {modifier}","name":"Continuați {modifier} pe {way_name}","destination":"Continuați {modifier} spre {destination}"},"straight":{"default":"Continuați înainte","name":"Continuați pe {way_name}","destination":"Continuați spre {destination}"},"sharp left":{"default":"Virați brusc stânga","name":"Virați brusc stânga pe {way_name}","destination":"Virați brusc stânga spre {destination}"},"sharp right":{"default":"Virați brusc dreapta","name":"Virați brusc dreapta pe {way_name}","destination":"Virați brusc dreapta spre {destination}"},"slight left":{"default":"Continuați ușor stânga","name":"Continuați ușor stânga pe {way_name}","destination":"Continuați ușor stânga spre {destination}"},"slight right":{"default":"Continuați ușor dreapta","name":"Continuați ușor dreapta pe {way_name}","destination":"Continuați ușor dreapta spre {destination}"},"uturn":{"default":"Întoarceți-vă","name":"Întoarceți-vă pe {way_name}","destination":"Întoarceți-vă spre {destination}"}},"notification":{"default":{"default":"Continuați {modifier}","name":"Continuați {modifier} pe {way_name}","destination":"Continuați {modifier} spre {destination}"},"uturn":{"default":"Întoarceți-vă","name":"Întoarceți-vă pe {way_name}","destination":"Întoarceți-vă spre {destination}"}},"off ramp":{"default":{"default":"Urmați rampa","name":"Urmați rampa pe {way_name}","destination":"Urmați rampa spre {destination}","exit":"Ieșiți pe ieșirea {exit}","exit_destination":"Ieșiți pe ieșirea {exit}spre {destination}"},"left":{"default":"Urmați rampa pe stânga","name":"Urmați rampa pe stânga pe {way_name}","destination":"Urmați rampa pe stânga spre {destination}","exit":"Ieșiți pe ieșirea {exit} pe stânga","exit_destination":"Ieșiți pe ieșirea {exit} pe stânga spre {destination}"},"right":{"default":"Urmați rampa pe dreapta","name":"Urmați rampa pe dreapta pe {way_name}","destination":"Urmați rampa pe dreapta spre {destination}","exit":"Ieșiți pe ieșirea {exit} pe dreapta","exit_destination":"Ieșiți pe ieșirea {exit} pe dreapta spre {destination}"},"sharp left":{"default":"Urmați rampa pe stânga","name":"Urmați rampa pe stânga pe {way_name}","destination":"Urmați rampa pe stânga spre {destination}","exit":"Ieșiți pe ieșirea {exit} pe stânga","exit_destination":"Ieșiți pe ieșirea {exit} pe stânga spre {destination}"},"sharp right":{"default":"Urmați rampa pe dreapta","name":"Urmați rampa pe dreapta pe {way_name}","destination":"Urmați rampa pe dreapta spre {destination}","exit":"Ieșiți pe ieșirea {exit} pe dreapta","exit_destination":"Ieșiți pe ieșirea {exit} pe dreapta spre {destination}"},"slight left":{"default":"Urmați rampa pe stânga","name":"Urmați rampa pe stânga pe {way_name}","destination":"Urmați rampa pe stânga spre {destination}","exit":"Ieșiți pe ieșirea {exit} pe stânga","exit_destination":"Ieșiți pe ieșirea {exit} pe stânga spre {destination}"},"slight right":{"default":"Urmați rampa pe dreapta","name":"Urmați rampa pe dreapta pe {way_name}","destination":"Urmați rampa pe dreapta spre {destination}","exit":"Ieșiți pe ieșirea {exit} pe dreapta","exit_destination":"Ieșiți pe ieșirea {exit} pe dreapta spre {destination}"}},"on ramp":{"default":{"default":"Urmați rampa","name":"Urmați rampa pe {way_name}","destination":"Urmați rampa spre {destination}"},"left":{"default":"Urmați rampa pe stânga","name":"Urmați rampa pe stânga pe {way_name}","destination":"Urmați rampa pe stânga spre {destination}"},"right":{"default":"Urmați rampa pe dreapta","name":"Urmați rampa pe dreapta pe {way_name}","destination":"Urmați rampa pe dreapta spre {destination}"},"sharp left":{"default":"Urmați rampa pe stânga","name":"Urmați rampa pe stânga pe {way_name}","destination":"Urmați rampa pe stânga spre {destination}"},"sharp right":{"default":"Urmați rampa pe dreapta","name":"Urmați rampa pe dreapta pe {way_name}","destination":"Urmați rampa pe dreapta spre {destination}"},"slight left":{"default":"Urmați rampa pe stânga","name":"Urmați rampa pe stânga pe {way_name}","destination":"Urmați rampa pe stânga spre {destination}"},"slight right":{"default":"Urmați rampa pe dreapta","name":"Urmați rampa pe dreapta pe {way_name}","destination":"Urmați rampa pe dreapta spre {destination}"}},"rotary":{"default":{"default":{"default":"Intrați în sensul giratoriu","name":"Intrați în sensul giratoriu și ieșiți pe {way_name}","destination":"Intrați în sensul giratoriu și ieșiți spre {destination}"},"name":{"default":"Intrați în  {rotary_name}","name":"Intrați în  {rotary_name} și ieșiți pe {way_name}","destination":"Intrați în  {rotary_name} și ieșiți spre {destination}"},"exit":{"default":"Intrați în sensul giratoriu și mergeți spre ieșirea {exit_number}","name":"Intrați în sensul giratoriu și mergeți spre ieșirea {exit_number} pe {way_name}","destination":"Intrați în sensul giratoriu și mergeți spre ieșirea {exit_number} spre {destination}"},"name_exit":{"default":"Intrați în  {rotary_name} și mergeți spre ieșirea {exit_number}","name":"Intrați în  {rotary_name} și mergeți spre ieșirea {exit_number} pe {way_name}","destination":"Intrați în  {rotary_name} și mergeți spre ieșirea {exit_number} spre {destination}"}}},"roundabout":{"default":{"exit":{"default":"Intrați în sensul giratoriu și mergeți spre ieșirea {exit_number}","name":"Intrați în sensul giratoriu și mergeți spre ieșirea {exit_number} pe {way_name}","destination":"Intrați în sensul giratoriu și mergeți spre ieșirea {exit_number} spre {destination}"},"default":{"default":"Intrați în sensul giratoriu","name":"Intrați în sensul giratoriu și ieșiți pe {way_name}","destination":"Intrați în sensul giratoriu și ieșiți spre {destination}"}}},"roundabout turn":{"default":{"default":"La sensul giratoriu virați {modifier}","name":"La sensul giratoriu virați {modifier} pe {way_name}","destination":"La sensul giratoriu virați {modifier} spre {destination}"},"left":{"default":"La sensul giratoriu virați stânga","name":"La sensul giratoriu virați stânga pe {way_name}","destination":"La sensul giratoriu virați stânga spre {destination}"},"right":{"default":"La sensul giratoriu virați dreapta","name":"La sensul giratoriu virați dreapta pe {way_name}","destination":"La sensul giratoriu virați dreapta spre {destination}"},"straight":{"default":"La sensul giratoriu continuați înainte","name":"La sensul giratoriu continuați înainte pe {way_name}","destination":"La sensul giratoriu continuați înainte spre {destination}"}},"exit roundabout":{"default":{"default":"Virați {modifier}","name":"Virați {modifier} pe {way_name}","destination":"Virați {modifier} spre {destination}"},"left":{"default":"Virați stânga","name":"Virați stânga pe {way_name}","destination":"Virați stânga spre {destination}"},"right":{"default":"Virați dreapta","name":"Virați dreapta pe {way_name}","destination":"Virați dreapta spre {destination}"},"straight":{"default":"Mergeți înainte","name":"Mergeți înainte pe {way_name}","destination":"Mergeți înainte spre {destination}"}},"exit rotary":{"default":{"default":"Virați {modifier}","name":"Virați {modifier} pe {way_name}","destination":"Virați {modifier} spre {destination}"},"left":{"default":"Virați stânga","name":"Virați stânga pe {way_name}","destination":"Virați stânga spre {destination}"},"right":{"default":"Virați dreapta","name":"Virați dreapta pe {way_name}","destination":"Virați dreapta spre {destination}"},"straight":{"default":"Mergeți înainte","name":"Mergeți înainte pe {way_name}","destination":"Mergeți înainte spre {destination}"}},"turn":{"default":{"default":"Virați {modifier}","name":"Virați {modifier} pe {way_name}","destination":"Virați {modifier} spre {destination}"},"left":{"default":"Virați stânga","name":"Virați stânga pe {way_name}","destination":"Virați stânga spre {destination}"},"right":{"default":"Virați dreapta","name":"Virați dreapta pe {way_name}","destination":"Virați dreapta spre {destination}"},"straight":{"default":"Mergeți înainte","name":"Mergeți înainte pe {way_name}","destination":"Mergeți înainte spre {destination}"}},"use lane":{"no_lanes":{"default":"Mergeți înainte"},"default":{"default":"{lane_instruction}"}}};
var ro = {
	meta: meta$13,
	v5: v5$13
};

var ro$1 = Object.freeze({
	meta: meta$13,
	v5: v5$13,
	default: ro
});

const meta$14 = {"capitalizeFirstLetter":true};
const v5$14 = {"constants":{"ordinalize":{"1":"первый","2":"второй","3":"третий","4":"четвёртый","5":"пятый","6":"шестой","7":"седьмой","8":"восьмой","9":"девятый","10":"десятый"},"direction":{"north":"северном","northeast":"северо-восточном","east":"восточном","southeast":"юго-восточном","south":"южном","southwest":"юго-западном","west":"западном","northwest":"северо-западном"},"modifier":{"left":"налево","right":"направо","sharp left":"налево","sharp right":"направо","slight left":"левее","slight right":"правее","straight":"прямо","uturn":"на разворот"},"lanes":{"xo":"Держитесь правее","ox":"Держитесь левее","xox":"Держитесь посередине","oxo":"Держитесь слева или справа"}},"modes":{"ferry":{"default":"Погрузитесь на паром","name":"Погрузитесь на паром {way_name}","destination":"Погрузитесь на паром в направлении {destination}"}},"phrase":{"two linked by distance":"{instruction_one}, затем через {distance} {instruction_two}","two linked":"{instruction_one}, затем {instruction_two}","one in distance":"Через {distance} {instruction_one}","name and ref":"{name} ({ref})","exit with number":"exit {exit}"},"arrive":{"default":{"default":"Вы прибыли в {nth} пункт назначения","upcoming":"Вы прибудете в {nth} пункт назначения","short":"Вы прибыли","short-upcoming":"Вы скоро прибудете"},"left":{"default":"Вы прибыли в {nth} пункт назначения, он находится слева","upcoming":"Вы прибудете в {nth} пункт назначения, он будет слева","short":"Вы прибыли","short-upcoming":"Вы скоро прибудете"},"right":{"default":"Вы прибыли в {nth} пункт назначения, он находится справа","upcoming":"Вы прибудете в {nth} пункт назначения, он будет справа","short":"Вы прибыли","short-upcoming":"Вы скоро прибудете"},"sharp left":{"default":"Вы прибыли в {nth} пункт назначения, он находится слева сзади","upcoming":"Вы прибудете в {nth} пункт назначения, он будет слева сзади","short":"Вы прибыли","short-upcoming":"Вы скоро прибудете"},"sharp right":{"default":"Вы прибыли в {nth} пункт назначения, он находится справа сзади","upcoming":"Вы прибудете в {nth} пункт назначения, он будет справа сзади","short":"Вы прибыли","short-upcoming":"Вы скоро прибудете"},"slight right":{"default":"Вы прибыли в {nth} пункт назначения, он находится справа впереди","upcoming":"Вы прибудете в {nth} пункт назначения, он будет справа впереди","short":"Вы прибыли","short-upcoming":"Вы скоро прибудете"},"slight left":{"default":"Вы прибыли в {nth} пункт назначения, он находится слева впереди","upcoming":"Вы прибудете в {nth} пункт назначения, он будет слева впереди","short":"Вы прибыли","short-upcoming":"Вы скоро прибудете"},"straight":{"default":"Вы прибыли в {nth} пункт назначения, он находится перед Вами","upcoming":"Вы прибудете в {nth} пункт назначения, он будет перед Вами","short":"Вы прибыли","short-upcoming":"Вы скоро прибудете"}},"continue":{"default":{"default":"Двигайтесь {modifier}","name":"Двигайтесь {modifier} по {way_name:dative}","destination":"Двигайтесь {modifier} в направлении {destination}","exit":"Двигайтесь {modifier} на {way_name:accusative}"},"straight":{"default":"Двигайтесь прямо","name":"Продолжите движение по {way_name:dative}","destination":"Продолжите движение в направлении {destination}","distance":"Двигайтесь прямо {distance}","namedistance":"Двигайтесь прямо {distance} по {way_name:dative}"},"sharp left":{"default":"Резко поверните налево","name":"Резко поверните налево на {way_name:accusative}","destination":"Резко поверните налево в направлении {destination}"},"sharp right":{"default":"Резко поверните направо","name":"Резко поверните направо на {way_name:accusative}","destination":"Резко поверните направо в направлении {destination}"},"slight left":{"default":"Плавно поверните налево","name":"Плавно поверните налево на {way_name:accusative}","destination":"Плавно поверните налево в направлении {destination}"},"slight right":{"default":"Плавно поверните направо","name":"Плавно поверните направо на {way_name:accusative}","destination":"Плавно поверните направо в направлении {destination}"},"uturn":{"default":"Развернитесь","name":"Развернитесь и продолжите движение по {way_name:dative}","destination":"Развернитесь в направлении {destination}"}},"depart":{"default":{"default":"Двигайтесь в {direction} направлении","name":"Двигайтесь в {direction} направлении по {way_name:dative}","namedistance":"Двигайтесь {distance} в {direction} направлении по {way_name:dative}"}},"end of road":{"default":{"default":"Поверните {modifier}","name":"Поверните {modifier} на {way_name:accusative}","destination":"Поверните {modifier} в направлении {destination}"},"straight":{"default":"Двигайтесь прямо","name":"Двигайтесь прямо по {way_name:dative}","destination":"Двигайтесь прямо в направлении {destination}"},"uturn":{"default":"В конце дороги развернитесь","name":"Развернитесь в конце {way_name:genitive}","destination":"В конце дороги развернитесь в направлении {destination}"}},"fork":{"default":{"default":"На развилке двигайтесь {modifier}","name":"На развилке двигайтесь {modifier} на {way_name:accusative}","destination":"На развилке двигайтесь {modifier} в направлении {destination}"},"slight left":{"default":"На развилке держитесь левее","name":"На развилке держитесь левее на {way_name:accusative}","destination":"На развилке держитесь левее и продолжите движение в направлении {destination}"},"slight right":{"default":"На развилке держитесь правее","name":"На развилке держитесь правее на {way_name:accusative}","destination":"На развилке держитесь правее и продолжите движение в направлении {destination}"},"sharp left":{"default":"На развилке резко поверните налево","name":"Резко поверните налево на {way_name:accusative}","destination":"Резко поверните налево и продолжите движение в направлении {destination}"},"sharp right":{"default":"На развилке резко поверните направо","name":"Резко поверните направо на {way_name:accusative}","destination":"Резко поверните направо и продолжите движение в направлении {destination}"},"uturn":{"default":"На развилке развернитесь","name":"На развилке развернитесь на {way_name:prepositional}","destination":"На развилке развернитесь и продолжите движение в направлении {destination}"}},"merge":{"default":{"default":"Перестройтесь {modifier}","name":"Перестройтесь {modifier} на {way_name:accusative}","destination":"Перестройтесь {modifier} в направлении {destination}"},"straight":{"default":"Двигайтесь прямо","name":"Продолжите движение по {way_name:dative}","destination":"Продолжите движение в направлении {destination}"},"slight left":{"default":"Перестройтесь левее","name":"Перестройтесь левее на {way_name:accusative}","destination":"Перестройтесь левее в направлении {destination}"},"slight right":{"default":"Перестройтесь правее","name":"Перестройтесь правее на {way_name:accusative}","destination":"Перестройтесь правее в направлении {destination}"},"sharp left":{"default":"Перестраивайтесь левее","name":"Перестраивайтесь левее на {way_name:accusative}","destination":"Перестраивайтесь левее в направлении {destination}"},"sharp right":{"default":"Перестраивайтесь правее","name":"Перестраивайтесь правее на {way_name:accusative}","destination":"Перестраивайтесь правее в направлении {destination}"},"uturn":{"default":"Развернитесь","name":"Развернитесь на {way_name:prepositional}","destination":"Развернитесь в направлении {destination}"}},"new name":{"default":{"default":"Двигайтесь {modifier}","name":"Двигайтесь {modifier} на {way_name:accusative}","destination":"Двигайтесь {modifier} в направлении {destination}"},"straight":{"default":"Двигайтесь прямо","name":"Продолжите движение по {way_name:dative}","destination":"Продолжите движение в направлении {destination}"},"sharp left":{"default":"Резко поверните налево","name":"Резко поверните налево на {way_name:accusative}","destination":"Резко поверните налево и продолжите движение в направлении {destination}"},"sharp right":{"default":"Резко поверните направо","name":"Резко поверните направо на {way_name:accusative}","destination":"Резко поверните направо и продолжите движение в направлении {destination}"},"slight left":{"default":"Плавно поверните налево","name":"Плавно поверните налево на {way_name:accusative}","destination":"Плавно поверните налево в направлении {destination}"},"slight right":{"default":"Плавно поверните направо","name":"Плавно поверните направо на {way_name:accusative}","destination":"Плавно поверните направо в направлении {destination}"},"uturn":{"default":"Развернитесь","name":"Развернитесь на {way_name:prepositional}","destination":"Развернитесь и продолжите движение в направлении {destination}"}},"notification":{"default":{"default":"Двигайтесь {modifier}","name":"Двигайтесь {modifier} по {way_name:dative}","destination":"Двигайтесь {modifier} в направлении {destination}"},"uturn":{"default":"Развернитесь","name":"Развернитесь на {way_name:prepositional}","destination":"Развернитесь и продолжите движение в направлении {destination}"}},"off ramp":{"default":{"default":"Сверните на съезд","name":"Сверните на съезд на {way_name:accusative}","destination":"Сверните на съезд в направлении {destination}","exit":"Сверните на съезд {exit}","exit_destination":"Сверните на съезд {exit} в направлении {destination}"},"left":{"default":"Сверните на левый съезд","name":"Сверните на левый съезд на {way_name:accusative}","destination":"Сверните на левый съезд в направлении {destination}","exit":"Сверните на съезд {exit} слева","exit_destination":"Сверните на съезд {exit} слева в направлении {destination}"},"right":{"default":"Сверните на правый съезд","name":"Сверните на правый съезд на {way_name:accusative}","destination":"Сверните на правый съезд в направлении {destination}","exit":"Сверните на съезд {exit} справа","exit_destination":"Сверните на съезд {exit} справа в направлении {destination}"},"sharp left":{"default":"Поверните налево на съезд","name":"Поверните налево на съезд на {way_name:accusative}","destination":"Поверните налево на съезд в направлении {destination}","exit":"Поверните налево на съезд {exit}","exit_destination":"Поверните налево на съезд {exit} в направлении {destination}"},"sharp right":{"default":"Поверните направо на съезд","name":"Поверните направо на съезд на {way_name:accusative}","destination":"Поверните направо на съезд в направлении {destination}","exit":"Поверните направо на съезд {exit}","exit_destination":"Поверните направо на съезд {exit} в направлении {destination}"},"slight left":{"default":"Перестройтесь левее на съезд","name":"Перестройтесь левее на съезд на {way_name:accusative}","destination":"Перестройтесь левее на съезд в направлении {destination}","exit":"Перестройтесь левее на {exit}","exit_destination":"Перестройтесь левее на съезд {exit} в направлении {destination}"},"slight right":{"default":"Перестройтесь правее на съезд","name":"Перестройтесь правее на съезд на {way_name:accusative}","destination":"Перестройтесь правее на съезд в направлении {destination}","exit":"Перестройтесь правее на съезд {exit}","exit_destination":"Перестройтесь правее на съезд {exit} в направлении {destination}"}},"on ramp":{"default":{"default":"Сверните на автомагистраль","name":"Сверните на въезд на {way_name:accusative}","destination":"Сверните на въезд на автомагистраль в направлении {destination}"},"left":{"default":"Сверните на левый въезд на автомагистраль","name":"Сверните на левый въезд на {way_name:accusative}","destination":"Сверните на левый въезд на автомагистраль в направлении {destination}"},"right":{"default":"Сверните на правый въезд на автомагистраль","name":"Сверните на правый въезд на {way_name:accusative}","destination":"Сверните на правый въезд на автомагистраль в направлении {destination}"},"sharp left":{"default":"Поверните на левый въезд на автомагистраль","name":"Поверните на левый въезд на {way_name:accusative}","destination":"Поверните на левый въезд на автомагистраль в направлении {destination}"},"sharp right":{"default":"Поверните на правый въезд на автомагистраль","name":"Поверните на правый въезд на {way_name:accusative}","destination":"Поверните на правый въезд на автомагистраль в направлении {destination}"},"slight left":{"default":"Перестройтесь левее на въезд на автомагистраль","name":"Перестройтесь левее на {way_name:accusative}","destination":"Перестройтесь левее на автомагистраль в направлении {destination}"},"slight right":{"default":"Перестройтесь правее на въезд на автомагистраль","name":"Перестройтесь правее на {way_name:accusative}","destination":"Перестройтесь правее на автомагистраль в направлении {destination}"}},"rotary":{"default":{"default":{"default":"Продолжите движение по круговой развязке","name":"На круговой развязке сверните на {way_name:accusative}","destination":"На круговой развязке сверните в направлении {destination}"},"name":{"default":"Продолжите движение по {rotary_name:dative}","name":"На {rotary_name:prepositional} сверните на {way_name:accusative}","destination":"На {rotary_name:prepositional} сверните в направлении {destination}"},"exit":{"default":"На круговой развязке сверните на {exit_number} съезд","name":"На круговой развязке сверните на {exit_number} съезд на {way_name:accusative}","destination":"На круговой развязке сверните на {exit_number} съезд в направлении {destination}"},"name_exit":{"default":"На {rotary_name:prepositional} сверните на {exit_number} съезд","name":"На {rotary_name:prepositional} сверните на {exit_number} съезд на {way_name:accusative}","destination":"На {rotary_name:prepositional} сверните на {exit_number} съезд в направлении {destination}"}}},"roundabout":{"default":{"exit":{"default":"На круговой развязке сверните на {exit_number} съезд","name":"На круговой развязке сверните на {exit_number} съезд на {way_name:accusative}","destination":"На круговой развязке сверните на {exit_number} съезд в направлении {destination}"},"default":{"default":"Продолжите движение по круговой развязке","name":"На круговой развязке сверните на {way_name:accusative}","destination":"На круговой развязке сверните в направлении {destination}"}}},"roundabout turn":{"default":{"default":"Двигайтесь {modifier}","name":"Двигайтесь {modifier} на {way_name:accusative}","destination":"Двигайтесь {modifier} в направлении {destination}"},"left":{"default":"Сверните налево","name":"Сверните налево на {way_name:accusative}","destination":"Сверните налево в направлении {destination}"},"right":{"default":"Сверните направо","name":"Сверните направо на {way_name:accusative}","destination":"Сверните направо в направлении {destination}"},"straight":{"default":"Двигайтесь прямо","name":"Двигайтесь прямо по {way_name:dative}","destination":"Двигайтесь прямо в направлении {destination}"}},"exit roundabout":{"default":{"default":"Сверните с круговой развязки","name":"Сверните с круговой развязки на {way_name:accusative}","destination":"Сверните с круговой развязки в направлении {destination}"}},"exit rotary":{"default":{"default":"Сверните с круговой развязки","name":"Сверните с круговой развязки на {way_name:accusative}","destination":"Сверните с круговой развязки в направлении {destination}"}},"turn":{"default":{"default":"Двигайтесь {modifier}","name":"Двигайтесь {modifier} на {way_name:accusative}","destination":"Двигайтесь {modifier}  в направлении {destination}"},"left":{"default":"Поверните налево","name":"Поверните налево на {way_name:accusative}","destination":"Поверните налево в направлении {destination}"},"right":{"default":"Поверните направо","name":"Поверните направо на {way_name:accusative}","destination":"Поверните направо  в направлении {destination}"},"straight":{"default":"Двигайтесь прямо","name":"Двигайтесь по {way_name:dative}","destination":"Двигайтесь в направлении {destination}"}},"use lane":{"no_lanes":{"default":"Продолжайте движение прямо"},"default":{"default":"{lane_instruction}"}}};
var ru = {
	meta: meta$14,
	v5: v5$14
};

var ru$1 = Object.freeze({
	meta: meta$14,
	v5: v5$14,
	default: ru
});

const meta$15 = {"capitalizeFirstLetter":true};
const v5$15 = {"constants":{"ordinalize":{"1":"1:a","2":"2:a","3":"3:e","4":"4:e","5":"5:e","6":"6:e","7":"7:e","8":"8:e","9":"9:e","10":"10:e"},"direction":{"north":"norr","northeast":"nordost","east":"öster","southeast":"sydost","south":"söder","southwest":"sydväst","west":"väster","northwest":"nordväst"},"modifier":{"left":"vänster","right":"höger","sharp left":"vänster","sharp right":"höger","slight left":"vänster","slight right":"höger","straight":"rakt fram","uturn":"U-sväng"},"lanes":{"xo":"Håll till höger","ox":"Håll till vänster","xox":"Håll till mitten","oxo":"Håll till vänster eller höger"}},"modes":{"ferry":{"default":"Ta färjan","name":"Ta färjan på {way_name}","destination":"Ta färjan mot {destination}"}},"phrase":{"two linked by distance":"{instruction_one}, sedan efter {distance}, {instruction_two}","two linked":"{instruction_one}, sedan {instruction_two}","one in distance":"Om {distance}, {instruction_one}","name and ref":"{name} ({ref})","exit with number":"exit {exit}"},"arrive":{"default":{"default":"Du är framme vid din {nth} destination","upcoming":"Du är snart framme vid din {nth} destination","short":"Du är framme","short-upcoming":"Du är snart framme"},"left":{"default":"Du är framme vid din {nth} destination, till vänster","upcoming":"Du är snart framme vid din {nth} destination, till vänster","short":"Du är framme","short-upcoming":"Du är snart framme"},"right":{"default":"Du är framme vid din {nth} destination, till höger","upcoming":"Du är snart framme vid din {nth} destination, till höger","short":"Du är framme","short-upcoming":"Du är snart framme"},"sharp left":{"default":"Du är framme vid din {nth} destination, till vänster","upcoming":"Du är snart framme vid din {nth} destination, till vänster","short":"Du är framme","short-upcoming":"Du är snart framme"},"sharp right":{"default":"Du är framme vid din {nth} destination, till höger","upcoming":"Du är snart framme vid din {nth} destination, till höger","short":"Du är framme","short-upcoming":"Du är snart framme"},"slight right":{"default":"Du är framme vid din {nth} destination, till höger","upcoming":"Du är snart framme vid din {nth} destination, till höger","short":"Du är framme","short-upcoming":"Du är snart framme"},"slight left":{"default":"Du är framme vid din {nth} destination, till vänster","upcoming":"Du är snart framme vid din {nth} destination, till vänster","short":"Du är framme","short-upcoming":"Du är snart framme"},"straight":{"default":"Du är framme vid din {nth} destination, rakt fram","upcoming":"Du är snart framme vid din {nth} destination, rakt fram","short":"Du är framme","short-upcoming":"Du är snart framme"}},"continue":{"default":{"default":"Sväng {modifier}","name":"Sväng {modifier} och fortsätt på {way_name}","destination":"Sväng {modifier} mot {destination}","exit":"Sväng {modifier} in på {way_name}"},"straight":{"default":"Fortsätt rakt fram","name":"Kör rakt fram och fortsätt på {way_name}","destination":"Fortsätt mot {destination}","distance":"Fortsätt rakt fram i {distance}","namedistance":"Fortsätt på {way_name} i {distance}"},"sharp left":{"default":"Sväng vänster","name":"Sväng vänster och fortsätt på {way_name}","destination":"Sväng vänster mot {destination}"},"sharp right":{"default":"Sväng höger","name":"Sväng höger och fortsätt på {way_name}","destination":"Sväng höger mot {destination}"},"slight left":{"default":"Sväng vänster","name":"Sväng vänster och fortsätt på {way_name}","destination":"Sväng vänster mot {destination}"},"slight right":{"default":"Sväng höger","name":"Sväng höger och fortsätt på {way_name}","destination":"Sväng höger mot {destination}"},"uturn":{"default":"Gör en U-sväng","name":"Gör en U-sväng och fortsätt på {way_name}","destination":"Gör en U-sväng mot {destination}"}},"depart":{"default":{"default":"Kör åt {direction}","name":"Kör åt {direction} på {way_name}","namedistance":"Kör {distance} åt {direction} på {way_name}"}},"end of road":{"default":{"default":"Sväng {modifier}","name":"Sväng {modifier} in på {way_name}","destination":"Sväng {modifier} mot {destination}"},"straight":{"default":"Fortsätt rakt fram","name":"Fortsätt rakt fram in på {way_name}","destination":"Fortsätt rakt fram mot {destination}"},"uturn":{"default":"Gör en U-sväng i slutet av vägen","name":"Gör en U-sväng in på {way_name} i slutet av vägen","destination":"Gör en U-sväng mot {destination} i slutet av vägen"}},"fork":{"default":{"default":"Håll till {modifier} där vägen delar sig","name":"Håll till {modifier} in på {way_name}","destination":"Håll till {modifier} mot {destination}"},"slight left":{"default":"Håll till vänster där vägen delar sig","name":"Håll till vänster in på {way_name}","destination":"Håll till vänster mot {destination}"},"slight right":{"default":"Håll till höger där vägen delar sig","name":"Håll till höger in på {way_name}","destination":"Håll till höger mot {destination}"},"sharp left":{"default":"Sväng vänster där vägen delar sig","name":"Sväng vänster in på {way_name}","destination":"Sväng vänster mot {destination}"},"sharp right":{"default":"Sväng höger där vägen delar sig","name":"Sväng höger in på {way_name}","destination":"Sväng höger mot {destination}"},"uturn":{"default":"Gör en U-sväng","name":"Gör en U-sväng in på {way_name}","destination":"Gör en U-sväng mot {destination}"}},"merge":{"default":{"default":"Byt till {modifier} körfält","name":"Byt till {modifier} körfält, in på {way_name}","destination":"Byt till {modifier} körfält, mot {destination}"},"straight":{"default":"Fortsätt","name":"Kör in på {way_name}","destination":"Kör mot {destination}"},"slight left":{"default":"Byt till vänstra körfältet","name":"Byt till vänstra körfältet, in på {way_name}","destination":"Byt till vänstra körfältet, mot {destination}"},"slight right":{"default":"Byt till högra körfältet","name":"Byt till högra körfältet, in på {way_name}","destination":"Byt till högra körfältet, mot {destination}"},"sharp left":{"default":"Byt till vänstra körfältet","name":"Byt till vänstra körfältet, in på {way_name}","destination":"Byt till vänstra körfältet, mot {destination}"},"sharp right":{"default":"Byt till högra körfältet","name":"Byt till högra körfältet, in på {way_name}","destination":"Byt till högra körfältet, mot {destination}"},"uturn":{"default":"Gör en U-sväng","name":"Gör en U-sväng in på {way_name}","destination":"Gör en U-sväng mot {destination}"}},"new name":{"default":{"default":"Fortsätt {modifier}","name":"Fortsätt {modifier} på {way_name}","destination":"Fortsätt {modifier} mot {destination}"},"straight":{"default":"Fortsätt rakt fram","name":"Fortsätt in på {way_name}","destination":"Fortsätt mot {destination}"},"sharp left":{"default":"Gör en skarp vänstersväng","name":"Gör en skarp vänstersväng in på {way_name}","destination":"Gör en skarp vänstersväng mot {destination}"},"sharp right":{"default":"Gör en skarp högersväng","name":"Gör en skarp högersväng in på {way_name}","destination":"Gör en skarp högersväng mot {destination}"},"slight left":{"default":"Fortsätt med lätt vänstersväng","name":"Fortsätt med lätt vänstersväng in på {way_name}","destination":"Fortsätt med lätt vänstersväng mot {destination}"},"slight right":{"default":"Fortsätt med lätt högersväng","name":"Fortsätt med lätt högersväng in på {way_name}","destination":"Fortsätt med lätt högersväng mot {destination}"},"uturn":{"default":"Gör en U-sväng","name":"Gör en U-sväng in på {way_name}","destination":"Gör en U-sväng mot {destination}"}},"notification":{"default":{"default":"Fortsätt {modifier}","name":"Fortsätt {modifier} på {way_name}","destination":"Fortsätt {modifier} mot {destination}"},"uturn":{"default":"Gör en U-sväng","name":"Gör en U-sväng in på {way_name}","destination":"Gör en U-sväng mot {destination}"}},"off ramp":{"default":{"default":"Ta avfarten","name":"Ta avfarten in på {way_name}","destination":"Ta avfarten mot {destination}","exit":"Ta avfart {exit} ","exit_destination":"Ta avfart {exit} mot {destination}"},"left":{"default":"Ta avfarten till vänster","name":"Ta avfarten till vänster in på {way_name}","destination":"Ta avfarten till vänster mot {destination}","exit":"Ta avfart {exit} till vänster","exit_destination":"Ta avfart {exit} till vänster mot {destination}"},"right":{"default":"Ta avfarten till höger","name":"Ta avfarten till höger in på {way_name}","destination":"Ta avfarten till höger mot {destination}","exit":"Ta avfart {exit} till höger","exit_destination":"Ta avfart {exit} till höger mot {destination}"},"sharp left":{"default":"Ta avfarten till vänster","name":"Ta avfarten till vänster in på {way_name}","destination":"Ta avfarten till vänster mot {destination}","exit":"Ta avfart {exit} till vänster","exit_destination":"Ta avfart {exit} till vänster mot {destination}"},"sharp right":{"default":"Ta avfarten till höger","name":"Ta avfarten till höger in på {way_name}","destination":"Ta avfarten till höger mot {destination}","exit":"Ta avfart {exit} till höger","exit_destination":"Ta avfart {exit} till höger mot {destination}"},"slight left":{"default":"Ta avfarten till vänster","name":"Ta avfarten till vänster in på {way_name}","destination":"Ta avfarten till vänster mot {destination}","exit":"Ta avfart {exit} till vänster","exit_destination":"Ta avfart{exit} till vänster mot {destination}"},"slight right":{"default":"Ta avfarten till höger","name":"Ta avfarten till höger in på {way_name}","destination":"Ta avfarten till höger mot {destination}","exit":"Ta avfart {exit} till höger","exit_destination":"Ta avfart {exit} till höger mot {destination}"}},"on ramp":{"default":{"default":"Ta påfarten","name":"Ta påfarten in på {way_name}","destination":"Ta påfarten mot {destination}"},"left":{"default":"Ta påfarten till vänster","name":"Ta påfarten till vänster in på {way_name}","destination":"Ta påfarten till vänster mot {destination}"},"right":{"default":"Ta påfarten till höger","name":"Ta påfarten till höger in på {way_name}","destination":"Ta påfarten till höger mot {destination}"},"sharp left":{"default":"Ta påfarten till vänster","name":"Ta påfarten till vänster in på {way_name}","destination":"Ta påfarten till vänster mot {destination}"},"sharp right":{"default":"Ta påfarten till höger","name":"Ta påfarten till höger in på {way_name}","destination":"Ta påfarten till höger mot {destination}"},"slight left":{"default":"Ta påfarten till vänster","name":"Ta påfarten till vänster in på {way_name}","destination":"Ta påfarten till vänster mot {destination}"},"slight right":{"default":"Ta påfarten till höger","name":"Ta påfarten till höger in på {way_name}","destination":"Ta påfarten till höger mot {destination}"}},"rotary":{"default":{"default":{"default":"Kör in i rondellen","name":"I rondellen, ta avfarten in på {way_name}","destination":"I rondellen, ta av mot {destination}"},"name":{"default":"Kör in i {rotary_name}","name":"I {rotary_name}, ta av in på {way_name}","destination":"I {rotary_name}, ta av mot {destination}"},"exit":{"default":"I rondellen, ta {exit_number} avfarten","name":"I rondellen, ta {exit_number} avfarten in på {way_name}","destination":"I rondellen, ta {exit_number} avfarten mot {destination}"},"name_exit":{"default":"I {rotary_name}, ta {exit_number} avfarten","name":"I {rotary_name}, ta {exit_number}  avfarten in på {way_name}","destination":"I {rotary_name}, ta {exit_number} avfarten mot {destination}"}}},"roundabout":{"default":{"exit":{"default":"I rondellen, ta {exit_number} avfarten","name":"I rondellen, ta {exit_number} avfarten in på {way_name}","destination":"I rondellen, ta {exit_number} avfarten mot {destination}"},"default":{"default":"Kör in i rondellen","name":"I rondellen, ta avfarten in på {way_name}","destination":"I rondellen, ta av mot {destination}"}}},"roundabout turn":{"default":{"default":"Sväng {modifier}","name":"Sväng {modifier} in på {way_name}","destination":"Sväng {modifier} mot {destination}"},"left":{"default":"Sväng vänster","name":"Sväng vänster in på {way_name}","destination":"Sväng vänster mot {destination}"},"right":{"default":"Sväng höger","name":"Sväng höger in på {way_name}","destination":"Sväng höger mot {destination}"},"straight":{"default":"Fortsätt rakt fram","name":"Fortsätt rakt fram in på {way_name}","destination":"Fortsätt rakt fram mot {destination}"}},"exit roundabout":{"default":{"default":"Kör ut ur rondellen","name":"Kör ut ur rondellen in på {way_name}","destination":"Kör ut ur rondellen mot {destination}"}},"exit rotary":{"default":{"default":"Kör ut ur rondellen","name":"Kör ut ur rondellen in på {way_name}","destination":"Kör ut ur rondellen mot {destination}"}},"turn":{"default":{"default":"Sväng {modifier}","name":"Sväng {modifier} in på {way_name}","destination":"Sväng {modifier} mot {destination}"},"left":{"default":"Sväng vänster","name":"Sväng vänster in på {way_name}","destination":"Sväng vänster mot {destination}"},"right":{"default":"Sväng höger","name":"Sväng höger in på {way_name}","destination":"Sväng höger mot {destination}"},"straight":{"default":"Kör rakt fram","name":"Kör rakt fram in på {way_name}","destination":"Kör rakt fram mot {destination}"}},"use lane":{"no_lanes":{"default":"Fortsätt rakt fram"},"default":{"default":"{lane_instruction}"}}};
var sv = {
	meta: meta$15,
	v5: v5$15
};

var sv$1 = Object.freeze({
	meta: meta$15,
	v5: v5$15,
	default: sv
});

const meta$16 = {"capitalizeFirstLetter":true};
const v5$16 = {"constants":{"ordinalize":{"1":"birinci","2":"ikinci","3":"üçüncü","4":"dördüncü","5":"beşinci","6":"altıncı","7":"yedinci","8":"sekizinci","9":"dokuzuncu","10":"onuncu"},"direction":{"north":"kuzey","northeast":"kuzeydoğu","east":"doğu","southeast":"güneydoğu","south":"güney","southwest":"güneybatı","west":"batı","northwest":"kuzeybatı"},"modifier":{"left":"sol","right":"sağ","sharp left":"keskin sol","sharp right":"keskin sağ","slight left":"hafif sol","slight right":"hafif sağ","straight":"düz","uturn":"U dönüşü"},"lanes":{"xo":"Sağda kalın","ox":"Solda kalın","xox":"Ortada kalın","oxo":"Solda veya sağda kalın"}},"modes":{"ferry":{"default":"Vapur kullan","name":"{way_name} vapurunu kullan","destination":"{destination} istikametine giden vapuru kullan"}},"phrase":{"two linked by distance":"{instruction_one} ve {distance} sonra {instruction_two}","two linked":"{instruction_one} ve sonra {instruction_two}","one in distance":"{distance} sonra, {instruction_one}","name and ref":"{name} ({ref})","exit with number":"exit {exit}"},"arrive":{"default":{"default":"{nth} hedefinize ulaştınız","upcoming":"{nth} hedefinize ulaştınız","short":"{nth} hedefinize ulaştınız","short-upcoming":"{nth} hedefinize ulaştınız"},"left":{"default":"{nth} hedefinize ulaştınız, hedefiniz solunuzdadır","upcoming":"{nth} hedefinize ulaştınız, hedefiniz solunuzdadır","short":"{nth} hedefinize ulaştınız","short-upcoming":"{nth} hedefinize ulaştınız"},"right":{"default":"{nth} hedefinize ulaştınız, hedefiniz sağınızdadır","upcoming":"{nth} hedefinize ulaştınız, hedefiniz sağınızdadır","short":"{nth} hedefinize ulaştınız","short-upcoming":"{nth} hedefinize ulaştınız"},"sharp left":{"default":"{nth} hedefinize ulaştınız, hedefiniz solunuzdadır","upcoming":"{nth} hedefinize ulaştınız, hedefiniz solunuzdadır","short":"{nth} hedefinize ulaştınız","short-upcoming":"{nth} hedefinize ulaştınız"},"sharp right":{"default":"{nth} hedefinize ulaştınız, hedefiniz sağınızdadır","upcoming":"{nth} hedefinize ulaştınız, hedefiniz sağınızdadır","short":"{nth} hedefinize ulaştınız","short-upcoming":"{nth} hedefinize ulaştınız"},"slight right":{"default":"{nth} hedefinize ulaştınız, hedefiniz sağınızdadır","upcoming":"{nth} hedefinize ulaştınız, hedefiniz sağınızdadır","short":"{nth} hedefinize ulaştınız","short-upcoming":"{nth} hedefinize ulaştınız"},"slight left":{"default":"{nth} hedefinize ulaştınız, hedefiniz solunuzdadır","upcoming":"{nth} hedefinize ulaştınız, hedefiniz solunuzdadır","short":"{nth} hedefinize ulaştınız","short-upcoming":"{nth} hedefinize ulaştınız"},"straight":{"default":"{nth} hedefinize ulaştınız, hedefiniz karşınızdadır","upcoming":"{nth} hedefinize ulaştınız, hedefiniz karşınızdadır","short":"{nth} hedefinize ulaştınız","short-upcoming":"{nth} hedefinize ulaştınız"}},"continue":{"default":{"default":"{modifier} yöne dön","name":"{way_name} üzerinde kalmak için {modifier} yöne dön","destination":"{destination} istikametinde {modifier} yöne dön","exit":"{way_name} üzerinde {modifier} yöne dön"},"straight":{"default":"Düz devam edin","name":"{way_name} üzerinde kalmak için düz devam et","destination":"{destination} istikametinde devam et","distance":"{distance} boyunca düz devam et","namedistance":"{distance} boyunca {way_name} üzerinde devam et"},"sharp left":{"default":"Sola keskin dönüş yap","name":"{way_name} üzerinde kalmak için sola keskin dönüş yap","destination":"{destination} istikametinde sola keskin dönüş yap"},"sharp right":{"default":"Sağa keskin dönüş yap","name":"{way_name} üzerinde kalmak için sağa keskin dönüş yap","destination":"{destination} istikametinde sağa keskin dönüş yap"},"slight left":{"default":"Sola hafif dönüş yap","name":"{way_name} üzerinde kalmak için sola hafif dönüş yap","destination":"{destination} istikametinde sola hafif dönüş yap"},"slight right":{"default":"Sağa hafif dönüş yap","name":"{way_name} üzerinde kalmak için sağa hafif dönüş yap","destination":"{destination} istikametinde sağa hafif dönüş yap"},"uturn":{"default":"U dönüşü yapın","name":"Bir U-dönüşü yap ve {way_name} devam et","destination":"{destination} istikametinde bir U-dönüşü yap"}},"depart":{"default":{"default":"{direction} tarafına yönelin","name":"{way_name} üzerinde {direction} yöne git","namedistance":"Head {direction} on {way_name} for {distance}"}},"end of road":{"default":{"default":"{modifier} tarafa dönün","name":"{way_name} üzerinde {modifier} yöne dön","destination":"{destination} istikametinde {modifier} yöne dön"},"straight":{"default":"Düz devam edin","name":"{way_name} üzerinde düz devam et","destination":"{destination} istikametinde düz devam et"},"uturn":{"default":"Yolun sonunda U dönüşü yapın","name":"Yolun sonunda {way_name} üzerinde bir U-dönüşü yap","destination":"Yolun sonunda {destination} istikametinde bir U-dönüşü yap"}},"fork":{"default":{"default":"Yol ayrımında {modifier} yönde kal","name":"{way_name} üzerindeki yol ayrımında {modifier} yönde kal","destination":"{destination} istikametindeki yol ayrımında {modifier} yönde kal"},"slight left":{"default":"Çatalın solundan devam edin","name":"Çatalın solundan {way_name} yoluna doğru ","destination":"{destination} istikametindeki yol ayrımında solda kal"},"slight right":{"default":"Çatalın sağından devam edin","name":"{way_name} üzerindeki yol ayrımında sağda kal","destination":"{destination} istikametindeki yol ayrımında sağda kal"},"sharp left":{"default":"Çatalda keskin sola dönün","name":"{way_name} üzerindeki yol ayrımında sola keskin dönüş yap","destination":"{destination} istikametindeki yol ayrımında sola keskin dönüş yap"},"sharp right":{"default":"Çatalda keskin sağa dönün","name":"{way_name} üzerindeki yol ayrımında sağa keskin dönüş yap","destination":"{destination} istikametindeki yol ayrımında sola keskin dönüş yap"},"uturn":{"default":"U dönüşü yapın","name":"{way_name} yoluna U dönüşü yapın","destination":"{destination} istikametinde bir U-dönüşü yap"}},"merge":{"default":{"default":"{modifier} yöne gir","name":"{way_name} üzerinde {modifier} yöne gir","destination":"{destination} istikametinde {modifier} yöne gir"},"straight":{"default":"düz yöne gir","name":"{way_name} üzerinde düz yöne gir","destination":"{destination} istikametinde düz yöne gir"},"slight left":{"default":"Sola gir","name":"{way_name} üzerinde sola gir","destination":"{destination} istikametinde sola gir"},"slight right":{"default":"Sağa gir","name":"{way_name} üzerinde sağa gir","destination":"{destination} istikametinde sağa gir"},"sharp left":{"default":"Sola gir","name":"{way_name} üzerinde sola gir","destination":"{destination} istikametinde sola gir"},"sharp right":{"default":"Sağa gir","name":"{way_name} üzerinde sağa gir","destination":"{destination} istikametinde sağa gir"},"uturn":{"default":"U dönüşü yapın","name":"{way_name} yoluna U dönüşü yapın","destination":"{destination} istikametinde bir U-dönüşü yap"}},"new name":{"default":{"default":"{modifier} yönde devam et","name":"{way_name} üzerinde {modifier} yönde devam et","destination":"{destination} istikametinde {modifier} yönde devam et"},"straight":{"default":"Düz devam et","name":"{way_name} üzerinde devam et","destination":"{destination} istikametinde devam et"},"sharp left":{"default":"Sola keskin dönüş yapın","name":"{way_name} yoluna doğru sola keskin dönüş yapın","destination":"{destination} istikametinde sola keskin dönüş yap"},"sharp right":{"default":"Sağa keskin dönüş yapın","name":"{way_name} yoluna doğru sağa keskin dönüş yapın","destination":"{destination} istikametinde sağa keskin dönüş yap"},"slight left":{"default":"Hafif soldan devam edin","name":"{way_name} üzerinde hafif solda devam et","destination":"{destination} istikametinde hafif solda devam et"},"slight right":{"default":"Hafif sağdan devam edin","name":"{way_name} üzerinde hafif sağda devam et","destination":"{destination} istikametinde hafif sağda devam et"},"uturn":{"default":"U dönüşü yapın","name":"{way_name} yoluna U dönüşü yapın","destination":"{destination} istikametinde bir U-dönüşü yap"}},"notification":{"default":{"default":"{modifier} yönde devam et","name":"{way_name} üzerinde {modifier} yönde devam et","destination":"{destination} istikametinde {modifier} yönde devam et"},"uturn":{"default":"U dönüşü yapın","name":"{way_name} yoluna U dönüşü yapın","destination":"{destination} istikametinde bir U-dönüşü yap"}},"off ramp":{"default":{"default":"Bağlantı yoluna geç","name":"{way_name} üzerindeki bağlantı yoluna geç","destination":"{destination} istikametine giden bağlantı yoluna geç","exit":"{exit} çıkış yoluna geç","exit_destination":"{destination} istikametindeki {exit} çıkış yoluna geç"},"left":{"default":"Soldaki bağlantı yoluna geç","name":"{way_name} üzerindeki sol bağlantı yoluna geç","destination":"{destination} istikametine giden sol bağlantı yoluna geç","exit":"Soldaki {exit} çıkış yoluna geç","exit_destination":"{destination} istikametindeki {exit} sol çıkış yoluna geç"},"right":{"default":"Sağdaki bağlantı yoluna geç","name":"{way_name} üzerindeki sağ bağlantı yoluna geç","destination":"{destination} istikametine giden sağ bağlantı yoluna geç","exit":"Sağdaki {exit} çıkış yoluna geç","exit_destination":"{destination} istikametindeki {exit} sağ çıkış yoluna geç"},"sharp left":{"default":"Soldaki bağlantı yoluna geç","name":"{way_name} üzerindeki sol bağlantı yoluna geç","destination":"{destination} istikametine giden sol bağlantı yoluna geç","exit":"Soldaki {exit} çıkış yoluna geç","exit_destination":"{destination} istikametindeki {exit} sol çıkış yoluna geç"},"sharp right":{"default":"Sağdaki bağlantı yoluna geç","name":"{way_name} üzerindeki sağ bağlantı yoluna geç","destination":"{destination} istikametine giden sağ bağlantı yoluna geç","exit":"Sağdaki {exit} çıkış yoluna geç","exit_destination":"{destination} istikametindeki {exit} sağ çıkış yoluna geç"},"slight left":{"default":"Soldaki bağlantı yoluna geç","name":"{way_name} üzerindeki sol bağlantı yoluna geç","destination":"{destination} istikametine giden sol bağlantı yoluna geç","exit":"Soldaki {exit} çıkış yoluna geç","exit_destination":"{destination} istikametindeki {exit} sol çıkış yoluna geç"},"slight right":{"default":"Sağdaki bağlantı yoluna geç","name":"{way_name} üzerindeki sağ bağlantı yoluna geç","destination":"{destination} istikametine giden sağ bağlantı yoluna geç","exit":"Sağdaki {exit} çıkış yoluna geç","exit_destination":"{destination} istikametindeki {exit} sağ çıkış yoluna geç"}},"on ramp":{"default":{"default":"Bağlantı yoluna geç","name":"{way_name} üzerindeki bağlantı yoluna geç","destination":"{destination} istikametine giden bağlantı yoluna geç"},"left":{"default":"Soldaki bağlantı yoluna geç","name":"{way_name} üzerindeki sol bağlantı yoluna geç","destination":"{destination} istikametine giden sol bağlantı yoluna geç"},"right":{"default":"Sağdaki bağlantı yoluna geç","name":"{way_name} üzerindeki sağ bağlantı yoluna geç","destination":"{destination} istikametine giden sağ bağlantı yoluna geç"},"sharp left":{"default":"Soldaki bağlantı yoluna geç","name":"{way_name} üzerindeki sol bağlantı yoluna geç","destination":"{destination} istikametine giden sol bağlantı yoluna geç"},"sharp right":{"default":"Sağdaki bağlantı yoluna geç","name":"{way_name} üzerindeki sağ bağlantı yoluna geç","destination":"{destination} istikametine giden sağ bağlantı yoluna geç"},"slight left":{"default":"Soldaki bağlantı yoluna geç","name":"{way_name} üzerindeki sol bağlantı yoluna geç","destination":"{destination} istikametine giden sol bağlantı yoluna geç"},"slight right":{"default":"Sağdaki bağlantı yoluna geç","name":"{way_name} üzerindeki sağ bağlantı yoluna geç","destination":"{destination} istikametine giden sağ bağlantı yoluna geç"}},"rotary":{"default":{"default":{"default":"Dönel kavşağa gir","name":"Dönel kavşağa gir ve {way_name} üzerinde çık","destination":"Dönel kavşağa gir ve {destination} istikametinde çık"},"name":{"default":"{rotary_name} dönel kavşağa gir","name":"{rotary_name} dönel kavşağa gir ve {way_name} üzerinde çık","destination":"{rotary_name} dönel kavşağa gir ve {destination} istikametinde çık"},"exit":{"default":"Dönel kavşağa gir ve {exit_number} numaralı çıkışa gir","name":"Dönel kavşağa gir ve {way_name} üzerindeki {exit_number} numaralı çıkışa gir","destination":"Dönel kavşağa gir ve {destination} istikametindeki {exit_number} numaralı çıkışa gir"},"name_exit":{"default":"{rotary_name} dönel kavşağa gir ve {exit_number} numaralı çıkışa gir","name":"{rotary_name} dönel kavşağa gir ve {way_name} üzerindeki {exit_number} numaralı çıkışa gir","destination":"{rotary_name} dönel kavşağa gir ve {destination} istikametindeki {exit_number} numaralı çıkışa gir"}}},"roundabout":{"default":{"exit":{"default":"Göbekli kavşağa gir ve {exit_number} numaralı çıkışa gir","name":"Göbekli kavşağa gir ve {way_name} üzerindeki {exit_number} numaralı çıkışa gir","destination":"Göbekli kavşağa gir ve {destination} istikametindeki {exit_number} numaralı çıkışa gir"},"default":{"default":"Göbekli kavşağa gir","name":"Göbekli kavşağa gir ve {way_name} üzerinde çık","destination":"Göbekli kavşağa gir ve {destination} istikametinde çık"}}},"roundabout turn":{"default":{"default":"Göbekli kavşakta {modifier} yöne dön","name":"{way_name} üzerindeki göbekli kavşakta {modifier} yöne dön","destination":"{destination} üzerindeki göbekli kavşakta {modifier} yöne dön"},"left":{"default":"Göbekli kavşakta sola dön","name":"Göbekli kavşakta {way_name} üzerinde sola dön","destination":"Göbekli kavşakta {destination} istikametinde sola dön"},"right":{"default":"Göbekli kavşakta sağa dön","name":"Göbekli kavşakta {way_name} üzerinde sağa dön","destination":"Göbekli kavşakta {destination} üzerinde sağa dön"},"straight":{"default":"Göbekli kavşakta düz devam et","name":"Göbekli kavşakta {way_name} üzerinde düz devam et","destination":"Göbekli kavşakta {destination} istikametinde düz devam et"}},"exit roundabout":{"default":{"default":"{modifier} yöne dön","name":"{way_name} üzerinde {modifier} yöne dön","destination":"{destination} istikametinde {modifier} yöne dön"},"left":{"default":"Sola dön","name":"{way_name} üzerinde sola dön","destination":"{destination} istikametinde sola dön"},"right":{"default":"Sağa dön","name":"{way_name} üzerinde sağa dön","destination":"{destination} istikametinde sağa dön"},"straight":{"default":"Düz git","name":"{way_name} üzerinde düz git","destination":"{destination} istikametinde düz git"}},"exit rotary":{"default":{"default":"{modifier} yöne dön","name":"{way_name} üzerinde {modifier} yöne dön","destination":"{destination} istikametinde {modifier} yöne dön"},"left":{"default":"Sola dön","name":"{way_name} üzerinde sola dön","destination":"{destination} istikametinde sola dön"},"right":{"default":"Sağa dön","name":"{way_name} üzerinde sağa dön","destination":"{destination} istikametinde sağa dön"},"straight":{"default":"Düz git","name":"{way_name} üzerinde düz git","destination":"{destination} istikametinde düz git"}},"turn":{"default":{"default":"{modifier} yöne dön","name":"{way_name} üzerinde {modifier} yöne dön","destination":"{destination} istikametinde {modifier} yöne dön"},"left":{"default":"Sola dönün","name":"{way_name} üzerinde sola dön","destination":"{destination} istikametinde sola dön"},"right":{"default":"Sağa dönün","name":"{way_name} üzerinde sağa dön","destination":"{destination} istikametinde sağa dön"},"straight":{"default":"Düz git","name":"{way_name} üzerinde düz git","destination":"{destination} istikametinde düz git"}},"use lane":{"no_lanes":{"default":"Düz devam edin"},"default":{"default":"{lane_instruction}"}}};
var tr = {
	meta: meta$16,
	v5: v5$16
};

var tr$1 = Object.freeze({
	meta: meta$16,
	v5: v5$16,
	default: tr
});

const meta$17 = {"capitalizeFirstLetter":true};
const v5$17 = {"constants":{"ordinalize":{"1":"1й","2":"2й","3":"3й","4":"4й","5":"5й","6":"6й","7":"7й","8":"8й","9":"9й","10":"10й"},"direction":{"north":"північ","northeast":"північний схід","east":"схід","southeast":"південний схід","south":"південь","southwest":"південний захід","west":"захід","northwest":"північний захід"},"modifier":{"left":"ліворуч","right":"праворуч","sharp left":"різко ліворуч","sharp right":"різко праворуч","slight left":"плавно ліворуч","slight right":"плавно праворуч","straight":"прямо","uturn":"розворот"},"lanes":{"xo":"Тримайтесь праворуч","ox":"Тримайтесь ліворуч","xox":"Тримайтесь в середині","oxo":"Тримайтесь праворуч або ліворуч"}},"modes":{"ferry":{"default":"Скористайтесь поромом","name":"Скористайтесь поромом {way_name}","destination":"Скористайтесь поромом у напрямку {destination}"}},"phrase":{"two linked by distance":"{instruction_one}, потім, через {distance}, {instruction_two}","two linked":"{instruction_one}, потім {instruction_two}","one in distance":"Через {distance}, {instruction_one}","name and ref":"{name} ({ref})","exit with number":"exit {exit}"},"arrive":{"default":{"default":"Ви прибули у ваш {nth} пункт призначення","upcoming":"Ви наближаєтесь до вашого {nth} місця призначення","short":"Ви прибули","short-upcoming":"Ви прибудете"},"left":{"default":"Ви прибули у ваш {nth} пункт призначення, він – ліворуч","upcoming":"Ви наближаєтесь до вашого {nth} місця призначення, ліворуч","short":"Ви прибули","short-upcoming":"Ви прибудете"},"right":{"default":"Ви прибули у ваш {nth} пункт призначення, він – праворуч","upcoming":"Ви наближаєтесь до вашого {nth} місця призначення, праворуч","short":"Ви прибули","short-upcoming":"Ви прибудете"},"sharp left":{"default":"Ви прибули у ваш {nth} пункт призначення, він – ліворуч","upcoming":"Ви наближаєтесь до вашого {nth} місця призначення, ліворуч","short":"Ви прибули","short-upcoming":"Ви прибудете"},"sharp right":{"default":"Ви прибули у ваш {nth} пункт призначення, він – праворуч","upcoming":"Ви наближаєтесь до вашого {nth} місця призначення, праворуч","short":"Ви прибули","short-upcoming":"Ви прибудете"},"slight right":{"default":"Ви прибули у ваш {nth} пункт призначення, він – праворуч","upcoming":"Ви наближаєтесь до вашого {nth} місця призначення, праворуч","short":"Ви прибули","short-upcoming":"Ви прибудете"},"slight left":{"default":"Ви прибули у ваш {nth} пункт призначення, він – ліворуч","upcoming":"Ви наближаєтесь до вашого {nth} місця призначення, ліворуч","short":"Ви прибули","short-upcoming":"Ви прибудете"},"straight":{"default":"Ви прибули у ваш {nth} пункт призначення, він – прямо перед вами","upcoming":"Ви наближаєтесь до вашого {nth} місця призначення, прямо перед вами","short":"Ви прибули","short-upcoming":"Ви прибудете"}},"continue":{"default":{"default":"Поверніть {modifier}","name":"Поверніть{modifier} залишаючись на {way_name}","destination":"Поверніть {modifier} у напрямку {destination}","exit":"Поверніть {modifier} на {way_name}"},"straight":{"default":"Продовжуйте рух прямо","name":"Продовжуйте рух прямо залишаючись на {way_name}","destination":"Рухайтесь у напрямку {destination}","distance":"Продовжуйте рух прямо {distance}","namedistance":"Продовжуйте рух по {way_name} {distance}"},"sharp left":{"default":"Поверніть різко ліворуч","name":"Поверніть різко ліворуч щоб залишитись на {way_name}","destination":"Поверніть різко ліворуч у напрямку {destination}"},"sharp right":{"default":"Поверніть різко праворуч","name":"Поверніть різко праворуч щоб залишитись на {way_name}","destination":"Поверніть різко праворуч у напрямку {destination}"},"slight left":{"default":"Поверніть різко ліворуч","name":"Поверніть плавно ліворуч щоб залишитись на {way_name}","destination":"Поверніть плавно ліворуч у напрямку {destination}"},"slight right":{"default":"Поверніть плавно праворуч","name":"Поверніть плавно праворуч щоб залишитись на {way_name}","destination":"Поверніть плавно праворуч у напрямку {destination}"},"uturn":{"default":"Здійсніть розворот","name":"Здійсніть розворот та рухайтесь по {way_name}","destination":"Здійсніть розворот у напрямку {destination}"}},"depart":{"default":{"default":"Прямуйте на {direction}","name":"Прямуйте на {direction} по {way_name}","namedistance":"Прямуйте на {direction} по {way_name} {distance}"}},"end of road":{"default":{"default":"Поверніть {modifier}","name":"Поверніть {modifier} на {way_name}","destination":"Поверніть {modifier} у напрямку {destination}"},"straight":{"default":"Продовжуйте рух прямо","name":"Продовжуйте рух прямо до {way_name}","destination":"Продовжуйте рух прямо у напрямку {destination}"},"uturn":{"default":"Здійсніть розворот в кінці дороги","name":"Здійсніть розворот на {way_name} в кінці дороги","destination":"Здійсніть розворот у напрямку {destination} в кінці дороги"}},"fork":{"default":{"default":"На роздоріжжі тримайтеся {modifier}","name":"Тримайтеся {modifier} і рухайтесь на {way_name}","destination":"Тримайтеся {modifier} в напрямку {destination}"},"slight left":{"default":"На роздоріжжі тримайтеся ліворуч","name":"Тримайтеся ліворуч і рухайтесь на {way_name}","destination":"Тримайтеся ліворуч в напрямку {destination}"},"slight right":{"default":"На роздоріжжі тримайтеся праворуч","name":"Тримайтеся праворуч і рухайтесь на {way_name}","destination":"Тримайтеся праворуч в напрямку {destination}"},"sharp left":{"default":"На роздоріжжі різко поверніть ліворуч","name":"Прийміть різко ліворуч на {way_name}","destination":"Прийміть різко ліворуч у напрямку {destination}"},"sharp right":{"default":"На роздоріжжі різко поверніть праворуч","name":"Прийміть різко праворуч на {way_name}","destination":"Прийміть різко праворуч у напрямку {destination}"},"uturn":{"default":"Здійсніть розворот","name":"Здійсніть розворот на {way_name}","destination":"Здійсніть розворот у напрямку {destination}"}},"merge":{"default":{"default":"Приєднайтеся до потоку {modifier}","name":"Приєднайтеся до потоку {modifier} на {way_name}","destination":"Приєднайтеся до потоку {modifier} у напрямку {destination}"},"straight":{"default":"Приєднайтеся до потоку","name":"Приєднайтеся до потоку на {way_name}","destination":"Приєднайтеся до потоку у напрямку {destination}"},"slight left":{"default":"Приєднайтеся до потоку ліворуч","name":"Приєднайтеся до потоку ліворуч на {way_name}","destination":"Приєднайтеся до потоку ліворуч у напрямку {destination}"},"slight right":{"default":"Приєднайтеся до потоку праворуч","name":"Приєднайтеся до потоку праворуч на {way_name}","destination":"Приєднайтеся до потоку праворуч у напрямку {destination}"},"sharp left":{"default":"Приєднайтеся до потоку ліворуч","name":"Приєднайтеся до потоку ліворуч на {way_name}","destination":"Приєднайтеся до потоку ліворуч у напрямку {destination}"},"sharp right":{"default":"Приєднайтеся до потоку праворуч","name":"Приєднайтеся до потоку праворуч на {way_name}","destination":"Приєднайтеся до потоку праворуч у напрямку {destination}"},"uturn":{"default":"Здійсніть розворот","name":"Здійсніть розворот на {way_name}","destination":"Здійсніть розворот у напрямку {destination}"}},"new name":{"default":{"default":"Рухайтесь {modifier}","name":"Рухайтесь {modifier} на {way_name}","destination":"Рухайтесь {modifier} у напрямку {destination}"},"straight":{"default":"Рухайтесь прямо","name":"Рухайтесь по {way_name}","destination":"Рухайтесь у напрямку {destination}"},"sharp left":{"default":"Прийміть різко ліворуч","name":"Прийміть різко ліворуч на {way_name}","destination":"Прийміть різко ліворуч у напрямку {destination}"},"sharp right":{"default":"Прийміть різко праворуч","name":"Прийміть різко праворуч на {way_name}","destination":"Прийміть різко праворуч у напрямку {destination}"},"slight left":{"default":"Рухайтесь плавно ліворуч","name":"Рухайтесь плавно ліворуч на {way_name}","destination":"Рухайтесь плавно ліворуч у напрямку {destination}"},"slight right":{"default":"Рухайтесь плавно праворуч","name":"Рухайтесь плавно праворуч на {way_name}","destination":"Рухайтесь плавно праворуч у напрямку {destination}"},"uturn":{"default":"Здійсніть розворот","name":"Здійсніть розворот на {way_name}","destination":"Здійсніть розворот у напрямку {destination}"}},"notification":{"default":{"default":"Рухайтесь {modifier}","name":"Рухайтесь {modifier} на {way_name}","destination":"Рухайтесь {modifier} у напрямку {destination}"},"uturn":{"default":"Здійсніть розворот","name":"Здійсніть розворот на {way_name}","destination":"Здійсніть розворот у напрямку {destination}"}},"off ramp":{"default":{"default":"Рухайтесь на зʼїзд","name":"Рухайтесь на зʼїзд на {way_name}","destination":"Рухайтесь на зʼїзд у напрямку {destination}","exit":"Оберіть з'їзд {exit}","exit_destination":"Оберіть з'їзд {exit} у напрямку {destination}"},"left":{"default":"Рухайтесь на зʼїзд ліворуч","name":"Рухайтесь на зʼїзд ліворуч на {way_name}","destination":"Рухайтесь на зʼїзд ліворуч у напрямку {destination}","exit":"Оберіть з'їзд {exit} ліворуч","exit_destination":"Оберіть з'їзд {exit} ліворуч у напрямку {destination}"},"right":{"default":"Рухайтесь на зʼїзд праворуч","name":"Рухайтесь на зʼїзд праворуч на {way_name}","destination":"Рухайтесь на зʼїзд праворуч у напрямку {destination}","exit":"Оберіть з'їзд {exit} праворуч","exit_destination":"Оберіть з'їзд {exit} праворуч у напрямку {destination}"},"sharp left":{"default":"Рухайтесь на зʼїзд ліворуч","name":"Рухайтесь на зʼїзд ліворуч на {way_name}","destination":"Рухайтесь на зʼїзд ліворуч у напрямку {destination}","exit":"Оберіть з'їзд {exit} ліворуч","exit_destination":"Оберіть з'їзд {exit} ліворуч у напрямку {destination}"},"sharp right":{"default":"Рухайтесь на зʼїзд праворуч","name":"Рухайтесь на зʼїзд праворуч на {way_name}","destination":"Рухайтесь на зʼїзд праворуч у напрямку {destination}","exit":"Оберіть з'їзд {exit} праворуч","exit_destination":"Оберіть з'їзд {exit} праворуч у напрямку {destination}"},"slight left":{"default":"Рухайтесь на зʼїзд ліворуч","name":"Рухайтесь на зʼїзд ліворуч на {way_name}","destination":"Рухайтесь на зʼїзд ліворуч у напрямку {destination}","exit":"Оберіть з'їзд {exit} ліворуч","exit_destination":"Оберіть з'їзд {exit} ліворуч у напрямку {destination}"},"slight right":{"default":"Рухайтесь на зʼїзд праворуч","name":"Рухайтесь на зʼїзд праворуч на {way_name}","destination":"Рухайтесь на зʼїзд праворуч у напрямку {destination}","exit":"Оберіть з'їзд {exit} праворуч","exit_destination":"Оберіть з'їзд {exit} праворуч у напрямку {destination}"}},"on ramp":{"default":{"default":"Рухайтесь на вʼїзд","name":"Рухайтесь на вʼїзд на {way_name}","destination":"Рухайтесь на вʼїзд у напрямку {destination}"},"left":{"default":"Рухайтесь на вʼїзд ліворуч","name":"Рухайтесь на вʼїзд ліворуч на {way_name}","destination":"Рухайтесь на вʼїзд ліворуч у напрямку {destination}"},"right":{"default":"Рухайтесь на вʼїзд праворуч","name":"Рухайтесь на вʼїзд праворуч на {way_name}","destination":"Рухайтесь на вʼїзд праворуч у напрямку {destination}"},"sharp left":{"default":"Рухайтесь на вʼїзд ліворуч","name":"Рухайтесь на вʼїзд ліворуч на {way_name}","destination":"Рухайтесь на вʼїзд ліворуч у напрямку {destination}"},"sharp right":{"default":"Рухайтесь на вʼїзд праворуч","name":"Рухайтесь на вʼїзд праворуч на {way_name}","destination":"Рухайтесь на вʼїзд праворуч у напрямку {destination}"},"slight left":{"default":"Рухайтесь на вʼїзд ліворуч","name":"Рухайтесь на вʼїзд ліворуч на {way_name}","destination":"Рухайтесь на вʼїзд ліворуч у напрямку {destination}"},"slight right":{"default":"Рухайтесь на вʼїзд праворуч","name":"Рухайтесь на вʼїзд праворуч на {way_name}","destination":"Рухайтесь на вʼїзд праворуч у напрямку {destination}"}},"rotary":{"default":{"default":{"default":"Рухайтесь по колу","name":"Рухайтесь по колу до {way_name}","destination":"Рухайтесь по колу в напрямку {destination}"},"name":{"default":"Рухайтесь по {rotary_name}","name":"Рухайтесь по {rotary_name} та поверніть на {way_name}","destination":"Рухайтесь по {rotary_name} та поверніть в напрямку {destination}"},"exit":{"default":"Рухайтесь по колу та повереніть у {exit_number} з'їзд","name":"Рухайтесь по колу та поверніть у {exit_number} з'їзд на {way_name}","destination":"Рухайтесь по колу та поверніть у {exit_number} з'їзд у напрямку {destination}"},"name_exit":{"default":"Рухайтесь по {rotary_name} та поверніть у {exit_number} з'їзд","name":"Рухайтесь по {rotary_name} та поверніть у {exit_number} з'їзд на {way_name}","destination":"Рухайтесь по {rotary_name} та поверніть у {exit_number} з'їзд в напрямку {destination}"}}},"roundabout":{"default":{"exit":{"default":"Рухайтесь по колу та повереніть у {exit_number} з'їзд","name":"Рухайтесь по колу та поверніть у {exit_number} з'їзд на {way_name}","destination":"Рухайтесь по колу та поверніть у {exit_number} з'їзд у напрямку {destination}"},"default":{"default":"Рухайтесь по колу","name":"Рухайтесь по колу до {way_name}","destination":"Рухайтесь по колу в напрямку {destination}"}}},"roundabout turn":{"default":{"default":"Рухайтесь {modifier}","name":"Рухайтесь {modifier} на {way_name}","destination":"Рухайтесь {modifier} в напрямку {destination}"},"left":{"default":"Поверніть ліворуч","name":"Поверніть ліворуч на {way_name}","destination":"Поверніть ліворуч у напрямку {destination}"},"right":{"default":"Поверніть праворуч","name":"Поверніть праворуч на {way_name}","destination":"Поверніть праворуч у напрямку {destination}"},"straight":{"default":"Рухайтесь прямо","name":"Продовжуйте рух прямо до {way_name}","destination":"Продовжуйте рух прямо у напрямку {destination}"}},"exit roundabout":{"default":{"default":"Залишить коло","name":"Залишить коло на {way_name} зʼїзді","destination":"Залишить коло в напрямку {destination}"}},"exit rotary":{"default":{"default":"Залишить коло","name":"Залишить коло на {way_name} зʼїзді","destination":"Залишить коло в напрямку {destination}"}},"turn":{"default":{"default":"Рухайтесь {modifier}","name":"Рухайтесь {modifier} на {way_name}","destination":"Рухайтесь {modifier} в напрямку {destination}"},"left":{"default":"Поверніть ліворуч","name":"Поверніть ліворуч на {way_name}","destination":"Поверніть ліворуч у напрямку {destination}"},"right":{"default":"Поверніть праворуч","name":"Поверніть праворуч на {way_name}","destination":"Поверніть праворуч у напрямку {destination}"},"straight":{"default":"Рухайтесь прямо","name":"Рухайтесь прямо по {way_name}","destination":"Рухайтесь прямо у напрямку {destination}"}},"use lane":{"no_lanes":{"default":"Продовжуйте рух прямо"},"default":{"default":"{lane_instruction}"}}};
var uk = {
	meta: meta$17,
	v5: v5$17
};

var uk$1 = Object.freeze({
	meta: meta$17,
	v5: v5$17,
	default: uk
});

const meta$18 = {"capitalizeFirstLetter":true};
const v5$18 = {"constants":{"ordinalize":{"1":"đầu tiên","2":"thứ 2","3":"thứ 3","4":"thứ 4","5":"thứ 5","6":"thú 6","7":"thứ 7","8":"thứ 8","9":"thứ 9","10":"thứ 10"},"direction":{"north":"bắc","northeast":"đông bắc","east":"đông","southeast":"đông nam","south":"nam","southwest":"tây nam","west":"tây","northwest":"tây bắc"},"modifier":{"left":"trái","right":"phải","sharp left":"trái gắt","sharp right":"phải gắt","slight left":"trái nghiêng","slight right":"phải nghiêng","straight":"thẳng","uturn":"ngược"},"lanes":{"xo":"Đi bên phải","ox":"Đi bên trái","xox":"Đi vào giữa","oxo":"Đi bên trái hay bên phải"}},"modes":{"ferry":{"default":"Lên phà","name":"Lên phà {way_name}","destination":"Lên phà đi {destination}"}},"phrase":{"two linked by distance":"{instruction_one}, rồi {distance} nữa thì {instruction_two}","two linked":"{instruction_one}, rồi {instruction_two}","one in distance":"{distance} nữa thì {instruction_one}","name and ref":"{name} ({ref})","exit with number":"exit {exit}"},"arrive":{"default":{"default":"Đến nơi {nth}","upcoming":"Đến nơi {nth}","short":"Đến nơi","short-upcoming":"Đến nơi"},"left":{"default":"Đến nơi {nth} ở bên trái","upcoming":"Đến nơi {nth} ở bên trái","short":"Đến nơi","short-upcoming":"Đến nơi"},"right":{"default":"Đến nơi {nth} ở bên phải","upcoming":"Đến nơi {nth} ở bên phải","short":"Đến nơi","short-upcoming":"Đến nơi"},"sharp left":{"default":"Đến nơi {nth} ở bên trái","upcoming":"Đến nơi {nth} ở bên trái","short":"Đến nơi","short-upcoming":"Đến nơi"},"sharp right":{"default":"Đến nơi {nth} ở bên phải","upcoming":"Đến nơi {nth} ở bên phải","short":"Đến nơi","short-upcoming":"Đến nơi"},"slight right":{"default":"Đến nơi {nth} ở bên phải","upcoming":"Đến nơi {nth} ở bên phải","short":"Đến nơi","short-upcoming":"Đến nơi"},"slight left":{"default":"Đến nơi {nth} ở bên trái","upcoming":"Đến nơi {nth} ở bên trái","short":"Đến nơi","short-upcoming":"Đến nơi"},"straight":{"default":"Đến nơi {nth} ở trước mặt","upcoming":"Đến nơi {nth} ở trước mặt","short":"Đến nơi","short-upcoming":"Đến nơi"}},"continue":{"default":{"default":"Quẹo {modifier}","name":"Quẹo {modifier} để chạy tiếp trên {way_name}","destination":"Quẹo {modifier} về hướng {destination}","exit":"Quẹo {modifier} vào {way_name}"},"straight":{"default":"Chạy thẳng","name":"Chạy tiếp trên {way_name}","destination":"Chạy tiếp về hướng {destination}","distance":"Chạy thẳng cho {distance}","namedistance":"Chạy tiếp trên {way_name} cho {distance}"},"sharp left":{"default":"Quẹo gắt bên trái","name":"Quẹo gắt bên trái để chạy tiếp trên {way_name}","destination":"Quẹo gắt bên trái về hướng {destination}"},"sharp right":{"default":"Quẹo gắt bên phải","name":"Quẹo gắt bên phải để chạy tiếp trên {way_name}","destination":"Quẹo gắt bên phải về hướng {destination}"},"slight left":{"default":"Nghiêng về bên trái","name":"Nghiêng về bên trái để chạy tiếp trên {way_name}","destination":"Nghiêng về bên trái về hướng {destination}"},"slight right":{"default":"Nghiêng về bên phải","name":"Nghiêng về bên phải để chạy tiếp trên {way_name}","destination":"Nghiêng về bên phải về hướng {destination}"},"uturn":{"default":"Quẹo ngược lại","name":"Quẹo ngược lại trên {way_name}","destination":"Quẹo ngược về hướng {destination}"}},"depart":{"default":{"default":"Đi về hướng {direction}","name":"Đi về hướng {direction} trên {way_name}","namedistance":"Đi về hướng {direction} trên {way_name} cho {distance}"}},"end of road":{"default":{"default":"Quẹo {modifier}","name":"Quẹo {modifier} vào {way_name}","destination":"Quẹo {modifier} về hướng {destination}"},"straight":{"default":"Chạy thẳng","name":"Chạy tiếp trên {way_name}","destination":"Chạy tiếp về hướng {destination}"},"uturn":{"default":"Quẹo ngược lại tại cuối đường","name":"Quẹo ngược vào {way_name} tại cuối đường","destination":"Quẹo ngược về hướng {destination} tại cuối đường"}},"fork":{"default":{"default":"Đi bên {modifier} ở ngã ba","name":"Giữ bên {modifier} vào {way_name}","destination":"Giữ bên {modifier} về hướng {destination}"},"slight left":{"default":"Nghiêng về bên trái ở ngã ba","name":"Giữ bên trái vào {way_name}","destination":"Giữ bên trái về hướng {destination}"},"slight right":{"default":"Nghiêng về bên phải ở ngã ba","name":"Giữ bên phải vào {way_name}","destination":"Giữ bên phải về hướng {destination}"},"sharp left":{"default":"Quẹo gắt bên trái ở ngã ba","name":"Quẹo gắt bên trái vào {way_name}","destination":"Quẹo gắt bên trái về hướng {destination}"},"sharp right":{"default":"Quẹo gắt bên phải ở ngã ba","name":"Quẹo gắt bên phải vào {way_name}","destination":"Quẹo gắt bên phải về hướng {destination}"},"uturn":{"default":"Quẹo ngược lại","name":"Quẹo ngược lại {way_name}","destination":"Quẹo ngược lại về hướng {destination}"}},"merge":{"default":{"default":"Nhập sang {modifier}","name":"Nhập sang {modifier} vào {way_name}","destination":"Nhập sang {modifier} về hướng {destination}"},"straight":{"default":"Nhập đường","name":"Nhập vào {way_name}","destination":"Nhập đường về hướng {destination}"},"slight left":{"default":"Nhập sang trái","name":"Nhập sang trái vào {way_name}","destination":"Nhập sang trái về hướng {destination}"},"slight right":{"default":"Nhập sang phải","name":"Nhập sang phải vào {way_name}","destination":"Nhập sang phải về hướng {destination}"},"sharp left":{"default":"Nhập sang trái","name":"Nhập sang trái vào {way_name}","destination":"Nhập sang trái về hướng {destination}"},"sharp right":{"default":"Nhập sang phải","name":"Nhập sang phải vào {way_name}","destination":"Nhập sang phải về hướng {destination}"},"uturn":{"default":"Quẹo ngược lại","name":"Quẹo ngược lại {way_name}","destination":"Quẹo ngược lại về hướng {destination}"}},"new name":{"default":{"default":"Chạy tiếp bên {modifier}","name":"Chạy tiếp bên {modifier} trên {way_name}","destination":"Chạy tiếp bên {modifier} về hướng {destination}"},"straight":{"default":"Chạy thẳng","name":"Chạy tiếp trên {way_name}","destination":"Chạy tiếp về hướng {destination}"},"sharp left":{"default":"Quẹo gắt bên trái","name":"Quẹo gắt bên trái vào {way_name}","destination":"Quẹo gắt bên trái về hướng {destination}"},"sharp right":{"default":"Quẹo gắt bên phải","name":"Quẹo gắt bên phải vào {way_name}","destination":"Quẹo gắt bên phải về hướng {destination}"},"slight left":{"default":"Nghiêng về bên trái","name":"Nghiêng về bên trái vào {way_name}","destination":"Nghiêng về bên trái về hướng {destination}"},"slight right":{"default":"Nghiêng về bên phải","name":"Nghiêng về bên phải vào {way_name}","destination":"Nghiêng về bên phải về hướng {destination}"},"uturn":{"default":"Quẹo ngược lại","name":"Quẹo ngược lại {way_name}","destination":"Quẹo ngược lại về hướng {destination}"}},"notification":{"default":{"default":"Chạy tiếp bên {modifier}","name":"Chạy tiếp bên {modifier} trên {way_name}","destination":"Chạy tiếp bên {modifier} về hướng {destination}"},"uturn":{"default":"Quẹo ngược lại","name":"Quẹo ngược lại {way_name}","destination":"Quẹo ngược lại về hướng {destination}"}},"off ramp":{"default":{"default":"Đi đường nhánh","name":"Đi đường nhánh {way_name}","destination":"Đi đường nhánh về hướng {destination}","exit":"Đi theo lối ra {exit}","exit_destination":"Đi theo lối ra {exit} về hướng {destination}"},"left":{"default":"Đi đường nhánh bên trái","name":"Đi đường nhánh {way_name} bên trái","destination":"Đi đường nhánh bên trái về hướng {destination}","exit":"Đi theo lối ra {exit} bên trái","exit_destination":"Đi theo lối ra {exit} bên trái về hướng {destination}"},"right":{"default":"Đi đường nhánh bên phải","name":"Đi đường nhánh {way_name} bên phải","destination":"Đi đường nhánh bên phải về hướng {destination}","exit":"Đi theo lối ra {exit} bên phải","exit_destination":"Đi theo lối ra {exit} bên phải về hướng {destination}"},"sharp left":{"default":"Đi đường nhánh bên trái","name":"Đi đường nhánh {way_name} bên trái","destination":"Đi đường nhánh bên trái về hướng {destination}","exit":"Đi theo lối ra {exit} bên trái","exit_destination":"Đi theo lối ra {exit} bên trái về hướng {destination}"},"sharp right":{"default":"Đi đường nhánh bên phải","name":"Đi đường nhánh {way_name} bên phải","destination":"Đi đường nhánh bên phải về hướng {destination}","exit":"Đi theo lối ra {exit} bên phải","exit_destination":"Đi theo lối ra {exit} bên phải về hướng {destination}"},"slight left":{"default":"Đi đường nhánh bên trái","name":"Đi đường nhánh {way_name} bên trái","destination":"Đi đường nhánh bên trái về hướng {destination}","exit":"Đi theo lối ra {exit} bên trái","exit_destination":"Đi theo lối ra {exit} bên trái về hướng {destination}"},"slight right":{"default":"Đi đường nhánh bên phải","name":"Đi đường nhánh {way_name} bên phải","destination":"Đi đường nhánh bên phải về hướng {destination}","exit":"Đi theo lối ra {exit} bên phải","exit_destination":"Đi theo lối ra {exit} bên phải về hướng {destination}"}},"on ramp":{"default":{"default":"Đi đường nhánh","name":"Đi đường nhánh {way_name}","destination":"Đi đường nhánh về hướng {destination}"},"left":{"default":"Đi đường nhánh bên trái","name":"Đi đường nhánh {way_name} bên trái","destination":"Đi đường nhánh bên trái về hướng {destination}"},"right":{"default":"Đi đường nhánh bên phải","name":"Đi đường nhánh {way_name} bên phải","destination":"Đi đường nhánh bên phải về hướng {destination}"},"sharp left":{"default":"Đi đường nhánh bên trái","name":"Đi đường nhánh {way_name} bên trái","destination":"Đi đường nhánh bên trái về hướng {destination}"},"sharp right":{"default":"Đi đường nhánh bên phải","name":"Đi đường nhánh {way_name} bên phải","destination":"Đi đường nhánh bên phải về hướng {destination}"},"slight left":{"default":"Đi đường nhánh bên trái","name":"Đi đường nhánh {way_name} bên trái","destination":"Đi đường nhánh bên trái về hướng {destination}"},"slight right":{"default":"Đi đường nhánh bên phải","name":"Đi đường nhánh {way_name} bên phải","destination":"Đi đường nhánh bên phải về hướng {destination}"}},"rotary":{"default":{"default":{"default":"Đi vào bùng binh","name":"Đi vào bùng binh và ra tại {way_name}","destination":"Đi vào bùng binh và ra về hướng {destination}"},"name":{"default":"Đi vào {rotary_name}","name":"Đi vào {rotary_name} và ra tại {way_name}","destination":"Đi và {rotary_name} và ra về hướng {destination}"},"exit":{"default":"Đi vào bùng binh và ra tại đường {exit_number}","name":"Đi vào bùng binh và ra tại đường {exit_number} tức {way_name}","destination":"Đi vào bùng binh và ra tại đường {exit_number} về hướng {destination}"},"name_exit":{"default":"Đi vào {rotary_name} và ra tại đường {exit_number}","name":"Đi vào {rotary_name} và ra tại đường {exit_number} tức {way_name}","destination":"Đi vào {rotary_name} và ra tại đường {exit_number} về hướng {destination}"}}},"roundabout":{"default":{"exit":{"default":"Đi vào bùng binh và ra tại đường {exit_number}","name":"Đi vào bùng binh và ra tại đường {exit_number} tức {way_name}","destination":"Đi vào bùng binh và ra tại đường {exit_number} về hướng {destination}"},"default":{"default":"Đi vào bùng binh","name":"Đi vào bùng binh và ra tại {way_name}","destination":"Đi vào bùng binh và ra về hướng {destination}"}}},"roundabout turn":{"default":{"default":"Quẹo {modifier}","name":"Quẹo {modifier} vào {way_name}","destination":"Quẹo {modifier} về hướng {destination}"},"left":{"default":"Quẹo trái","name":"Quẹo trái vào {way_name}","destination":"Quẹo trái về hướng {destination}"},"right":{"default":"Quẹo phải","name":"Quẹo phải vào {way_name}","destination":"Quẹo phải về hướng {destination}"},"straight":{"default":"Chạy thẳng","name":"Chạy tiếp trên {way_name}","destination":"Chạy tiếp về hướng {destination}"}},"exit roundabout":{"default":{"default":"Ra bùng binh","name":"Ra bùng binh vào {way_name}","destination":"Ra bùng binh về hướng {destination}"}},"exit rotary":{"default":{"default":"Ra bùng binh","name":"Ra bùng binh vào {way_name}","destination":"Ra bùng binh về hướng {destination}"}},"turn":{"default":{"default":"Quẹo {modifier}","name":"Quẹo {modifier} vào {way_name}","destination":"Quẹo {modifier} về hướng {destination}"},"left":{"default":"Quẹo trái","name":"Quẹo trái vào {way_name}","destination":"Quẹo trái về hướng {destination}"},"right":{"default":"Quẹo phải","name":"Quẹo phải vào {way_name}","destination":"Quẹo phải về hướng {destination}"},"straight":{"default":"Chạy thẳng","name":"Chạy thẳng vào {way_name}","destination":"Chạy thẳng về hướng {destination}"}},"use lane":{"no_lanes":{"default":"Chạy thẳng"},"default":{"default":"{lane_instruction}"}}};
var vi = {
	meta: meta$18,
	v5: v5$18
};

var vi$1 = Object.freeze({
	meta: meta$18,
	v5: v5$18,
	default: vi
});

const meta$19 = {"capitalizeFirstLetter":false};
const v5$19 = {"constants":{"ordinalize":{"1":"第一","2":"第二","3":"第三","4":"第四","5":"第五","6":"第六","7":"第七","8":"第八","9":"第九","10":"第十"},"direction":{"north":"北","northeast":"东北","east":"东","southeast":"东南","south":"南","southwest":"西南","west":"西","northwest":"西北"},"modifier":{"left":"向左","right":"向右","sharp left":"向左","sharp right":"向右","slight left":"向左","slight right":"向右","straight":"直行","uturn":"调头"},"lanes":{"xo":"靠右直行","ox":"靠左直行","xox":"保持在道路中间直行","oxo":"保持在道路两侧直行"}},"modes":{"ferry":{"default":"乘坐轮渡","name":"乘坐{way_name}轮渡","destination":"乘坐开往{destination}的轮渡"}},"phrase":{"two linked by distance":"{instruction_one}, then, in {distance}, {instruction_two}","two linked":"{instruction_one}, then {instruction_two}","one in distance":"In {distance}, {instruction_one}","name and ref":"{name}（{ref}）","exit with number":"exit {exit}"},"arrive":{"default":{"default":"您已经到达您的{nth}个目的地","upcoming":"您已经到达您的{nth}个目的地","short":"您已经到达您的{nth}个目的地","short-upcoming":"您已经到达您的{nth}个目的地"},"left":{"default":"您已经到达您的{nth}个目的地，在道路左侧","upcoming":"您已经到达您的{nth}个目的地，在道路左侧","short":"您已经到达您的{nth}个目的地","short-upcoming":"您已经到达您的{nth}个目的地"},"right":{"default":"您已经到达您的{nth}个目的地，在道路右侧","upcoming":"您已经到达您的{nth}个目的地，在道路右侧","short":"您已经到达您的{nth}个目的地","short-upcoming":"您已经到达您的{nth}个目的地"},"sharp left":{"default":"您已经到达您的{nth}个目的地，在道路左侧","upcoming":"您已经到达您的{nth}个目的地，在道路左侧","short":"您已经到达您的{nth}个目的地","short-upcoming":"您已经到达您的{nth}个目的地"},"sharp right":{"default":"您已经到达您的{nth}个目的地，在道路右侧","upcoming":"您已经到达您的{nth}个目的地，在道路右侧","short":"您已经到达您的{nth}个目的地","short-upcoming":"您已经到达您的{nth}个目的地"},"slight right":{"default":"您已经到达您的{nth}个目的地，在道路右侧","upcoming":"您已经到达您的{nth}个目的地，在道路右侧","short":"您已经到达您的{nth}个目的地","short-upcoming":"您已经到达您的{nth}个目的地"},"slight left":{"default":"您已经到达您的{nth}个目的地，在道路左侧","upcoming":"您已经到达您的{nth}个目的地，在道路左侧","short":"您已经到达您的{nth}个目的地","short-upcoming":"您已经到达您的{nth}个目的地"},"straight":{"default":"您已经到达您的{nth}个目的地，在您正前方","upcoming":"您已经到达您的{nth}个目的地，在您正前方","short":"您已经到达您的{nth}个目的地","short-upcoming":"您已经到达您的{nth}个目的地"}},"continue":{"default":{"default":"{modifier}行驶","name":"继续{modifier}，上{way_name}","destination":"{modifier}行驶，前往{destination}","exit":"{modifier}行驶，上{way_name}"},"sharp left":{"default":"Make a sharp left","name":"Make a sharp left to stay on {way_name}","destination":"Make a sharp left towards {destination}"},"sharp right":{"default":"Make a sharp right","name":"Make a sharp right to stay on {way_name}","destination":"Make a sharp right towards {destination}"},"uturn":{"default":"调头","name":"调头上{way_name}","destination":"调头后前往{destination}"}},"depart":{"default":{"default":"出发向{direction}","name":"出发向{direction}，上{way_name}","namedistance":"Head {direction} on {way_name} for {distance}"}},"end of road":{"default":{"default":"{modifier}行驶","name":"{modifier}行驶，上{way_name}","destination":"{modifier}行驶，前往{destination}"},"straight":{"default":"继续直行","name":"继续直行，上{way_name}","destination":"继续直行，前往{destination}"},"uturn":{"default":"在道路尽头调头","name":"在道路尽头调头上{way_name}","destination":"在道路尽头调头，前往{destination}"}},"fork":{"default":{"default":"在岔道保持{modifier}","name":"在岔道保持{modifier}，上{way_name}","destination":"在岔道保持{modifier}，前往{destination}"},"uturn":{"default":"调头","name":"调头，上{way_name}","destination":"调头，前往{destination}"}},"merge":{"default":{"default":"{modifier}并道","name":"{modifier}并道，上{way_name}","destination":"{modifier}并道，前往{destination}"},"straight":{"default":"直行并道","name":"直行并道，上{way_name}","destination":"直行并道，前往{destination}"},"uturn":{"default":"调头","name":"调头，上{way_name}","destination":"调头，前往{destination}"}},"new name":{"default":{"default":"继续{modifier}","name":"继续{modifier}，上{way_name}","destination":"继续{modifier}，前往{destination}"},"straight":{"default":"继续直行","name":"Continue onto {way_name}","destination":"Continue towards {destination}"},"uturn":{"default":"调头","name":"调头，上{way_name}","destination":"调头，前往{destination}"}},"notification":{"default":{"default":"继续{modifier}","name":"继续{modifier}，上{way_name}","destination":"继续{modifier}，前往{destination}"},"uturn":{"default":"调头","name":"调头，上{way_name}","destination":"调头，前往{destination}"}},"off ramp":{"default":{"default":"上匝道","name":"通过匝道驶入{way_name}","destination":"通过匝道前往{destination}","exit":"Take exit {exit}","exit_destination":"Take exit {exit} towards {destination}"},"left":{"default":"通过左边的匝道","name":"通过左边的匝道驶入{way_name}","destination":"通过左边的匝道前往{destination}","exit":"Take exit {exit} on the left","exit_destination":"Take exit {exit} on the left towards {destination}"},"right":{"default":"通过右边的匝道","name":"通过右边的匝道驶入{way_name}","destination":"通过右边的匝道前往{destination}","exit":"Take exit {exit} on the right","exit_destination":"Take exit {exit} on the right towards {destination}"}},"on ramp":{"default":{"default":"通过匝道","name":"通过匝道驶入{way_name}","destination":"通过匝道前往{destination}"},"left":{"default":"通过左边的匝道","name":"通过左边的匝道驶入{way_name}","destination":"通过左边的匝道前往{destination}"},"right":{"default":"通过右边的匝道","name":"通过右边的匝道驶入{way_name}","destination":"通过右边的匝道前往{destination}"}},"rotary":{"default":{"default":{"default":"进入环岛","name":"通过环岛后驶入{way_name}","destination":"通过环岛前往{destination}"},"name":{"default":"进入{rotary_name}环岛","name":"通过{rotary_name}环岛后驶入{way_name}","destination":"通过{rotary_name}环岛后前往{destination}"},"exit":{"default":"进入环岛并从{exit_number}出口驶出","name":"进入环岛后从{exit_number}出口驶出进入{way_name}","destination":"进入环岛后从{exit_number}出口驶出前往{destination}"},"name_exit":{"default":"进入{rotary_name}环岛后从{exit_number}出口驶出","name":"进入{rotary_name}环岛后从{exit_number}出口驶出进入{way_name}","destination":"进入{rotary_name}环岛后从{exit_number}出口驶出前往{destination}"}}},"roundabout":{"default":{"exit":{"default":"进入环岛后从{exit_number}出口驶出","name":"进入环岛后从{exit_number}出口驶出前往{way_name}","destination":"进入环岛后从{exit_number}出口驶出前往{destination}"},"default":{"default":"进入环岛","name":"通过环岛后驶入{way_name}","destination":"通过环岛后前往{destination}"}}},"roundabout turn":{"default":{"default":"在环岛{modifier}行驶","name":"在环岛{modifier}行驶，上{way_name}","destination":"在环岛{modifier}行驶，前往{destination}"},"left":{"default":"在环岛左转","name":"在环岛左转，上{way_name}","destination":"在环岛左转，前往{destination}"},"right":{"default":"在环岛右转","name":"在环岛右转，上{way_name}","destination":"在环岛右转，前往{destination}"},"straight":{"default":"在环岛继续直行","name":"在环岛继续直行，上{way_name}","destination":"在环岛继续直行，前往{destination}"}},"exit roundabout":{"default":{"default":"{modifier}转弯","name":"{modifier}转弯，上{way_name}","destination":"{modifier}转弯，前往{destination}"},"left":{"default":"左转","name":"左转，上{way_name}","destination":"左转，前往{destination}"},"right":{"default":"右转","name":"右转，上{way_name}","destination":"右转，前往{destination}"},"straight":{"default":"直行","name":"直行，上{way_name}","destination":"直行，前往{destination}"}},"exit rotary":{"default":{"default":"{modifier}转弯","name":"{modifier}转弯，上{way_name}","destination":"{modifier}转弯，前往{destination}"},"left":{"default":"左转","name":"左转，上{way_name}","destination":"左转，前往{destination}"},"right":{"default":"右转","name":"右转，上{way_name}","destination":"右转，前往{destination}"},"straight":{"default":"直行","name":"直行，上{way_name}","destination":"直行，前往{destination}"}},"turn":{"default":{"default":"{modifier}转弯","name":"{modifier}转弯，上{way_name}","destination":"{modifier}转弯，前往{destination}"},"left":{"default":"左转","name":"左转，上{way_name}","destination":"左转，前往{destination}"},"right":{"default":"右转","name":"右转，上{way_name}","destination":"右转，前往{destination}"},"straight":{"default":"直行","name":"直行，上{way_name}","destination":"直行，前往{destination}"}},"use lane":{"no_lanes":{"default":"继续直行"},"default":{"default":"{lane_instruction}"}}};
var zhHans = {
	meta: meta$19,
	v5: v5$19
};

var zhHans$1 = Object.freeze({
	meta: meta$19,
	v5: v5$19,
	default: zhHans
});

const meta$20 = {"regExpFlags":""};
const v5$20 = {"accusative":[["^ ([«\"])"," трасса $1"],["^ (\\S+)ая [Аа]ллея "," $1ую аллею "],["^ (\\S+)ья [Аа]ллея "," $1ью аллею "],["^ (\\S+)яя [Аа]ллея "," $1юю аллею "],["^ (\\d+)-я (\\S+)ая [Аа]ллея "," $1-ю $2ую аллею "],["^ [Аа]ллея "," аллею "],["^ (\\S+)ая-(\\S+)ая [Уу]лица "," $1ую-$2ую улицу "],["^ (\\S+)ая [Уу]лица "," $1ую улицу "],["^ (\\S+)ья [Уу]лица "," $1ью улицу "],["^ (\\S+)яя [Уу]лица "," $1юю улицу "],["^ (\\d+)-я [Уу]лица "," $1-ю улицу "],["^ (\\d+)-я (\\S+)ая [Уу]лица "," $1-ю $2ую улицу "],["^ (\\S+)ая (\\S+)ая [Уу]лица "," $1ую $2ую улицу "],["^ (\\S+[вн])а [Уу]лица "," $1у улицу "],["^ (\\S+)ая (\\S+[вн])а [Уу]лица "," $1ую $2у улицу "],["^ Даньславля [Уу]лица "," Даньславлю улицу "],["^ Добрыня [Уу]лица "," Добрыню улицу "],["^ Людогоща [Уу]лица "," Людогощу улицу "],["^ [Уу]лица "," улицу "],["^ (\\d+)-я [Лл]иния "," $1-ю линию "],["^ (\\d+)-(\\d+)-я [Лл]иния "," $1-$2-ю линию "],["^ (\\S+)ая [Лл]иния "," $1ую линию "],["^ (\\S+)ья [Лл]иния "," $1ью линию "],["^ (\\S+)яя [Лл]иния "," $1юю линию "],["^ (\\d+)-я (\\S+)ая [Лл]иния "," $1-ю $2ую линию "],["^ [Лл]иния "," линию "],["^ (\\d+)-(\\d+)-я [Лл]инии "," $1-$2-ю линии "],["^ (\\S+)ая [Нн]абережная "," $1ую набережную "],["^ (\\S+)ья [Нн]абережная "," $1ью набережную "],["^ (\\S+)яя [Нн]абережная "," $1юю набережную "],["^ (\\d+)-я (\\S+)ая [Нн]абережная "," $1-ю $2ую набережную "],["^ [Нн]абережная "," набережную "],["^ (\\S+)ая [Пп]лощадь "," $1ую площадь "],["^ (\\S+)ья [Пп]лощадь "," $1ью площадь "],["^ (\\S+)яя [Пп]лощадь "," $1юю площадь "],["^ (\\S+[вн])а [Пп]лощадь "," $1у площадь "],["^ (\\d+)-я (\\S+)ая [Пп]лощадь "," $1-ю $2ую площадь "],["^ [Пп]лощадь "," площадь "],["^ (\\S+)ая [Ээ]стакада "," $1ую эстакаду "],["^ (\\S+)ья [Ээ]стакада "," $1ью эстакаду "],["^ (\\S+)яя [Ээ]стакада "," $1юю эстакаду "],["^ (\\d+)-я (\\S+)ая [Ээ]стакада "," $1-ю $2ую эстакаду "],["^ [Ээ]стакада "," эстакаду "],["^ (\\S+)ая [Мм]агистраль "," $1ую магистраль "],["^ (\\S+)ья [Мм]агистраль "," $1ью магистраль "],["^ (\\S+)яя [Мм]агистраль "," $1юю магистраль "],["^ (\\S+)ая (\\S+)ая [Мм]агистраль "," $1ую $2ую магистраль "],["^ (\\d+)-я (\\S+)ая [Мм]агистраль "," $1-ю $2ую магистраль "],["^ [Мм]агистраль "," магистраль "],["^ (\\S+)ая [Рр]азвязка "," $1ую развязку "],["^ (\\S+)ья [Рр]азвязка "," $1ью развязку "],["^ (\\S+)яя [Рр]азвязка "," $1юю развязку "],["^ (\\d+)-я (\\S+)ая [Рр]азвязка "," $1-ю $2ую развязку "],["^ [Рр]азвязка "," развязку "],["^ (\\S+)ая [Тт]расса "," $1ую трассу "],["^ (\\S+)ья [Тт]расса "," $1ью трассу "],["^ (\\S+)яя [Тт]расса "," $1юю трассу "],["^ (\\d+)-я (\\S+)ая [Тт]расса "," $1-ю $2ую трассу "],["^ [Тт]расса "," трассу "],["^ (\\S+)ая ([Аа]вто)?[Дд]орога "," $1ую $2дорогу "],["^ (\\S+)ья ([Аа]вто)?[Дд]орога "," $1ью $2дорогу "],["^ (\\S+)яя ([Аа]вто)?[Дд]орога "," $1юю $2дорогу "],["^ (\\S+)ая (\\S+)ая ([Аа]вто)?[Дд]орога "," $1ую $2ую $3дорогу "],["^ (\\d+)-я (\\S+)ая ([Аа]вто)?[Дд]орога "," $1-ю $2ую $3дорогу "],["^ ([Аа]вто)?[Дд]орога "," $1дорогу "],["^ (\\S+)ая [Дд]орожка "," $1ую дорожку "],["^ (\\S+)ья [Дд]орожка "," $1ью дорожку "],["^ (\\S+)яя [Дд]орожка "," $1юю дорожку "],["^ (\\d+)-я (\\S+)ая [Дд]орожка "," $1-ю $2ую дорожку "],["^ [Дд]орожка "," дорожку "],["^ (\\S+)ая [Кк]оса "," $1ую косу "],["^ [Дд]убл[её]р "," дублёр "]],"dative":[["^ ([«\"])"," трасса $1"],["^ (\\S+)ая [Аа]ллея "," $1ой аллее "],["^ (\\S+)ья [Аа]ллея "," $1ьей аллее "],["^ (\\S+)яя [Аа]ллея "," $1ей аллее "],["^ (\\d+)-я (\\S+)ая [Аа]ллея "," $1-й $2ой аллее "],["^ [Аа]ллея "," аллее "],["^ (\\S+)ая-(\\S+)ая [Уу]лица "," $1ой-$2ой улице "],["^ (\\S+)ая [Уу]лица "," $1ой улице "],["^ (\\S+)ья [Уу]лица "," $1ьей улице "],["^ (\\S+)яя [Уу]лица "," $1ей улице "],["^ (\\d+)-я [Уу]лица "," $1-й улице "],["^ (\\d+)-я (\\S+)ая [Уу]лица "," $1-й $2ой улице "],["^ (\\S+)ая (\\S+)ая [Уу]лица "," $1ой $2ой улице "],["^ (\\S+[вн])а [Уу]лица "," $1ой улице "],["^ (\\S+)ая (\\S+[вн])а [Уу]лица "," $1ой $2ой улице "],["^ Даньславля [Уу]лица "," Даньславлей улице "],["^ Добрыня [Уу]лица "," Добрыней улице "],["^ Людогоща [Уу]лица "," Людогощей улице "],["^ [Уу]лица "," улице "],["^ (\\d+)-я [Лл]иния "," $1-й линии "],["^ (\\d+)-(\\d+)-я [Лл]иния "," $1-$2-й линии "],["^ (\\S+)ая [Лл]иния "," $1ой линии "],["^ (\\S+)ья [Лл]иния "," $1ьей линии "],["^ (\\S+)яя [Лл]иния "," $1ей линии "],["^ (\\d+)-я (\\S+)ая [Лл]иния "," $1-й $2ой линии "],["^ [Лл]иния "," линии "],["^ (\\d+)-(\\d+)-я [Лл]инии "," $1-$2-й линиям "],["^ (\\S+)ая [Нн]абережная "," $1ой набережной "],["^ (\\S+)ья [Нн]абережная "," $1ьей набережной "],["^ (\\S+)яя [Нн]абережная "," $1ей набережной "],["^ (\\d+)-я (\\S+)ая [Нн]абережная "," $1-й $2ой набережной "],["^ [Нн]абережная "," набережной "],["^ (\\S+)ая [Пп]лощадь "," $1ой площади "],["^ (\\S+)ья [Пп]лощадь "," $1ьей площади "],["^ (\\S+)яя [Пп]лощадь "," $1ей площади "],["^ (\\S+[вн])а [Пп]лощадь "," $1ой площади "],["^ (\\d+)-я (\\S+)ая [Пп]лощадь "," $1-й $2ой площади "],["^ [Пп]лощадь "," площади "],["^ (\\S+)ая [Ээ]стакада "," $1ой эстакаде "],["^ (\\S+)ья [Ээ]стакада "," $1ьей эстакаде "],["^ (\\S+)яя [Ээ]стакада "," $1ей эстакаде "],["^ (\\d+)-я (\\S+)ая [Ээ]стакада "," $1-й $2ой эстакаде "],["^ [Ээ]стакада "," эстакаде "],["^ (\\S+)ая [Мм]агистраль "," $1ой магистрали "],["^ (\\S+)ья [Мм]агистраль "," $1ьей магистрали "],["^ (\\S+)яя [Мм]агистраль "," $1ей магистрали "],["^ (\\S+)ая (\\S+)ая [Мм]агистраль "," $1ой $2ой магистрали "],["^ (\\d+)-я (\\S+)ая [Мм]агистраль "," $1-й $2ой магистрали "],["^ [Мм]агистраль "," магистрали "],["^ (\\S+)ая [Рр]азвязка "," $1ой развязке "],["^ (\\S+)ья [Рр]азвязка "," $1ьей развязке "],["^ (\\S+)яя [Рр]азвязка "," $1ей развязке "],["^ (\\d+)-я (\\S+)ая [Рр]азвязка "," $1-й $2ой развязке "],["^ [Рр]азвязка "," развязке "],["^ (\\S+)ая [Тт]расса "," $1ой трассе "],["^ (\\S+)ья [Тт]расса "," $1ьей трассе "],["^ (\\S+)яя [Тт]расса "," $1ей трассе "],["^ (\\d+)-я (\\S+)ая [Тт]расса "," $1-й $2ой трассе "],["^ [Тт]расса "," трассе "],["^ (\\S+)ая ([Аа]вто)?[Дд]орога "," $1ой $2дороге "],["^ (\\S+)ья ([Аа]вто)?[Дд]орога "," $1ьей $2дороге "],["^ (\\S+)яя ([Аа]вто)?[Дд]орога "," $1ей $2дороге "],["^ (\\S+)ая (\\S+)ая ([Аа]вто)?[Дд]орога "," $1ой $2ой $3дороге "],["^ (\\d+)-я (\\S+)ая ([Аа]вто)?[Дд]орога "," $1-й $2ой $3дороге "],["^ ([Аа]вто)?[Дд]орога "," $1дороге "],["^ (\\S+)ая [Дд]орожка "," $1ой дорожке "],["^ (\\S+)ья [Дд]орожка "," $1ьей дорожке "],["^ (\\S+)яя [Дд]орожка "," $1ей дорожке "],["^ (\\d+)-я (\\S+)ая [Дд]орожка "," $1-й $2ой дорожке "],["^ [Дд]орожка "," дорожке "],["^ (\\S+)во [Пп]оле "," $1ву полю "],["^ (\\S+)ая [Кк]оса "," $1ой косе "],["^ (\\S+)[иоы]й [Пп]роток "," $1ому протоку "],["^ (\\S+н)ий [Бб]ульвар "," $1ему бульвару "],["^ (\\S+)[иоы]й [Бб]ульвар "," $1ому бульвару "],["^ (\\S+[иы]н) [Бб]ульвар "," $1у бульвару "],["^ (\\S+)[иоы]й (\\S+н)ий [Бб]ульвар "," $1ому $2ему бульвару "],["^ (\\S+н)ий (\\S+)[иоы]й [Бб]ульвар "," $1ему $2ому бульвару "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Бб]ульвар "," $1ому $2ому бульвару "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Бб]ульвар "," $1ому $2у бульвару "],["^ (\\d+)-й (\\S+н)ий [Бб]ульвар "," $1-му $2ему бульвару "],["^ (\\d+)-й (\\S+)[иоы]й [Бб]ульвар "," $1-му $2ому бульвару "],["^ (\\d+)-й (\\S+[иы]н) [Бб]ульвар "," $1-му $2у бульвару "],["^ [Бб]ульвар "," бульвару "],["^ [Дд]убл[её]р "," дублёру "],["^ (\\S+н)ий [Зз]аезд "," $1ему заезду "],["^ (\\S+)[иоы]й [Зз]аезд "," $1ому заезду "],["^ (\\S+[еёо]в) [Зз]аезд "," $1у заезду "],["^ (\\S+[иы]н) [Зз]аезд "," $1у заезду "],["^ (\\S+)[иоы]й (\\S+н)ий [Зз]аезд "," $1ому $2ему заезду "],["^ (\\S+н)ий (\\S+)[иоы]й [Зз]аезд "," $1ему $2ому заезду "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Зз]аезд "," $1ому $2ому заезду "],["^ (\\S+)[иоы]й (\\S+[еёо]в) [Зз]аезд "," $1ому $2у заезду "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Зз]аезд "," $1ому $2у заезду "],["^ (\\d+)-й (\\S+н)ий [Зз]аезд "," $1-му $2ему заезду "],["^ (\\d+)-й (\\S+)[иоы]й [Зз]аезд "," $1-му $2ому заезду "],["^ (\\d+)-й (\\S+[еёо]в) [Зз]аезд "," $1-му $2у заезду "],["^ (\\d+)-й (\\S+[иы]н) [Зз]аезд "," $1-му $2у заезду "],["^ [Зз]аезд "," заезду "],["^ (\\S+н)ий [Мм]ост "," $1ему мосту "],["^ (\\S+)[иоы]й [Мм]ост "," $1ому мосту "],["^ (\\S+[еёо]в) [Мм]ост "," $1у мосту "],["^ (\\S+[иы]н) [Мм]ост "," $1у мосту "],["^ (\\S+)[иоы]й (\\S+н)ий [Мм]ост "," $1ому $2ему мосту "],["^ (\\S+н)ий (\\S+)[иоы]й [Мм]ост "," $1ему $2ому мосту "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Мм]ост "," $1ому $2ому мосту "],["^ (\\S+)[иоы]й (\\S+[еёо]в) [Мм]ост "," $1ому $2у мосту "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Мм]ост "," $1ому $2у мосту "],["^ (\\d+)-й [Мм]ост "," $1-му мосту "],["^ (\\d+)-й (\\S+н)ий [Мм]ост "," $1-му $2ему мосту "],["^ (\\d+)-й (\\S+)[иоы]й [Мм]ост "," $1-му $2ому мосту "],["^ (\\d+)-й (\\S+[еёо]в) [Мм]ост "," $1-му $2у мосту "],["^ (\\d+)-й (\\S+[иы]н) [Мм]ост "," $1-му $2у мосту "],["^ [Мм]ост "," мосту "],["^ (\\S+н)ий [Оо]бход "," $1ему обходу "],["^ (\\S+)[иоы]й [Оо]бход "," $1ому обходу "],["^ [Оо]бход "," обходу "],["^ (\\S+н)ий [Пп]арк "," $1ему парку "],["^ (\\S+)[иоы]й [Пп]арк "," $1ому парку "],["^ (\\S+[иы]н) [Пп]арк "," $1у парку "],["^ (\\S+)[иоы]й (\\S+н)ий [Пп]арк "," $1ому $2ему парку "],["^ (\\S+н)ий (\\S+)[иоы]й [Пп]арк "," $1ему $2ому парку "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Пп]арк "," $1ому $2ому парку "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Пп]арк "," $1ому $2у парку "],["^ (\\d+)-й (\\S+н)ий [Пп]арк "," $1-му $2ему парку "],["^ (\\d+)-й (\\S+)[иоы]й [Пп]арк "," $1-му $2ому парку "],["^ (\\d+)-й (\\S+[иы]н) [Пп]арк "," $1-му $2у парку "],["^ [Пп]арк "," парку "],["^ (\\S+)[иоы]й-(\\S+)[иоы]й [Пп]ереулок "," $1ому-$2ому переулку "],["^ (\\d+)-й (\\S+)[иоы]й-(\\S+)[иоы]й [Пп]ереулок "," $1-му $2ому-$3ому переулку "],["^ (\\S+н)ий [Пп]ереулок "," $1ему переулку "],["^ (\\S+)[иоы]й [Пп]ереулок "," $1ому переулку "],["^ (\\S+[еёо]в) [Пп]ереулок "," $1у переулку "],["^ (\\S+[иы]н) [Пп]ереулок "," $1у переулку "],["^ (\\S+)[иоы]й (\\S+н)ий [Пп]ереулок "," $1ому $2ему переулку "],["^ (\\S+н)ий (\\S+)[иоы]й [Пп]ереулок "," $1ему $2ому переулку "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Пп]ереулок "," $1ому $2ому переулку "],["^ (\\S+)[иоы]й (\\S+[еёо]в) [Пп]ереулок "," $1ому $2у переулку "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Пп]ереулок "," $1ому $2у переулку "],["^ (\\d+)-й [Пп]ереулок "," $1-му переулку "],["^ (\\d+)-й (\\S+н)ий [Пп]ереулок "," $1-му $2ему переулку "],["^ (\\d+)-й (\\S+)[иоы]й [Пп]ереулок "," $1-му $2ому переулку "],["^ (\\d+)-й (\\S+[еёо]в) [Пп]ереулок "," $1-му $2у переулку "],["^ (\\d+)-й (\\S+[иы]н) [Пп]ереулок "," $1-му $2у переулку "],["^ [Пп]ереулок "," переулку "],["^ [Пп]одъезд "," подъезду "],["^ (\\S+[еёо]в)-(\\S+)[иоы]й [Пп]роезд "," $1у-$2ому проезду "],["^ (\\S+н)ий [Пп]роезд "," $1ему проезду "],["^ (\\S+)[иоы]й [Пп]роезд "," $1ому проезду "],["^ (\\S+[еёо]в) [Пп]роезд "," $1у проезду "],["^ (\\S+[иы]н) [Пп]роезд "," $1у проезду "],["^ (\\S+)[иоы]й (\\S+н)ий [Пп]роезд "," $1ому $2ему проезду "],["^ (\\S+н)ий (\\S+)[иоы]й [Пп]роезд "," $1ему $2ому проезду "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Пп]роезд "," $1ому $2ому проезду "],["^ (\\S+)[иоы]й (\\S+[еёо]в) [Пп]роезд "," $1ому $2у проезду "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Пп]роезд "," $1ому $2у проезду "],["^ (\\d+)-й [Пп]роезд "," $1-му проезду "],["^ (\\d+)-й (\\S+н)ий [Пп]роезд "," $1-му $2ему проезду "],["^ (\\d+)-й (\\S+)[иоы]й [Пп]роезд "," $1-му $2ому проезду "],["^ (\\d+)-й (\\S+[еёо]в) [Пп]роезд "," $1-му $2у проезду "],["^ (\\d+)-й (\\S+[иы]н) [Пп]роезд "," $1-му $2у проезду "],["^ (\\d+)-й (\\S+н)ий (\\S+)[иоы]й [Пп]роезд "," $1-му $2ему $3ому проезду "],["^ (\\d+)-й (\\S+)[иоы]й (\\S+)[иоы]й [Пп]роезд "," $1-му $2ому $3ому проезду "],["^ [Пп]роезд "," проезду "],["^ (\\S+н)ий [Пп]роспект "," $1ему проспекту "],["^ (\\S+)[иоы]й [Пп]роспект "," $1ому проспекту "],["^ (\\S+[иы]н) [Пп]роспект "," $1у проспекту "],["^ (\\S+)[иоы]й (\\S+н)ий [Пп]роспект "," $1ому $2ему проспекту "],["^ (\\S+н)ий (\\S+)[иоы]й [Пп]роспект "," $1ему $2ому проспекту "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Пп]роспект "," $1ому $2ому проспекту "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Пп]роспект "," $1ому $2у проспекту "],["^ (\\d+)-й (\\S+н)ий [Пп]роспект "," $1-му $2ему проспекту "],["^ (\\d+)-й (\\S+)[иоы]й [Пп]роспект "," $1-му $2ому проспекту "],["^ (\\d+)-й (\\S+[иы]н) [Пп]роспект "," $1-му $2у проспекту "],["^ [Пп]роспект "," проспекту "],["^ (\\S+н)ий [Пп]утепровод "," $1ему путепроводу "],["^ (\\S+)[иоы]й [Пп]утепровод "," $1ому путепроводу "],["^ (\\S+[иы]н) [Пп]утепровод "," $1у путепроводу "],["^ (\\S+)[иоы]й (\\S+н)ий [Пп]утепровод "," $1ому $2ему путепроводу "],["^ (\\S+н)ий (\\S+)[иоы]й [Пп]утепровод "," $1ему $2ому путепроводу "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Пп]утепровод "," $1ому $2ому путепроводу "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Пп]утепровод "," $1ому $2у путепроводу "],["^ (\\d+)-й (\\S+н)ий [Пп]утепровод "," $1-му $2ему путепроводу "],["^ (\\d+)-й (\\S+)[иоы]й [Пп]утепровод "," $1-му $2ому путепроводу "],["^ (\\d+)-й (\\S+[иы]н) [Пп]утепровод "," $1-му $2у путепроводу "],["^ [Пп]утепровод "," путепроводу "],["^ (\\S+н)ий [Сс]пуск "," $1ему спуску "],["^ (\\S+)[иоы]й [Сс]пуск "," $1ому спуску "],["^ (\\S+[еёо]в) [Сс]пуск "," $1у спуску "],["^ (\\S+[иы]н) [Сс]пуск "," $1у спуску "],["^ (\\S+)[иоы]й (\\S+н)ий [Сс]пуск "," $1ому $2ему спуску "],["^ (\\S+н)ий (\\S+)[иоы]й [Сс]пуск "," $1ему $2ому спуску "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Сс]пуск "," $1ому $2ому спуску "],["^ (\\S+)[иоы]й (\\S+[еёо]в) [Сс]пуск "," $1ому $2у спуску "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Сс]пуск "," $1ому $2у спуску "],["^ (\\d+)-й (\\S+н)ий [Сс]пуск "," $1-му $2ему спуску "],["^ (\\d+)-й (\\S+)[иоы]й [Сс]пуск "," $1-му $2ому спуску "],["^ (\\d+)-й (\\S+[еёо]в) [Сс]пуск "," $1-му $2у спуску "],["^ (\\d+)-й (\\S+[иы]н) [Сс]пуск "," $1-му $2у спуску "],["^ [Сс]пуск "," спуску "],["^ (\\S+н)ий [Сс]ъезд "," $1ему съезду "],["^ (\\S+)[иоы]й [Сс]ъезд "," $1ому съезду "],["^ (\\S+[иы]н) [Сс]ъезд "," $1у съезду "],["^ (\\S+)[иоы]й (\\S+н)ий [Сс]ъезд "," $1ому $2ему съезду "],["^ (\\S+н)ий (\\S+)[иоы]й [Сс]ъезд "," $1ему $2ому съезду "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Сс]ъезд "," $1ому $2ому съезду "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Сс]ъезд "," $1ому $2у съезду "],["^ (\\d+)-й (\\S+н)ий [Сс]ъезд "," $1-му $2ему съезду "],["^ (\\d+)-й (\\S+)[иоы]й [Сс]ъезд "," $1-му $2ому съезду "],["^ (\\d+)-й (\\S+[иы]н) [Сс]ъезд "," $1-му $2у съезду "],["^ [Сс]ъезд "," съезду "],["^ (\\S+н)ий [Тт][уо]ннель "," $1ему тоннелю "],["^ (\\S+)[иоы]й [Тт][уо]ннель "," $1ому тоннелю "],["^ (\\S+[иы]н) [Тт][уо]ннель "," $1у тоннелю "],["^ (\\S+)[иоы]й (\\S+н)ий [Тт][уо]ннель "," $1ому $2ему тоннелю "],["^ (\\S+н)ий (\\S+)[иоы]й [Тт][уо]ннель "," $1ему $2ому тоннелю "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Тт][уо]ннель "," $1ому $2ому тоннелю "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Тт][уо]ннель "," $1ому $2у тоннелю "],["^ (\\d+)-й (\\S+н)ий [Тт][уо]ннель "," $1-му $2ему тоннелю "],["^ (\\d+)-й (\\S+)[иоы]й [Тт][уо]ннель "," $1-му $2ому тоннелю "],["^ (\\d+)-й (\\S+[иы]н) [Тт][уо]ннель "," $1-му $2у тоннелю "],["^ [Тт][уо]ннель "," тоннелю "],["^ (\\S+н)ий [Тт]ракт "," $1ему тракту "],["^ (\\S+)[иоы]й [Тт]ракт "," $1ому тракту "],["^ (\\S+[еёо]в) [Тт]ракт "," $1у тракту "],["^ (\\S+[иы]н) [Тт]ракт "," $1у тракту "],["^ (\\S+)[иоы]й (\\S+н)ий [Тт]ракт "," $1ому $2ему тракту "],["^ (\\S+н)ий (\\S+)[иоы]й [Тт]ракт "," $1ему $2ому тракту "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Тт]ракт "," $1ому $2ому тракту "],["^ (\\S+)[иоы]й (\\S+[еёо]в) [Тт]ракт "," $1ому $2у тракту "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Тт]ракт "," $1ому $2у тракту "],["^ (\\d+)-й (\\S+н)ий [Тт]ракт "," $1-му $2ему тракту "],["^ (\\d+)-й (\\S+)[иоы]й [Тт]ракт "," $1-му $2ому тракту "],["^ (\\d+)-й (\\S+[еёо]в) [Тт]ракт "," $1-му $2у тракту "],["^ (\\d+)-й (\\S+[иы]н) [Тт]ракт "," $1-му $2у тракту "],["^ [Тт]ракт "," тракту "],["^ (\\S+н)ий [Тт]упик "," $1ему тупику "],["^ (\\S+)[иоы]й [Тт]упик "," $1ому тупику "],["^ (\\S+[еёо]в) [Тт]упик "," $1у тупику "],["^ (\\S+[иы]н) [Тт]упик "," $1у тупику "],["^ (\\S+)[иоы]й (\\S+н)ий [Тт]упик "," $1ому $2ему тупику "],["^ (\\S+н)ий (\\S+)[иоы]й [Тт]упик "," $1ему $2ому тупику "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Тт]упик "," $1ому $2ому тупику "],["^ (\\S+)[иоы]й (\\S+[еёо]в) [Тт]упик "," $1ому $2у тупику "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Тт]упик "," $1ому $2у тупику "],["^ (\\d+)-й [Тт]упик "," $1-му тупику "],["^ (\\d+)-й (\\S+н)ий [Тт]упик "," $1-му $2ему тупику "],["^ (\\d+)-й (\\S+)[иоы]й [Тт]упик "," $1-му $2ому тупику "],["^ (\\d+)-й (\\S+[еёо]в) [Тт]упик "," $1-му $2у тупику "],["^ (\\d+)-й (\\S+[иы]н) [Тт]упик "," $1-му $2у тупику "],["^ [Тт]упик "," тупику "],["^ (\\S+[ео])е ([Пп]олу)?[Кк]ольцо "," $1му $2кольцу "],["^ (\\S+ье) ([Пп]олу)?[Кк]ольцо "," $1му $2кольцу "],["^ (\\S+[ео])е (\\S+[ео])е ([Пп]олу)?[Кк]ольцо "," $1му $2му $3кольцу "],["^ (\\S+ье) (\\S+[ео])е ([Пп]олу)?[Кк]ольцо "," $1му $2му $3кольцу "],["^ (\\d+)-е (\\S+[ео])е ([Пп]олу)?[Кк]ольцо "," $1-му $2му $3кольцу "],["^ (\\d+)-е (\\S+ье) ([Пп]олу)?[Кк]ольцо "," $1-му $2му $3кольцу "],["^ ([Пп]олу)?[Кк]ольцо "," $1кольцу "],["^ (\\S+[ео])е [Шш]оссе "," $1му шоссе "],["^ (\\S+ье) [Шш]оссе "," $1му шоссе "],["^ (\\S+[ео])е (\\S+[ео])е [Шш]оссе "," $1му $2му шоссе "],["^ (\\S+ье) (\\S+[ео])е [Шш]оссе "," $1му $2му шоссе "],["^ (\\d+)-е (\\S+[ео])е [Шш]оссе "," $1-му $2му шоссе "],["^ (\\d+)-е (\\S+ье) [Шш]оссе "," $1-му $2му шоссе "],[" ([Тт])ретому "," $1ретьему "],["([жч])ому ","$1ьему "],["([жч])ой ","$1ей "]],"genitive":[["^ ([«\"])"," трасса $1"],["^ (\\S+)ая [Аа]ллея "," $1ой аллеи "],["^ (\\S+)ья [Аа]ллея "," $1ьей аллеи "],["^ (\\S+)яя [Аа]ллея "," $1ей аллеи "],["^ (\\d+)-я (\\S+)ая [Аа]ллея "," $1-й $2ой аллеи "],["^ [Аа]ллея "," аллеи "],["^ (\\S+)ая-(\\S+)ая [Уу]лица "," $1ой-$2ой улицы "],["^ (\\S+)ая [Уу]лица "," $1ой улицы "],["^ (\\S+)ья [Уу]лица "," $1ьей улицы "],["^ (\\S+)яя [Уу]лица "," $1ей улицы "],["^ (\\d+)-я [Уу]лица "," $1-й улицы "],["^ (\\d+)-я (\\S+)ая [Уу]лица "," $1-й $2ой улицы "],["^ (\\S+)ая (\\S+)ая [Уу]лица "," $1ой $2ой улицы "],["^ (\\S+[вн])а [Уу]лица "," $1ой улицы "],["^ (\\S+)ая (\\S+[вн])а [Уу]лица "," $1ой $2ой улицы "],["^ Даньславля [Уу]лица "," Даньславлей улицы "],["^ Добрыня [Уу]лица "," Добрыней улицы "],["^ Людогоща [Уу]лица "," Людогощей улицы "],["^ [Уу]лица "," улицы "],["^ (\\d+)-я [Лл]иния "," $1-й линии "],["^ (\\d+)-(\\d+)-я [Лл]иния "," $1-$2-й линии "],["^ (\\S+)ая [Лл]иния "," $1ой линии "],["^ (\\S+)ья [Лл]иния "," $1ьей линии "],["^ (\\S+)яя [Лл]иния "," $1ей линии "],["^ (\\d+)-я (\\S+)ая [Лл]иния "," $1-й $2ой линии "],["^ [Лл]иния "," линии "],["^ (\\d+)-(\\d+)-я [Лл]инии "," $1-$2-й линий "],["^ (\\S+)ая [Нн]абережная "," $1ой набережной "],["^ (\\S+)ья [Нн]абережная "," $1ьей набережной "],["^ (\\S+)яя [Нн]абережная "," $1ей набережной "],["^ (\\d+)-я (\\S+)ая [Нн]абережная "," $1-й $2ой набережной "],["^ [Нн]абережная "," набережной "],["^ (\\S+)ая [Пп]лощадь "," $1ой площади "],["^ (\\S+)ья [Пп]лощадь "," $1ьей площади "],["^ (\\S+)яя [Пп]лощадь "," $1ей площади "],["^ (\\S+[вн])а [Пп]лощадь "," $1ой площади "],["^ (\\d+)-я (\\S+)ая [Пп]лощадь "," $1-й $2ой площади "],["^ [Пп]лощадь "," площади "],["^ (\\S+)ая [Ээ]стакада "," $1ой эстакады "],["^ (\\S+)ья [Ээ]стакада "," $1ьей эстакады "],["^ (\\S+)яя [Ээ]стакада "," $1ей эстакады "],["^ (\\d+)-я (\\S+)ая [Ээ]стакада "," $1-й $2ой эстакады "],["^ [Ээ]стакада "," эстакады "],["^ (\\S+)ая [Мм]агистраль "," $1ой магистрали "],["^ (\\S+)ья [Мм]агистраль "," $1ьей магистрали "],["^ (\\S+)яя [Мм]агистраль "," $1ей магистрали "],["^ (\\S+)ая (\\S+)ая [Мм]агистраль "," $1ой $2ой магистрали "],["^ (\\d+)-я (\\S+)ая [Мм]агистраль "," $1-й $2ой магистрали "],["^ [Мм]агистраль "," магистрали "],["^ (\\S+)ая [Рр]азвязка "," $1ой развязки "],["^ (\\S+)ья [Рр]азвязка "," $1ьей развязки "],["^ (\\S+)яя [Рр]азвязка "," $1ей развязки "],["^ (\\d+)-я (\\S+)ая [Рр]азвязка "," $1-й $2ой развязки "],["^ [Рр]азвязка "," развязки "],["^ (\\S+)ая [Тт]расса "," $1ой трассы "],["^ (\\S+)ья [Тт]расса "," $1ьей трассы "],["^ (\\S+)яя [Тт]расса "," $1ей трассы "],["^ (\\d+)-я (\\S+)ая [Тт]расса "," $1-й $2ой трассы "],["^ [Тт]расса "," трассы "],["^ (\\S+)ая ([Аа]вто)?[Дд]орога "," $1ой $2дороги "],["^ (\\S+)ья ([Аа]вто)?[Дд]орога "," $1ьей $2дороги "],["^ (\\S+)яя ([Аа]вто)?[Дд]орога "," $1ей $2дороги "],["^ (\\S+)ая (\\S+)ая ([Аа]вто)?[Дд]орога "," $1ой $2ой $3дороги "],["^ (\\d+)-я (\\S+)ая ([Аа]вто)?[Дд]орога "," $1-й $2ой $3дороги "],["^ ([Аа]вто)?[Дд]орога "," $1дороги "],["^ (\\S+)ая [Дд]орожка "," $1ой дорожки "],["^ (\\S+)ья [Дд]орожка "," $1ьей дорожки "],["^ (\\S+)яя [Дд]орожка "," $1ей дорожки "],["^ (\\d+)-я (\\S+)ая [Дд]орожка "," $1-й $2ой дорожки "],["^ [Дд]орожка "," дорожки "],["^ (\\S+)во [Пп]оле "," $1ва поля "],["^ (\\S+)ая [Кк]оса "," $1ой косы "],["^ (\\S+)[иоы]й [Пп]роток "," $1ого протока "],["^ (\\S+н)ий [Бб]ульвар "," $1его бульвара "],["^ (\\S+)[иоы]й [Бб]ульвар "," $1ого бульвара "],["^ (\\S+[иы]н) [Бб]ульвар "," $1ого бульвара "],["^ (\\S+)[иоы]й (\\S+н)ий [Бб]ульвар "," $1ого $2его бульвара "],["^ (\\S+н)ий (\\S+)[иоы]й [Бб]ульвар "," $1его $2ого бульвара "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Бб]ульвар "," $1ого $2ого бульвара "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Бб]ульвар "," $1ого $2ого бульвара "],["^ (\\d+)-й (\\S+н)ий [Бб]ульвар "," $1-го $2его бульвара "],["^ (\\d+)-й (\\S+)[иоы]й [Бб]ульвар "," $1-го $2ого бульвара "],["^ (\\d+)-й (\\S+[иы]н) [Бб]ульвар "," $1-го $2ого бульвара "],["^ [Бб]ульвар "," бульвара "],["^ [Дд]убл[её]р "," дублёра "],["^ (\\S+н)ий [Зз]аезд "," $1его заезда "],["^ (\\S+)[иоы]й [Зз]аезд "," $1ого заезда "],["^ (\\S+[еёо]в) [Зз]аезд "," $1а заезда "],["^ (\\S+[иы]н) [Зз]аезд "," $1а заезда "],["^ (\\S+)[иоы]й (\\S+н)ий [Зз]аезд "," $1ого $2его заезда "],["^ (\\S+н)ий (\\S+)[иоы]й [Зз]аезд "," $1его $2ого заезда "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Зз]аезд "," $1ого $2ого заезда "],["^ (\\S+)[иоы]й (\\S+[еёо]в) [Зз]аезд "," $1ого $2а заезда "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Зз]аезд "," $1ого $2а заезда "],["^ (\\d+)-й (\\S+н)ий [Зз]аезд "," $1-го $2его заезда "],["^ (\\d+)-й (\\S+)[иоы]й [Зз]аезд "," $1-го $2ого заезда "],["^ (\\d+)-й (\\S+[еёо]в) [Зз]аезд "," $1-го $2а заезда "],["^ (\\d+)-й (\\S+[иы]н) [Зз]аезд "," $1-го $2а заезда "],["^ [Зз]аезд "," заезда "],["^ (\\S+н)ий [Мм]ост "," $1его моста "],["^ (\\S+)[иоы]й [Мм]ост "," $1ого моста "],["^ (\\S+[еёо]в) [Мм]ост "," $1а моста "],["^ (\\S+[иы]н) [Мм]ост "," $1а моста "],["^ (\\S+)[иоы]й (\\S+н)ий [Мм]ост "," $1ого $2его моста "],["^ (\\S+н)ий (\\S+)[иоы]й [Мм]ост "," $1его $2ого моста "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Мм]ост "," $1ого $2ого моста "],["^ (\\S+)[иоы]й (\\S+[еёо]в) [Мм]ост "," $1ого $2а моста "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Мм]ост "," $1ого $2а моста "],["^ (\\d+)-й [Мм]ост "," $1-го моста "],["^ (\\d+)-й (\\S+н)ий [Мм]ост "," $1-го $2его моста "],["^ (\\d+)-й (\\S+)[иоы]й [Мм]ост "," $1-го $2ого моста "],["^ (\\d+)-й (\\S+[еёо]в) [Мм]ост "," $1-го $2а моста "],["^ (\\d+)-й (\\S+[иы]н) [Мм]ост "," $1-го $2а моста "],["^ [Мм]ост "," моста "],["^ (\\S+н)ий [Оо]бход "," $1его обхода "],["^ (\\S+)[иоы]й [Оо]бход "," $1ого обхода "],["^ [Оо]бход "," обхода "],["^ (\\S+н)ий [Пп]арк "," $1его парка "],["^ (\\S+)[иоы]й [Пп]арк "," $1ого парка "],["^ (\\S+[иы]н) [Пп]арк "," $1ого парка "],["^ (\\S+)[иоы]й (\\S+н)ий [Пп]арк "," $1ого $2его парка "],["^ (\\S+н)ий (\\S+)[иоы]й [Пп]арк "," $1его $2ого парка "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Пп]арк "," $1ого $2ого парка "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Пп]арк "," $1ого $2ого парка "],["^ (\\d+)-й (\\S+н)ий [Пп]арк "," $1-го $2его парка "],["^ (\\d+)-й (\\S+)[иоы]й [Пп]арк "," $1-го $2ого парка "],["^ (\\d+)-й (\\S+[иы]н) [Пп]арк "," $1-го $2ого парка "],["^ [Пп]арк "," парка "],["^ (\\S+)[иоы]й-(\\S+)[иоы]й [Пп]ереулок "," $1ого-$2ого переулка "],["^ (\\d+)-й (\\S+)[иоы]й-(\\S+)[иоы]й [Пп]ереулок "," $1-го $2ого-$3ого переулка "],["^ (\\S+н)ий [Пп]ереулок "," $1его переулка "],["^ (\\S+)[иоы]й [Пп]ереулок "," $1ого переулка "],["^ (\\S+[еёо]в) [Пп]ереулок "," $1а переулка "],["^ (\\S+[иы]н) [Пп]ереулок "," $1а переулка "],["^ (\\S+)[иоы]й (\\S+н)ий [Пп]ереулок "," $1ого $2его переулка "],["^ (\\S+н)ий (\\S+)[иоы]й [Пп]ереулок "," $1его $2ого переулка "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Пп]ереулок "," $1ого $2ого переулка "],["^ (\\S+)[иоы]й (\\S+[еёо]в) [Пп]ереулок "," $1ого $2а переулка "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Пп]ереулок "," $1ого $2а переулка "],["^ (\\d+)-й [Пп]ереулок "," $1-го переулка "],["^ (\\d+)-й (\\S+н)ий [Пп]ереулок "," $1-го $2его переулка "],["^ (\\d+)-й (\\S+)[иоы]й [Пп]ереулок "," $1-го $2ого переулка "],["^ (\\d+)-й (\\S+[еёо]в) [Пп]ереулок "," $1-го $2а переулка "],["^ (\\d+)-й (\\S+[иы]н) [Пп]ереулок "," $1-го $2а переулка "],["^ [Пп]ереулок "," переулка "],["^ [Пп]одъезд "," подъезда "],["^ (\\S+[еёо]в)-(\\S+)[иоы]й [Пп]роезд "," $1а-$2ого проезда "],["^ (\\S+н)ий [Пп]роезд "," $1его проезда "],["^ (\\S+)[иоы]й [Пп]роезд "," $1ого проезда "],["^ (\\S+[еёо]в) [Пп]роезд "," $1а проезда "],["^ (\\S+[иы]н) [Пп]роезд "," $1а проезда "],["^ (\\S+)[иоы]й (\\S+н)ий [Пп]роезд "," $1ого $2его проезда "],["^ (\\S+н)ий (\\S+)[иоы]й [Пп]роезд "," $1его $2ого проезда "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Пп]роезд "," $1ого $2ого проезда "],["^ (\\S+)[иоы]й (\\S+[еёо]в) [Пп]роезд "," $1ого $2а проезда "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Пп]роезд "," $1ого $2а проезда "],["^ (\\d+)-й [Пп]роезд "," $1-го проезда "],["^ (\\d+)-й (\\S+н)ий [Пп]роезд "," $1-го $2его проезда "],["^ (\\d+)-й (\\S+)[иоы]й [Пп]роезд "," $1-го $2ого проезда "],["^ (\\d+)-й (\\S+[еёо]в) [Пп]роезд "," $1-го $2а проезда "],["^ (\\d+)-й (\\S+[иы]н) [Пп]роезд "," $1-го $2а проезда "],["^ (\\d+)-й (\\S+н)ий (\\S+)[иоы]й [Пп]роезд "," $1-го $2его $3ого проезда "],["^ (\\d+)-й (\\S+)[иоы]й (\\S+)[иоы]й [Пп]роезд "," $1-го $2ого $3ого проезда "],["^ [Пп]роезд "," проезда "],["^ (\\S+н)ий [Пп]роспект "," $1его проспекта "],["^ (\\S+)[иоы]й [Пп]роспект "," $1ого проспекта "],["^ (\\S+[иы]н) [Пп]роспект "," $1ого проспекта "],["^ (\\S+)[иоы]й (\\S+н)ий [Пп]роспект "," $1ого $2его проспекта "],["^ (\\S+н)ий (\\S+)[иоы]й [Пп]роспект "," $1его $2ого проспекта "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Пп]роспект "," $1ого $2ого проспекта "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Пп]роспект "," $1ого $2ого проспекта "],["^ (\\d+)-й (\\S+н)ий [Пп]роспект "," $1-го $2его проспекта "],["^ (\\d+)-й (\\S+)[иоы]й [Пп]роспект "," $1-го $2ого проспекта "],["^ (\\d+)-й (\\S+[иы]н) [Пп]роспект "," $1-го $2ого проспекта "],["^ [Пп]роспект "," проспекта "],["^ (\\S+н)ий [Пп]утепровод "," $1его путепровода "],["^ (\\S+)[иоы]й [Пп]утепровод "," $1ого путепровода "],["^ (\\S+[иы]н) [Пп]утепровод "," $1ого путепровода "],["^ (\\S+)[иоы]й (\\S+н)ий [Пп]утепровод "," $1ого $2его путепровода "],["^ (\\S+н)ий (\\S+)[иоы]й [Пп]утепровод "," $1его $2ого путепровода "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Пп]утепровод "," $1ого $2ого путепровода "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Пп]утепровод "," $1ого $2ого путепровода "],["^ (\\d+)-й (\\S+н)ий [Пп]утепровод "," $1-го $2его путепровода "],["^ (\\d+)-й (\\S+)[иоы]й [Пп]утепровод "," $1-го $2ого путепровода "],["^ (\\d+)-й (\\S+[иы]н) [Пп]утепровод "," $1-го $2ого путепровода "],["^ [Пп]утепровод "," путепровода "],["^ (\\S+н)ий [Сс]пуск "," $1его спуска "],["^ (\\S+)[иоы]й [Сс]пуск "," $1ого спуска "],["^ (\\S+[еёо]в) [Сс]пуск "," $1а спуска "],["^ (\\S+[иы]н) [Сс]пуск "," $1а спуска "],["^ (\\S+)[иоы]й (\\S+н)ий [Сс]пуск "," $1ого $2его спуска "],["^ (\\S+н)ий (\\S+)[иоы]й [Сс]пуск "," $1его $2ого спуска "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Сс]пуск "," $1ого $2ого спуска "],["^ (\\S+)[иоы]й (\\S+[еёо]в) [Сс]пуск "," $1ого $2а спуска "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Сс]пуск "," $1ого $2а спуска "],["^ (\\d+)-й (\\S+н)ий [Сс]пуск "," $1-го $2его спуска "],["^ (\\d+)-й (\\S+)[иоы]й [Сс]пуск "," $1-го $2ого спуска "],["^ (\\d+)-й (\\S+[еёо]в) [Сс]пуск "," $1-го $2а спуска "],["^ (\\d+)-й (\\S+[иы]н) [Сс]пуск "," $1-го $2а спуска "],["^ [Сс]пуск "," спуска "],["^ (\\S+н)ий [Сс]ъезд "," $1его съезда "],["^ (\\S+)[иоы]й [Сс]ъезд "," $1ого съезда "],["^ (\\S+[иы]н) [Сс]ъезд "," $1ого съезда "],["^ (\\S+)[иоы]й (\\S+н)ий [Сс]ъезд "," $1ого $2его съезда "],["^ (\\S+н)ий (\\S+)[иоы]й [Сс]ъезд "," $1его $2ого съезда "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Сс]ъезд "," $1ого $2ого съезда "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Сс]ъезд "," $1ого $2ого съезда "],["^ (\\d+)-й (\\S+н)ий [Сс]ъезд "," $1-го $2его съезда "],["^ (\\d+)-й (\\S+)[иоы]й [Сс]ъезд "," $1-го $2ого съезда "],["^ (\\d+)-й (\\S+[иы]н) [Сс]ъезд "," $1-го $2ого съезда "],["^ [Сс]ъезд "," съезда "],["^ (\\S+н)ий [Тт][уо]ннель "," $1его тоннеля "],["^ (\\S+)[иоы]й [Тт][уо]ннель "," $1ого тоннеля "],["^ (\\S+[иы]н) [Тт][уо]ннель "," $1ого тоннеля "],["^ (\\S+)[иоы]й (\\S+н)ий [Тт][уо]ннель "," $1ого $2его тоннеля "],["^ (\\S+н)ий (\\S+)[иоы]й [Тт][уо]ннель "," $1его $2ого тоннеля "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Тт][уо]ннель "," $1ого $2ого тоннеля "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Тт][уо]ннель "," $1ого $2ого тоннеля "],["^ (\\d+)-й (\\S+н)ий [Тт][уо]ннель "," $1-го $2его тоннеля "],["^ (\\d+)-й (\\S+)[иоы]й [Тт][уо]ннель "," $1-го $2ого тоннеля "],["^ (\\d+)-й (\\S+[иы]н) [Тт][уо]ннель "," $1-го $2ого тоннеля "],["^ [Тт][уо]ннель "," тоннеля "],["^ (\\S+н)ий [Тт]ракт "," $1ем тракта "],["^ (\\S+)[иоы]й [Тт]ракт "," $1ого тракта "],["^ (\\S+[еёо]в) [Тт]ракт "," $1а тракта "],["^ (\\S+[иы]н) [Тт]ракт "," $1а тракта "],["^ (\\S+)[иоы]й (\\S+н)ий [Тт]ракт "," $1ого $2его тракта "],["^ (\\S+н)ий (\\S+)[иоы]й [Тт]ракт "," $1его $2ого тракта "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Тт]ракт "," $1ого $2ого тракта "],["^ (\\S+)[иоы]й (\\S+[еёо]в) [Тт]ракт "," $1ого $2а тракта "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Тт]ракт "," $1ого $2а тракта "],["^ (\\d+)-й (\\S+н)ий [Тт]ракт "," $1-го $2его тракта "],["^ (\\d+)-й (\\S+)[иоы]й [Тт]ракт "," $1-го $2ого тракта "],["^ (\\d+)-й (\\S+[еёо]в) [Тт]ракт "," $1-го $2а тракта "],["^ (\\d+)-й (\\S+[иы]н) [Тт]ракт "," $1-го $2а тракта "],["^ [Тт]ракт "," тракта "],["^ (\\S+н)ий [Тт]упик "," $1его тупика "],["^ (\\S+)[иоы]й [Тт]упик "," $1ого тупика "],["^ (\\S+[еёо]в) [Тт]упик "," $1а тупика "],["^ (\\S+[иы]н) [Тт]упик "," $1а тупика "],["^ (\\S+)[иоы]й (\\S+н)ий [Тт]упик "," $1ого $2его тупика "],["^ (\\S+н)ий (\\S+)[иоы]й [Тт]упик "," $1его $2ого тупика "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Тт]упик "," $1ого $2ого тупика "],["^ (\\S+)[иоы]й (\\S+[еёо]в) [Тт]упик "," $1ого $2а тупика "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Тт]упик "," $1ого $2а тупика "],["^ (\\d+)-й [Тт]упик "," $1-го тупика "],["^ (\\d+)-й (\\S+н)ий [Тт]упик "," $1-го $2его тупика "],["^ (\\d+)-й (\\S+)[иоы]й [Тт]упик "," $1-го $2ого тупика "],["^ (\\d+)-й (\\S+[еёо]в) [Тт]упик "," $1-го $2а тупика "],["^ (\\d+)-й (\\S+[иы]н) [Тт]упик "," $1-го $2а тупика "],["^ [Тт]упик "," тупика "],["^ (\\S+[ео])е ([Пп]олу)?[Кк]ольцо "," $1го $2кольца "],["^ (\\S+ье) ([Пп]олу)?[Кк]ольцо "," $1го $2кольца "],["^ (\\S+[ео])е (\\S+[ео])е ([Пп]олу)?[Кк]ольцо "," $1го $2го $3кольца "],["^ (\\S+ье) (\\S+[ео])е ([Пп]олу)?[Кк]ольцо "," $1го $2го $3кольца "],["^ (\\d+)-е (\\S+[ео])е ([Пп]олу)?[Кк]ольцо "," $1-го $2го $3кольца "],["^ (\\d+)-е (\\S+ье) ([Пп]олу)?[Кк]ольцо "," $1-го $2го $3кольца "],["^ ([Пп]олу)?[Кк]ольцо "," $1кольца "],["^ (\\S+[ео])е [Шш]оссе "," $1го шоссе "],["^ (\\S+ье) [Шш]оссе "," $1го шоссе "],["^ (\\S+[ео])е (\\S+[ео])е [Шш]оссе "," $1го $2го шоссе "],["^ (\\S+ье) (\\S+[ео])е [Шш]оссе "," $1го $2го шоссе "],["^ (\\d+)-е (\\S+[ео])е [Шш]оссе "," $1-го $2го шоссе "],["^ (\\d+)-е (\\S+ье) [Шш]оссе "," $1-го $2го шоссе "],[" ([Тт])ретого "," $1ретьего "],["([жч])ого ","$1ьего "]],"prepositional":[["^ ([«\"])"," трасса $1"],["^ (\\S+)ая [Аа]ллея "," $1ой аллее "],["^ (\\S+)ья [Аа]ллея "," $1ьей аллее "],["^ (\\S+)яя [Аа]ллея "," $1ей аллее "],["^ (\\d+)-я (\\S+)ая [Аа]ллея "," $1-й $2ой аллее "],["^ [Аа]ллея "," аллее "],["^ (\\S+)ая-(\\S+)ая [Уу]лица "," $1ой-$2ой улице "],["^ (\\S+)ая [Уу]лица "," $1ой улице "],["^ (\\S+)ья [Уу]лица "," $1ьей улице "],["^ (\\S+)яя [Уу]лица "," $1ей улице "],["^ (\\d+)-я [Уу]лица "," $1-й улице "],["^ (\\d+)-я (\\S+)ая [Уу]лица "," $1-й $2ой улице "],["^ (\\S+)ая (\\S+)ая [Уу]лица "," $1ой $2ой улице "],["^ (\\S+[вн])а [Уу]лица "," $1ой улице "],["^ (\\S+)ая (\\S+[вн])а [Уу]лица "," $1ой $2ой улице "],["^ Даньславля [Уу]лица "," Даньславлей улице "],["^ Добрыня [Уу]лица "," Добрыней улице "],["^ Людогоща [Уу]лица "," Людогощей улице "],["^ [Уу]лица "," улице "],["^ (\\d+)-я [Лл]иния "," $1-й линии "],["^ (\\d+)-(\\d+)-я [Лл]иния "," $1-$2-й линии "],["^ (\\S+)ая [Лл]иния "," $1ой линии "],["^ (\\S+)ья [Лл]иния "," $1ьей линии "],["^ (\\S+)яя [Лл]иния "," $1ей линии "],["^ (\\d+)-я (\\S+)ая [Лл]иния "," $1-й $2ой линии "],["^ [Лл]иния "," линии "],["^ (\\d+)-(\\d+)-я [Лл]инии "," $1-$2-й линиях "],["^ (\\S+)ая [Нн]абережная "," $1ой набережной "],["^ (\\S+)ья [Нн]абережная "," $1ьей набережной "],["^ (\\S+)яя [Нн]абережная "," $1ей набережной "],["^ (\\d+)-я (\\S+)ая [Нн]абережная "," $1-й $2ой набережной "],["^ [Нн]абережная "," набережной "],["^ (\\S+)ая [Пп]лощадь "," $1ой площади "],["^ (\\S+)ья [Пп]лощадь "," $1ьей площади "],["^ (\\S+)яя [Пп]лощадь "," $1ей площади "],["^ (\\S+[вн])а [Пп]лощадь "," $1ой площади "],["^ (\\d+)-я (\\S+)ая [Пп]лощадь "," $1-й $2ой площади "],["^ [Пп]лощадь "," площади "],["^ (\\S+)ая [Ээ]стакада "," $1ой эстакаде "],["^ (\\S+)ья [Ээ]стакада "," $1ьей эстакаде "],["^ (\\S+)яя [Ээ]стакада "," $1ей эстакаде "],["^ (\\d+)-я (\\S+)ая [Ээ]стакада "," $1-й $2ой эстакаде "],["^ [Ээ]стакада "," эстакаде "],["^ (\\S+)ая [Мм]агистраль "," $1ой магистрали "],["^ (\\S+)ья [Мм]агистраль "," $1ьей магистрали "],["^ (\\S+)яя [Мм]агистраль "," $1ей магистрали "],["^ (\\S+)ая (\\S+)ая [Мм]агистраль "," $1ой $2ой магистрали "],["^ (\\d+)-я (\\S+)ая [Мм]агистраль "," $1-й $2ой магистрали "],["^ [Мм]агистраль "," магистрали "],["^ (\\S+)ая [Рр]азвязка "," $1ой развязке "],["^ (\\S+)ья [Рр]азвязка "," $1ьей развязке "],["^ (\\S+)яя [Рр]азвязка "," $1ей развязке "],["^ (\\d+)-я (\\S+)ая [Рр]азвязка "," $1-й $2ой развязке "],["^ [Рр]азвязка "," развязке "],["^ (\\S+)ая [Тт]расса "," $1ой трассе "],["^ (\\S+)ья [Тт]расса "," $1ьей трассе "],["^ (\\S+)яя [Тт]расса "," $1ей трассе "],["^ (\\d+)-я (\\S+)ая [Тт]расса "," $1-й $2ой трассе "],["^ [Тт]расса "," трассе "],["^ (\\S+)ая ([Аа]вто)?[Дд]орога "," $1ой $2дороге "],["^ (\\S+)ья ([Аа]вто)?[Дд]орога "," $1ьей $2дороге "],["^ (\\S+)яя ([Аа]вто)?[Дд]орога "," $1ей $2дороге "],["^ (\\S+)ая (\\S+)ая ([Аа]вто)?[Дд]орога "," $1ой $2ой $3дороге "],["^ (\\d+)-я (\\S+)ая ([Аа]вто)?[Дд]орога "," $1-й $2ой $3дороге "],["^ ([Аа]вто)?[Дд]орога "," $1дороге "],["^ (\\S+)ая [Дд]орожка "," $1ой дорожке "],["^ (\\S+)ья [Дд]орожка "," $1ьей дорожке "],["^ (\\S+)яя [Дд]орожка "," $1ей дорожке "],["^ (\\d+)-я (\\S+)ая [Дд]орожка "," $1-й $2ой дорожке "],["^ [Дд]орожка "," дорожке "],["^ (\\S+)во [Пп]оле "," $1вом поле "],["^ (\\S+)ая [Кк]оса "," $1ой косе "],["^ (\\S+)[иоы]й [Пп]роток "," $1ом протоке "],["^ (\\S+н)ий [Бб]ульвар "," $1ем бульваре "],["^ (\\S+)[иоы]й [Бб]ульвар "," $1ом бульваре "],["^ (\\S+[иы]н) [Бб]ульвар "," $1ом бульваре "],["^ (\\S+)[иоы]й (\\S+н)ий [Бб]ульвар "," $1ом $2ем бульваре "],["^ (\\S+н)ий (\\S+)[иоы]й [Бб]ульвар "," $1ем $2ом бульваре "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Бб]ульвар "," $1ом $2ом бульваре "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Бб]ульвар "," $1ом $2ом бульваре "],["^ (\\d+)-й (\\S+н)ий [Бб]ульвар "," $1-м $2ем бульваре "],["^ (\\d+)-й (\\S+)[иоы]й [Бб]ульвар "," $1-м $2ом бульваре "],["^ (\\d+)-й (\\S+[иы]н) [Бб]ульвар "," $1-м $2ом бульваре "],["^ [Бб]ульвар "," бульваре "],["^ [Дд]убл[её]р "," дублёре "],["^ (\\S+н)ий [Зз]аезд "," $1ем заезде "],["^ (\\S+)[иоы]й [Зз]аезд "," $1ом заезде "],["^ (\\S+[еёо]в) [Зз]аезд "," $1ом заезде "],["^ (\\S+[иы]н) [Зз]аезд "," $1ом заезде "],["^ (\\S+)[иоы]й (\\S+н)ий [Зз]аезд "," $1ом $2ем заезде "],["^ (\\S+н)ий (\\S+)[иоы]й [Зз]аезд "," $1ем $2ом заезде "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Зз]аезд "," $1ом $2ом заезде "],["^ (\\S+)[иоы]й (\\S+[еёо]в) [Зз]аезд "," $1ом $2ом заезде "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Зз]аезд "," $1ом $2ом заезде "],["^ (\\d+)-й (\\S+н)ий [Зз]аезд "," $1-м $2ем заезде "],["^ (\\d+)-й (\\S+)[иоы]й [Зз]аезд "," $1-м $2ом заезде "],["^ (\\d+)-й (\\S+[еёо]в) [Зз]аезд "," $1-м $2ом заезде "],["^ (\\d+)-й (\\S+[иы]н) [Зз]аезд "," $1-м $2ом заезде "],["^ [Зз]аезд "," заезде "],["^ (\\S+н)ий [Мм]ост "," $1ем мосту "],["^ (\\S+)[иоы]й [Мм]ост "," $1ом мосту "],["^ (\\S+[еёо]в) [Мм]ост "," $1ом мосту "],["^ (\\S+[иы]н) [Мм]ост "," $1ом мосту "],["^ (\\S+)[иоы]й (\\S+н)ий [Мм]ост "," $1ом $2ем мосту "],["^ (\\S+н)ий (\\S+)[иоы]й [Мм]ост "," $1ем $2ом мосту "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Мм]ост "," $1ом $2ом мосту "],["^ (\\S+)[иоы]й (\\S+[еёо]в) [Мм]ост "," $1ом $2ом мосту "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Мм]ост "," $1ом $2ом мосту "],["^ (\\d+)-й [Мм]ост "," $1-м мосту "],["^ (\\d+)-й (\\S+н)ий [Мм]ост "," $1-м $2ем мосту "],["^ (\\d+)-й (\\S+)[иоы]й [Мм]ост "," $1-м $2ом мосту "],["^ (\\d+)-й (\\S+[еёо]в) [Мм]ост "," $1-м $2ом мосту "],["^ (\\d+)-й (\\S+[иы]н) [Мм]ост "," $1-м $2ом мосту "],["^ [Мм]ост "," мосту "],["^ (\\S+н)ий [Оо]бход "," $1ем обходе "],["^ (\\S+)[иоы]й [Оо]бход "," $1ом обходе "],["^ [Оо]бход "," обходе "],["^ (\\S+н)ий [Пп]арк "," $1ем парке "],["^ (\\S+)[иоы]й [Пп]арк "," $1ом парке "],["^ (\\S+[иы]н) [Пп]арк "," $1ом парке "],["^ (\\S+)[иоы]й (\\S+н)ий [Пп]арк "," $1ом $2ем парке "],["^ (\\S+н)ий (\\S+)[иоы]й [Пп]арк "," $1ем $2ом парке "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Пп]арк "," $1ом $2ом парке "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Пп]арк "," $1ом $2ом парке "],["^ (\\d+)-й (\\S+н)ий [Пп]арк "," $1-м $2ем парке "],["^ (\\d+)-й (\\S+)[иоы]й [Пп]арк "," $1-м $2ом парке "],["^ (\\d+)-й (\\S+[иы]н) [Пп]арк "," $1-м $2ом парке "],["^ [Пп]арк "," парке "],["^ (\\S+)[иоы]й-(\\S+)[иоы]й [Пп]ереулок "," $1ом-$2ом переулке "],["^ (\\d+)-й (\\S+)[иоы]й-(\\S+)[иоы]й [Пп]ереулок "," $1-м $2ом-$3ом переулке "],["^ (\\S+н)ий [Пп]ереулок "," $1ем переулке "],["^ (\\S+)[иоы]й [Пп]ереулок "," $1ом переулке "],["^ (\\S+[еёо]в) [Пп]ереулок "," $1ом переулке "],["^ (\\S+[иы]н) [Пп]ереулок "," $1ом переулке "],["^ (\\S+)[иоы]й (\\S+н)ий [Пп]ереулок "," $1ом $2ем переулке "],["^ (\\S+н)ий (\\S+)[иоы]й [Пп]ереулок "," $1ем $2ом переулке "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Пп]ереулок "," $1ом $2ом переулке "],["^ (\\S+)[иоы]й (\\S+[еёо]в) [Пп]ереулок "," $1ом $2ом переулке "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Пп]ереулок "," $1ом $2ом переулке "],["^ (\\d+)-й [Пп]ереулок "," $1-м переулке "],["^ (\\d+)-й (\\S+н)ий [Пп]ереулок "," $1-м $2ем переулке "],["^ (\\d+)-й (\\S+)[иоы]й [Пп]ереулок "," $1-м $2ом переулке "],["^ (\\d+)-й (\\S+[еёо]в) [Пп]ереулок "," $1-м $2ом переулке "],["^ (\\d+)-й (\\S+[иы]н) [Пп]ереулок "," $1-м $2ом переулке "],["^ [Пп]ереулок "," переулке "],["^ [Пп]одъезд "," подъезде "],["^ (\\S+[еёо]в)-(\\S+)[иоы]й [Пп]роезд "," $1ом-$2ом проезде "],["^ (\\S+н)ий [Пп]роезд "," $1ем проезде "],["^ (\\S+)[иоы]й [Пп]роезд "," $1ом проезде "],["^ (\\S+[еёо]в) [Пп]роезд "," $1ом проезде "],["^ (\\S+[иы]н) [Пп]роезд "," $1ом проезде "],["^ (\\S+)[иоы]й (\\S+н)ий [Пп]роезд "," $1ом $2ем проезде "],["^ (\\S+н)ий (\\S+)[иоы]й [Пп]роезд "," $1ем $2ом проезде "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Пп]роезд "," $1ом $2ом проезде "],["^ (\\S+)[иоы]й (\\S+[еёо]в) [Пп]роезд "," $1ом $2ом проезде "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Пп]роезд "," $1ом $2ом проезде "],["^ (\\d+)-й [Пп]роезд "," $1-м проезде "],["^ (\\d+)-й (\\S+н)ий [Пп]роезд "," $1-м $2ем проезде "],["^ (\\d+)-й (\\S+)[иоы]й [Пп]роезд "," $1-м $2ом проезде "],["^ (\\d+)-й (\\S+[еёо]в) [Пп]роезд "," $1-м $2ом проезде "],["^ (\\d+)-й (\\S+[иы]н) [Пп]роезд "," $1-м $2ом проезде "],["^ (\\d+)-й (\\S+н)ий (\\S+)[иоы]й [Пп]роезд "," $1-м $2ем $3ом проезде "],["^ (\\d+)-й (\\S+)[иоы]й (\\S+)[иоы]й [Пп]роезд "," $1-м $2ом $3ом проезде "],["^ [Пп]роезд "," проезде "],["^ (\\S+н)ий [Пп]роспект "," $1ем проспекте "],["^ (\\S+)[иоы]й [Пп]роспект "," $1ом проспекте "],["^ (\\S+[иы]н) [Пп]роспект "," $1ом проспекте "],["^ (\\S+)[иоы]й (\\S+н)ий [Пп]роспект "," $1ом $2ем проспекте "],["^ (\\S+н)ий (\\S+)[иоы]й [Пп]роспект "," $1ем $2ом проспекте "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Пп]роспект "," $1ом $2ом проспекте "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Пп]роспект "," $1ом $2ом проспекте "],["^ (\\d+)-й (\\S+н)ий [Пп]роспект "," $1-м $2ем проспекте "],["^ (\\d+)-й (\\S+)[иоы]й [Пп]роспект "," $1-м $2ом проспекте "],["^ (\\d+)-й (\\S+[иы]н) [Пп]роспект "," $1-м $2ом проспекте "],["^ [Пп]роспект "," проспекте "],["^ (\\S+н)ий [Пп]утепровод "," $1ем путепроводе "],["^ (\\S+)[иоы]й [Пп]утепровод "," $1ом путепроводе "],["^ (\\S+[иы]н) [Пп]утепровод "," $1ом путепроводе "],["^ (\\S+)[иоы]й (\\S+н)ий [Пп]утепровод "," $1ом $2ем путепроводе "],["^ (\\S+н)ий (\\S+)[иоы]й [Пп]утепровод "," $1ем $2ом путепроводе "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Пп]утепровод "," $1ом $2ом путепроводе "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Пп]утепровод "," $1ом $2ом путепроводе "],["^ (\\d+)-й (\\S+н)ий [Пп]утепровод "," $1-м $2ем путепроводе "],["^ (\\d+)-й (\\S+)[иоы]й [Пп]утепровод "," $1-м $2ом путепроводе "],["^ (\\d+)-й (\\S+[иы]н) [Пп]утепровод "," $1-м $2ом путепроводе "],["^ [Пп]утепровод "," путепроводе "],["^ (\\S+н)ий [Сс]пуск "," $1ем спуске "],["^ (\\S+)[иоы]й [Сс]пуск "," $1ом спуске "],["^ (\\S+[еёо]в) [Сс]пуск "," $1ом спуске "],["^ (\\S+[иы]н) [Сс]пуск "," $1ом спуске "],["^ (\\S+)[иоы]й (\\S+н)ий [Сс]пуск "," $1ом $2ем спуске "],["^ (\\S+н)ий (\\S+)[иоы]й [Сс]пуск "," $1ем $2ом спуске "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Сс]пуск "," $1ом $2ом спуске "],["^ (\\S+)[иоы]й (\\S+[еёо]в) [Сс]пуск "," $1ом $2ом спуске "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Сс]пуск "," $1ом $2ом спуске "],["^ (\\d+)-й (\\S+н)ий [Сс]пуск "," $1-м $2ем спуске "],["^ (\\d+)-й (\\S+)[иоы]й [Сс]пуск "," $1-м $2ом спуске "],["^ (\\d+)-й (\\S+[еёо]в) [Сс]пуск "," $1-м $2ом спуске "],["^ (\\d+)-й (\\S+[иы]н) [Сс]пуск "," $1-м $2ом спуске "],["^ [Сс]пуск "," спуске "],["^ (\\S+н)ий [Сс]ъезд "," $1ем съезде "],["^ (\\S+)[иоы]й [Сс]ъезд "," $1ом съезде "],["^ (\\S+[иы]н) [Сс]ъезд "," $1ом съезде "],["^ (\\S+)[иоы]й (\\S+н)ий [Сс]ъезд "," $1ом $2ем съезде "],["^ (\\S+н)ий (\\S+)[иоы]й [Сс]ъезд "," $1ем $2ом съезде "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Сс]ъезд "," $1ом $2ом съезде "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Сс]ъезд "," $1ом $2ом съезде "],["^ (\\d+)-й (\\S+н)ий [Сс]ъезд "," $1-м $2ем съезде "],["^ (\\d+)-й (\\S+)[иоы]й [Сс]ъезд "," $1-м $2ом съезде "],["^ (\\d+)-й (\\S+[иы]н) [Сс]ъезд "," $1-м $2ом съезде "],["^ [Сс]ъезд "," съезде "],["^ (\\S+н)ий [Тт][уо]ннель "," $1ем тоннеле "],["^ (\\S+)[иоы]й [Тт][уо]ннель "," $1ом тоннеле "],["^ (\\S+[иы]н) [Тт][уо]ннель "," $1ом тоннеле "],["^ (\\S+)[иоы]й (\\S+н)ий [Тт][уо]ннель "," $1ом $2ем тоннеле "],["^ (\\S+н)ий (\\S+)[иоы]й [Тт][уо]ннель "," $1ем $2ом тоннеле "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Тт][уо]ннель "," $1ом $2ом тоннеле "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Тт][уо]ннель "," $1ом $2ом тоннеле "],["^ (\\d+)-й (\\S+н)ий [Тт][уо]ннель "," $1-м $2ем тоннеле "],["^ (\\d+)-й (\\S+)[иоы]й [Тт][уо]ннель "," $1-м $2ом тоннеле "],["^ (\\d+)-й (\\S+[иы]н) [Тт][уо]ннель "," $1-м $2ом тоннеле "],["^ [Тт][уо]ннель "," тоннеле "],["^ (\\S+н)ий [Тт]ракт "," $1ем тракте "],["^ (\\S+)[иоы]й [Тт]ракт "," $1ом тракте "],["^ (\\S+[еёо]в) [Тт]ракт "," $1ом тракте "],["^ (\\S+[иы]н) [Тт]ракт "," $1ом тракте "],["^ (\\S+)[иоы]й (\\S+н)ий [Тт]ракт "," $1ом $2ем тракте "],["^ (\\S+н)ий (\\S+)[иоы]й [Тт]ракт "," $1ем $2ом тракте "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Тт]ракт "," $1ом $2ом тракте "],["^ (\\S+)[иоы]й (\\S+[еёо]в) [Тт]ракт "," $1ом $2ом тракте "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Тт]ракт "," $1ом $2ом тракте "],["^ (\\d+)-й (\\S+н)ий [Тт]ракт "," $1-м $2ем тракте "],["^ (\\d+)-й (\\S+)[иоы]й [Тт]ракт "," $1-м $2ом тракте "],["^ (\\d+)-й (\\S+[еёо]в) [Тт]ракт "," $1-м $2ом тракте "],["^ (\\d+)-й (\\S+[иы]н) [Тт]ракт "," $1-м $2ом тракте "],["^ [Тт]ракт "," тракте "],["^ (\\S+н)ий [Тт]упик "," $1ем тупике "],["^ (\\S+)[иоы]й [Тт]упик "," $1ом тупике "],["^ (\\S+[еёо]в) [Тт]упик "," $1ом тупике "],["^ (\\S+[иы]н) [Тт]упик "," $1ом тупике "],["^ (\\S+)[иоы]й (\\S+н)ий [Тт]упик "," $1ом $2ем тупике "],["^ (\\S+н)ий (\\S+)[иоы]й [Тт]упик "," $1ем $2ом тупике "],["^ (\\S+)[иоы]й (\\S+)[иоы]й [Тт]упик "," $1ом $2ом тупике "],["^ (\\S+)[иоы]й (\\S+[еёо]в) [Тт]упик "," $1ом $2ом тупике "],["^ (\\S+)[иоы]й (\\S+[иы]н) [Тт]упик "," $1ом $2ом тупике "],["^ (\\d+)-й [Тт]упик "," $1-м тупике "],["^ (\\d+)-й (\\S+н)ий [Тт]упик "," $1-м $2ем тупике "],["^ (\\d+)-й (\\S+)[иоы]й [Тт]упик "," $1-м $2ом тупике "],["^ (\\d+)-й (\\S+[еёо]в) [Тт]упик "," $1-м $2ом тупике "],["^ (\\d+)-й (\\S+[иы]н) [Тт]упик "," $1-м $2ом тупике "],["^ [Тт]упик "," тупике "],["^ (\\S+[ео])е ([Пп]олу)?[Кк]ольцо "," $1м $2кольце "],["^ (\\S+ье) ([Пп]олу)?[Кк]ольцо "," $1м $2кольце "],["^ (\\S+[ео])е (\\S+[ео])е ([Пп]олу)?[Кк]ольцо "," $1м $2м $3кольце "],["^ (\\S+ье) (\\S+[ео])е ([Пп]олу)?[Кк]ольцо "," $1м $2м $3кольце "],["^ (\\d+)-е (\\S+[ео])е ([Пп]олу)?[Кк]ольцо "," $1-м $2м $3кольце "],["^ (\\d+)-е (\\S+ье) ([Пп]олу)?[Кк]ольцо "," $1-м $2м $3кольце "],["^ ([Пп]олу)?[Кк]ольцо "," $1кольце "],["^ (\\S+[ео])е [Шш]оссе "," $1м шоссе "],["^ (\\S+ье) [Шш]оссе "," $1м шоссе "],["^ (\\S+[ео])е (\\S+[ео])е [Шш]оссе "," $1м $2м шоссе "],["^ (\\S+ье) (\\S+[ео])е [Шш]оссе "," $1м $2м шоссе "],["^ (\\d+)-е (\\S+[ео])е [Шш]оссе "," $1-м $2м шоссе "],["^ (\\d+)-е (\\S+ье) [Шш]оссе "," $1-м $2м шоссе "],[" ([Тт])ретом "," $1ретьем "],["([жч])ом ","$1ьем "]]};
var ru$2 = {
	meta: meta$20,
	v5: v5$20
};

var ru$3 = Object.freeze({
	meta: meta$20,
	v5: v5$20,
	default: ru$2
});

var instructionsDa = ( da$1 && da ) || da$1;

var instructionsDe = ( de$1 && de ) || de$1;

var instructionsEn = ( en$1 && en ) || en$1;

var instructionsEo = ( eo$1 && eo ) || eo$1;

var instructionsEs = ( es$1 && es ) || es$1;

var instructionsEsEs = ( esES$1 && esES ) || esES$1;

var instructionsFr = ( fr$1 && fr ) || fr$1;

var instructionsHe = ( he$1 && he ) || he$1;

var instructionsId = ( id$1 && id ) || id$1;

var instructionsIt = ( it$1 && it ) || it$1;

var instructionsNl = ( nl$1 && nl ) || nl$1;

var instructionsPl = ( pl$1 && pl ) || pl$1;

var instructionsPtBr = ( ptBR$1 && ptBR ) || ptBR$1;

var instructionsRo = ( ro$1 && ro ) || ro$1;

var instructionsRu = ( ru$1 && ru ) || ru$1;

var instructionsSv = ( sv$1 && sv ) || sv$1;

var instructionsTr = ( tr$1 && tr ) || tr$1;

var instructionsUk = ( uk$1 && uk ) || uk$1;

var instructionsVi = ( vi$1 && vi ) || vi$1;

var instructionsZhHans = ( zhHans$1 && zhHans ) || zhHans$1;

var grammarRu = ( ru$3 && ru$2 ) || ru$3;

// Load all language files explicitly to allow integration
// with bundling tools like webpack and browserify





















// Load all grammar files


// Create a list of supported codes
var instructions = {
    'da': instructionsDa,
    'de': instructionsDe,
    'en': instructionsEn,
    'eo': instructionsEo,
    'es': instructionsEs,
    'es-ES': instructionsEsEs,
    'fr': instructionsFr,
    'he': instructionsHe,
    'id': instructionsId,
    'it': instructionsIt,
    'nl': instructionsNl,
    'pl': instructionsPl,
    'pt-BR': instructionsPtBr,
    'ro': instructionsRo,
    'ru': instructionsRu,
    'sv': instructionsSv,
    'tr': instructionsTr,
    'uk': instructionsUk,
    'vi': instructionsVi,
    'zh-Hans': instructionsZhHans
};

// Create list of supported grammar
var grammars = {
    'ru': grammarRu
};

function parseLanguageIntoCodes (language) {
    var match = language.match(/(\w\w)(?:-(\w\w\w\w))?(?:-(\w\w))?/i);
    var locale = [];
    if (match[1]) {
        match[1] = match[1].toLowerCase();
        locale.push(match[1]);
    }
    if (match[2]) {
        match[2] = match[2][0].toUpperCase() + match[2].substring(1).toLowerCase();
        locale.push(match[2]);
    }
    if (match[3]) {
        match[3] = match[3].toUpperCase();
        locale.push(match[3]);
    }

    return {
        locale: locale.join('-'),
        language: match[1],
        script: match[2],
        region: match[3]
    };
}

var languages = {
    supportedCodes: Object.keys(instructions),
    parsedSupportedCodes: Object.keys(instructions).map(function(language) {
        return parseLanguageIntoCodes(language);
    }),
    instructions: instructions,
    grammars: grammars,
    parseLanguageIntoCodes: parseLanguageIntoCodes
};

var instructions$1 = languages.instructions;
var grammars$1 = languages.grammars;

var osrmTextInstructions = function(version) {
    Object.keys(instructions$1).forEach(function(code) {
        if (!instructions$1[code][version]) { throw 'invalid version ' + version + ': ' + code + ' not supported'; }
    });

    return {
        capitalizeFirstLetter: function(language, string) {
            return string.charAt(0).toLocaleUpperCase(language) + string.slice(1);
        },
        ordinalize: function(language, number) {
            // Transform numbers to their translated ordinalized value
            if (!language) throw new Error('No language code provided');

            return instructions$1[language][version].constants.ordinalize[number.toString()] || '';
        },
        directionFromDegree: function(language, degree) {
            // Transform degrees to their translated compass direction
            if (!language) throw new Error('No language code provided');
            if (!degree && degree !== 0) {
                // step had no bearing_after degree, ignoring
                return '';
            } else if (degree >= 0 && degree <= 20) {
                return instructions$1[language][version].constants.direction.north;
            } else if (degree > 20 && degree < 70) {
                return instructions$1[language][version].constants.direction.northeast;
            } else if (degree >= 70 && degree <= 110) {
                return instructions$1[language][version].constants.direction.east;
            } else if (degree > 110 && degree < 160) {
                return instructions$1[language][version].constants.direction.southeast;
            } else if (degree >= 160 && degree <= 200) {
                return instructions$1[language][version].constants.direction.south;
            } else if (degree > 200 && degree < 250) {
                return instructions$1[language][version].constants.direction.southwest;
            } else if (degree >= 250 && degree <= 290) {
                return instructions$1[language][version].constants.direction.west;
            } else if (degree > 290 && degree < 340) {
                return instructions$1[language][version].constants.direction.northwest;
            } else if (degree >= 340 && degree <= 360) {
                return instructions$1[language][version].constants.direction.north;
            } else {
                throw new Error('Degree ' + degree + ' invalid');
            }
        },
        laneConfig: function(step) {
            // Reduce any lane combination down to a contracted lane diagram
            if (!step.intersections || !step.intersections[0].lanes) throw new Error('No lanes object');

            var config = [];
            var currentLaneValidity = null;

            step.intersections[0].lanes.forEach(function (lane) {
                if (currentLaneValidity === null || currentLaneValidity !== lane.valid) {
                    if (lane.valid) {
                        config.push('o');
                    } else {
                        config.push('x');
                    }
                    currentLaneValidity = lane.valid;
                }
            });

            return config.join('');
        },
        getWayName: function(language, step, options) {
            var classes = options ? options.classes || [] : [];
            if (typeof step !== 'object') throw new Error('step must be an Object');
            if (!language) throw new Error('No language code provided');
            if (!Array.isArray(classes)) throw new Error('classes must be an Array or undefined');

            var wayName;
            var name = step.name || '';
            var ref = (step.ref || '').split(';')[0];

            // Remove hacks from Mapbox Directions mixing ref into name
            if (name === step.ref) {
                // if both are the same we assume that there used to be an empty name, with the ref being filled in for it
                // we only need to retain the ref then
                name = '';
            }
            name = name.replace(' (' + step.ref + ')', '');

            // In attempt to avoid using the highway name of a way,
            // check and see if the step has a class which should signal
            // the ref should be used instead of the name.
            var wayMotorway = classes.indexOf('motorway') !== -1;

            if (name && ref && name !== ref && !wayMotorway) {
                var phrase = instructions$1[language][version].phrase['name and ref'] ||
                    instructions$1.en[version].phrase['name and ref'];
                wayName = this.tokenize(language, phrase, {
                    name: name,
                    ref: ref
                }, options);
            } else if (name && ref && wayMotorway && (/\d/).test(ref)) {
                wayName = options && options.formatToken ? options.formatToken('ref', ref) : ref;
            } else if (!name && ref) {
                wayName = options && options.formatToken ? options.formatToken('ref', ref) : ref;
            } else {
                wayName = options && options.formatToken ? options.formatToken('name', name) : name;
            }

            return wayName;
        },
        compile: function(language, step, options) {
            if (!language) throw new Error('No language code provided');
            if (languages.supportedCodes.indexOf(language) === -1) throw new Error('language code ' + language + ' not loaded');
            if (!step.maneuver) throw new Error('No step maneuver provided');

            var type = step.maneuver.type;
            var modifier = step.maneuver.modifier;
            var mode = step.mode;
            // driving_side will only be defined in OSRM 5.14+
            var side = step.driving_side;

            if (!type) { throw new Error('Missing step maneuver type'); }
            if (type !== 'depart' && type !== 'arrive' && !modifier) { throw new Error('Missing step maneuver modifier'); }

            if (!instructions$1[language][version][type]) {
                // Log for debugging
                console.log('Encountered unknown instruction type: ' + type); // eslint-disable-line no-console
                // OSRM specification assumes turn types can be added without
                // major version changes. Unknown types are to be treated as
                // type `turn` by clients
                type = 'turn';
            }

            // Use special instructions if available, otherwise `defaultinstruction`
            var instructionObject;
            if (instructions$1[language][version].modes[mode]) {
                instructionObject = instructions$1[language][version].modes[mode];
            } else {
              // omit side from off ramp if same as driving_side
              // note: side will be undefined if the input is from OSRM <5.14
              // but the condition should still evaluate properly regardless
                var omitSide = type === 'off ramp' && modifier.indexOf(side) >= 0;
                if (instructions$1[language][version][type][modifier] && !omitSide) {
                    instructionObject = instructions$1[language][version][type][modifier];
                } else {
                    instructionObject = instructions$1[language][version][type].default;
                }
            }

            // Special case handling
            var laneInstruction;
            switch (type) {
            case 'use lane':
                laneInstruction = instructions$1[language][version].constants.lanes[this.laneConfig(step)];
                if (!laneInstruction) {
                    // If the lane combination is not found, default to continue straight
                    instructionObject = instructions$1[language][version]['use lane'].no_lanes;
                }
                break;
            case 'rotary':
            case 'roundabout':
                if (step.rotary_name && step.maneuver.exit && instructionObject.name_exit) {
                    instructionObject = instructionObject.name_exit;
                } else if (step.rotary_name && instructionObject.name) {
                    instructionObject = instructionObject.name;
                } else if (step.maneuver.exit && instructionObject.exit) {
                    instructionObject = instructionObject.exit;
                } else {
                    instructionObject = instructionObject.default;
                }
                break;
            default:
                // NOOP, since no special logic for that type
            }

            // Decide way_name with special handling for name and ref
            var wayName = this.getWayName(language, step, options);

            // Decide which instruction string to use
            // Destination takes precedence over name
            var instruction;
            if (step.destinations && step.exits && instructionObject.exit_destination) {
                instruction = instructionObject.exit_destination;
            } else if (step.destinations && instructionObject.destination) {
                instruction = instructionObject.destination;
            } else if (step.exits && instructionObject.exit) {
                instruction = instructionObject.exit;
            } else if (wayName && instructionObject.name) {
                instruction = instructionObject.name;
            } else {
                instruction = instructionObject.default;
            }

            var destinations = step.destinations && step.destinations.split(': ');
            var destinationRef = destinations && destinations[0].split(',')[0];
            var destination = destinations && destinations[1] && destinations[1].split(',')[0];
            var firstDestination;
            if (destination && destinationRef) {
                firstDestination = destinationRef + ': ' + destination;
            } else {
                firstDestination = destinationRef || destination || '';
            }

            var nthWaypoint = options && options.legIndex >= 0 && options.legIndex !== options.legCount - 1 ? this.ordinalize(language, options.legIndex + 1) : '';

            // Replace tokens
            // NOOP if they don't exist
            var replaceTokens = {
                'way_name': wayName,
                'destination': firstDestination,
                'exit': (step.exits || '').split(';')[0],
                'exit_number': this.ordinalize(language, step.maneuver.exit || 1),
                'rotary_name': step.rotary_name,
                'lane_instruction': laneInstruction,
                'modifier': instructions$1[language][version].constants.modifier[modifier],
                'direction': this.directionFromDegree(language, step.maneuver.bearing_after),
                'nth': nthWaypoint
            };

            return this.tokenize(language, instruction, replaceTokens, options);
        },
        grammarize: function(language, name, grammar) {
            if (!language) throw new Error('No language code provided');
            // Process way/rotary name with applying grammar rules if any
            if (name && grammar && grammars$1 && grammars$1[language] && grammars$1[language][version]) {
                var rules = grammars$1[language][version][grammar];
                if (rules) {
                    // Pass original name to rules' regular expressions enclosed with spaces for simplier parsing
                    var n = ' ' + name + ' ';
                    var flags = grammars$1[language].meta.regExpFlags || '';
                    rules.forEach(function(rule) {
                        var re = new RegExp(rule[0], flags);
                        n = n.replace(re, rule[1]);
                    });

                    return n.trim();
                }
            }

            return name;
        },
        tokenize: function(language, instruction, tokens, options) {
            if (!language) throw new Error('No language code provided');
            // Keep this function context to use in inline function below (no arrow functions in ES4)
            var that = this;
            var startedWithToken = false;
            var output = instruction.replace(/\{(\w+)(?::(\w+))?\}/g, function(token, tag, grammar, offset) {
                var value = tokens[tag];

                // Return unknown token unchanged
                if (typeof value === 'undefined') {
                    return token;
                }

                value = that.grammarize(language, value, grammar);

                // If this token appears at the beginning of the instruction, capitalize it.
                if (offset === 0 && instructions$1[language].meta.capitalizeFirstLetter) {
                    startedWithToken = true;
                    value = that.capitalizeFirstLetter(language, value);
                }

                if (options && options.formatToken) {
                    value = options.formatToken(tag, value);
                }

                return value;
            })
            .replace(/ {2}/g, ' '); // remove excess spaces

            if (!startedWithToken && instructions$1[language].meta.capitalizeFirstLetter) {
                return this.capitalizeFirstLetter(language, output);
            }

            return output;
        },
        getBestMatchingLanguage: function(language) {
            if (languages.instructions[language]) return language;

            var codes = languages.parseLanguageIntoCodes(language);
            var languageCode = codes.language;
            var scriptCode = codes.script;
            var regionCode = codes.region;

            // Same language code and script code (lng-Scpt)
            if (languages.instructions[languageCode + '-' + scriptCode]) {
                return languageCode + '-' + scriptCode;
            }

            // Same language code and region code (lng-CC)
            if (languages.instructions[languageCode + '-' + regionCode]) {
                return languageCode + '-' + regionCode;
            }

            // Same language code (lng)
            if (languages.instructions[languageCode]) {
                return languageCode;
            }

            // Same language code and any script code (lng-Scpx) and the found language contains a script
            var anyScript = languages.parsedSupportedCodes.find(function (language) {
                return language.language === languageCode && language.script;
            });
            if (anyScript) {
                return anyScript.locale;
            }

            // Same language code and any region code (lng-CX)
            var anyCountry = languages.parsedSupportedCodes.find(function (language) {
                return language.language === languageCode && language.region;
            });
            if (anyCountry) {
                return anyCountry.locale;
            }

            return 'en';
        }
    };
};

const defaults$1 = {
	serviceUrl: 'https://router.project-osrm.org/route/v1',
	profile: 'driving',
	timeout: 30 * 1000,
	routingOptions: {
		alternatives: true,
		steps: true
	},
	polylinePrecision: 5,
	useHints: true,
	suppressDemoServerWarning: false,
	language: 'en'
};

/**
 * Works against OSRM's new API in version 5.0; this has
 * the API version v1.
 */
class OSRMv1 {
	constructor (options) {
		this.options = Object.assign({}, defaults$1, options);
		this._hints = {
			locations: {}
		};

		if (!this.options.suppressDemoServerWarning &&
			this.options.serviceUrl.indexOf('//router.project-osrm.org') >= 0) {
			console.warn('You are using OSRM\'s demo server. ' +
				'Please note that it is **NOT SUITABLE FOR PRODUCTION USE**.\n' +
				'Refer to the demo server\'s usage policy: ' +
				'https://github.com/Project-OSRM/osrm-backend/wiki/Api-usage-policy\n\n' +
				'To change, set the serviceUrl option.\n\n' +
				'Please do not report issues with this server to neither ' +
				'Leaflet Routing Machine or OSRM - it\'s for\n' +
				'demo only, and will sometimes not be available, or work in ' +
				'unexpected ways.\n\n' +
				'Please set up your own OSRM server, or use a paid service ' +
				'provider for production.');
		}
	}

	route (waypoints, callback, context, options) {
		var timedOut = false,
			wps = [],
			url,
			timer,
			wp,
			i,
			xhr;

		options = Object.assign({}, this.options.routingOptions, options);
		url = this.buildRouteUrl(waypoints, options);
		if (this.options.requestParameters) {
      url += Object.keys(this.options.requestParameters).reduce((s, p, i) => 
        s + (i > 0 ? '&' : '') +
        p + '=' + window.encodeURIComponent(this.options.requestParameters[p]),
        url.indexOf('?') >= 0 ? '&' : '?');
		}

		timer = setTimeout(function() {
			timedOut = true;
			callback.call(context || callback, {
				status: -1,
				message: 'OSRM request timed out.'
			});
		}, this.options.timeout);

		// Create a copy of the waypoints, since they
		// might otherwise be asynchronously modified while
		// the request is being processed.
		for (i = 0; i < waypoints.length; i++) {
			wp = waypoints[i];
			wps.push(new Waypoint(wp.lngLat, wp.name, wp.options));
		}

		return xhr = window.fetch(url)
      .then(resp => {

  			clearTimeout(timer);
        if (timedOut) {
          return;
        }

        return resp.json();
      })
      .then(data => {
				return this._routeDone(data, wps, options, callback, context);
  		})
      .catch(err => {
        callback.call(context || callback, err);
      });
	}

	requiresMoreDetail (route, zoom, bounds) {
		if (!route.properties.isSimplified) {
			return false;
		}

		var waypoints = route.inputWaypoints,
			i;
		for (i = 0; i < waypoints.length; ++i) {
			if (!bounds.contains(waypoints[i].lngLat)) {
				return true;
			}
		}

		return false;
	}

	_routeDone (response, inputWaypoints, options, callback, context) {
		var alts = [],
		    actualWaypoints,
		    i,
		    route;

		try {
			context = context || callback;
			if (response.code !== 'Ok') {
				callback.call(context, {
					status: response.code
				});
				return;
			}

			actualWaypoints = this._toWaypoints(inputWaypoints, response.waypoints);

			for (i = 0; i < response.routes.length; i++) {
				route = this._convertRoute(response.routes[i]);
				route.inputWaypoints = inputWaypoints;
				route.waypoints = actualWaypoints;
				route.properties = {isSimplified: !options || !options.geometryOnly || options.simplifyGeometry};
				alts.push(route);
			}

			this._saveHintData(response.waypoints, inputWaypoints);
		} catch (ex) {
      throw {
        status: -3,
        message: ex.toString()
      }
		}

		callback.call(context, null, alts);
	}

	_convertRoute (responseRoute) {
		var result = {
				name: '',
				coordinates: [],
				instructions: [],
				summary: {
					totalDistance: responseRoute.distance,
					totalTime: responseRoute.duration
				}
			},
			legNames = [],
			waypointIndices = [],
			index = 0,
			legCount = responseRoute.legs.length,
			hasSteps = responseRoute.legs[0].steps.length > 0,
			i,
			j,
			leg,
			step,
			geometry,
			type,
			modifier,
			text,
			stepToText;

		if (this.options.stepToText) {
			stepToText = this.options.stepToText;
		} else {
			var textInstructions = osrmTextInstructions('v5', this.options.language);
			stepToText = textInstructions.compile.bind(textInstructions, this.options.language);
		}

		for (i = 0; i < legCount; i++) {
			leg = responseRoute.legs[i];
			legNames.push(leg.summary && leg.summary.charAt(0).toUpperCase() + leg.summary.substring(1));
			for (j = 0; j < leg.steps.length; j++) {
				step = leg.steps[j];
				geometry = this._decodePolyline(step.geometry);
				result.coordinates.push.apply(result.coordinates, geometry);
				type = this._maneuverToInstructionType(step.maneuver, i === legCount - 1);
				modifier = this._maneuverToModifier(step.maneuver);
				text = stepToText(step);

				if (type) {
					if ((i == 0 && step.maneuver.type == 'depart') || step.maneuver.type == 'arrive') {
						waypointIndices.push(index);
					}

					result.instructions.push({
						type: type,
						distance: step.distance,
						time: step.duration,
						road: step.name,
						direction: this._bearingToDirection(step.maneuver.bearing_after),
						exit: step.maneuver.exit,
						index: index,
						mode: step.mode,
						modifier: modifier,
						text: text
					});
				}

				index += geometry.length;
			}
		}

		result.name = legNames.join(', ');
		if (!hasSteps) {
			result.coordinates = this._decodePolyline(responseRoute.geometry);
		} else {
			result.waypointIndices = waypointIndices;
		}

		return result;
	}

	_bearingToDirection (bearing) {
		var oct = Math.round(bearing / 45) % 8;
		return ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][oct];
	}

	_maneuverToInstructionType (maneuver, lastLeg) {
		switch (maneuver.type) {
		case 'new name':
			return 'Continue';
		case 'depart':
			return 'Head';
		case 'arrive':
			return lastLeg ? 'DestinationReached' : 'WaypointReached';
		case 'roundabout':
		case 'rotary':
			return 'Roundabout';
		case 'merge':
		case 'fork':
		case 'on ramp':
		case 'off ramp':
		case 'end of road':
			return this._camelCase(maneuver.type);
		// These are all reduced to the same instruction in the current model
		//case 'turn':
		//case 'ramp': // deprecated in v5.1
		default:
			return this._camelCase(maneuver.modifier);
		}
	}

	_maneuverToModifier (maneuver) {
		var modifier = maneuver.modifier;

		switch (maneuver.type) {
		case 'merge':
		case 'fork':
		case 'on ramp':
		case 'off ramp':
		case 'end of road':
			modifier = this._leftOrRight(modifier);
		}

		return modifier && this._camelCase(modifier);
	}

	_camelCase (s) {
		var words = s.split(' '),
			result = '';
		for (var i = 0, l = words.length; i < l; i++) {
			result += words[i].charAt(0).toUpperCase() + words[i].substring(1);
		}

		return result;
	}

	_leftOrRight (d) {
		return d.indexOf('left') >= 0 ? 'Left' : 'Right';
	}

	_decodePolyline (routeGeometry) {
		var cs = polyline_1.decode(routeGeometry, this.options.polylinePrecision),
			result = new Array(cs.length),
			i;
		for (i = cs.length - 1; i >= 0; i--) {
      var c = cs[i];
			result[i] = [c[1], c[0]];
		}

		return result;
	}

	_toWaypoints (inputWaypoints, vias) {
		var wps = [],
		    i,
		    viaLoc;
		for (i = 0; i < vias.length; i++) {
			viaLoc = vias[i].location;
			wps.push(new Waypoint([viaLoc[1], viaLoc[0]],
        inputWaypoints[i].name,
				inputWaypoints[i].options));
		}

		return wps;
	}

	buildRouteUrl (waypoints, options) {
		var locs = [],
			hints = [],
			wp,
			lngLat,
		    computeInstructions,
		    computeAlternative = true;

		for (var i = 0; i < waypoints.length; i++) {
			wp = waypoints[i];
			lngLat = wp.lngLat;
			locs.push(lngLat[0] + ',' + lngLat[1]);
			hints.push(this._hints.locations[this._locationKey(lngLat)] || '');
		}

		computeInstructions =
			true;

		return this.options.serviceUrl + '/' + this.options.profile + '/' +
			locs.join(';') + '?' +
			(options.geometryOnly ? (options.simplifyGeometry ? '' : 'overview=full') : 'overview=false') +
			'&alternatives=' + computeAlternative.toString() +
			'&steps=' + computeInstructions.toString() +
			(this.options.useHints ? '&hints=' + hints.join(';') : '') +
			(options.allowUTurns ? '&continue_straight=' + !options.allowUTurns : '');
	}

	_locationKey (location) {
		return location[0] + ',' + location[1];
	}

	_saveHintData (actualWaypoints, waypoints) {
		var loc;
		this._hints = {
			locations: {}
		};
		for (var i = actualWaypoints.length - 1; i >= 0; i--) {
			loc = waypoints[i].lngLat;
			this._hints.locations[this._locationKey(loc)] = actualWaypoints[i].hint;
		}
	}
}

var main = {
  Control: L$1.Control.extend({
    initialize (options) {
      options = Object.assign(options);
      options.waypoints = options.waypoints && options.waypoints.map(wp => {
        if (wp instanceof Waypoint) {
          return wp
        } else {
          const latLng = L$1.latLng(wp);
          return new Waypoint([latLng.lng, latLng.lat])
        }
      });

      options.router = options.router || new OSRMv1(options);

      L$1.setOptions(this, options);
    },

    onAdd (map) {
      this._container = L$1.DomUtil.create('div');
      this._component = new Control({
        target: this._container,
        data: Object.assign({map}, this.options)
      });

      return this._container
    },

    onRemove (map) {
      this._component.destroy();
    }
  })
}

return main;

})));
