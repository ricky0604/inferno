import { isNullOrUndefined } from './utils';
import { createUniversalElement } from './universal';

function InfernoVNode(tpl) {
	this.tpl = tpl;
	this.dom = null;
	this.instance = null;
	this.tag = null;
	this.children = null;
	this.style = null;
	this.className = null;
	this.attrs = null;
	this.events = null;
	this.hooks = null;
	this.key = null;
}

export default function createTemplate(shape, childrenType) {
	const tag = shape.tag || null;
	const tagIsDynamic = tag && tag.arg !== undefined ? true : false;

	const children = !isNullOrUndefined(shape.children) ? shape.children : null;
	const childrenIsDynamic = children && children.arg !== undefined ? true : false;

	const attrs = shape.attrs || null;
	const attrsIsDynamic = attrs && attrs.arg !== undefined ? true : false;

	const hooks = shape.hooks || null;
	const hooksIsDynamic = hooks && hooks.arg !== undefined ? true : false;

	const events = shape.events || null;
	const eventsIsDynamic = events && events.arg !== undefined ? true : false;

	const key = shape.key !== undefined ? shape.key : null;
	const keyIsDynamic = !isNullOrUndefined(key) && !isNullOrUndefined(key.arg);

	const style = shape.style || null;
	const styleIsDynamic = style && style.arg !== undefined ? true : false;

	const className = shape.className !== undefined ? shape.className : null;
	const classNameIsDynamic = className && className.arg !== undefined ? true : false;

	let dom = null;

	if (typeof tag === 'string') {
		const newAttrs = Object.assign({}, className ? { className: className } : {}, shape.attrs || {});
		dom = createUniversalElement(tag, newAttrs);
	}

	const tpl = {
		dom: dom,
		pools: {
			keyed: {},
			nonKeyed: []
		},
		tag: !tagIsDynamic ? tag : null,
		isComponent: tagIsDynamic,
		hasAttrs: attrsIsDynamic,
		hasHooks: hooksIsDynamic,
		hasEvents: eventsIsDynamic,
		hasStyle: styleIsDynamic,
		hasClassName: classNameIsDynamic,
		childrenType: childrenType === undefined ? (children ? 5 : 0) : childrenType
	};

	return function () {
		const vNode = new InfernoVNode(tpl);

		if (tagIsDynamic === true) {
			vNode.tag = arguments[tag.arg];
		}
		if (childrenIsDynamic === true) {
			vNode.children = arguments[children.arg];
		}
		if (attrsIsDynamic === true) {
			vNode.attrs = arguments[attrs.arg];
		}
		if (hooksIsDynamic === true) {
			vNode.hooks = arguments[hooks.arg];
		}
		if (eventsIsDynamic === true) {
			vNode.events = arguments[events.arg];
		}
		if (keyIsDynamic === true) {
			vNode.key = arguments[key.arg];
		}
		if (styleIsDynamic === true) {
			vNode.style = arguments[style.arg];
		}
		if (classNameIsDynamic === true) {
			vNode.className = arguments[className.arg];
		}

		return vNode;
	};
}