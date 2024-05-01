const express = require("express");
const jwttoken = require("jsonwebtoken");
const router = express.Router();
const zod = require("zod");
const {PaytmUser, PaytmAccount} = require("../db");
const JWT_SECRET = require("../config");
const {authMiddleware} = require("../auth_middleware");
const { default: mongoose } = require("mongoose");

const tranferValidation = zod.object({
    accountID: zod.string(),
    amount: zod.number()});

router.get("/balance", authMiddleware, async(req,res) => {
    
    const account = await PaytmAccount.findOne({
        userId: req.userId
    })

    return res.json({
        balance: account.balance
    })

});

router.put("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const isvalidatedTransfer = tranferValidation.safeParse(req.body);

    if (!isvalidatedTransfer.success) {
        return res.status(411).json({
            message: "incorrect input"
        });
    }

    const { accountID, amount } = req.body;

  

    try {
        const fromAccount = await PaytmAccount.findOne({ userId: req.userId }).session(session);
        if (!fromAccount || fromAccount.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "insufficient balance"
            });
        }

        const toAccount = await PaytmAccount.findOne({ userId: accountID }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "incorrect account"
            });
        }
        
        
        
        // Perform the transaction
        fromAccount.balance -= amount;
        toAccount.balance += amount;

        await fromAccount.save();
        await toAccount.save();

        // Commit transaction
        await session.commitTransaction();

        res.json({
            message: "Transfer successful"
        });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({
            message: "Internal server error"
        });
    } finally {
        session.endSession();
    }
});



module.exports = router;