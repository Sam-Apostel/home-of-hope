export const develop = (type: string, classNames: string, content: Array<HTMLElement|string|number|Array<HTMLElement|string|number>>|HTMLElement|string|number|Node|Node[] = [], attr: Record<string, string> = {}): HTMLElement => {
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

const selectElement = (name: string, classNames: string, extraAttr: Record<string, string|Array<HTMLOptionElement>>, changedCallBack: (string) => void): HTMLLabelElement => {
	const po = (o): Record<string, string> => Object.entries(o).reduce((a,[k,v]) => {if(v) a[k] = v; return a}, {});
	const pa = (a): Array<HTMLElement|string|number> => a.filter( a => a ?? false);
	const {label, autocomplete, placeholder, options, value} = extraAttr;
	const select = develop('select', '', [], po({name, placeholder, autocomplete})) as HTMLSelectElement;
	(options as Array<HTMLOptionElement>).forEach(option => {
		select.add(option);
		if (option.value === value){
			select.value = value;
		}
	});
	select.addEventListener('change', ()=>{
		changedCallBack((select as HTMLSelectElement).value);
	});
	return develop('label', classNames, pa([label, select])) as HTMLLabelElement;
}

export const formElement = (type: string, name: string, classNames: string, extraAttr: Record<string, string|Array<HTMLOptionElement>>, changedCallBack: (string) => void): HTMLLabelElement => {
	if( type === 'select' ) return selectElement(name, classNames, extraAttr, changedCallBack);
	const po = (o): Record<string, string> => Object.entries(o).reduce((a,[k,v]) => {if(v) a[k] = v; return a}, {});
	const pa = (a): Array<HTMLElement|string|number> => a.filter( a => a ?? false);
	const {label, autocomplete, placeholder, value} = extraAttr;

	const input = develop('input', '', [], po({type, name, placeholder, autocomplete, value}));
	input.addEventListener('change', ()=>{
		changedCallBack((input as HTMLInputElement).value);
	});

	return develop('label', classNames, pa([label, input]), {['for']: name}) as HTMLLabelElement;
}

export const imageElement = (classNames: string, src: string, alt: string, sizes: Array<string>, formats: Array<string>): HTMLPictureElement => {
	const sources = formats.map(format =>
		develop('srcset', '', [], {srcset: sizes.reduce((acc, size) => acc + `https://tigrr.b-cdn.net/images/${size}/${format}/${src}.${format} ${size}w `, ''), type:  `image/${format}`})
	);
	const img = develop('img', classNames,[], {src: `https://tigrr.b-cdn.net/images/${sizes[0]}/${formats[1%formats.length]}/${src}.${formats[1%formats.length]}`, alt});
	return develop('picture', '', [sources, img]);
};

export const FEValue = (formElement: HTMLLabelElement): string => {
	return ([...formElement.childNodes][1] as HTMLInputElement).value
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

export const asCurrency = (number: number, canBeFree = false): string => {
	const big = `${Math.ceil(number * 100 )}`;
	if(big === '0'){ return canBeFree? 'gratis' : '€0.00' }
	if(big.length === 1){ return `€0.0${big}`}
	if(big.length === 2){ return `€0.${big}`}
	return '€' + big.slice(0,big.length-2) + '.' + big.slice(big.length-2);
};
