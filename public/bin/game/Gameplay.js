// All enumerations will be stored in Gameplay along with the winningConditions for each game type like hostage rescue demolition...
Gameplay = {}
Gameplay.enum = {}
Gameplay.enum.mode = {
  SINGLE:0, //no planning like cs2d
  PLAN:1, // only planning
  HYBRID:2 // both planning and like cs2d user can control one character real time during execution phase
}
Gameplay.enum.character = {}
Gameplay.enum.character.gender = {
  MALE:0,
  FEMALE:1
}
Gameplay.enum.character.status = {
  IDLE:0,//character is not doing anything
  MOVE:1,//character is moving
  ACTION:2,//is performing an action using WEAPON_1 WEAPON_2 EQUIP_1 EQUIP_2
  CAMP:3, // is camping (wait/delay)
  SIGNAL:4, // giving a signal to other characters in wait mode
  DEAD:5, // is dead
  INTERACT:6, // is interacting with hostage bomb..
  RELOAD:7, // is reloading
  PAUSE:8, //Paused
  AUTO:9 //Automatic
}
Gameplay.enum.action = {
  WEAPON_1:0,
  WEAPON_2:1,
  EQUIP_1:2,
  EQUIP_2:3
}
Gameplay.enum.types = {
  HR : 0//Hostage Rescue
}
Gameplay.enum.weapon = {
  M4:0
}
Gameplay.enum.equipment = {
  HE_GRENADE:0,
  SMOKE_GRENADE:1,
  MEDKIT:2,
  MINE:3,
  AIR_SUPPORT:4,
  FLASHBANG:5,
  DEFUSAL_KIT:6,
  EXTRA_ARMOR:7
}
Gameplay.winningCondition = {}
Gameplay.winningCondition[Gameplay.enum.types.HR] = {
  'shortDescription' : 'HR',
  'longDescription' : 'Rescue the hostages or kill opposition',
  'hostages' : true,
  'opposition' :true
}
