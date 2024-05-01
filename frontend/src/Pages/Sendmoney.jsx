import { useSearchParams } from 'react-router-dom';
import axios from "axios";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const [amount, setAmount] = useState(0);
    const [transferSuccess, setTransferSuccess] = useState(false);
    const [transferFailure, setTransferFailure] = useState(false);
    const [showAmountWarning, setShowAmountWarning] = useState(false); // New state variable for amount warning
    const navigate = useNavigate();

    const handleTransfer = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // Handle error or redirect to login
                return;
            }

            if (amount <= 0) {
                setShowAmountWarning(true); // Show warning if amount is <= 0
                return;
            }

            const response = await axios.put(
                "http://localhost:3000/api/v1/account/transfer",
                {
                    accountID: String(id),
                    amount: parseFloat(amount)
                },
                {
                    headers: {
                        authorization: token // Include the token as it is, assuming it already contains "Bearer" prefix
                    },
                }
            );

            // Handle successful transfer
            console.log("Transfer successful:", response.data);
            setTransferSuccess(true);
        } catch (error) {
            // Handle error
            console.error('Error initiating transfer:', error);
            setTransferFailure(true); // Set transfer failure state
        }
    };

    const handleOkClick = () => {
        // Redirect to dashboard page
        navigate('/dashboard');
    };

    const handleFailureOkClick = () => {
        // Reset transfer failure state
        setTransferFailure(false);
    };

    const handleWarningOkClick = () => {
        // Hide amount warning
        setShowAmountWarning(false);
    };

    return (
        <div className="flex justify-center h-screen bg-gray-100">
            <div className="h-full flex flex-col justify-center">
                <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h2 className="text-3xl font-bold text-center">Send Money</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-2xl text-white">{name && name.length > 0 ? <span className="text-2xl text-white">{name[0].toUpperCase()}</span> : null}</span>
                            </div>
                            <h3 className="text-2xl font-semibold">{name}</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="amount">
                                    Amount (in Rs)
                                </label>
                                <input
                                    onChange={(e) => {
                                        setAmount(e.target.value);
                                    }}
                                    type="number"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    id="amount"
                                    placeholder="Enter amount"
                                />
                                {showAmountWarning && (
                                    <p className="text-red-500">Please enter a value greater than 0.</p>
                                )}
                            </div>
                            <button
                                onClick={handleTransfer}
                                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
                            >
                                Initiate Transfer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {transferSuccess && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow">
                        <p className="text-lg font-semibold mb-2">Transfer Successful!</p>
                        <button onClick={handleOkClick} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">OK</button>
                    </div>
                </div>
            )}
            {transferFailure && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow">
                        <p className="text-lg font-semibold mb-2">Transfer Failed!</p>
                        <button onClick={handleFailureOkClick} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SendMoney;
