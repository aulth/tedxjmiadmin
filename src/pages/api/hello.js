import cors from 'cors';

// Apply the cors middleware
const corsHandler = cors({
  origin: 'http://127.0.0.1:5500', // Replace with the allowed origin
  methods: ['POST'], // Adjust the allowed methods
});

export default function handler(req, res) {
  // Apply the cors middleware
  corsHandler(req, res, () => {
    // Handle the API request here
    res.status(200).json({ name: 'John Doe' });
  });
}
