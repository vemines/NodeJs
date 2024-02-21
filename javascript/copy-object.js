const obj = {
    name: 'VeMines',
    hobby: {
        game: 'LOL'
    },
    age: undefined,
    abc: NaN
}
// const copyObj = obj; // shallow copy, affect obj when change copyObj
// const copyObj = {...obj}; //shallow copy, not apply for inside object (hobby)
// const copyObj = JSON.parse(JSON.stringify(obj)); // shallow copy, affect if contains undefined (null), NaN (remove field)

const copyObj = structuredClone(obj); // DeepClone
obj.name = 'Parson';
obj.hobby.game = 'Offline';
console.log('copyObj::', copyObj);
console.log('obj:: ', obj);