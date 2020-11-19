module.exports = async ({query}, res) => {
	const {orderId} = query;
	const url = `https://api.mollie.com/v2/orders/${orderId}`;
	const api_key = process.env.mollie;
	const options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${api_key}`
		}
	};
	const answer = await fetch(url, options);
	await res.json(answer.json());
};
