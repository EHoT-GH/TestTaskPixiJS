// VARS
var renderer, background, stage, ticker;
var intValue = 1000, intervalId;
var int = intValue;
//var log = console.log;
var maxHeight = 420;
var maxWidth = 1200;
var gravity = 0.4;
var shapesPerSecond = 1;
var figuresAmount = -1;
var figures = [];
var figureSurfaceSum = 0;
var counterTA = document.getElementById('figures'),
    surfaceTA = document.getElementById('surface'),
    gravityTA = document.getElementById('gravity'),
    shapesTA = document.getElementById('shapes'),
    wrapper = document.getElementById('wrapper'),
    shapesBtn = document.getElementById('sps');

var model = {
  //TODO: Create a rectangular area.
  createView:      function() {
    stage = new PIXI.Container();
    renderer = new PIXI.autoDetectRenderer(maxWidth, maxHeight, {backgroundColor: 0xFFFFFF});
    ticker = PIXI.ticker.shared;
    wrapper.appendChild(renderer.view);

    background = new PIXI.Graphics();
    background.beginFill(0xFFFFFF);
    background.drawRect(0, 0, maxWidth, maxHeight);
    background.endFill();
    background.zIndex = -666;
    background.interactive = true;
    background.buttonMode = true;
    stage.addChild(background);

    gravityTA.value = gravity;
    shapesTA.value = shapesPerSecond;
    // TODO: click inside the rectangle, a RSRC will be generated at mouse position and start falling.
    background.on("pointerdown", function() {
      model.drawSomething(renderer.plugins.interaction.mouse.global.x);
    });
  },
  //TODO: Inside the rectangular area generate random shapes with random colours = RSRC.
  drawSomething:   function(x) {
    var result = model.randomizer(1, 6);
    if (result === 1) {
      model.drawCircle(x);
    } else if (result === 2) {
      model.drawEllipse(x);
    } else if (result === 3) {
      model.drawPolygon(x, result);
    } else if (result === 4) {
      model.drawPolygon(x, result);
    } else if (result === 5) {
      model.drawPolygon(x, result);
    } else if (result === 6) {
      model.drawPolygon(x, result);
    }

    model.surfacesSumCalc();

  },
  drawCircle:      function(x) {
    var randomColor = model.getRandomColor();
    var randRad = model.randomizer(10, 30);
    var inAreaX = maxWidth - randRad;
    var circleX, circleY = -randRad;
    if (x === undefined) {
      circleX = model.randomizer(1, inAreaX);
    } else {
      circleX = x;
    }
    var circle = new PIXI.Graphics();
    circle.lineStyle(0);
    circle.beginFill(randomColor, 1);
    circle.drawCircle(circleX, circleY, randRad);
    circle.endFill();
    circle.interactive = true;
    circle.buttonMode = true;
    figuresAmount++;
    circle.id = figuresAmount;
    circle.name = 'circle';
    circle.size = randRad;
    circle.surface = model.circleSurface(randRad);
    circle.on('pointerdown', controller.clearFigure);
    model.surfacesSumCalc();
    figures.push(circle);
    stage.addChild(circle);
  },
  drawEllipse:     function(x) {
    var randomColor = model.getRandomColor();
    var randHeight = model.randomizer(10, 30);
    var randWidth = model.randomizer(10, 30);
    var inAreaX = maxWidth - randWidth;
    var ellipseX, ellipseY = -randWidth;
    if (x === undefined) {
      ellipseX = model.randomizer(1, inAreaX);
    } else {
      ellipseX = x;
    }
    var ellipse = new PIXI.Graphics();
    ellipse.lineStyle(0);
    ellipse.beginFill(randomColor, 1);
    ellipse.drawEllipse(ellipseX, ellipseY, randWidth, randHeight);
    ellipse.endFill();
    ellipse.interactive = true;
    ellipse.buttonMode = true;
    figuresAmount++;
    ellipse.id = figuresAmount;
    ellipse.name = 'ellipse';
    ellipse.size = randHeight;
    ellipse.surface = model.ellipseSurface(randWidth, randHeight);
    ellipse.on('pointerdown', controller.clearFigure);
    model.surfacesSumCalc();
    figures.push(ellipse);
    stage.addChild(ellipse);
  },
  drawPolygon:     function(x, num) {
    var randomColor = model.getRandomColor();
    if (x === undefined) {
      x = model.randomizer(1, maxWidth);
    }
    var size = model.randomizer(25, 50);
    var y = size;
    var coors = model.getRandomCoors(num, size, x, y);
    var polygon = new PIXI.Graphics();
    polygon.lineStyle(0);
    polygon.beginFill(randomColor);
    polygon.drawPolygon(coors);
    polygon.endFill();
    polygon.interactive = true;
    polygon.buttonMode = true;
    figuresAmount++;
    polygon.id = figuresAmount;
    polygon.size = size;
    switch (num) {
      case 3:
        polygon.name = 'triangle';
        polygon.surface = model.pentagonSurface(num, size);
        break;
      case 4:
        polygon.name = 'rectangle';
        polygon.surface = model.pentagonSurface(num, size);
        break;
      case 5:
        polygon.name = 'pentagon';
        polygon.surface = model.pentagonSurface(num, size);
        break;
      case 6:
        polygon.name = 'hexagon';
        polygon.surface = model.pentagonSurface(num, size);
        break;
    }
    polygon.on('pointerdown', controller.clearFigure);
    model.surfacesSumCalc();
    figures.push(polygon);
    stage.addChild(polygon);
  },
  pentagonSurface: function(num, R) {
    var S, a;
    if (num === 3) {
      S = (3 * Math.sqrt(3) * Math.pow(R, 2)) / 4;
    } else if (num === 4) {
      S = Math.pow(R * 2, 2) / 2;
    } else if (num === 5) {
      a = (10 * R) / Math.sqrt(50 + 10 * Math.sqrt(5));
      S = (Math.sqrt(25 + 10 * Math.sqrt(5)) / 4) * Math.pow(a, 2);
    } else {
      S = (3 * Math.sqrt(3) * Math.pow(R, 2)) / 2;
    }
    return parseFloat(S.toFixed(2));
  },
  circleSurface:   function(r) {
    var S = Math.PI * Math.pow(r, 2);
    return parseFloat(S.toFixed(2));
  },
  ellipseSurface:  function(a, b) {
    var S = Math.PI * a * b;
    return parseFloat(S.toFixed(2));
  },
  randomizer:      function(e, r) {
    return Math.floor(Math.random() * r) + e;
  },
  getRandomColor:  function() {
    var letters = '0123456789ABCDEF';
    var color = '0x';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  },
  getRandomCoors:  function(number, size, Xcoor, Ycoor) {
    var coorsArr = [];
    for (var a = 0; a < number; a++) {
      coorsArr.push(Xcoor + size * Math.cos(a * 2 * Math.PI / number));
      coorsArr.push(Ycoor + size * Math.sin(a * 2 * Math.PI / number));
    }
    for (var i = 0; i < coorsArr.length; i++) {
      var temp = coorsArr[i];
      if (i % 2 === 0) {
        coorsArr[i] = coorsArr[i]; //x
      } else {
        coorsArr[i] = -temp; //y
      }
    }
    return coorsArr;
  },
  surfacesSumCalc: function() {
    figureSurfaceSum = 0;
    figures.forEach(function(figure) {
      figureSurfaceSum += figure.surface;
    });
    // TODO: In the top left you will have two HTML text fields,
    // one showing the number of shapes being displayed in the rectangle.
    counterTA.value = figures.length;
    // the other text field shows the surface area (in px^2) occupied by the shapes.
    surfaceTA.value = figureSurfaceSum.toFixed(2) + ' px^2';
  }
};
var view = {
  loadGame: function() {
    model.createView();
    intervalId = setInterval(model.drawSomething, int);

    //TODO: The shapes must fall down from top to bottom
    ticker.add(function() {
      for (var i = 0; i < figures.length; i++) {
        figures[i].position.y += gravity;
        if (figures[i].position.y > maxHeight + (figures[i].size * 2)) {
          figures[i].clear();
          figures.splice(i, 1);
        }
        renderer.render(stage);
        model.surfacesSumCalc();
      }
    });
  }
};

