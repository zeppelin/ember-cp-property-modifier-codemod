const isCP = (objectProperty) => {
  if (objectProperty.value.type !== 'CallExpression') {
    return false;
  }

  let { callee } = objectProperty.value;

  if (callee.object.type === 'CallExpression') {
    while (callee.object.callee) {
      callee = callee.object.callee;
    }
  }

  return isCPPropertyModifier(callee);
};

const isCPPropertyModifier = (callee) => {
  return callee.object.type === 'FunctionExpression'
    && callee.property.name === 'property';
};

const getCPProperties = (objectProperty) => {
  let callee = objectProperty.value.callee;

  if (isCPPropertyModifier(callee)) {
    return {
      dependentKeys: objectProperty.value.arguments,
      computedFunction: callee.object
    }
  } else {
    // let object = callee.object;
    let object;

    while (callee.object.callee) {
      object = callee.object;
      callee = callee.object.callee;
    }

    return {
      dependentKeys: object.arguments,
      computedFunction: object.callee.object
    };
  }
};

const createCP = (j, dependentKeys, computedFunction) => {
  return j.callExpression(
    j.memberExpression(
      j.identifier('Ember'),
      j.identifier('computed')
    ),
    [...dependentKeys, computedFunction]
  );
};

module.exports = {
  isCP,
  isCPPropertyModifier,
  getCPProperties,
  createCP
};
