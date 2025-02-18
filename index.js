const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/payment-success', async (req, res) => {
    const { gateway, payment_id, razorpay_order_id, razorpay_signature } = req.query;
  
    try {
      if (gateway === 'stripe') {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status === 'paid') {
          return res.redirect('/success.html');
        }
      } else if (gateway === 'razorpay') {
        const payment = await razorpay.payments.fetch(payment_id);
        if (payment.status === 'captured') {
          return res.redirect('/success.html');
        }
      }
      
      // If payment verification fails
      res.redirect('/payment-failed');
    } catch (err) {
      console.error('Verification error:', err);
      res.redirect('/payment-failed');
    }
  });

  app.post('/create-stripe-session', async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: { name: 'Premium Plan' },
            unit_amount: 1000, // $10.00
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${process.env.DOMAIN}/payment-success?gateway=stripe&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.DOMAIN}/payment-failed`,
      });
  
      res.json({ id: session.id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  app.post('/create-razorpay-order', async (req, res) => {
    try {
      const options = {
        amount: 19900, // ₹199
        currency: 'INR',
        receipt: 'premium_plan_001'
      };
  
      const order = await razorpay.orders.create(options);
      res.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Basic route
app.get('/', (req, res) => {
    res.sendFile(__dirname+"/app.html");
});

app.get('/analysef', (req, res) => {
    res.sendFile(__dirname+"/analysef.html");
});

app.get('/exampleuser', (req, res) => {
    res.sendFile(__dirname+"/exampleuser.html");
});

app.get('/preview', (req, res) => {
    res.sendFile(__dirname+"/preview.html");
});

app.get('/examplethanks', (req, res) => {
    res.sendFile(__dirname+"/examplethanks.html");
});

app.get('/purchase', (req, res) => {
    res.sendFile(__dirname+"/purchase.html");
});

app.get('/fresults', (req, res) => {
    res.sendFile(__dirname+"/fresults.html");
  });



app.get('/payment-failed', (req, res) => {
    res.send('Payment failed - please try again');
  });


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});