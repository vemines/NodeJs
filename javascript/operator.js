// const a = {
//     b: {
//         c: {
//             d: 40,
//         }
//     }
// }
// const value = a?.b?.c?.d     // a && a.b && a.b.c && a.b.c.d 
// console.log(value);

let a = null, b = undefined, c = '', d = 0, e = false

var valueA = a || 'default'   // default
var valueB = b || 'default'   // default
var valueC = c || 'default'   // default
var valueD = d || 'default'   // default
var valueE = e || 'default'   // default

// console.log({valueA, valueB, valueC, valueD, valueE});

var valueA = a ?? 'default'   // default
var valueB = b ?? 'default'   // default
var valueC = c ?? 'default'   // ''
var valueD = d ?? 'default'   // 0
var valueE = e ?? 'default'   // e

// console.log({valueA, valueB, valueC, valueD, valueE});

a ??= 'default'
b ??= 'default'
c ??= 'default'
d ??= 'default'
e ??= 'default'

console.log({ a, b, c, d, e });
