interface Options {
	functions: boolean;
	functionNames: boolean;
	isJsx?: (obj: any) => boolean;
}

declare const assertJsx: {
	({ Assertion: any }): void;
	options: Partial<Options>;
};

/** Options for all assertions.
 *	@property {function} isJsx					A test to see if the given parameter is a JSX VNode. Defaults to checking for the existence of an __isVNode property
 */
export declare const options: Options;

/** Middleware: pass to `chai.use()` to add JSX assertion support. */
export default assertJsx;
