# preact-jsx-chai

[![NPM](http://img.shields.io/npm/v/preact-jsx-chai.svg)](https://www.npmjs.com/package/preact-jsx-chai)
[![travis-ci](https://travis-ci.org/developit/preact-jsx-chai.svg)](https://travis-ci.org/developit/preact-jsx-chai)

Extend Chai with support for asserting JSX equality & contents with support for [Preact] Components.

(Heavily) inspired by [jsx-chai].


---


### Usage

```js
import { h } from 'preact'; /** @jsx h */

import chai from 'chai';
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


### Testing Components

```js
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
