# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Weapon.create(name: 'Baseball bat', description: '', image: '', range: '0', damage: 1, dice: 1,
              dice_to_success: 3, allow_open_door: false, silent_kill: true, silent_door: false,
              ambidextry: false)
Weapon.create(name: 'Chainsaw', description: '', image: '', range: '0', damage: 2, dice: 5,
              dice_to_success: 5, allow_open_door: true, silent_kill: false, silent_door: true,
              ambidextry: false)
Weapon.create(name: 'Crowbar', description: '', image: '', range: '0', damage: 1, dice: 1,
              dice_to_success: 4, allow_open_door: true, silent_kill: true, silent_door: true,
              ambidextry: false)
Weapon.create(name: 'Fire Axe', description: '', image: '', range: '0', damage: 2, dice: 1,
              dice_to_success: 4, allow_open_door: true, silent_kill: true, silent_door: false,
              ambidextry: false)
Weapon.create(name: 'Katana', description: '', image: '', range: '0', damage: 1, dice: 2,
              dice_to_success: 4, allow_open_door: false, silent_kill: true, silent_door: false,
              ambidextry: false)
Weapon.create(name: 'Machete', description: '', image: '', range: '0', damage: 2, dice: 1,
              dice_to_success: 4, allow_open_door: false, silent_kill: true, silent_door: false,
              ambidextry: true)
Weapon.create(name: 'Pan', description: '', image: '', range: '0', damage: 1, dice: 1,
              dice_to_success: 6, allow_open_door: false, silent_kill: true, silent_door: false,
              ambidextry: false)
Weapon.create(name: 'Pistol', description: '', image: '', range: '0-1', damage: 1, dice: 1,
              dice_to_success: 4, allow_open_door: false, silent_kill: false, silent_door: false,
              ambidextry: true)
Weapon.create(name: 'Sawed off', description: 'A little shotgun', image: '', range: '0-1', damage: 1, dice: 2,
              dice_to_success: 3, allow_open_door: false, silent_kill: false, silent_door: false,
              ambidextry: true)
Weapon.create(name: 'Shotgun', description: '', image: '', range: '0-1', damage: 2, dice: 2,
              dice_to_success: 4, allow_open_door: false, silent_kill: false, silent_door: false,
              ambidextry: false)
Weapon.create(name: 'Sub MG', description: '', image: '', range: '0-1', damage: 1, dice: 3,
              dice_to_success: 5, allow_open_door: false, silent_kill: false, silent_door: false,
              ambidextry: true)
Weapon.create(name: '.44 Magnum', description: '', image: '', range: '0-1', damage: 2, dice: 1,
              dice_to_success: 4, allow_open_door: false, silent_kill: false, silent_door: false,
              ambidextry: true)
Weapon.create(name: 'P90', description: '', image: '', range: '0-2', damage: 1, dice: 5,
              dice_to_success: 3, allow_open_door: false, silent_kill: false, silent_door: false,
              ambidextry: true)
Weapon.create(name: 'Assault rifle', description: '', image: '', range: '1-2', damage: 1, dice: 3,
              dice_to_success: 4, allow_open_door: false, silent_kill: false, silent_door: false,
              ambidextry: false)
Weapon.create(name: 'Claw Hammer', description: '', image: '', range: '0', damage: 1, dice: 1,
              dice_to_success: 4, allow_open_door: true, silent_kill: true, silent_door: true,
              ambidextry: true)
Weapon.create(name: 'Hatchet', description: '', image: '', range: '0', damage: 1, dice: 1,
              dice_to_success: 3, allow_open_door: false, silent_kill: true, silent_door: false,
              ambidextry: false)
Weapon.create(name: 'Kitchen knife', description: '', image: '', range: '0', damage: 1, dice: 1,
              dice_to_success: 5, allow_open_door: false, silent_kill: true, silent_door: false,
              ambidextry: true)