import React, { useState } from 'react';
import axios from 'axios';

function MembershipCheckout() {
    const [loading, setLoading] = useState(false);

    const handlePayment = async (planAmount) => {
        try {
            setLoading(true);

            // 1. Call your Spring Boot backend to create the Razorpay order
            const orderResponse = await axios.post('http://localhost:8080/api/payment/create-order', {
                amount: planAmount * 100, 
                currency: "INR"
            });

            const orderData = JSON.parse(orderResponse.data);

            // 2. Configure the Razorpay modal options
            const options = {
                key: "YOUR_RAZORPAY_TEST_KEY_ID", // Replace with your Test Key ID
                amount: orderData.amount,
                currency: orderData.currency,
                name: "FitStudio",
                description: "Gym Membership Plan",
                order_id: orderData.id,
                handler: async function (response) {
                    try {
                        // 3. Send payment details back to backend for secure verification
                        const verificationResponse = await axios.post('http://localhost:8080/api/payment/verify', {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature
                        });

                        alert(verificationResponse.data.message);
                    } catch (err) {
                        alert("Payment verification failed!");
                        console.error(err);
                    }
                },
                prefill: {
                    name: "Manasa V",
                    email: "manasa@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#3399cc"
                }
            };

            // 4. Open the Razorpay checkout popup window
            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Error initiating payment:", error);
            alert("Could not start payment. Please check your backend connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>FitStudio Membership Plan</h2>
            <p>Unlock full access to gym facilities.</p>
            <button 
                onClick={() => handlePayment(500)} 
                disabled={loading}
                style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#3399cc', color: '#fff', border: 'none', borderRadius: '4px' }}
            >
                {loading ? "Processing..." : "Pay ₹500 Now"}
            </button>
        </div>
    );
}

export default MembershipCheckout;