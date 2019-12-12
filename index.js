const input = '<x=3, y=15, z=8>\n<x=5, y=-1, z=-2>\n<x=-10, y=8, z=2>\n<x=8, y=4, z=-5>';
const inputTest = '<x=-1, y=0, z=2>\n<x=2, y=-10, z=-7>\n<x=4, y=-8, z=8>\n<x=3, y=5, z=-1>'; //2772

const parseInput = input => {
  return input.split('\n').map(moon =>
    JSON.parse(
      moon
        .replace('<', '{')
        .replace('>', '}')
        .replace('x=', '"x":')
        .replace('y=', '"y":')
        .replace('z=', '"z":')
    )
  );
};

const calcVelocity = (moon, listMoons) => {
  const moonsGreaterX = listMoons.filter(m => m.pos.x > moon.pos.x);
  const moonsGreaterY = listMoons.filter(m => m.pos.y > moon.pos.y);
  const moonsGreaterZ = listMoons.filter(m => m.pos.z > moon.pos.z);
  const moonsSmallerX = listMoons.filter(m => m.pos.x < moon.pos.x);
  const moonsSmallerY = listMoons.filter(m => m.pos.y < moon.pos.y);
  const moonsSmallerZ = listMoons.filter(m => m.pos.z < moon.pos.z);
  const x = moon.vel.x + moonsGreaterX.length - moonsSmallerX.length;
  const y = moon.vel.y + moonsGreaterY.length - moonsSmallerY.length;
  const z = moon.vel.z + moonsGreaterZ.length - moonsSmallerZ.length;

  return { x: x, y: y, z: z };
};

const calcPot = moon => {
  return Math.abs(moon.pos.x) + Math.abs(moon.pos.y) + Math.abs(moon.pos.z);
};

const calcKin = moon => {
  return Math.abs(moon.vel.x) + Math.abs(moon.vel.y) + Math.abs(moon.vel.z);
};

const getTotalEnergy = (input, steps) => {
  let listMoons = [...parseInput(input)];
  listMoons = listMoons.map(moon => {
    return { pos: { x: moon.x, y: moon.y, z: moon.z }, vel: { x: 0, y: 0, z: 0 }, pot: null, kin: null, tot: null };
  });

  for (let i = 1; i < steps + 1; i++) {
    const auxListMoons = JSON.parse(JSON.stringify(listMoons));

    for (const moon of listMoons) {
      const vel = calcVelocity(moon, auxListMoons);
      moon.vel = vel;
      moon.pos = { x: moon.pos.x + vel.x, y: moon.pos.y + vel.y, z: moon.pos.z + vel.z };
    }
  }

  let totMoons = 0;

  for (const moon of listMoons) {
    moon.pot = calcPot(moon);
    moon.kin = calcKin(moon);
    moon.tot = moon.pot * moon.kin;
    totMoons += moon.tot;
  }

  return { totEnergy: totMoons, listMoons: listMoons };
};

const isMatchListMoonsCoordinateXYZ = (strCoordinate, list1, list2) => {
  let indexKey = 0;

  for (let i = 0; i < Object.keys(list1[0].pos).length; i++) {
    if (Object.keys(list1[0].pos)[i] === strCoordinate) {
      indexKey = i;
      break;
    }
  }

  let indexKeyVel = 0;

  for (let i = 0; i < Object.keys(list1[0].vel).length; i++) {
    if (Object.keys(list1[0].vel)[i] === strCoordinate) {
      indexKeyVel = i;
      break;
    }
  }

  for (let i = 0; i < list1.length; i++) {
    const valList1 = Object.values(list1[i].pos)[indexKey];
    const valList2 = Object.values(list2[i].pos)[indexKey];
    const valListVel1 = Object.values(list1[i].vel)[indexKeyVel];
    const valListVel2 = Object.values(list2[i].vel)[indexKeyVel];

    if (valList1 !== valList2 || valListVel1 !== valListVel2) {
      return false;
    }
  }

  return true;
};

const stepsToRepeat = (input, strCoordinate) => {
  let listMoons = [...parseInput(input)];
  listMoons = listMoons.map(moon => {
    return { pos: { x: moon.x, y: moon.y, z: moon.z }, vel: { x: 0, y: 0, z: 0 }, pot: null, kin: null, tot: null };
  });

  let count = 0;
  const initialListMoons = JSON.parse(JSON.stringify(listMoons));

  while (true) {
    const auxListMoons = JSON.parse(JSON.stringify(listMoons));

    for (const moon of listMoons) {
      const vel = calcVelocity(moon, auxListMoons);
      moon.vel = vel;
      moon.pos = { x: moon.pos.x + vel.x, y: moon.pos.y + vel.y, z: moon.pos.z + vel.z };
    }

    count++;

    if (isMatchListMoonsCoordinateXYZ(strCoordinate, listMoons, initialListMoons)) {
      break;
    }
  }

  return count;
};

const gcd_two_numbers = (x, y) => {
  if (typeof x !== 'number' || typeof y !== 'number') return false;
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
};

const calcSteps = input => {
  const x = stepsToRepeat(input, 'x');
  const y = stepsToRepeat(input, 'y');
  const z = stepsToRepeat(input, 'z');
  const xy = Math.round((x * y) / gcd_two_numbers(x, y));
  const xyz = Math.round((xy * z) / gcd_two_numbers(xy, z));

  return xyz;
};

console.time('part1')
console.log(getTotalEnergy(input, 1000));
console.timeEnd('part1')
console.time('part2')
console.log(calcSteps(input));
console.timeEnd('part2')

