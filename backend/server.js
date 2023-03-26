const express = require('express')
const cors = require('cors')

const app = express()
const port = 3002
app.use(express.json())
app.use(cors())

app.get('/all', async (req, res) => {
	try {
		await fetch(`https://api.warframe.market/v1/items/ash_prime_set/orders`, {
			method: 'GET',
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
		})
			.then((response) => response.json())
			.then((data) => res.status(200).json(data.payload.orders))
			.then(console.log(`GET nekros orders`))
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

app.get('/:item', async (req, res) => {
	let itemDat
	try {
		await fetch(`https://api.warframe.market/v1/items/${req.params.item}`, {
			method: 'GET',
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
		})
			.then((res) => res.json())
			.then((data) =>
				data.payload.item.items_in_set.filter((item) => {
					return item.url_name === req.params.item
				})
			)
			.then((data) => res.status(200).json(data[0].en.item_name))
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

app.get('/:item/orders/sell', async (req, res) => {
	try {
		await fetch(
			`https://api.warframe.market/v1/items/${req.params.item}/orders`,
			{
				method: 'GET',
				headers: {
					'Access-Control-Allow-Origin': '*',
				},
			}
		)
			.then((res) => res.json())
			.then((data) =>
				data.payload.orders.filter((order) => {
					return order.user.status === 'ingame'
				})
			)
      .then((data) => res.status(200).json(data))
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

app.listen(port, () => {
	console.log(`\x1b[33mServer running on port ${port}.\x1b[39m`)
})
