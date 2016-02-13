/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var View = __webpack_require__(1);
	var Mtn = __webpack_require__(4);
	var Game = __webpack_require__(5);
	var MtnRange = __webpack_require__(6);

	$(function() {

	  var canvasEl = document.getElementsByTagName("canvas")[0];

	  canvasEl.width = window.innerWidth;
	  canvasEl.height = window.innerHeight - 4;

	  var game = new Game();

	  // console.log(Mtn.prototype.genRandom());

	  new View(canvasEl, game);

	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* globals $ */

	var Util = __webpack_require__(2);
	var Key = __webpack_require__(3);

	function View(canvas, game) {

	  this.canvas = canvas;
	  this.ctx = canvas.getContext('2d');
	  this.xMin = 0;
	  this.yMin = -canvas.height / 1.5;
	  this.xRng = canvas.width;
	  this.yRng = canvas.height;
	  this.ctx.width = this.xRng;
	  this.ctx.height = this.yRng;
	  this.dOrigin = [0,0];

	  this.game = game;
	  this.game.view = this;
	  this.game.startWorld();

	  this.draw();

	  this.bindKeys();

	  this.scroll();

	};

	View.prototype.draw = function () {

	  this.ctx.clearRect(0,0,this.ctx.width, this.ctx.height);
	  var origin = [this.xMin, this.yMin];
	  this.game.draw(this.ctx, origin);

	};

	View.prototype.bindKeys = function(){
	  var that = this;

	  Key("up,right,down,left", function(e) {
	    that.handleKeypress(e.keyIdentifier);
	  });

	};


	View.prototype.KEYMAP = {
	  'Up'   : [ 0,-1],
	  'Right': [ 1, 0],
	  'Down' : [ 0, 1],
	  'Left' : [-1, 0]
	}

	View.prototype.handleKeypress = function (e) {

	  this.dOrigin = this.KEYMAP[e];

	};

	View.prototype.updateKeys = function() {
	  if (!Key.isPressed('left') &&
	      !Key.isPressed('right') &&
	      !Key.isPressed('up') &&
	      !Key.isPressed('down'))
	  {
	    this.dOrigin = [0,0];
	  }
	}

	View.prototype.handleKeyup = function (e) {

	};

	View.prototype.scroll = function () {

	  var that = this;
	  this.draw();
	  // debugger

	  function update() {

	    that.updateKeys();

	    var scale = 20;
	    that.xMin += that.dOrigin[0] * scale;
	    that.yMin += that.dOrigin[1] * scale;

	    that.draw();

	    var x = that.xMin + 600;

	    // debugger;
	    var y = that.game.mtnRanges[0][0].yAtX(x);


	    that.ctx.beginPath();
	    that.ctx.fillStyle = "green";
	    that.ctx.arc(x - that.xMin, y - that.yMin,8,0, Math.PI * 2);
	    that.ctx.fill();


	    requestAnimationFrame(update);
	  }

	  requestAnimationFrame(update);
	};

	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports) {

	function Util() {
	};

	Util.prototype.random = function(min, max) {

	  //handle 2d array acting as range
	  if (min.__proto__.constructor.name === "Array") {
	    max = min[1];
	    min = min[0];
	  }

	  return Math.random() * (max-min) + min;

	};


	Util.prototype.vSum = function(end, start) {
	  if (start == undefined) { start = [0,0]; }

	  return [start[0] + end[0], start[1] + end[1]];
	}

	Util.prototype.vDiff = function(origin, pos){

	  return [pos[0] - origin[0], pos[1] - origin[1]];
	  
	}
	module.exports = Util;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	//     keymaster.js
	//     (c) 2011-2013 Thomas Fuchs
	//     keymaster.js may be freely distributed under the MIT license.

	;(function(global){
	  var k,
	    _handlers = {},
	    _mods = { 16: false, 18: false, 17: false, 91: false },
	    _scope = 'all',
	    // modifier keys
	    _MODIFIERS = {
	      '⇧': 16, shift: 16,
	      '⌥': 18, alt: 18, option: 18,
	      '⌃': 17, ctrl: 17, control: 17,
	      '⌘': 91, command: 91
	    },
	    // special keys
	    _MAP = {
	      backspace: 8, tab: 9, clear: 12,
	      enter: 13, 'return': 13,
	      esc: 27, escape: 27, space: 32,
	      left: 37, up: 38,
	      right: 39, down: 40,
	      del: 46, 'delete': 46,
	      home: 36, end: 35,
	      pageup: 33, pagedown: 34,
	      ',': 188, '.': 190, '/': 191,
	      '`': 192, '-': 189, '=': 187,
	      ';': 186, '\'': 222,
	      '[': 219, ']': 221, '\\': 220
	    },
	    code = function(x){
	      return _MAP[x] || x.toUpperCase().charCodeAt(0);
	    },
	    _downKeys = [];

	  for(k=1;k<20;k++) _MAP['f'+k] = 111+k;

	  // IE doesn't support Array#indexOf, so have a simple replacement
	  function index(array, item){
	    var i = array.length;
	    while(i--) if(array[i]===item) return i;
	    return -1;
	  }

	  // for comparing mods before unassignment
	  function compareArray(a1, a2) {
	    if (a1.length != a2.length) return false;
	    for (var i = 0; i < a1.length; i++) {
	        if (a1[i] !== a2[i]) return false;
	    }
	    return true;
	  }

	  var modifierMap = {
	      16:'shiftKey',
	      18:'altKey',
	      17:'ctrlKey',
	      91:'metaKey'
	  };
	  function updateModifierKey(event) {
	      for(k in _mods) _mods[k] = event[modifierMap[k]];
	  };

	  // handle keydown event
	  function dispatch(event) {
	    var key, handler, k, i, modifiersMatch, scope;
	    key = event.keyCode;

	    if (index(_downKeys, key) == -1) {
	        _downKeys.push(key);
	    }

	    // if a modifier key, set the key.<modifierkeyname> property to true and return
	    if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
	    if(key in _mods) {
	      _mods[key] = true;
	      // 'assignKey' from inside this closure is exported to window.key
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;
	      return;
	    }
	    updateModifierKey(event);

	    // see if we need to ignore the keypress (filter() can can be overridden)
	    // by default ignore key presses if a select, textarea, or input is focused
	    if(!assignKey.filter.call(this, event)) return;

	    // abort if no potentially matching shortcuts found
	    if (!(key in _handlers)) return;

	    scope = getScope();

	    // for each potential shortcut
	    for (i = 0; i < _handlers[key].length; i++) {
	      handler = _handlers[key][i];

	      // see if it's in the current scope
	      if(handler.scope == scope || handler.scope == 'all'){
	        // check if modifiers match if any
	        modifiersMatch = handler.mods.length > 0;
	        for(k in _mods)
	          if((!_mods[k] && index(handler.mods, +k) > -1) ||
	            (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
	        // call the handler and stop the event if neccessary
	        if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){
	          if(handler.method(event, handler)===false){
	            if(event.preventDefault) event.preventDefault();
	              else event.returnValue = false;
	            if(event.stopPropagation) event.stopPropagation();
	            if(event.cancelBubble) event.cancelBubble = true;
	          }
	        }
	      }
	    }
	  };

	  // unset modifier keys on keyup
	  function clearModifier(event){
	    var key = event.keyCode, k,
	        i = index(_downKeys, key);

	    // remove key from _downKeys
	    if (i >= 0) {
	        _downKeys.splice(i, 1);
	    }

	    if(key == 93 || key == 224) key = 91;
	    if(key in _mods) {
	      _mods[key] = false;
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;
	    }
	  };

	  function resetModifiers() {
	    for(k in _mods) _mods[k] = false;
	    for(k in _MODIFIERS) assignKey[k] = false;
	  };

	  // parse and assign shortcut
	  function assignKey(key, scope, method){
	    var keys, mods;
	    keys = getKeys(key);
	    if (method === undefined) {
	      method = scope;
	      scope = 'all';
	    }

	    // for each shortcut
	    for (var i = 0; i < keys.length; i++) {
	      // set modifier keys if any
	      mods = [];
	      key = keys[i].split('+');
	      if (key.length > 1){
	        mods = getMods(key);
	        key = [key[key.length-1]];
	      }
	      // convert to keycode and...
	      key = key[0]
	      key = code(key);
	      // ...store handler
	      if (!(key in _handlers)) _handlers[key] = [];
	      _handlers[key].push({ shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods });
	    }
	  };

	  // unbind all handlers for given key in current scope
	  function unbindKey(key, scope) {
	    var multipleKeys, keys,
	      mods = [],
	      i, j, obj;

	    multipleKeys = getKeys(key);

	    for (j = 0; j < multipleKeys.length; j++) {
	      keys = multipleKeys[j].split('+');

	      if (keys.length > 1) {
	        mods = getMods(keys);
	      }

	      key = keys[keys.length - 1];
	      key = code(key);

	      if (scope === undefined) {
	        scope = getScope();
	      }
	      if (!_handlers[key]) {
	        return;
	      }
	      for (i = 0; i < _handlers[key].length; i++) {
	        obj = _handlers[key][i];
	        // only clear handlers if correct scope and mods match
	        if (obj.scope === scope && compareArray(obj.mods, mods)) {
	          _handlers[key][i] = {};
	        }
	      }
	    }
	  };

	  // Returns true if the key with code 'keyCode' is currently down
	  // Converts strings into key codes.
	  function isPressed(keyCode) {
	      if (typeof(keyCode)=='string') {
	        keyCode = code(keyCode);
	      }
	      return index(_downKeys, keyCode) != -1;
	  }

	  function getPressedKeyCodes() {
	      return _downKeys.slice(0);
	  }

	  function filter(event){
	    var tagName = (event.target || event.srcElement).tagName;
	    // ignore keypressed in any elements that support keyboard data input
	    return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
	  }

	  // initialize key.<modifier> to false
	  for(k in _MODIFIERS) assignKey[k] = false;

	  // set current scope (default 'all')
	  function setScope(scope){ _scope = scope || 'all' };
	  function getScope(){ return _scope || 'all' };

	  // delete all handlers for a given scope
	  function deleteScope(scope){
	    var key, handlers, i;

	    for (key in _handlers) {
	      handlers = _handlers[key];
	      for (i = 0; i < handlers.length; ) {
	        if (handlers[i].scope === scope) handlers.splice(i, 1);
	        else i++;
	      }
	    }
	  };

	  // abstract key logic for assign and unassign
	  function getKeys(key) {
	    var keys;
	    key = key.replace(/\s/g, '');
	    keys = key.split(',');
	    if ((keys[keys.length - 1]) == '') {
	      keys[keys.length - 2] += ',';
	    }
	    return keys;
	  }

	  // abstract mods logic for assign and unassign
	  function getMods(key) {
	    var mods = key.slice(0, key.length - 1);
	    for (var mi = 0; mi < mods.length; mi++)
	    mods[mi] = _MODIFIERS[mods[mi]];
	    return mods;
	  }

	  // cross-browser events
	  function addEvent(object, event, method) {
	    if (object.addEventListener)
	      object.addEventListener(event, method, false);
	    else if(object.attachEvent)
	      object.attachEvent('on'+event, function(){ method(window.event) });
	  };

	  // set the handlers globally on document
	  addEvent(document, 'keydown', function(event) { dispatch(event) }); // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48
	  addEvent(document, 'keyup', clearModifier);

	  // reset modifiers to false whenever the window is (re)focused.
	  addEvent(window, 'focus', resetModifiers);

	  // store previously defined key
	  var previousKey = global.key;

	  // restore previously defined key and return reference to our key object
	  function noConflict() {
	    var k = global.key;
	    global.key = previousKey;
	    return k;
	  }

	  // set window.key and window.key.set/get/deleteScope, and the default filter
	  global.key = assignKey;
	  global.key.setScope = setScope;
	  global.key.getScope = getScope;
	  global.key.deleteScope = deleteScope;
	  global.key.filter = filter;
	  global.key.isPressed = isPressed;
	  global.key.getPressedKeyCodes = getPressedKeyCodes;
	  global.key.noConflict = noConflict;
	  global.key.unbind = unbindKey;

	  if(true) module.exports = assignKey;

	})(this);


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(2);

	function Mtn(pos, parent) {
	  this.dPos = pos;
	  this.parent;
	  this.child;
	  this.parentPos;

	  // this.setParent(parent, options);
	};

	Mtn.prototype.setParent = function (parent, options) {
	  if (parent == undefined) {
	    this.parent = undefined;
	    this.parentPos = [0,0];
	    // this.pos = this.dPos;
	  } else {
	    this.parent = parent;
	    this.parentPos = parent.pos;
	    // this.pos = Util.prototype.vSum(this.parentPos, this.dPos);
	    this.parent.child = this;
	  }

	  if (options) {
	    if (options['startPos']) { this.parentPos = options['startPos']; }
	  }

	  this.pos = Util.prototype.vSum(this.parentPos, this.dPos);
	}

	Mtn.prototype.peaksAtX = function(x) {

	  if (this.pos[0] > x) {
	    return [this];
	  } else {

	    var response = this.child.peaksAtX(x);

	    if (response && response.length === 1) {

	      response.push(this);
	      return response;
	    } else {
	      return response;
	    }

	  }
	}

	Mtn.prototype.yAtX = function(x) {
	  var peaks = this.peaksAtX(x);


	  debugger;
	  var dX = x - peaks[1].pos[0];

	  //to get slope of
	  var dXtotal = peaks[0].pos[0] - peaks[1].pos[0];

	  /// rise / run
	  var slope = (peaks[0].pos[1] - peaks[1].pos[1]) / dXtotal;

	  return peaks[1].pos[1] + slope * dX;
	}

	Mtn.prototype.genRange = function (parent, options) {
	  // options is big hash with options
	  // important ones: width, direction, height
	  //
	  // higher level of abstraction - a variety of elements generated
	  // according to chaining together pre-made types of formations
	  //
	  //

	  var mtns = [];

	  for (var i = 0; i < 550; i++) {
	    var newPos = Mtn.prototype.genRandomPos(options);
	    var newMtn = new Mtn(newPos);
	    if (i > 0) { newMtn.setParent(oldMtn); }
	    else { newMtn.setParent(parent, options); }
	    mtns.push(newMtn);
	    var oldMtn = newMtn;
	  }

	  return mtns;
	};

	Mtn.prototype.FORMATIONS = {

	};

	Mtn.prototype.genRandomPos = function (prms) {
	  if (prms === undefined ) { prms = {}; }
	  if (prms['dXrng'] === undefined ) {
	      prms['dXrng'] = [ 15,40]; }
	  if (prms['dYrng'] === undefined ) {
	      prms['dYrng'] = [-20,20]; }

	  var dX = Util.prototype.random(prms['dXrng']);
	  var dY = Util.prototype.random(prms['dYrng']);

	  return [dX, dY];
	};

	Mtn.prototype.draw = function(ctx, origin) {

	  var startPos =  Util.prototype.vDiff(origin, this.parentPos);
	  var endPos =    Util.prototype.vDiff(origin, this.pos);

	  // ctx.beginPath();
	  // ctx.moveTo(startPos[0], startPos[1]);
	  ctx.lineTo(endPos[0], endPos[1]);
	  // ctx.stroke();

	};

	// Mtn.prototype.

	module.exports = Mtn;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Mtn = __webpack_require__(4);
	var Util = __webpack_require__(2);
	var MtnRange = __webpack_require__(6);

	function Game() {

	  this.mtnRanges = [];
	  // this.Mtn = Mtn.prototype;

	  // this.startWorld();

	  // debugger;
	  this.mtns = this.mtnRanges.push(Mtn.prototype.genRange(undefined, {startPos: [0, -20]}));
	  // debugger;
	  this.mtns = this.mtnRanges.push(Mtn.prototype.genRange(undefined, {startPos: [0, 150]}));
	  // this.mtns = this.mtnRanges.push(Mtn.prototype.genRange({dYrng: []}));

	  //[mtnRange ]
	}

	Game.prototype.startWorld = function(options) {

	  // debugger;

	  var range = new MtnRange(this.view);

	  // var defaults = {
	  //   worldOrigin: [0,0]
	  // };
	  //
	  // if (!options) { options = {}; }
	  //
	  // var prms = defaults.extend(options);



	};

	Game.prototype.draw = function (ctx, origin) {

	  for (var i = 0; i < this.mtnRanges.length; i++) {

	    // origin[1] -= 100;

	    var range = this.mtnRanges[i];
	    var start = undefined;
	    var num = 0;
	    for (var j = 0; j < range.length; j++) {

	      var mtnPos = range[j].pos;


	      if (start == undefined) {
	        if (mtnPos[0] > origin[0]) { start = j }
	      } else if (mtnPos[0] < origin[0] + ctx.width) {
	        num += 1;

	      }

	    }

	    var toDrawRange = [];

	    for (var m = start; m <= start+num+1; m++) {
	      toDrawRange.push(range[m]);
	    }

	    ctx.beginPath();

	    ctx.fillStyle = "#" + "1" + "2" + (i*4);

	    // debugger;

	    var startPoint = Util.prototype.vDiff(origin, toDrawRange[0].parentPos);

	    ctx.moveTo(startPoint[0], startPoint[1]);

	    for (var k = 0; k < toDrawRange.length; k++) {
	      toDrawRange[k].draw(ctx, origin);
	    }

	    ctx.lineTo(ctx.width, ctx.height);
	    ctx.lineTo(0, ctx.height);


	    ctx.fill();

	  }

	};

	module.exports = Game;


	//mtn ranges to draw


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(2);
	var Mtn = __webpack_require__(4);

	function MtnRange(view, options) {

	  this.origin = [0,0];
	  this.nodes = [];
	  this.view = view

	  this.fill = 'black';
	  this.fillStatus = 'line-only';
	  this.lineColor = 'green';
	  this.lineSize = 5;

	  this.regenerating = {
	    minPct: 0.5,
	    maxPct: 1
	  };

	  if (this.regenerating) {
	    this.startRng();
	  }

	};

	MtnRange.prototype.startRng = function() {

	  debugger;

	  var minX = this.view.xMin;
	  var minY = this.view.yMin;
	  var maxX = this.view.xRng + minX;
	  var maxY = this.view.yRng + minY;
	  var originPos = this.origin;
	  var parent;

	  var x = minX - (this.view.xRng * this.regenerating.minPct);
	  var mostRecent = newMtn();
	  var mostRecentPos = this.origin;

	  while (x < maxX + this.view.xRng * this.regenerating.minPct) {



	    debugger;
	    finalPos = Util.prototype.vSum(
	      Mtn.prototype.genRandomPos(),
	      mostRecentPos
	    );

	    if (mostRecentPos === this.origin) { parent = undefined }
	    toAdd = newMtn(finalPos, originPos);

	    this.nodes.push(mostRecent);

	  }

	}

	MtnRange.prototype.regen = function() {


	  var minY = this.view.minX;
	  var mixY = this.view.minY;
	  var maxX = this.view.xRng - minX;
	  var maxY = this.view.yRng - minX;

	}

	MtnRange.prototype.draw = function (ctx) {

	  ctx.beginPath();

	  for (var i = 0; i < this.nodes.length; i++) {
	    this.nodes[i].tracePath(ctx);
	  }

	  if (ctx.fill) {
	    ctx.fillStyle = this.fill;
	    this.setupFill(ctx);
	    ctx.fill();
	  }


	  ctx.stroke();


	};

	module.exports = MtnRange;


/***/ }
/******/ ]);