import render from 'preact-render-to-string';

/*global chai*/

/** Options for all assertions.
 *	@property {function} isJsx A test to see if the given parameter is a JSX VNode. Defaults to checking for the existence of an __isVNode property
 */
export const options = {};

// options to pass to renderToString() when doing a deep comparison
const RENDER_OPTS = {
	sortAttributes: true
};

// options to pass to renderToString() when doing a shallow comparison
const SHALLOW_OPTS = {
	sortAttributes: true,
	shallow: true
};

// for shallow comparisons, the "expected" value should NOT have high order components resolved at the root
const SHALLOW_OPTS_EXPECTED = {
	sortAttributes: true,
	shallow: true,
	renderRootComponent: false
};

// create an assertion template string for the given action
let msg = act => `expected #{act} to ${act} #{exp}`;

// assert that an object is JSX (or more correctly, a VNode)
let isJsx = obj => obj && (options.isJsx ? options.isJsx(obj) : (obj.__isVNode || isVNode(obj)));

// does it look like a vnode?
let isVNode = obj => obj.hasOwnProperty('nodeName') && obj.hasOwnProperty('attributes') && obj.hasOwnProperty('children') && obj.constructor.name==='VNode';

// inject a chai assertion if the values being tested are JSX VNodes
let ifJsx = (fn, opts, optsExpected) => next => function(jsx, ...args) {
	if (!isJsx(this._obj)) return next.call(this, jsx, ...args);
	let actual = render(this._obj, null, opts).trim();
	let expected = render(jsx, null, optsExpected || opts).trim();
	return fn(this, { expected, actual, jsx });
};

// create a passthrough function
let through = next => function(...args) { return next.call(this, ...args); };

// assert that a String is equal to the given string
let equal = (a, { expected, actual }) => a.assert(actual===expected, msg('equal'), msg('not equal'), expected, actual, true);

// assert that a String contains the given string
let include = (a, { expected, actual }) => a.assert(~actual.indexOf(expected), msg('include'), msg('not include'), expected, actual, true);


/** Middleware: pass to `chai.use()` to add JSX assertion support. */
export default function assertJsx({ Assertion }) {
	if (Assertion.__assertJsxMounted===true) return;
	Assertion.__assertJsxMounted = true;

	Assertion.overwriteMethod('eql', ifJsx(equal, RENDER_OPTS));
	Assertion.overwriteMethod('eqls', ifJsx(equal, RENDER_OPTS));

	Assertion.overwriteMethod('equal', ifJsx(equal, SHALLOW_OPTS, SHALLOW_OPTS_EXPECTED));
	Assertion.overwriteMethod('equals', ifJsx(equal, SHALLOW_OPTS, SHALLOW_OPTS_EXPECTED));


	['include', 'includes', 'contain', 'contains'].forEach( method => {
		Assertion.overwriteChainableMethod(method, ifJsx(include), through);
	});
}


// auto-mount if possible
if (typeof chai!=='undefined' && chai.use) chai.use(assertJsx);
