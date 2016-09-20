import render from 'preact-render-to-string/jsx';

/** Options for all assertions.
 *	@property {function} isJsx					A test to see if the given parameter is a JSX VNode. Defaults to checking for the existence of an __isVNode property
 */
export const options = {
	/* If `false`, props with function values will be omitted from the comparison entirely */
	functions: true,
	/* If `false`, ignores function names and bound state, asserting only that the compared attributes are functions */
	functionNames: true
};

// options to pass to renderToString() when doing a deep comparison
const RENDER_OPTS = {
	sortAttributes: true
};

// options to pass to renderToString() when doing a shallow comparison
const SHALLOW_OPTS = {
	...RENDER_OPTS,
	shallow: true
};

// for shallow comparisons, the "expected" value should NOT have high order components resolved at the root
const SHALLOW_OPTS_EXPECTED = {
	...SHALLOW_OPTS,
	renderRootComponent: false
};

// for "includes" and "contains", pretty-print the diff but not the version that gets compared
const INCLUDE_RENDER_OPTS = {
	...RENDER_OPTS,
	pretty: false
};

// create an assertion template string for the given action
let msg = act => `expected #{act} to ${act} #{exp}`;

// assert that an object is JSX (or more correctly, a VNode)
let isJsx = obj => obj && (options.isJsx ? options.isJsx(obj) : (obj.__isVNode || isVNode(obj)));

// does it look like a vnode?
let isVNode = obj => obj.hasOwnProperty('nodeName') && obj.hasOwnProperty('attributes') && obj.hasOwnProperty('children') && obj.constructor.name==='VNode';

// inject default options and invoke render with no context
let doRender = (jsx, opts) => render(jsx, null, {
	functions: options.functions,
	functionNames: options.functionNames,
	...opts
});

// inject a chai assertion if the values being tested are JSX VNodes
let ifJsx = (fn, opts, optsExpected, displayOpts) => next => function(jsx, ...args) {
	if (!isJsx(this._obj)) return next.call(this, jsx, ...args);
	let actual = doRender(this._obj, opts).trim();
	let expected = doRender(jsx, optsExpected || opts).trim();
	let diffActual = displayOpts ? doRender(this._obj, displayOpts).trim() : actual;
	let diffExpected = displayOpts ? doRender(jsx, displayOpts).trim() : expected;
	return fn(this, { expected, actual, diffActual, diffExpected, jsx });
};

// create a passthrough function
let through = next => function(...args) { return next.call(this, ...args); };

// assert that a String is equal to the given string
let equal = (a, { expected, actual, diffExpected, diffActual }) => a.assert(actual===expected, msg('equal'), msg('not equal'), diffExpected, diffActual, true);

// assert that a String contains the given string
let include = (a, { expected, actual, diffExpected, diffActual }) => a.assert(~actual.indexOf(expected), msg('include'), msg('not include'), diffExpected, diffActual, true);


/** Middleware: pass to `chai.use()` to add JSX assertion support. */
export default function assertJsx({ Assertion }) {
	if (Assertion.__assertJsxMounted===true) return;
	Assertion.__assertJsxMounted = true;

	Assertion.overwriteMethod('eql', ifJsx(equal, RENDER_OPTS));
	Assertion.overwriteMethod('eqls', ifJsx(equal, RENDER_OPTS));

	Assertion.overwriteMethod('equal', ifJsx(equal, SHALLOW_OPTS, SHALLOW_OPTS_EXPECTED));
	Assertion.overwriteMethod('equals', ifJsx(equal, SHALLOW_OPTS, SHALLOW_OPTS_EXPECTED));

	['include', 'includes', 'contain', 'contains'].forEach( method => {
		Assertion.overwriteChainableMethod(method, ifJsx(include, INCLUDE_RENDER_OPTS, INCLUDE_RENDER_OPTS, RENDER_OPTS), through);
	});
}

assertJsx.options = options;

// auto-mount if possible
if (typeof chai!=='undefined' && chai.use) chai.use(assertJsx);
