zurvives.directive('board', function($http, boardData, socket) {
	var directive = {
        link: link,
        scope: true,
        restrict: 'AEC',
        controller: 'singleGameController'
    };
    return directive;
	
	function link($scope, element, attrs) {
		boardData.getJson().then(function(data) {
			boardData.setJson(data);
			boardData.getLayers();
			boardData.transformLayers();

			var boardGround = boardData.layer2d["Board"];

			var neighboorZones = {};

			var tilesetImage = new Image();
			tilesetImage.src = '/board/images/tileset.png';
			tilesetImage.onload = drawImage;

			var stage = new createjs.Stage(element[0]);
			var container = new createjs.Container();
			container.name = "tilesContainer";
			stage.enableMouseOver();
			var tileSize = boardData.dataJson.tilewidth;       // The size of a tile (32×32)
			var rowTileCount = boardData.dataJson.width;   // The number of tiles in a row of our background
			var colTileCount = boardData.dataJson.height;   // The number of tiles in a column of our background
			var imageNumTiles = boardData.dataJson.width;  // The number of tiles per row in the tileset image

            $scope.boardWidth = tileSize * rowTileCount;
            $scope.boardHeight = tileSize * colTileCount;

			// Get different layers from json

			function drawImage () {
				var imageData = {
					images: [tilesetImage],
					frames: {
						width: tileSize,
						height: tileSize,
						spacing: 0,
						margin: 0
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
						cellBitmap.name = 'tile_'+x+'-'+y;

						$.each(boardData.layer2d, function(name, tiles) {
							if(name !== "Board") {
								var tile = tiles[x][y];
								if(tile !== 0) {
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

						cellBitmap.addEventListener("click", $scope.canMoveTo);
						container.addChild(cellBitmap);
					};
				};

				stage.addChild(container);
				stage.update();
                $scope.stage = stage;
                $scope.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
				//$scope.initPlayer($scope.color);
				fillNeighboors();

                //Emit event when map fully loaded
                socket.emit('map:loaded');
			}

			var player;

            $scope.initPlayer = function initPlayer(color, username) {
				player = new createjs.Shape();
				player.graphics.beginFill(color).drawCircle(0,0,10);
				//moveTo(player, 34, 0);
                player.x = 34*tileSize + tileSize/2;
                player.y = tileSize/2;
				player.Zone = 19;
                player.name = username;
                //Add player to scope
                $scope.listplayer.push(player);
				stage.addChild(player);
				stage.update();
			};

            $scope.moveTo = function moveTo(object, x, y) {
				object.x= x*tileSize + tileSize/2;
				object.y =y*tileSize + tileSize/2;
				stage.update();
            };
            $scope.moveToBroadcast = function moveTo(object, x, y) {
                object.x= x;
                object.y =y;
                stage.update();
            };

			$scope.canMoveTo = function canMoveTo(e) {
				 //debugger;
				var isNeighboor = $.inArray(parseInt(e.currentTarget.Zone), eval('neighboorZones[' + player.Zone + ']'));
                //console.log(isNeighboor);
				if(e.currentTarget.Zone && e.currentTarget.Zone !== player.Zone && isNeighboor !== -1 ) {
                    $scope.moveTo(player, (e.currentTarget.x/tileSize), (e.currentTarget.y/tileSize));
					player.Zone = e.currentTarget.Zone;

                    var data = {player: {name: player.name, x: player.x, y: player.y, zone: player.zone}, slug: $scope.$parent.slug};
                    //TODO: add socket
                    socket.emit('game:stage:player:move', data);
				} else {
					console.log("Vous ne passerez pas!!");
				}
			};

			function fillNeighboors() {
				var element;
				var col;
				var row;
				var tiles = container.children;
				for (var i = 0; i < tiles.length; i++) {
					element = tiles[i].name.split(/_|-/);
					col = element[1];
					row = element[2];
					if(tiles[i].Zone) {
						checkNeighboors(tiles[i], col, row);	
					}
				};

			}

			function checkNeighboors(tile, colCoord, rowCoord) {
				var colCoordonates = parseInt(colCoord);
				var rowCoordonates = parseInt(rowCoord);
				var tileZone = tile.Zone;
				var tileUp;
				var tileDown;
				var tileLeft;
				var tileRight;

				// if (colCoordonates !== 0 || rowCoordonates !== 0) {
					tileUp    = container.getChildByName('tile_' + (colCoordonates-1) + '-' + rowCoordonates);
					tileDown  = container.getChildByName('tile_' + (colCoordonates+1) + '-' + rowCoordonates);
					tileLeft  = container.getChildByName('tile_' + colCoordonates + '-' + (rowCoordonates-1));
					tileRight = container.getChildByName('tile_' + colCoordonates + '-' + (rowCoordonates+1));
				// };

				var potential = [tileUp, tileDown, tileLeft, tileRight];

				var tileNeigbhoors = new Array();

				for (var l = 0; l < 4; l++) {
	                if (potential[l] != null && potential[l] != null) {
	                    tileNeigbhoors.push(potential[l]);
	                }
	            }

	            var isInArray;

	            for (var m = 0; m < tileNeigbhoors.length; m++) {
	            	isInArray = $.inArray(parseInt(tileNeigbhoors[m].Zone), eval('neighboorZones[' +tile.Zone + ']'));
	            	if(tileNeigbhoors[m].Zone && tileNeigbhoors[m].Zone !== tile.Zone) {
	            		if(!(eval('neighboorZones[' + tile.Zone +']'))) {
	            			eval('neighboorZones[' + tile.Zone + '] = []');
	            		}
	            		if(isInArray === -1) {
	            			eval('neighboorZones[' + tile.Zone + '].push(parseInt(tileNeigbhoors[m].Zone))');
	            		}
	            	}
	            };

			}

		});

    }
});