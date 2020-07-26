export const develop = (type: string, classNames: string, content: Array<HTMLElement|string|number>|HTMLElement|string|number = [], attr: Record<string, string> = {}): HTMLElement => {
	const elem = document.createElement(type);
	classNames.split(' ').filter(className => className !== '').forEach(className => elem.classList.add(className));

	const addChild = (child): void => {
		if (Array.isArray(child)){
			child.forEach(c => {
				addChild(c);
			});
		}else if (typeof child === 'string'){
			elem.innerText = child;
		}else if (typeof child === 'number'){
			elem.innerText = child.toString();
		}else{
			elem.appendChild(child);
		}
	}

	addChild(content);

	Object.keys(attr).forEach(key => elem.setAttribute(key, attr[key]));

	return elem;
};

export const formElement = (type: string, name: string, classNames: string, label= '', autocomplete = '', placeholder = ''): HTMLElement => {
	const input = develop('input', classNames, [], {type, name, placeholder, autocomplete});
	return develop('label', '', [label, input], {for: name});
}

export const initObjectIterators = (): void => {

	Object.defineProperty(Object.prototype, 'mapKeys',{
		value: (callback): Array<unknown> => Object.keys(this).map(callback),
		writable: true,
		configurable: true,
		enumerable: false
	});

	Object.defineProperty(Object.prototype, 'mapEntries',{
		value: (callback): Array<unknown> => Object.entries(this).map(callback),
		writable: true,
		configurable: true,
		enumerable: false
	});

	Object.defineProperty(Object.prototype, 'mapValues', {
		value: (callback): Array<unknown> => Object.values(this).map(callback),
		writable: true,
		configurable: true,
		enumerable: false
	});

	Object.defineProperty(Object.prototype, 'feValue', {
		value: (callback): void => Object.values(this).forEach(callback),
		writable: true,
		configurable: true,
		enumerable: false
	});

	Object.defineProperty(Object.prototype, 'feKey', {
		value: (callback): void => Object.keys(this).forEach(callback),
		writable: true,
		configurable: true,
		enumerable: false
	});

	Object.defineProperty(Object.prototype, 'feEntry', {
		value: (callback): void => Object.entries(this).forEach(callback),
		writable: true,
		configurable: true,
		enumerable: false
	});
}

export default {
	develop,
	initObjectIterators,
	formElement
};
