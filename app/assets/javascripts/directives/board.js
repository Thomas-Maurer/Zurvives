zurvives.directive('board', function($http, boardData, socket) {
	var directive = {
        link: link,
        scope: true,
        restrict: 'AEC',
        controller: 'singleGameController'
    };
    return directive;
	
	function link($scope, element, attrs) {
        $scope.$on('$destroy', function (event) {
            socket.removeAllListeners();
        });
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
            var zombiesContainer = new createjs.Container();
            zombiesContainer.name = "zombiesContainer";
            var zonesContainer = new createjs.Container();
            zonesContainer.name = "zonesContainer";
			stage.enableMouseOver();
			var tileSize = boardData.dataJson.tilewidth;       // The size of a tile (32×32)
			var rowTileCount = boardData.dataJson.width;   // The number of tiles in a row of our background
			var colTileCount = boardData.dataJson.height;   // The number of tiles in a column of our background
			var imageNumTiles = boardData.dataJson.width;  // The number of tiles per row in the tileset image

			var previousZoneForHovering;

            $scope.boardWidth = tileSize * rowTileCount;
            $scope.boardHeight = tileSize * colTileCount;

            var zoneZombies = [];

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
										case "SpawnZombie":
											eval('cellBitmap. ' + results[0] + ' = true');
                                            zoneZombies.push(cellBitmap);
											break;
										default:
											eval('cellBitmap. ' + results[0] + ' = results[1]');
											break;
									}
								}
							}
						});

						cellBitmap.addEventListener("click", $scope.canMoveTo);
						cellBitmap.addEventListener("mouseover", function(e) {
							if(e.currentTarget.Zone && (previousZoneForHovering === undefined || !e.relatedTarget || !e.relatedTarget.Zone || e.currentTarget.Zone != previousZoneForHovering)) {
								var tilesInZone = _.where(container.children, {Zone : e.currentTarget.Zone});
								_.each( tilesInZone, function(tile) {
									tile.cursor = "pointer";
								});
								previousZoneForHovering = e.currentTarget.Zone;
								var tileZone = parseInt(e.currentTarget.Zone);
								var zoneToHover = _.findWhere(zonesContainer.children, {zone: tileZone});
								zoneToHover.graphics.beginFill("rgba(0,0,0,0.5)").drawRect(zoneToHover.xCoord, zoneToHover.yCoord, zoneToHover.width, zoneToHover.height);
								zoneToHover.alpha = 1;
								stage.update();
							}
						});
						cellBitmap.addEventListener("mouseout", function(e) {
							if(e.currentTarget.Zone && (!e.relatedTarget || previousZoneForHovering != e.relatedTarget.Zone)) {
								var tilesInZone = _.where(container.children, {Zone : e.currentTarget.Zone});
								_.each( tilesInZone, function(tile) {
									tile.cursor = "arrow";
								});
								var tileZone = parseInt(e.currentTarget.Zone);
								var zoneToHover = _.findWhere(zonesContainer.children, {zone: tileZone});
								zoneToHover.graphics.clear();
								zoneToHover.alpha = 0;
								stage.update();
							}
						});
						container.addChild(cellBitmap);

					};
				};

				stage.addChild(container);
                stage.addChild(zombiesContainer);
                stage.addChild(zonesContainer);
				stage.update();
                $scope.stage = stage;
                $scope.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
				fillNeighboors();
				for (var i = 1; i <= zones.length+1; i++) {
					var currentZoneTiles = [];
					_.each(container.children, function(tile) {
						if(tile.Zone) {
							if(parseInt(tile.Zone) === i) {
								currentZoneTiles.push(tile);
							}
						}
					});
					var minX = _.min(currentZoneTiles, function(zone) {return zone.x}).x;
					var minY = _.min(currentZoneTiles, function(zone) {return zone.y}).y;
					var maxX = (_.max(currentZoneTiles, function(zone) {return zone.x}).x) + tileSize;
					var maxY = (_.max(currentZoneTiles, function(zone) {return zone.y}).y) + tileSize;
					var drawnZone = new createjs.Shape();
					drawnZone.graphics.drawRect(minX, minY, (maxX-minX), (maxY-minY));
					drawnZone.zone = i;
					drawnZone.xCoord = minX;
					drawnZone.yCoord = minY;
					drawnZone.width = maxX-minX;
					drawnZone.height = maxY-minY;
					zonesContainer.addChild(drawnZone);
					stage.update();
				};

                //Emit event when map fully loaded
                socket.emit('map:loaded');
			}

			var player;
			var zombie;

            $scope.initPlayer = function initPlayer(color, username) {
				player = new createjs.Shape();
				player.graphics.beginFill(color).drawCircle(0,0,10);
				//moveTo(player, 34, 0);
                player.x = 34*tileSize + tileSize/2;
                player.y = tileSize/2;
				player.Zone = 19;
                player.name = username;

                var currentZone = _.findWhere(zones, {zone: player.Zone.toString()});
                currentZone.noise++;

                //Add player to scope
                $scope.listplayer.push(player);
				stage.addChild(player);
				stage.update();
			};

            $scope.getSpawnZombies = function () {
                return zoneZombies;
            };

			$scope.initZombie = function initZombie(zone, id, broadcast) {
				zombie = new createjs.Shape();
				zombie.graphics.beginFill("red").drawCircle(0,0,10);
				zombie.x = zone.x + tileSize/2;
                zombie.y = zone.y + tileSize/2;
				zombie.Zone = zone.Zone;
                zombie.id = id;
                //Add zombie to scope
                $scope.listZombies.push(zombie);
				zombiesContainer.addChild(zombie);
                if (!broadcast){
                    socket.emit('game:add:zombie', {zone: {Zone: zombie.Zone, x: zone.x, y: zone.y}, zombie: {x: zombie.x, y: zombie.y, zone: zombie.Zone, id: zombie.id}, slug: $scope.$parent.slug});

                }
                stage.update();
			};

            $scope.deletePlayer = function (useremail) {
                var playerToDelete = _.findWhere($scope.listplayer, useremail);
                stage.removeChild(playerToDelete);
                stage.update();
            };

            $scope.moveTo = function moveTo(object, x, y) {
				object.x= x*tileSize + tileSize/2;
				object.y =y*tileSize + tileSize/2;
				stage.update();
                $scope.alreadyMove = true;
            };

            $scope.moveToZ = function moveToZ(object, x, y, zone) {
                object.x= x*tileSize + tileSize/2;
                object.y =y*tileSize + tileSize/2;
                stage.update();
            };
            $scope.moveToBroadcast = function moveToBroadcast(object, x, y) {
                object.x= x;
                object.y =y;
                stage.update();
            };

            $scope.getZones = function () {
                return zones;
            };

			$scope.canMoveTo = function canMoveTo(e) {
                if ($scope.checkIfPlayerTurn() && $scope.canPerformAction()) {
                    if (!$scope.alreadyMove && !$scope.alreadyLoot){
                        var indexOfCurrentPlayer =_.findIndex($scope.players, _.findWhere($scope.players, {email: $scope.user.email}));
                        var isNeighboor = $.inArray(parseInt(e.currentTarget.Zone), eval('neighboorZones[' + player.Zone + ']'));

                        if(e.currentTarget.Zone && e.currentTarget.Zone !== player.Zone && isNeighboor !== -1 ) {
                            var currentZone = _.findWhere(zones, {zone: player.Zone.toString()});
                            currentZone.noise--;

                            player.Zone = e.currentTarget.Zone;

                            currentZone = _.findWhere(zones, {zone: player.Zone.toString()});
                            currentZone.noise++;
                            $scope.moveTo(player, (e.currentTarget.x/tileSize), (e.currentTarget.y/tileSize));

                            var data = {player: {name: player.name, x: player.x, y: player.y, zone: player.Zone}, slug: $scope.$parent.slug};

                            socket.emit('game:stage:player:move', data);
                        } else {
                            //console.log("Vous ne passerez pas!!");
                            $scope.flashService.emit('You shall not pass');

                        }
                    }else {
                        $scope.flashService.emit('You are trying to loot');
                        //console.log("Loot Time");
                        $scope.lootIfYouCan(e.currentTarget.Zone, player.Zone);
                    }
                }else {
                    $scope.flashService.emit('cannot move not your turn');
                   // console.log('cannot move not your turn');
                }

			};

			$scope.findPath = function(zombieZone,loudestZone) {
				var closedList = [];
				var zZone = _.findWhere(zones, { zone: zombieZone.toString() });
				var lZone = _.findWhere(zones, { zone: loudestZone.toString() });
				var openList = [zZone];
				var currentZone = zZone;
				var zonesToReset;

				while(openList.length > 0) {
					var zombieZoneNeighboors = currentZone.neighbors;
					
					for (var i = 0; i < zombieZoneNeighboors.length; i++) {
						var neighbor = zombieZoneNeighboors[i];
						if(neighbor === lZone) {
							neighbor.parent = currentZone;
							openList = [];
							closedList = [];
                            return neighbor.pathToOrigin();

						}
						if(!_.include(closedList, neighbor)) {
							if(!_.include(openList, neighbor)) {
								openList.push(neighbor);
								neighbor.parent = currentZone;
                                var score = neighbor.score();
                                var distance = getDistanceBetween(neighbor,lZone);
								neighbor.heuristic = score + distance;
							}
						}
					}

					closedList.push(currentZone);
					openList.remove(_.indexOf(openList, currentZone));

					currentZone = _.min(openList,function(object) {return object.heuristic});
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
                this.noise = 0;

				this.score = function() {
					var total = 0;
					var p = this.parent;

					while(p) {
						++total;
						p = p.parent;
					}
					return total;
				};

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
			};

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