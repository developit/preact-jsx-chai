# preact-jsx-chai

[![NPM](http://img.shields.io/npm/v/preact-jsx-chai.svg)](https://www.npmjs.com/package/preact-jsx-chai)
[![travis-ci](https://travis-ci.org/developit/preact-jsx-chai.svg)](https://travis-ci.org/developit/preact-jsx-chai)

Extend Chai with support for asserting JSX equality & contents with support for [Preact] Components.

(Heavily) inspired by [jsx-chai].


---


### Usage

```js
import { h } from 'preact'; /** @jsx h */

import chai, { expect } from 'chai';
import assertJsx from 'preact-jsx-chai';
chai.use(assertJsx);

// check if two JSX DOMs are deeply equal:
expect(
	<div id="1">a</div>
).to.deep.equal(
	<div id="1">a</div>
);

// check if a given JSX DOM contains the given fragment:
expect(
	<div> <span>foo!</span> </div>
).to.contain(
	<span>foo!</span>
);
```

> **Note:** in environments like Karma where chai is available as a global, `preact-jsx-chai` will automatically register itself on import. Don't worry, though, this plugin is smart enough to avoid registering itself multiple times.


---


### Options

There are a few global options available to customize how `preact-jsx-chai` asserts over VNodes.


| Name            | Type     | Default | Description
|-----------------|----------|---------|-------------
| `isJsx`         | Function | _auto_  | Override the detection of values as being JSX VNodes.
| `functions`     | Boolean  | _true_  | If `false`, props with function values will be omitted from the comparison entirely
| `functionNames` | Boolean  | _true_  | If `false`, ignores function names and bound state, asserting only that the compared props are functions


##### To set these options:

```js
import { options } from 'preact-jsx-chai';
options.functions = false;

// or:

import jsxChai from 'preact-jsx-chai';
jsxChai.options.functions = false;
```


---


### Testing Preact Components

Assertions are supported for both functional and classical components.

Typically, JSX assertions follow a pattern where the component to be tested is passed to `expect()` with any props necessary, and the expected DOM state is passed to `.eql()` (or its alias `.deep.equal()`):

```js
// Supports both functional and classical components
const Link = ({ url, text }) => (
	<a class="link" href={'/'+href}>Link: { text }</a>
);

expect(
	<Link url="?foo" text="foo" />
).to.eql(
	<a href="/?foo">Link: foo</a>
);
```


---


### License

[MIT]


[Preact]: https://github.com/developit/preact
[jsx-chai]: https://github.com/bkonkle/jsx-chai
[MIT]: http://choosealicense.com/licenses/mit/
