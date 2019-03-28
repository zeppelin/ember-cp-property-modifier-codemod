const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

const {
  isCP,
  isCPPropertyModifier,
  getCPProperties,
  createCP
} = require('./utils');

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const options = getOptions();

  return j(file.source)
    .find(j.ObjectProperty)
    .filter(({ node }) => isCP(node))
    .forEach(path => {
      let objectProperty = path.node;
      let callee = objectProperty.value.callee;

      let { dependentKeys, computedFunction } = getCPProperties(objectProperty);
      let cp = createCP(j, dependentKeys, computedFunction);

      // The simple case: `function() {}.property()`
      if (isCPPropertyModifier(callee)) {
        objectProperty.value = cp;
        return;
      }

      // The nasty cases: `function() {}.property().meta({ a: 1 }).readOnly()`
      let c = callee;
      while (c.object.callee) {
        callee = c;
        c = c.object.callee;
      }

      callee.object = cp;
    })
    .toSource();
};
