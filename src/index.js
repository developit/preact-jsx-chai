import render from 'preact-render-to-string';

/*global chai*/

/** Options for all assertions.
 *	@property {function} isJsx A test to see if the given parameter is a JSX VNode. Defaults to checking for the existence of an __isVNode property
 */
export const options = {};

// create an assertion template string for the given action
let msg = act => `expected #{act} to ${act} #{exp}`;

// assert that an object is JSX (or more correctly, a VNode)
let isJsx = obj => obj && options.isJsx ? options.isJsx(obj) : obj.__isVNode;

// inject a chai assertion if the values being tested are JSX VNodes
let ifJsx = (fn, opts) => next => function(jsx, ...args) {
	if (!isJsx(this._obj)) return next.call(this, jsx, ...args);
	let expected = render(jsx, opts).trim();
	let actual = render(this._obj, opts).trim();
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

	Assertion.overwriteMethod('eql', ifJsx(equal));
	Assertion.overwriteMethod('eqls', ifJsx(equal));

	Assertion.overwriteMethod('equal', ifJsx(equal, { shallow:true }));
	Assertion.overwriteMethod('equals', ifJsx(equal, { shallow:true }));


	['include', 'includes', 'contain', 'contains'].forEach( method => {
		Assertion.overwriteChainableMethod(method, ifJsx(include), through);
	});
}


// auto-mount if possible
if (typeof chai!=='undefined' && chai.use) chai.use(assertJsx);
