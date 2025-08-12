export  let intervals = {};

export function delay(name, isActive, func, timer) {
  if (!isActive) {
    console.log(`${name} not started`);
    return;
  }

  intervals[name] = {
    id: setInterval(func, timer * 1000),
    active: true
  };

  console.log(`started ${name}`, intervals[name]);
}


export function stopInterval(name) {
  if (intervals[name]) {
    clearInterval(intervals[name].id);
    intervals[name].active = false;
    console.log(`${name} stopped`);
  }
}

