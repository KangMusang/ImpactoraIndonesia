const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/success', (req, res) => {
  res.send('<h1>Payment Successful!</h1><p>Thank you for your purchase.</p>');
});

app.get('/cancel', (req, res) => {
  res.send('<h1>Payment Cancelled</h1><p>Your payment was cancelled.</p>');
});

// API for eagle info (Indonesian eagles)
app.get('/api/eagles', (req, res) => {
  const eagles = [
    {
      country: 'Indonesia',
      type: 'Javan Hawk-Eagle',
      habitat: 'Tropical rainforests of Java',
      description: 'The Javan Hawk-Eagle is a medium-large raptor endemic to the Indonesian island of Java. It is critically endangered due to habitat loss.',
      wingspan: '1.2-1.4 meters',
      weight: '1.2-1.8 kg'
    },
    {
      country: 'Indonesia',
      type: 'Sulawesi Hawk-Eagle',
      habitat: 'Rainforests of Sulawesi',
      description: 'Endemic to Sulawesi, this eagle is known for its distinctive crest and is vulnerable to extinction.',
      wingspan: '1.1-1.3 meters',
      weight: '1.0-1.5 kg'
    },
    {
      country: 'Indonesia',
      type: 'Changeable Hawk-Eagle',
      habitat: 'Forests across Indonesia',
      description: 'A widespread species found in various forest types throughout Indonesia, known for its variable plumage.',
      wingspan: '1.0-1.2 meters',
      weight: '0.8-1.2 kg'
    },
    {
      country: 'Indonesia',
      type: 'Crested Serpent-Eagle',
      habitat: 'Lowland forests',
      description: 'Specialized in hunting snakes and other reptiles, this eagle has a distinctive crest.',
      wingspan: '1.0-1.2 meters',
      weight: '0.9-1.3 kg'
    },
    {
      country: 'Indonesia',
      type: 'Blyth\'s Hawk-Eagle',
      habitat: 'Hill forests',
      description: 'Found in hilly and mountainous areas, this eagle is known for its powerful build.',
      wingspan: '1.1-1.3 meters',
      weight: '1.0-1.5 kg'
    },
    {
      country: 'Indonesia',
      type: 'Wallace\'s Hawk-Eagle',
      habitat: 'Rainforests of Wallacea',
      description: 'Endemic to the Wallacea region, this eagle is named after Alfred Russel Wallace.',
      wingspan: '1.0-1.2 meters',
      weight: '0.9-1.3 kg'
    }
  ];
  res.json(eagles);
});

// API for national parks
app.get('/api/national-parks', (req, res) => {
  const nationalParks = [
    {
      name: 'Gunung Leuser National Park',
      location: 'Aceh and North Sumatra',
      description: 'Home to the critically endangered Sumatran orangutan and the Javan Hawk-Eagle.',
      area: '7,927 km²',
      established: '1991'
    },
    {
      name: 'Komodo National Park',
      location: 'East Nusa Tenggara',
      description: 'Famous for the Komodo dragon, the world\'s largest lizard.',
      area: '1,817 km²',
      established: '1980'
    },
    {
      name: 'Bali Barat National Park',
      location: 'Bali',
      description: 'Features diverse ecosystems including savannas, mangroves, and coral reefs.',
      area: '190 km²',
      established: '1941'
    },
    {
      name: 'Ujung Kulon National Park',
      location: 'Banten, Java',
      description: 'The last refuge of the Javan rhino and home to various endangered species.',
      area: '443 km²',
      established: '1992'
    },
    {
      name: 'Lorentz National Park',
      location: 'Papua',
      description: 'The largest national park in Southeast Asia, featuring diverse ecosystems from glaciers to rainforests.',
      area: '25,056 km²',
      established: '1997'
    },
    {
      name: 'Way Kambas National Park',
      location: 'Lampung, Sumatra',
      description: 'Known for its elephant conservation program and diverse wildlife.',
      area: '1,250 km²',
      established: '1935'
    }
  ];
  res.json(nationalParks);
});

// API for merchandise
app.get('/api/merchandise', (req, res) => {
  const merchandise = [
    { id: 1, name: 'Eagle T-Shirt', price: 25, image: 'tshirt.jpg' },
    { id: 2, name: 'Eagle Mug', price: 15, image: 'mug.jpg' },
    { id: 3, name: 'Eagle Poster', price: 10, image: 'poster.jpg' },
    { id: 4, name: 'Eagle Hat', price: 20, image: 'hat.jpg' }
  ];
  res.json(merchandise);
});

// Xendit integration (sandbox)
// Uncomment and add your Xendit API key to use real payment
/*
const Xendit = require('xendit-node');
const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY || 'your_xendit_secret_key_here'
});
const { Invoice } = xenditClient;
*/

app.post('/api/create-checkout-session', async (req, res) => {
  const { items, customer } = req.body;

  try {
    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

    // For testing without Xendit - remove this block when using real Xendit
    console.log('Checkout request:', {
      items,
      customer,
      totalAmount
    });

    res.json({
      message: `Terima kasih ${customer.name}! Total pembayaran: Rp ${totalAmount.toLocaleString('id-ID')}. Xendit integration akan diaktifkan setelah API key ditambahkan.`,
      items: items,
      customer: customer,
      totalAmount: totalAmount
    });

    Uncomment this block when using real Xendit
    const invoice = await Invoice.createInvoice({
      externalId: `invoice-${Date.now()}`,
      amount: totalAmount,
      description: `Pembelian ${items.map(i => i.name).join(', ')}`,
      invoiceDuration: 86400, // 24 hours
      currency: 'IDR',
      customer: {
        givenNames: customer.name,
        email: customer.email || 'customer@example.com',
        mobileNumber: customer.phone || '+6281234567890',
        address: customer.address
      },
      items: items.map(item => ({
        name: item.name,
        quantity: 1,
        price: item.price,
        category: 'Merchandise'
      })),
      successRedirectUrl: 'http://localhost:3000/success',
      failureRedirectUrl: 'http://localhost:3000/cancel'
    });

    res.json({
      invoiceUrl: invoice.invoiceUrl,
      externalId: invoice.externalId
    });
    */
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
