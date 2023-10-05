export function safeInput<C>(component: C, attr: keyof C) {
  let value = component[attr];
  if (isString(value)) {
    try {
      component[attr] = JSON.parse(value);
    } catch (e) {
      console.error("Failed to parse input", e)
    }
  }
}

function isString(s: any) : s is string {
  return typeof s === 'string';
}
