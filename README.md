# CSS to Radium

A CLI utility to convert the contents of a CSS file to a Radium-compatible JS object.

## Installation

```
$ npm install css-to-radium
```

## Usage

```
$ css-to-radium style.css style.js
```

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
