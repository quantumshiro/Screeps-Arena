import { Creep, GameObject } from "game/prototypes";
import { getDirection, getObjectsByPrototype, getRange } from "game/utils";
import { Flag } from "arena";
import { searchPath } from "game/path-finder";

declare module "game/prototypes" {
  interface Creep {
    initialPos: RoomPosition;
  }
}

const myCreeps: Creep[] = getObjectsByPrototype(Creep).filter(i => i.my);
const enemyCreeps: Creep[] = getObjectsByPrototype(Creep).filter(i => !i.my);
const enemyFlag: Flag | undefined = getObjectsByPrototype(Flag).find(i => !i.my);

export function healer(creep: Creep) {
  const targets = myCreeps.filter(i => i !== creep && i.hits < i.hitsMax).sort((a, b) => a.hits - b.hits);

  if (targets.length) {
    creep.moveTo(targets[0]);
  } else {
    if (enemyFlag) {
      creep.moveTo(enemyFlag);
    }
  }

  const healTargets = myCreeps.filter(i => getRange(i, creep) <= 3).sort((a, b) => a.hits - b.hits);

  if (healTargets.length > 0) {
    if (getRange(healTargets[0], creep) === 1) {
      creep.heal(healTargets[0]);
    } else {
      creep.rangedHeal(healTargets[0]);
    }
  }

  const range = 7;
  const enemiesInRange = enemyCreeps.filter(i => getRange(i, creep) < range);
  if (enemiesInRange.length > 0) {
    flee(creep, enemiesInRange, range);
  }

  if (enemyFlag) {
    creep.moveTo(enemyFlag);
  }
}

export function flee(creep: Creep, targets: GameObject[], range: number) {
  const result = searchPath(
    creep,
    targets.map(i => ({ pos: i, range })),
    { flee: true }
  );
  if (result.path.length > 0) {
    const direction = getDirection(result.path[0].x - creep.x, result.path[0].y - creep.y);
    creep.move(direction);
  }
}
