export const develop = (type: string, className: string, content: Array<HTMLElement>|HTMLElement|string|number = [], attr: Record<string, string> = {}): HTMLElement => {
	const elem = document.createElement(type);
	elem.classList.add(className);

	if (Array.isArray(content)){
		content.forEach(c => elem.appendChild(c));
	}else if (typeof content === 'string'){
		elem.innerText = content;
	}else if (typeof content === 'number'){
		elem.innerText = content.toString();
	}else{
		elem.appendChild(content);
	}

	Object.keys(attr).forEach(key => elem.setAttribute(key, attr[key]));

	return elem;
};

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
	initObjectIterators
};
