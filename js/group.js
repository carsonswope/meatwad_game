var Util = require('./util.js').prototype;
// var Circle = require('./circle.js');
// var Point = require('./point.js');

function Group(options) {
  // parent can be position(global level) or another group
  this.dPos = [0,0];
  this.children = [];
  this.points = [];
  this.circles = [];
  this.childrenAngle = 0;

  this.lines = {
    fromOrigin: false,
    //ctx.strokeStyle
    color: 'black',
    //ctx.lineWidth
    width: '5',

    connectEnds: true,



  };
  this.fill = {
    filled: false,
    //
    fillMode: 'object',


  };

  this.connected

  this.generate;
  this.regenerating;

}

Group.prototype.setOrigin = function(newOrigin) {
  this.origin = newOrigin;
  if (newOrigin) {
    switch(this.__proto__.constructor.name) {
      case 'Point':
        newOrigin.points.push(this);
        break;
      case 'Group':
        newOrigin.children.push(this);
        break;
      case 'Circle':
        newOrigin.circles.push(this);
        break;
    };
  }
};

Group.prototype.addChild = function(child) {
  child.setOrigin.call(child, this);
}

Group.prototype.removeChild = function(child) {

  switch(child.__proto__.constructor.name) {
    case 'Point':
      var i = this.points.indexOf(child);
      if(i > -1) { this.points.splice(i, 1); }
      break;
    case 'Group':
      var i = this.children.indexOf(child);
      if(i > -1) { this.children.splice(i, 1); }
      break;
    case 'Circle':
      var i = this.circles.indexOf(child);
      if(i > -1) { this.circles.splice(i, 1); }
      break;
  }

  child.setOrigin();

}

Group.prototype.screenPos = function (viewPos) {

  if (!viewPos) { viewPos = [0,0]; }
  if (!this.origin) {

    return Util.vDiff(
      viewPos,
      this.anglePos()
    );
  } else {
    return Util.vSum(
      this.origin.screenPos(viewPos),
      this.anglePos()
    );
  }
}

Group.prototype.angleOfDPos = function () {
  if (!this.originalAngle) {
    this.originalAngle = Util.aOfV(this.dPos);
  }
  return this.originalAngle;
}

Group.prototype.screenAngle = function () {
  if (!this.origin) {
    return 0;
  } else {
    return this.origin.childrenAngle + this.origin.screenAngle();
  }

}

Group.prototype.anglePos = function() {

  var angle = this.angleOfDPos() + this.screenAngle();
  var magnitude = Util.vMag(this.dPos);

  return Util.magnitudeAngle(magnitude, angle);
}

// Group.prototype.drawLines = function(ctx, origin) {
//
//   var ownPos = this.screenPos();
//
//   for (var i = 0; i < this.points.length; i++) {
//
//     var kid = this.points[i]
//     if (i == 0) {
//       kid.startDrawing(ctx, origin, final);
//     } else if (i == this.points.length -1) {
//       var final = this.lines.connectEnds ?
//         this.points[0].screenPos(origin) : undefined;
//       kid.finishDrawing(ctx, origin, final);
//     } else {
//       kid.draw(ctx, origin);
//     }
//
//   }
//
//
// }

Group.prototype.draw = function(ctx, origin) {

  //set up order specification?
  this.drawLines(ctx, origin);
  this.drawCircles(ctx, origin);
  this.drawChildren(ctx, origin);


  this.pointCoordinates();

}

Group.prototype.pointCoordinates = function(origin) {
  if (!origin) { origin = [0,0]; }
  var that = this;
  // debugger;
  return this.points.map(function(point) {
    return point.screenPos(origin);
  });
}

Group.prototype.drawCircles = function(ctx, origin) {

}

Group.prototype.drawLines = function(ctx, origin) {

  // debugger;

  var points = this.pointCoordinates(origin);

  ctx.beginPath();
  ctx.lineWidth = this.lines.width;
  ctx.strokeStyle = this.lines.color;

  for (var i = 0; i < points.length; i++) {
    var pos = points[i];
    if (i == 0) {
      ctx.moveTo(pos[0], pos[1]);
    } else {
      ctx.lineTo(pos[0], pos[1]);
    }
  }

  debugger;

  if (this.points.length && this.lines.connectEnds) {
    debugger;
    ctx.lineTo(points[0][0], points[0][1]);
  }

  ctx.stroke();
}

Group.prototype.drawChildren = function(ctx, origin) {
  this.children.forEach(function(child) {
    child.draw(ctx, origin);
  })
}

Group.prototype.collides = function(otherGroup) {
  var otherGroupPoints = otherGroup.pointCoordinates();
  var ownPoints = this.pointCoordinates();

  var final = this.lines.connectEnds ?
    ownPoints.length : ownPoints.length - 1;

  for (var i = 0; i < ownPoints.length; i++) {
    var lineStart = ownPoints[i];
    var lineEnd = ownPoints[(i + 1) % ownPoints.length];

    for (var j = 0; j < otherGroupPoints.length; j++) {
      distance = Util.distToSegmentStartEnd(
        otherGroupPoints[j],
        lineStart,
        lineEnd
      );
      if (distance < 5) { return true; }
    }

  }

  return false;


}


module.exports = Group;
