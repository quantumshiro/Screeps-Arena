import { Flag } from "arena";
import { getObjectsByPrototype, getRange } from "game/utils";
import { Creep } from "game/prototypes";
import { Visual } from "game/visual";
import { flee } from "./healer";

declare module "game/prototypes" {
  interface Creep {
    initialPos: RoomPosition;
  }
}

const enemyCreeps: Creep[] = getObjectsByPrototype(Creep).filter(i => !i.my);
const enemyFlag: Flag | undefined = getObjectsByPrototype(Flag).find(i => !i.my);

export function meleeAttacker(creep: Creep) {
  // Here is the alternative to the creep "memory" from Screeps World. All game objects are persistent. You can assign any property to it once, and it will be available during the entire match.
  if (!creep.initialPos) {
    creep.initialPos = { x: creep.x, y: creep.y };
  }

  new Visual().text(
    creep.hits.toString(),
    { x: creep.x, y: creep.y - 0.5 }, // above the creep
    {
      font: "0.5",
      opacity: 0.7,
      backgroundColor: "#808080",
      backgroundPadding: 0.03
    }
  );
  const targets = enemyCreeps
    .filter(i => getRange(i, creep.initialPos) < 10)
    .sort((a, b) => getRange(a, creep) - getRange(b, creep));

  if (enemyCreeps && targets.length > 0) {
    creep.moveTo(targets[0]);
    creep.attack(targets[0]);
  } else {
    creep.moveTo(creep.initialPos);
  }
}

export function rangedAttacker(creep: Creep) {
  const targets = enemyCreeps.sort((a, b) => getRange(a, creep) - getRange(b, creep));

  if (targets.length > 0) {
    creep.rangedAttack(targets[0]);
  }

  if (enemyFlag) {
    creep.moveTo(enemyFlag);
  }

  const range = 3;
  const enemiesInRange = enemyCreeps.filter(i => getRange(i, creep) < range);
  if (enemiesInRange.length > 0) {
    flee(creep, enemiesInRange, range);
  }
}
