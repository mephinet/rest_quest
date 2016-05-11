import "babel-polyfill";

import test_movement from './tests/test_movement';
import test_qm from './tests/test_qm';

console.info('Testing movement reducer...');
test_movement();

console.info('Testing qm reducer...');
test_qm();

console.log('Tests passed!');
