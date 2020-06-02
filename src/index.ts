import { Controller } from './controller';

const genLimit = 0;
const probability = 20;

var ctrl: Controller;

Controller.create(genLimit, 0, probability).then(obj => {
    ctrl = obj;
    ctrl.init();
});