

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

app.listen(port, () => {
    console.log('Server is running on http://localhost:', port)
})