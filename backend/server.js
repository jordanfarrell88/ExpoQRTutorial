

require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection could not be established
});


pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client:', err.stack)
    return
  }
  client.query('SELECT NOW()', (err, result) => {
    release()
    if (err) {
      console.error('Error executing query:', err.stack)
      return
    }
    console.log('Database connected successfully:', result.rows[0])
  })
})


// GET product details after QR Code scan
app.get('/products/:line_code', async (req, res) => {
    const { line_code } = req.params

    try {
        const result = await pool.query('SELECT * FROM products WHERE line_code = $1',[line_code])

        if(result.rows.length === 0) return res.status(404).json({
            message: "Product not found"
        })
        res.json(result.rows[0])
    } catch (error) {
        console.error('Database error:', error) // Add this line
        res.status(500).json({
            error: `Internal server error: ${error.message}`, // Show error.message instead
            details: error.stack // Optional: for debugging
        })
    }
})

// POST delivery into deliveries table after submitting delivery
app.post("/deliveries", async(req, res) => {
  const { user_id, supplier, subtotal, total, vat_amount, quantity} = req.body

  try {
    const result = await pool.query(
      `INSERT INTO deliveries (user_id, supplier, subtotal, total, vat_amount, quantity)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING deliv_id`,
      [user_id, supplier, subtotal, total, vat_amount, quantity]
    )

    res.status(201).json({ deliv_id: result.rows[0].deliv_id })
  } catch (error) {
    console.error("Failed to create delivery", error)

    res.status(500).json({ error: "Failed to create delivery"})
  }

}) 


// POST delivery items from delivery

app.post("/delivery_items", async (req, res) => {
  const { deliv_id, line_code, product_description, unit_price, quantity } = req.body

  try {
    const result = await pool.query(
      `INSERT INTO delivery_items (deliv_id, line_code, product_description, unit_price, quantity)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [deliv_id, line_code, product_description, unit_price, quantity]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error("Failed to add delivery item", error)

    res.status(500).json({error: "Failed to add item to delivery"})
  }
})

// GET recent deliveries and their items

app.get("/recent-deliveries/user/:user_id", async (res,res) => {

  const { user_id } = req.params

  try {
    const deliveriesResult = await pool.query(
      'SELECT TOP 20 * FROM deliveries WHERE user_id = $1 ORDER BY delivered_at DESC', [user_id]
    )
    const deliveries = deliveriesResult.rows

    for (let delivery of deliveries) {
      const itemsResult = await pool.query(
        'SELECT line_code, product_description, quantity, unit_price, supplier FROM delivery_items WHERE deliv_id = $1',
      [delivery.deliv_id]
      )
      delivery.items = itemsResult.rows
    }
  } catch (error) {
    console.error("Could not load deliveries", error)

    res.status(500).json({ error: "Could not load deliveries. Please try again later"})
  }
})

app.listen(port, () => {
    console.log('Server is running on http://localhost:', port)
})