import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { axiosSecure } from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setProcessing(true);

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet. Please try again.");
      setProcessing(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (card == null) {
      setError("Card element not found.");
      setProcessing(false);
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("[error]", error);
      setError(error.message);
      setProcessing(false);
    } else {
      console.log("[PaymentMethod]", paymentMethod);
      setSucceeded(true);
      setProcessing(false);
      setError(null);
    }

    // next step
    const amount = 9900;
    const res = await axiosSecure.post("/create-payment-intent", {
      amount,
    });

    const clientSecret = res.data.clientSecret;
    console.log("This si res", clientSecret);

    // step-3: confirm payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: user.displayName,
          email: user.email,
        },
      },
    });

    if (result.error) {
      setError(result.error.message);
    } else {
      setError("");
      if (result.paymentIntent.status === "succeeded") {
        const email = user.email;
        console.log("Payment succeeded!");
        const roleManager = await axiosSecure.post("/update-user", {
          email,
        });

        if (roleManager.data && roleManager.data.success) {
          // Show SweetAlert and navigate to home
          import("sweetalert2").then((Swal) => {
            Swal.default
              .fire({
                icon: "success",
                title: "Congratulations!",
                text: "You are now a premium member.",
                confirmButtonColor: "#2563eb",
              })
              .then(() => {
                window.location.href = "/";
              });
          });
        }
      }
    }
  };

  const handleCardChange = (event) => {
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Details
          </h2>
          <p className="text-gray-600">Enter your card information below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card Element Container */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Card Information
            </label>
            <div
              className={`
            border rounded-lg p-4 bg-gray-50 transition-all duration-200
            ${
              error
                ? "border-red-300 bg-red-50"
                : "border-gray-300 hover:border-blue-400 focus-within:border-blue-500 focus-within:bg-white"
            }
          `}
            >
              <CardElement
                onChange={handleCardChange}
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#374151",
                      fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif',
                      fontSmoothing: "antialiased",
                      "::placeholder": {
                        color: "#9CA3AF",
                      },
                      iconColor: "#6B7280",
                    },
                    invalid: {
                      color: "#EF4444",
                      iconColor: "#EF4444",
                    },
                  },
                  hidePostalCode: false,
                }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {succeeded && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Payment method created successfully!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!stripe || processing || succeeded}
            className={`
            w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200
            ${
              !stripe || processing || succeeded
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
            }
            ${processing ? "animate-pulse" : ""}
          `}
          >
            {processing ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : succeeded ? (
              "Payment Successful!"
            ) : (
              "Pay $99 Now"
            )}
          </button>

          {/* Security Notice */}
          <div className="text-center text-xs text-gray-500">
            <div className="flex items-center justify-center space-x-1">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Your payment information is encrypted and secure</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
