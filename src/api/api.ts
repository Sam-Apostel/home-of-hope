import endpoints from './endpoints';
//import log from '../utils/logger';

const endpointToApiCall = (api, [name, endpoint] ) => {
	api[name] = (postData = {}, then = (res) => {if(!res) throw res}, fallback, urlData = {}) => {
		if(!fallback) fallback = console.log;
		const url = Object.entries(urlData).reduce( (url, [name, value]) => url.replace(`{${name}}`, value), endpoint);
		fetch(url, {
			method: 'POST',
			headers: {
				Accept: 'application/json'
			},
			body: JSON.stringify(postData)
		})
			.then(res=>res.json())
			.then(then)
			.catch(fallback)
	}
	return api;
};

export default Object.entries(endpoints).reduce( endpointToApiCall, {});
