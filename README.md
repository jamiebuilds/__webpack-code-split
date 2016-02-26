Problem:

Trying to have multiple entries, one primary "main" entry and then many "module"
dependencies.

This part is easy, using `globby` it looks like this:

```js
var modules = globby.sync('./src/modules/*/index.js');

var entries = {
  main: './src/entry.js'
};

modules.forEach(function(filePath) {
  var name = path.basename(path.dirname(filePath));
  entries[name] = filePath;
});

module.exports = {
  entry: entries, // { main: './src/entry.js', a: './src/modules/a/index.js', ... }
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js'
  }
};
```

However, this means dependencies that are pulled in by separate bundles will
exist in each bundle. Instead it should be pulled into the primary "main"
bundle.

```yaml
main:
  - entry.js
a:
  - modules/a/index.js
  - modules/a/another.js
  - common/1.js
b:
  - modules/b/index.js
  - modules/b/another.js
  - common/1.js
c:
  - modules/c/index.js
  - modules/c/another.js
  - common/2.js
```

It's fairly simple using the `CommonsChunkPlugin` to get this tree:

```yaml
main:
  - entry.js
common:
  - common/1.js
a:
  - modules/a/index.js
  - modules/a/another.js
b:
  - modules/b/index.js
  - modules/b/another.js
c:
  - modules/c/index.js
  - modules/c/another.js
  - common/2.js
```

However, the desire is to make "main" and "common" the same thing:

```yaml
main:
  - entry.js
  - common/1.js
a:
  - modules/a/index.js
  - modules/a/another.js
b:
  - modules/b/index.js
  - modules/b/another.js
c:
  - modules/c/index.js
  - modules/c/another.js
  - common/2.js
```
