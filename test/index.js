import { default as assertJsx, options } from '../src';
import { h } from 'preact';
import { expect, default as chai } from 'chai';
chai.use(assertJsx);
/**@jsx h */

/*eslint-env mocha */
/*eslint max-nested-callbacks:0*/

describe('preact-jsx-chai', () => {
	describe('assertJsx()', () => {
		it('should be a function', () => {
			expect(assertJsx).to.be.a('function');
		});

		it('should be a function', () => {
			expect(assertJsx).to.be.a('function');
		});

		describe('sanity', () => {
			it('be triggered when JSX is tested', () => {
				expect(<jsx />).to.deep.equal(<jsx />);
			});

			it('not be triggered when JSX is not tested', () => {
				expect(<jsx />).to.deep.equal({
					nodeName: 'jsx',
					attributes: undefined,
					children: undefined
				});
			});
		});
	});

	describe('options', () => {
		it('should be an object', () => {
			expect(options).to.be.an('object');
		});

		xit('should support isJsx()', () => {
			// @TODO
		});
	});
});
