const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

const isPropertyFunction = (callee) => {
  return callee.object.type === 'FunctionExpression'
    && callee.property.name === 'property';
};

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const options = getOptions();

  return j(file.source)
    .find(j.ObjectProperty)
    .filter(path =>
      path.node.value.type === 'CallExpression'
      && isPropertyFunction(path.node.value.callee)
    )
    .forEach(path => {
      let { value } = path.node;

      let dependentKeys = value.arguments;
      let computedFunction = value.callee.object;

      path.node.value = j.callExpression(
        j.memberExpression(
          j.identifier('Ember'),
          j.identifier('computed')
        ),
        [...dependentKeys, computedFunction]
      );
    })
    .toSource();
};
