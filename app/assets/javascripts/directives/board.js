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
			var zones = [];

			var tilesetImage = new Image();
			tilesetImage.src = '/board/images/tileset.png';
			tilesetImage.onload = drawImage;

			var stage = new createjs.Stage(element[0]);
			var container = new createjs.Container();
			container.name = "tilesContainer";
			var chemin = new createjs.Container();
			chemin.name = "cheminZombie";
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
										case "SpawnZombie":
											eval('cellBitmap. ' + results[0] + ' = true');
											break;
										default:
											eval('cellBitmap. ' + results[0] + ' = results[1]');
											break;
									}
								}
							}
						});

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

			var zombie;
			var zombiePath;

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

			$scope.initZombie = function initZombie() {
				zombie = new createjs.Shape();
				zombie.graphics.beginFill("red").drawCircle(0,0,10);
				zombie.x = tileSize/2;
                zombie.y = 19*tileSize + tileSize/2;
				zombie.Zone = 34;
				stage.addChild(zombie);
				stage.update();
				findPath(parseInt(zombie.Zone),parseInt(player.Zone));
			}

            $scope.moveTo = function moveTo(object, x, y) {
				object.x= x*tileSize + tileSize/2;
				object.y =y*tileSize + tileSize/2;
				stage.update();
                $scope.alreadyMove = true;
            };
            $scope.moveToBroadcast = function moveTo(object, x, y) {
                object.x= x;
                object.y =y;
                stage.update();
            };

			$scope.canMoveTo = function canMoveTo(e) {
                //debugger;
                if ($scope.checkIfPlayerTurn() && $scope.canPerformAction()) {
                    if (!$scope.alreadyMove){
                        var indexOfCurrentPlayer =_.findIndex($scope.players, _.findWhere($scope.players, {email: $scope.user.email}));
                        var isNeighboor = $.inArray(parseInt(e.currentTarget.Zone), eval('neighboorZones[' + player.Zone + ']'));

                        if(e.currentTarget.Zone && e.currentTarget.Zone !== player.Zone && isNeighboor !== -1 ) {
                            $scope.moveTo(player, (e.currentTarget.x/tileSize), (e.currentTarget.y/tileSize));
                            player.Zone = e.currentTarget.Zone;

                            var data = {player: {name: player.name, x: player.x, y: player.y, zone: player.zone}, slug: $scope.$parent.slug};

                            socket.emit('game:stage:player:move', data);
                            socket.emit('game:changeTurn',{currentplayer: indexOfCurrentPlayer, slug: $scope.slug, actionsLeft: $scope.actions});
                        } else {
                            console.log("Vous ne passerez pas!!");

                        }
                    }else {
                        console.log("Loot Time");
                        $scope.lootIfYouCan();
                    }
                }else {
                    console.log('cannot move not your turn');
                }

			};

			var findPath = function(zombieZone,loudestZone) {
				var closedList = [];
				var zZone = _.findWhere(zones, { zone: zombieZone.toString() });
				var lZone = _.findWhere(zones, { zone: loudestZone.toString() });
				var openList = [zZone];
				var currentZone = zZone;

				stage.addChild(chemin);

				while(openList.length > 0) {
					var zombieZoneNeighboors = currentZone.neighbors;
					
					for (var i = 0; i < zombieZoneNeighboors.length; i++) {
						var neighbor = zombieZoneNeighboors[i];
						if(neighbor === lZone) {
							neighbor.parent = currentZone;
							zombiePath = neighbor.pathToOrigin();
							openList = [];
							drawSolution();
							return true;

						}
						if(!_.include(closedList, neighbor)) {
							if(!_.include(openList, neighbor)) {
								openList.push(neighbor);
								neighbor.parent = currentZone;
								neighbor.heuristic = neighbor.score() + getDistanceBetween(neighbor,lZone);
							}
						}
					}

					closedList.push(currentZone);
					openList.remove(_.indexOf(openList, currentZone));

					currentZone = openList[openList.length-1];
				}
			}

			function drawSolution() {
				var i = 0;
				var path = zombiePath;
				setInterval(function() {
					if(i < path.length) {
						// for (var i = 0; i < path.length; i++) {
							var point = new createjs.Shape();
							point.graphics.beginFill("purple").drawCircle(parseInt(path[i].x*tileSize + tileSize/2),parseInt(path[i].y*tileSize + tileSize/2),10);
							chemin.addChild(point);
							stage.update();
						// };
					} else {
						return
					}
					i++;
				}, 200);
			}

			function sleep(milliseconds) {
			  var start = new Date().getTime();
			  for (var i = 0; i < 1e7; i++) {
			    if ((new Date().getTime() - start) > milliseconds){
			      break;
			    }
			  }
			}

			function getDistanceBetween(start, end) {
				var xDist = Math.abs((parseInt(start.x)*tileSize) - (parseInt(end.x)*tileSize));
			    var yDist = Math.abs((parseInt(start.y)*tileSize) - (parseInt(end.y)*tileSize));

			    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
			}

			var Zone = function(zone, y, x) {
				this.zone = zone;
				this.neighbors = [];
				this.x = x;
				this.y = y;
				this.parent = null;
				this.heuristic = 0;

				this.score = function() {
					var total = 0;
					var p = this.parent;

					while(p) {
						++total;
						p = p.parent;
					}
					return total;
				}

				this.pathToOrigin = function() {
					var path = [this];
					var p = this.parent;

					while(p) {
						path.push(p);
						p = p.parent;
					}

					path.reverse();

					return path;
				}
			}

			function fillNeighboors() {
				var element;
				var col;
				var row;
				var tiles = container.children;
				var first_iteration = true;
				for (var i = 0; i < tiles.length; i++) {
					element = tiles[i].name.split(/_|-/);
					col = element[1];
					row = element[2];
					if(tiles[i].Zone) {
						checkNeighboors(tiles[i], col, row);
						var zone = new Zone(tiles[i].Zone, col, row);
						if(first_iteration) {
							zones.push(zone);
							first_iteration = false;
						}
						if(!_.findWhere(zones, {zone: tiles[i].Zone})) {
							zones.push(zone);
						}
					}
				};
				for (var b = 0; b < zones.length; b++) {
					for (var c = 0; c < neighboorZones[parseInt(zones[b].zone)].length; c++) {
						zones[b].neighbors.push(_.findWhere(zones, { zone: neighboorZones[parseInt(zones[b].zone)][c].toString() }));
					};
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

			// A BOUGER DE PLACE ICI C'EST NUL !!!!

			// Array Remove - By John Resig (MIT Licensed)
			Array.prototype.remove = function(from, to) {
			  var rest = this.slice((to || from) + 1 || this.length);
			  this.length = from < 0 ? this.length + from : from;
			  return this.push.apply(this, rest);
			};

			// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
			if (!Object.keys) {
			  Object.keys = (function() {
			    'use strict';
			    var hasOwnProperty = Object.prototype.hasOwnProperty,
			        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
			        dontEnums = [
			          'toString',
			          'toLocaleString',
			          'valueOf',
			          'hasOwnProperty',
			          'isPrototypeOf',
			          'propertyIsEnumerable',
			          'constructor'
			        ],
			        dontEnumsLength = dontEnums.length;

			    return function(obj) {
			      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
			        throw new TypeError('Object.keys called on non-object');
			      }

			      var result = [], prop, i;

			      for (prop in obj) {
			        if (hasOwnProperty.call(obj, prop)) {
			          result.push(prop);
			        }
			      }

			      if (hasDontEnumBug) {
			        for (i = 0; i < dontEnumsLength; i++) {
			          if (hasOwnProperty.call(obj, dontEnums[i])) {
			            result.push(dontEnums[i]);
			          }
			        }
			      }
			      return result;
			    };
			  }());
			}

		});

    }
});