import { isUndef, Input, isInvalid, isNull, isArray, isStringOrNumber, VTextNode, VComponent, VElement, isVElement, isVComponent, VTemplate, isFalse } from '../shared';
import { isVTextNode, isVTemplate, createPlaceholder, createTextNode, appendChild, normaliseArray } from './shared';
import Lifecycle from './Lifecycle';

export function mount(input: Input, parentDomNode: HTMLElement | DocumentFragment, lifecycle: Lifecycle, instance: Object, namespace: string, isKeyed: boolean): HTMLElement | Text | Comment | DocumentFragment {
	if (isInvalid(input)) {
		return createPlaceholder(parentDomNode);
	} else if (isStringOrNumber(input)) {
		throw new Error(`Inferno Error: invalid mount input of "${ typeof input }". Ensure the String or Number is wrapped in a VElement, VComponent, VTemplate or Array.`);
	} else if (isVTextNode(input)) {
		debugger;
		return mountVTextNode(input, parentDomNode);
	} else if (isVComponent(input)) {
		return mountVComponent(input, parentDomNode, lifecycle, instance, namespace);
	} else if (isVElement(input)) {
		return mountVElement(input, parentDomNode, lifecycle, instance, namespace);
	} else if (isVTemplate(input)) {
		return mountVTemplate(input, parentDomNode, lifecycle, instance);
	} else if (isArray(input)) {
		let domNode: HTMLElement | DocumentFragment = parentDomNode;
		
		if (isNull(parentDomNode)) {
			domNode = document.createDocumentFragment();
		}
		if (isFalse(isKeyed)) {
			mountArray(normaliseArray(input, true), domNode, lifecycle, instance, namespace, false);
		} else {
			mountArray(input, domNode, lifecycle, instance, namespace, true);
		}
		return domNode;
	} else {
		throw new Error('Inferno Error: failed to "mount", invalid object was detected. Valid "mount" types are Array, Promise, Function, VTextNode, VElement, VComponent and VTemplate.');
	}
}

function mountVTextNode(vTextNode: VTextNode, parentDomNode: HTMLElement | DocumentFragment): any {
	const domTextNode = createTextNode(vTextNode._text);

	vTextNode._dom = domTextNode;
	if (parentDomNode) {
		appendChild(parentDomNode, domTextNode);
	}
	return domTextNode;
}

function mountVComponent(vComponent: VComponent, parentDomNode: HTMLElement | DocumentFragment, lifecycle, instance, namespace): any {
	// TODO
}

function mountVElement(vComponent: VElement, parentDomNode: HTMLElement | DocumentFragment, lifecycle, instance, namespace): any {
	// TODO
}

function mountVTemplate(vComponent: VTemplate, parentDomNode: HTMLElement | DocumentFragment, lifecycle, instance): any {
	// TODO
}

function mountArray(array: Array<Input>, domNode: HTMLElement | DocumentFragment, lifecycle, instance, namespace, isKeyed) {
	for (let i = 0; i < array.length; i++) {
		let arrayItem: Input = array[i];

		mount(arrayItem, domNode, lifecycle, instance, namespace, isKeyed);
	}
}