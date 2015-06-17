zurvives.directive('board', function($http, boardData) {
	var directive = {
        link: link,
        scope: true,
        restrict: 'AEC'
    };
    return directive;
	
	function link(scope, element, attrs) {
		boardData.getJson().then(function(data) {
			boardData.setJson(data);
			boardData.getLayers();
			boardData.transformLayers();

			var boardGround = boardData.layer2d["Board"];

			var tilesetImage = new Image();
			tilesetImage.src = '/assets/images/tileset.png';
			tilesetImage.onload = drawImage;

			var stage = new createjs.Stage(element[0]);
			stage.enableMouseOver();
			var tileSize = boardData.dataJson.tilewidth;       // The size of a tile (32×32)
			var rowTileCount = boardData.dataJson.width;   // The number of tiles in a row of our background
			var colTileCount = boardData.dataJson.height;   // The number of tiles in a column of our background
			var imageNumTiles = boardData.dataJson.width;  // The number of tiles per row in the tileset image

			scope.boardWidth = tileSize * rowTileCount;
			scope.boardHeight = tileSize * colTileCount;

			// Get different layers from json
			var layerZones = boardData.layer2d["Zones"];

			console.log(layerZones);

			function drawImage () {
				var imageData = {
					images: [tilesetImage],
					frames: {
						width: tileSize,
						height: tileSize,
						spacing: 0,
						margin: 0,
					}
				};

				var tilesetsheet = new createjs.SpriteSheet(imageData);

				var layer2dLength = Object.keys(boardData.layer2d).length;

				// $.each(boardData.layer2d, function(name, tile) {
					var layerData = boardData.layer2d["Board"];
					initLayer(layerData, tilesetsheet, tileSize);
				// });

			}

			function initLayer(layerData, tilesetsheet, tileSize) {
				for (var y = 0; y < rowTileCount; y++) {
					for (var x = 0; x < colTileCount; x++) {
						var cellBitmap = new createjs.Sprite(tilesetsheet);
						cellBitmap.gotoAndStop(layerData[x][y] - 1);
						cellBitmap.x = tileSize * y;
						cellBitmap.y = tileSize * x;
						cellBitmap.addEventListener("click", test);
						stage.addChild(cellBitmap);
					};
				};

				stage.update();
				initPlayer();
			}

			var circle;

			function initPlayer() {
				circle = new createjs.Shape();
				circle.graphics.beginFill("red").drawCircle(0,0,10);
				moveTo(circle, 35, 1);
				stage.addChild(circle);
				stage.update();
			}

			function moveTo(object, x, y) {
				object.x= x*tileSize + tileSize/2;
				object.y =y*tileSize + tileSize/2;
				stage.update();
			}

			function test(e) {
				moveTo(circle, (e.currentTarget.x/tileSize), (e.currentTarget.y/tileSize));
				console.log(e);
			}

		});

    }
});