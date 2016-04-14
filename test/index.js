import { default as assertJsx, options } from '../src';
import { h, Component } from 'preact';
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

		describe('components', () => {
			it('should compare single-level components', () => {
				class EmptyButton extends Component {
					render(props) { return <button {...props} />; }
				}
				expect(<EmptyButton />).to.eql(<button />);
				expect(<EmptyButton foo="bar" />).to.eql(<button foo="bar" />);
			});

			it('should compare components with children', () => {
				class Button extends Component {
					render(props) { return <button {...props}>{props.children}</button>; }
				}
				expect(<Button />).to.eql(<button />);
				expect(<Button foo="bar" />).to.eql(<button foo="bar" />);
				expect(<Button>text</Button>).to.eql(<button>text</button>);
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

	describe('shallow', () => {
		it('should render shallow for .equal()', () => {
			// example component that, if rendered, would never be equal
			let counter = 0;
			const Outer = () => <Inner b="b" />;
			const Inner = ({ b }) => <span b1={b}>{++counter}</span>;
			expect(<Outer a />).to.equal(<Inner b="b" />);
		});

		it('should render deeply for .eql() / .deep.equal()', () => {
			// example component that, if rendered, would never be equal
			let counter = 0;
			const Outer = () => <Inner b="b" />;
			const Inner = ({ b }) => <span b1={b}>{++counter}</span>;
			expect(<Outer />).to.eql(<span b1="b">1</span>);
			expect(<Outer a />).not.to.eql(<Outer b />);
		});
	});
});
