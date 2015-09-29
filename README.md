# CSS to Radium

A CLI utility to convert the contents of a CSS file to a Radium-compatible JS object.

## Installation

```
$ npm install css-to-radium
```

## Usage

By default, `css-to-radium` works with `stdin` and `stdout`:

```
$ css-to-radium < example/style.css > example/style.js
```

You can also target a source file directly with the `--input` flag and return a converted file by specifying the target path after any options:

```
$ css-to-radium --input style.css style.js
```

Or you can mix and match the two:

```
$ css-to-radium --input example/style.css > example/style.js
```

It turns a file like this:

```css
/* style.css */
.btn {
  background: #ccc;
  padding: 10px;
  font-size: 16px;
}

.btn-primary {
  background: orange;
  color: #fff;
}
```

into one like this:

```js
// style.js

module.exports = {
  ".btn": {
    background: "#ccc",
    padding: 10,
    fontSize: 16
  },
  ".btn-primary": {
    background: "orange",
    color: "white"
  }
}
```

## Options

### input

`--input [inputSrc]`

A source file to use as input. To process multiple files at once, include this
flag multiple times:

```
$ css-to-radium --input style.css --input more.css
```

### quote

`--quote [type]`

Type of quote used in generated JS. Defaults to `single`.

```
css-to-radium style.css style.js --quote double
```

### indentSize

`--indentSize [int]`

Number of space characters to use for indents in generated JS. If this flag is not included, defaults to a single tab character (`\t`).

```
css-to-radium style.css style.js --indentSize=2
```

## Webpack

Using Webpack? Check out [radium-loader](https://github.com/dminkovsky/radium-loader).