var controller = {
  //TODO: If you click a shape, it will disappear
  clearFigure:    function() {
    for (var i = 0; i < figures.length; i++) {
      if (figures[i].id === this.id) {
        model.surfacesSumCalc();
        figures.splice(i, 1);
      }
    }
    this.clear();
    renderer.render(stage);
    model.surfacesSumCalc();
  },
  //TODO: In the bottom you will add a couple of controls (HTML):
  // -/+ increase or decrease the number of shapes generated per second (update the text field accordingly)
  numberOfShapesPerSecond: function(inc) {
    if (inc === '+') {
      shapesPerSecond++;
    } else if (inc === '-') {
      shapesPerSecond--;
    }
    clearInterval(intervalId);
    if (shapesPerSecond > 0) {
      int = intValue / shapesPerSecond;
      intervalId = setInterval(model.drawSomething, int);
      shapesBtn.disabled = false;
    } else {
      int = intValue;
      shapesBtn.disabled = true;
    }
    shapesTA.value = shapesPerSecond;
  },
  //TODO:  The falling is controlled by the Gravity Value
  // -/+ increase or decrease the gravity value (update the text value accordingly)
  gravityControl: function(inc) {
    if (inc === '+') {
      gravity += 0.2;
    } else if (inc === '-') {
      gravity -= 0.2;
    }
    gravityTA.value = parseFloat(gravity.toFixed(2));
  }
};

view.loadGame();