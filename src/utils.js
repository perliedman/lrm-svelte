import template from 'string-template'

const defaults = {
  unitNames: {
    meters: 'm',
    kilometers: 'km',
    miles: 'mi',
    yards: 'yd',
    hours: 'h',
    minutes: 'min',
    seconds: 's',
  },
  roundingSensitivity: 1,
  distanceTemplate: '{value} {unit}'
}

export function formatDistance (d /* Number (meters) */, sensitivity, options) {
  options = options || defaults
  sensitivity = sensitivity || options.roundingSensitivity
  const un = options.unitNames
  const simpleRounding = sensitivity <= 0
  const roundFn = simpleRounding ? function(v) { return v; } : round
  var data

  if (options.units === 'imperial') {
    const yards = d / 0.9144;
    if (yards >= 1000) {
      data = {
        value: roundFn(d / 1609.344, sensitivity),
        unit: un.miles
      };
    } else {
      data = {
        value: roundFn(yards, sensitivity),
        unit: un.yards
      };
    }
  } else {
    var v = roundFn(d, sensitivity);
    data = {
      value: v >= 1000 ? (v / 1000) : v,
      unit: v >= 1000 ? un.kilometers : un.meters
    };
  }

  if (simpleRounding) {
    data.value = data.value.toFixed(-sensitivity);
  }

  return template(options.distanceTemplate, data);
}

function round (d, sensitivity) {
  var s = sensitivity,
    pow10 = Math.pow(10, (Math.floor(d / s) + '').length - 1),
    r = Math.floor(d / pow10),
    p = (r > 5) ? pow10 : pow10 / 2;

  return Math.round(d / p) * p;
}

export function formatDuration (t /* Number (seconds) */, options) {
  options = options || defaults
  var un = options.unitNames;
  // More than 30 seconds precision looks ridiculous
  t = Math.round(t / 30) * 30;

  if (t > 86400) {
    return Math.round(t / 3600) + ' ' + un.hours;
  } else if (t > 3600) {
    return Math.floor(t / 3600) + ' ' + un.hours + ' ' +
      Math.round((t % 3600) / 60) + ' ' + un.minutes;
  } else if (t > 300) {
    return Math.round(t / 60) + ' ' + un.minutes;
  } else if (t > 60) {
    return Math.floor(t / 60) + ' ' + un.minutes +
      (t % 60 !== 0 ? ' ' + (t % 60) + ' ' + un.seconds : '');
  } else {
    return t + ' ' + un.seconds;
  }
}