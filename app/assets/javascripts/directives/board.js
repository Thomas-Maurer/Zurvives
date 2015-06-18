zurvives.directive('board', function($http, boardData,socket) {
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

			var neighboorZones = {
				1: [2],
				2: [1,5],
				3: [4],
				4: [3,5],
				5: [2,4,6,23],
				6: [5,7],
				7: [6,8,29],
				8: [7,9],
				9: [8,10,43],
				10: [9,11],
				11: [10,12,44],
				12: [11,13],
				13: [12,14,70],
				14: [13,15],
				15: [14,16,22],
				16: [15,17],
				17: [16,18],
				18: [17,19],
				19: [18,20],
				20: [19,21],
				21: [20,22],
				22: [15,21],
				23: [5,24],
				24: [23,25],
				25: [24,26],
				26: [25,27,28],
				27: [26,36],
				28: [26,32],
				29: [7,30],
				30: [29,31,45],
				31: [30,32],
				32: [28,31,33],
				33: [32,38],
				34: [35],
				35: [34,36],
				36: [27,35,37],
				37: [36,38],
				38: [33,37,39],
				39: [38,41],
				41: [39,42],
				42: [41,52],
				43: [9,46],
				44: [11,48],
				45: [30,46],
				46: [43,45,47],
				47: [46,48],
				48: [44,47,49],
				49: [48,50],
				50: [49,51],
				51: [50,52],
				52: [42,51,53,55],
				53: [52,54],
				54: [53],
				55: [52,56],
				56: [55,57,62],
				57: [56,58],
				58: [57,59,61],
				59: [58,60],
				60: [59],
				61: [58,65],
				62: [56,63],
				63: [62,64,68],
				64: [63,65],
				65: [64,66],
				66: [65,67],
				67: [66],
				68: [63,69],
				69: [68,70],
				70: [13,69]
			}

			var tilesetImage = new Image();
			tilesetImage.src = '/board/images/tileset.png';
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

				// $.each(boardData.layer2d, function(name, tiles) {
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

						$.each(boardData.layer2d, function(name, tiles) {
							if(name !== "Board") {
								var tile = tiles[x][y];
								if(tile !== 0) {
									// cellBitmap.name = name;
									var results = name.match(/(\d+|\D+)/g);
									switch(name) {
										case "Collision":
											eval('cellBitmap. ' + results[0] + ' = true');
											break;
										default:
											eval('cellBitmap. ' + results[0] + ' = results[1]');
											break;
									}
								}
							}
						});

						// console.log(cellBitmap);

						cellBitmap.addEventListener("click", canMoveTo);
						stage.addChild(cellBitmap);
					};
				};

				stage.update();
				initPlayer();
			}

			var player;

			function initPlayer() {
				player = new createjs.Shape();
				player.graphics.beginFill("red").drawCircle(0,0,10);
				moveTo(player, 34, 0);
				player.Zone = 19;
				stage.addChild(player);
				stage.update();
			}

			function moveTo(object, x, y) {
				object.x= x*tileSize + tileSize/2;
				object.y =y*tileSize + tileSize/2;
				stage.update();

                //TODO: add socket
                socket.emit('stage:move',object);
            }

			function canMoveTo(e) {
				// debugger;
				var isNeighboor = $.inArray(parseInt(e.currentTarget.Zone), eval('neighboorZones[' + player.Zone + ']'));
				if(e.currentTarget.Zone && e.currentTarget.Zone !== player.Zone && isNeighboor !== -1 ) {
					moveTo(player, (e.currentTarget.x/tileSize), (e.currentTarget.y/tileSize));
					player.Zone = e.currentTarget.Zone;
				} else {
					console.log("Vous ne passerez pas!!");
				}
			}

		});

    }
});