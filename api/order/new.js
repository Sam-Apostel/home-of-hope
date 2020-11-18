const toCurrency = amount => ({ currency: 'EUR', value: amount.toFixed(2)});

const transformLine = ({ price, quantity, name }) => ({
	type: 'physical',
	name,
	quantity: quantity,
	unitPrice: toCurrency(price),
	totalAmount: toCurrency(price * quantity),
	vatRate: '0.00',
	vatAmount: toCurrency(0)
});

const transformShipping = shipping => ({
	type: 'shipping_fee',
	name: 'shipping and transaction fees',
	quantity: 1,
	unitPrice: toCurrency(shipping),
	totalAmount: toCurrency(shipping),
	vatRate: '0.00',
	vatAmount: toCurrency(0)
});

const transformAddress = ({name, email, street, postal, city, country}) => ({
	givenName: name.first,
	familyName: name.last,
	email: email,
	streetAndNumber: street,
	postalCode: postal,
	city: city,
	country: country
});

const makeBody = ({ amount, orderNumber, lines, billingAddress, email, comments }) => {
	const expires = new Date();
	expires.setDate(expires.getDate() + 7); // expires in a week (7 days), minimum is 1 maximum is 101
	return {
		amount,
		orderNumber,
		lines,
		billingAddress,
		redirectUrl: `https://${process.env.VERCEL_URL}/shop?redirect=payment`,
		locale: 'nl_BE',
		expiresAt: expires.toLocaleDateString('en-CA'),
		metadata: { email , comments }
	}
};

module.exports = async ({body}, res) => {
	const url = 'https://api.mollie.com/v2/orders';
	const api_key = process.env.mollie;
	await res.send(body);
	const { order, address, shipping, comments } = body;

	const total = (shipping || 0) + order.reduce((tot, { price, quantity}) => (tot + (price * quantity)),{});
	const amount = toCurrency(total);
	const lines = order.map(transformLine);
	if (shipping) lines.append(transformShipping(shipping));
	const billingAddress = transformAddress(address);
	const orderNumber = Math.floor(Math.random() * 10000000); // TODO: create a better incremental id
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${api_key}`
		},
		body: JSON.stringify(makeBody({ amount, orderNumber, lines, billingAddress, email: address.email, comments }))
	};
	const answer = await fetch(url, options);
	await res.json(answer.json());
};
