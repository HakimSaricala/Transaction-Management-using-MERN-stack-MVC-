require("dotenv").config();
const router = require("express").Router();
const transactionData = require("../model/transaction");
const User = require( "../model/user" );
const jwt = require( 'jsonwebtoken' ) ;
const bcrypt = require( 'bcryptjs' ) ;
const {protect} = require( './auth.js') 
// User routes

//register
router.post('/users/register', async (req, res) => {

  
  const { name, email, password } = req.body;

  // Check if all fields are provided
  if (!name || !email || !password) {
    return res.status(400).send(`Please provide all required details ${name,email,password}`);
  }
 
  if (!name) {
    return res.status(400).json({ message: "Please provide name." });
  }
  if (!email){
    return res.status(400).json({ message: "Please provide email." });
  }
  if (!password){
    return res.status(400).json({ message: "Please provide password." });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    // Save the new user to the database
    const savedUser = await newUser.save();
    res.status(201).json({ message: "User Created", data: savedUser, token: generateToken(savedUser._id) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//login
router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) { // Await the result of bcrypt.compare
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: "Invalid Email or Password" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Logged in
router.post('/users', protect,async(req,res)=>{
  const {_id,name,email}= await User.findById(req.user.id)

  res.status(200).json({
    id: _id,
    name,
    email,
  })
  
})


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_Secret, {
      expiresIn: '30d',
  });
}






// Transaction routes

router.get('/transactions', protect, (req, res) => {
  transactionData.find({ user: req.user.id })
  .then((transactions) => {
      res.status(200).json({ message: 'Successfully retrieved data', transactions });
  })
  .catch((err) => {
      res.status(500).json({ error: err.message });
  });
});




router.get("/transactions/:id", protect, async (req, res) => {
  let id = req.params.id;
  console.log(`Request for transaction with id ${id}`);
  
  try {
      const transaction = await transactionData.findById(id);
      
      if (!transaction) {
          return res.status(404).json({ message: "No transaction found" });
      }
      
      // Check if the transaction belongs to the authorized user
      if (transaction.user.toString() !== req.user.id) {
          return res.status(401).json({ message: "Unauthorized access to transaction" });
      }
      
      res.status(200).json(transaction);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});



router.post("/transactions", protect, (req, res) => {
  const { PaymentDate, Owner, Weight, Quality, Amount, Mode } = req.body;

  // Assign the authenticated user's id to the new transaction
  const newTrans = new transactionData({
    user: req.user.id,  // Set the user field to the authenticated user's id
    PaymentDate,
    Owner,
    Weight: parseInt(Weight),
    Quality,
    Amount: parseInt(Amount),
    Mode,
   
  });

  newTrans.save()
    .then((transaction) => {
      res.status(201).json({ message: "Data Created", transaction });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});


router.put('/transactions/:id', protect, async (req, res) => {
  try {
      // Get the transaction data based on id
      const transaction = await transactionData.findById(req.params.id);
    
      const { PaymentDate,  Owner, Weight, Quality, Amount, Mode } = req.body;
      
      // Check if user exists
      const user = await User.findById(req.user.id);
     
      if (!user) {
          return res.status(401).json({ error: 'User not found' });
      }
      
      // Get only the authorized data for user
      if (transaction.user.toString() !== user.id) {
          return res.status(401).json({ message: 'User not authorized' });
      }
      
      // Update the transaction
      const updatedTransaction = await transactionData.findByIdAndUpdate(req.params.id, { PaymentDate, Owner, Weight, Quality, Amount, Mode }, { new: true });
      
      if (!updatedTransaction) {
          return res.status(404).json({ message: 'Transaction not found' });
      }
      
      res.json(updatedTransaction);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

router.delete('/transactions/:id', protect, async (req, res) => {
  try {
      // Get the transaction data based on id
      const transaction = await transactionData.findById(req.params.id);
    
      // Check if user exists
      const user = await User.findById(req.user.id);
      
      if (!user) {
          return res.status(401).json({ error: 'User not found' });
      }
      
      // Get only the authorized data for user
      if (transaction.user.toString() !== user.id) {
          return res.status(401).json({ message: 'User not authorized' });
      }
      
      // Delete the transaction
      const deletedTransaction = await transactionData.findByIdAndDelete(req.params.id);
      
      if (!deletedTransaction) {
          return res.status(404).json({ message: 'Transaction not found' });
      }
      
      res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

module.exports = router;