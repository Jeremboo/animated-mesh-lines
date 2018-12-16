import getRandomInt from './getRandomInt';

export default arr => arr[getRandomInt(0, arr.length - 1)];