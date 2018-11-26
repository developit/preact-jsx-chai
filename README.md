# preact-jsx-chai

[![Greenkeeper badge](https://badges.greenkeeper.io/developit/preact-jsx-chai.svg)](https://greenkeeper.io/)

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

### Assertions

Deep, fully rendered equality/inclusion is checked for: `.deep.equal`, `.eql`, `.include`, and `.contain`

Shallow, JSX only equality/inclusion is checked for: `.equal`, `.shallow.include`, and `.shallow.contain`

```js
let Outer = ({a}) => <Inner a={a}/>
let Innter = ({a}) => <div>{a}</div>

// JSX tests
expect(<Outer />).to.be.jsx
expect('Outer').to.not.be.jsx

// Deep equality tests
expect(<Outer a="foo"/>).to.deep.equal(<Inner a="foo" notRenderedProp="x" />)
expect(<Outer a="foo"/>).to.deep.equal(<div>foo</div>/>)
expect(<Outer a="foo"/>).to.not.deep.equal(<Inner a="NotBar"/>)
expect(<Outer />).to.eql(<Outer />) // .eql is shorthand for .deep.equal
expect(<Outer a="foo"/>).to.not.eql(<Inner a="NotFoo"/>)

// Shallow Equality tests
expect(<Outer a="foo"/>).to.equal(<Inner a="foo" />)
expect(<Outer a="foo"/>).to.not.equal(<Inner a="foo" verifiedJSXProp="x" />)
expect(<Outer a="foo"/>).to.not.equal(<div>foo</div>) // <Inner /> is not rendered

let WrappedOuter = ({a}) => <div id="outer"><Inner a={a} /></div>

// Deep includes/contains tests
expect(<WrappedOuter a="foo" />).to.include(<div>foo</div>)
expect(<WrappedOuter a="foo" />).to.contain(<div>foo</div>)
expect(<WrappedOuter a="foo" />).to.contain(<Inner a="foo" />)
expect(<WrappedOuter a="foo" />).to.not.include(<div>Bad Div</div>)

// Shallow includes/contains tests
expect(<WrappedOuter a="foo" />).to.shallow.contain(<Inner a="foo" />)
expect(<WrappedOuter a="foo" />).to.not.shallow.include(<div>foo</div>)
```

---


### License

[MIT]


[Preact]: https://github.com/developit/preact
[jsx-chai]: https://github.com/bkonkle/jsx-chai
[MIT]: http://choosealicense.com/licenses/mit/
