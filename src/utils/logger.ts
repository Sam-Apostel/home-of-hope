import api from '../api/api';

const error = (...args): void => {
	api.log(...args)
/*	const args = {...obj, ...[...form.keys()].reduce( ((obj, key) => obj[key] = form.get(key)), {})};

	const formData = new FormData();
	Object.entries(args).forEach( ([key, value]) => {
		formData.append(key, JSON.stringify(value));
	});
	fetch(endpoints.log, {
		method: 'POST',
		headers: {
			Accept: 'application/json'
		},
		body: formData
	}).catch();

 */
}

export default {
	error
}
