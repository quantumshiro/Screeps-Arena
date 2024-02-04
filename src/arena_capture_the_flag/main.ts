// Note that there is no global objects like Game or Memory. All methods, prototypes and constants are imported built-in modules
// import {
//   ATTACK,
//   CostMatrix,
//   HEAL,
//   RANGED_ATTACK,
//   RoomPosition,
//   getDirection,
//   getRange,
//   getObjectById,
//   getObjectsByPrototype,
//   getTime
// } from "game";

// Everything can be imported either from the root /game module or corresponding submodules
// import { pathFinder } from "game";
// pathFinder.searchPath();
// import { prototypes } from "game";
// prototypes.Creep
// prototypes.RoomObject

// import {searchPath } from '/game/path-finder';
// import {Creep} from '/game/prototypes';

// This would work too:
// import * as PathFinder from '/game/path-finder'; --> PathFinder.searchPath
// import {Creep} from '/game/prototypes/creep';
// import * as prototypes from '/game/prototypes'; --> prototypes.Creep

// This stuff is arena-specific
import { ATTACK, HEAL, RANGED_ATTACK } from "game/constants";
import { Creep } from "game/prototypes";
import { getObjectsByPrototype, getTicks } from "game/utils";
import { healer } from "./healer";
import { meleeAttacker, rangedAttacker } from "./attacker";

declare module "game/prototypes" {
  interface Creep {
    initialPos: RoomPosition;
  }
}

// You can also import your files like this:
// import {roleAttacker} from './roles/attacker.mjs';

// We can define global objects that will be valid for the entire match.
// The game guarantees there will be no global reset during the match.
// Note that you cannot assign any game objects here, since they are populated on the first tick, not when the script is initialized.

// This is the only exported function from the main module. It is called every tick.
export function loop(): void {
  const myCreeps: Creep[] = getObjectsByPrototype(Creep).filter(i => i.my);
  // We assign global variables here. They will be accessible throughout the tick, and even on the following ticks too.
  // getObjectsByPrototype function is the alternative to Room.find from Screeps World.
  // There is no Game.creeps or Game.structures, you can manage game objects in your own way.

  // Notice how getTime is a global function, but not Game.time anymore
  if (getTicks() % 10 === 0) {
    console.log(`I have ${myCreeps.length} creeps`);
  }

  // Run all my creeps according to their bodies
  myCreeps.forEach(creep => {
    if (creep.body.some(i => i.type === ATTACK)) {
      meleeAttacker(creep);
    }
    if (creep.body.some(i => i.type === RANGED_ATTACK)) {
      rangedAttacker(creep);
    }
    if (creep.body.some(i => i.type === HEAL)) {
      healer(creep);
    }
  });
}
