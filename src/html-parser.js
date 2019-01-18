import { createElement } from "./create-element";

function _createElement(result) {
  return createElement(
    result[1],
    parseAttribute(result[2]),
    result[4] === "" ? result[6] : result[4]
  );
}

function exec(regex, str) {
  return regex.exec(str.replace(/\s/g, ""));
}

function parseAttribute(attr) {
  let attrs = {};

  if (!attr) {
    return attrs;
  }

  const regex = /([a-zA-Z0-9-]+)=(["'])(.*?)\2/;
  let result = regex.exec(attr);

  while ((result = regex.exec(attr)) && result) {
    attrs[result[1]] = result[3];
    attr = attr.replace(regex, "");
  }

  return attrs;
}

function h(source, ele) {
  const regex = /<([a-zA-Z0-9]+)\s*(?:\s*([a-zA-Z0-9-]+=(["']).*\3))*>([^<>]*)(.*?)([^<>]*)<\/\1>(.*)/;
  let result = exec(regex, source);

  if (!result) {
    throw new Error("Please Make sure the HTML expression are correct!");
  }

  let inner = result[5];
  let currentEle = ele;

  if (result[7]) {
    throw new Error("The HTML expression can only have one root Element!");
  }

  if (!ele) {
    currentEle = _createElement(result);
  } else {
    currentEle.children.push(_createElement(result));
  }

  let innerResult;
  while ((innerResult = exec(regex, inner)) && (innerResult = innerResult[0])) {
    currentEle = h(innerResult, currentEle);
    inner = inner.replace(innerResult, "");
  }

  return currentEle;
}

export const html = html => h(html[0]);
