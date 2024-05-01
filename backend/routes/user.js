const express = require("express");
const jwttoken = require("jsonwebtoken");
const router = express.Router();
const zod = require("zod");
const {PaytmUser, PaytmAccount} = require("../db");
const JWT_SECRET = require("../config");
const {authMiddleware} = require("../auth_middleware")


const PaytmUserValidation = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstname: zod.string(),
    lastname: zod.string(),
  });

const siginValidation = zod.object({
    username: zod.string().email(),
    password: zod.string()});

const updateBodyValidation = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional(),
})

router.post("/signup", async (req,res) => {
    const isvalidatedUser = PaytmUserValidation.safeParse(req.body);

    if (!isvalidatedUser) {
        return res.status(411).json({
            message: "incorrect input"

        })
    }

    const isexistingUser = await PaytmUser.findOne({
        username: req.body.username
    })

    if (isexistingUser) {
        return res.status(411).json({
            message: "user already exists"
        })
        
    }

    const user = await PaytmUser.create({
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname

    })

    const userId = user._id
    const balance = 1+ Math.floor(Math.random() * 10000)

    //once user signup, new account needs to be created

    const account = await PaytmAccount.create({
        userId,
        balance
    })

    const token = jwttoken.sign({userId}, JWT_SECRET)

    res.json({
        message:"User created successfully",
        usertoken: token,
        firstname: req.body.firstname,
        UserID: userId, 
        AccountBalance: balance
    })


})

router.post("/signin", async (req,res) => {

    const isvalidatedSiginUser = siginValidation.safeParse(req.body);

    if (!isvalidatedSiginUser) {
        return res.status(411).json({
            message: "incorrect input"

        })
    }

    const isexistingUser = await PaytmUser.findOne({
        username: req.body.username
    })

    if (!isexistingUser) {
        return res.status(411).json({
            message: "user not exists"
        }
       );
    } else {
        const firstName = isexistingUser.firstname
        const userId = isexistingUser._id
        const token = jwttoken.sign({user_id: isexistingUser._id}, JWT_SECRET)
        
        const account = await PaytmAccount.findOne({ userId });
        const balance = account ? account.balance : 0;

        return res.status(200).json({
          usertoken: token,
          firstname: firstName,
          UserID: userId,
          balance
        });

    
        
    }
})



router.put("/", authMiddleware, async (req, res) => {
    const {success, data} = updateBodyValidation.safeParse(req.body);
  
    if (!success) {
      return res.status(400).json({
        message: "Invalid inputs",
      });
    }
  
    // Filter out empty and undefined values from the validated data
    const validKeys = Object.keys(data);
    const updateFields = validKeys.reduce((accumulator, key) => {
      if (data[key] !== undefined && data[key] !== "") {
        accumulator[key] = data[key];
      }
      return accumulator;
    }, {} ); // {} is initial accumulator value
  
    // Check if any valid fields are provided
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided for update",
      });
    }
  
    // Update user information using updateOne
    try {
      const result = await PaytmUser.updateOne({ _id: req.userId }, { $set: updateFields });
  
      if (result.nModified === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }
  
      res.json({
        message: "User information updated successfully",
        updatedFields: updateFields,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  });

router.get("/bulk", authMiddleware, async(req,res) => {

    const filter = req.query.filter || "";

    const users = await PaytmUser.find({
        $or: [
          {
            firstname: {
              $regex: new RegExp(filter, "i"), // Case-insensitive search
            },
          },
          {
            lastname: {
              $regex: new RegExp(filter, "i"),
            },
          },
        ],
      });

    res.json({
        user: users.map(user =>({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        }))
    
    })



})

module.exports = router;