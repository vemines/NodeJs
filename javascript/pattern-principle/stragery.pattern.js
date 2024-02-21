function promotionPrice(originalPrice) {
    return originalPrice <= 200 ? originalPrice * 0.9 : originalPrice - 30;
}

function preorderPrice(originalPrice) {
    return originalPrice * 0.5;
}

function blackFridayPrice(originalPrice) {
    return originalPrice * 0.1;
}

function promotion01012024(originalPrice) {
    return originalPrice * 0.8;
}

function defaultPrice(originalPrice) {
    return originalPrice;
}


const getPriceStrategies = {
    preorderPrice,
    promotionPrice,
    blackFridayPrice,
    promotion01012024,
    default: defaultPrice,
}

function getPrice(originalPrice, typePromotion) {
    return getPriceStrategies[typePromotion](originalPrice);
}

console.log('-->>>', getPrice(200, "preorderPrice"))


