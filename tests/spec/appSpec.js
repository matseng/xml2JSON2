/* global describe, it */

(function () {
    'use strict';

    describe('hello world', function () {
        describe('maybe a bit more context here in the future', function () {
            it('should return "hello world"', function () {
            	expect(helloWorld()).to.equal('hello world 3');
            });
        });
    });



})();
