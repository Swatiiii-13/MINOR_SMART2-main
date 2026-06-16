import { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

// Dynamically inject Razorpay Checkout SDK script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulation Sandbox State variables
  const [showSimulatedModal, setShowSimulatedModal] = useState(false);
  const [modalOrderData, setModalOrderData] = useState(null);
  const [simulationStatus, setSimulationStatus] = useState('success');

  // Fallback state if navigated directly without state
  const itemState = location.state || {
    title: 'Trip Booking',
    provider: 'Unknown Provider',
    price: '₹ 0',
  };

  const handleConfirmSimulatedPayment = async () => {
    setIsProcessing(true);
    setShowSimulatedModal(false);

    try {
      if (simulationStatus === 'failure') {
        alert('Payment failed! Reason: Simulated payment failure by user choice.');
        setIsProcessing(false);
        return;
      }

      // Simulate network request latency for authenticity
      await new Promise(resolve => setTimeout(resolve, 1500));

      const checkIn = new Date();
      const checkOut = new Date();
      checkOut.setDate(checkOut.getDate() + 1); // 1 night stay

      const mockPaymentId = `pay_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;

      // Call verification endpoint with mock data
      const verifyResponse = await api.post('/payments/verify', {
        razorpay_order_id: modalOrderData.id,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: 'mock_signature',
        hotelId: itemState.hotelId,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString()
      });

      console.log('Simulated payment verified and booking confirmed:', verifyResponse.data);
      alert(`Success! [Razorpay Sandbox Simulator] Payment verified and stay at ${itemState.provider} confirmed.\nYour Booking ID is: ${verifyResponse.data.booking._id}`);

      // Clean up current session cache
      sessionStorage.removeItem('currentItinerary');
      sessionStorage.removeItem('currentTripRequest');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Simulated verification failed:', err);
      alert(err.response?.data?.message || 'Simulated payment signature verification failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const numericPrice = parseInt(itemState.price.toString().replace(/\D/g, '')) || 0;

      if (itemState.hotelId) {
        // Intercept and redirect to the simulated payment sandbox modal if key is placeholder
        const isPlaceholderKey = !import.meta.env.VITE_RAZORPAY_KEY_ID || import.meta.env.VITE_RAZORPAY_KEY_ID.includes('placeholder');

        if (isPlaceholderKey) {
          console.log('Placeholder Razorpay Key detected. Redirecting to Sandbox Simulator.');
          
          const orderResponse = await api.post('/payments/create-order', {
            amount: numericPrice
          });
          
          setModalOrderData(orderResponse.data);
          setShowSimulatedModal(true);
          return;
        }

        // Load the Razorpay SDK script dynamically for real keys
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          alert('Failed to load Razorpay SDK. Please check your internet connection.');
          setIsProcessing(false);
          return;
        }

        // Create the Razorpay Order on the backend
        const orderResponse = await api.post('/payments/create-order', {
          amount: numericPrice
        });

        const orderData = orderResponse.data;

        const checkIn = new Date();
        const checkOut = new Date();
        checkOut.setDate(checkOut.getDate() + 1); // 1 night stay

        // Setup Razorpay checkout options
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholderKeyId123',
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Smart Travel Planner',
          description: `Booking stay at ${itemState.provider}`,
          order_id: orderData.id,
          handler: async function (response) {
            setIsProcessing(true);
            try {
              // Send signature details to backend for verification and booking registration
              const verifyResponse = await api.post('/payments/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature || 'mock_signature',
                hotelId: itemState.hotelId,
                checkIn: checkIn.toISOString(),
                checkOut: checkOut.toISOString()
              });

              console.log('Payment verified and booking confirmed:', verifyResponse.data);
              alert(`Success! Payment verified and stay at ${itemState.provider} confirmed.\nYour Booking ID is: ${verifyResponse.data.booking._id}`);
              
              // Clean up current session cache for generated itineraries
              sessionStorage.removeItem('currentItinerary');
              sessionStorage.removeItem('currentTripRequest');
              navigate('/dashboard', { replace: true });
            } catch (err) {
              console.error('Payment verification failed:', err);
              alert(err.response?.data?.message || 'Payment signature verification failed. Your transaction is secure, please contact support.');
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: ''
          },
          theme: {
            color: '#2563eb'
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          alert(`Payment failed! Reason: ${resp.error.description}`);
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        // Fallback simulated payment loop for non-db mock items (e.g. flight bookings)
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert(`Simulation Success: Booked ${itemState.title} successfully.`);
        
        sessionStorage.removeItem('currentItinerary');
        sessionStorage.removeItem('currentTripRequest');
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Booking checkout transaction failed:', error);
      alert(error.response?.data?.message || 'Failed to complete checkout payment and register booking. Please check available rooms and try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', maxWidth: '1000px', margin: '2rem auto', minHeight: '70vh', padding: '0 1rem' }}>
      {/* Left Side: Order Summary */}
      <div className="order-summary glass-container" style={{ flex: '1 1 300px', padding: '2rem' }}>
        <h2 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '2rem' }}>Order Summary</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ margin: 0 }}>{itemState.title}</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0, marginTop: '0.5rem' }}>{itemState.provider}</p>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {itemState.price}
          </div>
        </div>
        
        <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Subtotal</span>
            <span>{itemState.price}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Taxes & Fees</span>
            <span>Included</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <span>Total</span>
            <span>{itemState.price}</span>
          </div>
        </div>
      </div>

      {/* Right Side: Payment Details */}
      <div className="payment-details glass-container" style={{ flex: '2 1 400px', padding: '2rem' }}>
        <h2 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '2rem' }}>Payment Details</h2>
        <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Name on Card</label>
            <input type="text" required defaultValue={user?.name || ''} placeholder="John Doe" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Card Number</label>
            <input type="text" required placeholder="0000 0000 0000 0000" pattern="[0-9\s]{13,19}" maxLength="19" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Expiry Date</label>
              <input type="text" required placeholder="MM/YY" maxLength="5" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>CVC</label>
              <input type="password" required placeholder="123" maxLength="4" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }} />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isProcessing}
            className="glass-button" 
            style={{ width: '100%', marginTop: '1rem', padding: '1rem', background: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.1rem' }}
          >
            {isProcessing ? 'Processing...' : `Pay ${itemState.price}`}
          </button>
        </form>
      </div>

      {/* 5. Razorpay Sandbox Simulator Overlay Modal */}
      {showSimulatedModal && modalOrderData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="glass-container" style={{
            maxWidth: '450px',
            width: '100%',
            padding: '2.5rem',
            background: 'rgba(30, 41, 59, 0.95)',
            border: '1px solid var(--glass-border)',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            color: 'white',
            fontFamily: 'sans-serif'
          }}>
            <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.25rem' }}>
              <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'block' }}>💳</span>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>Razorpay Sandbox Simulator</h3>
              <p style={{ margin: 0, marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Secure mock payment environment</p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ opacity: 0.7 }}>Order ID</span>
                <span style={{ fontWeight: '500', fontFamily: 'monospace' }}>{modalOrderData.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ opacity: 0.7 }}>Stay Provider</span>
                <span style={{ fontWeight: '500' }}>{itemState.provider}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 'bold', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                <span>Amount Due</span>
                <span style={{ color: '#10b981' }}>{itemState.price}</span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Select Simulation Outcome</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setSimulationStatus('success')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: simulationStatus === 'success' ? '#10b981' : 'rgba(255,255,255,0.1)',
                    background: simulationStatus === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.02)',
                    color: simulationStatus === 'success' ? '#34d399' : 'var(--text-secondary)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  🟢 Success
                </button>
                <button
                  onClick={() => setSimulationStatus('failure')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: simulationStatus === 'failure' ? '#ef4444' : 'rgba(255,255,255,0.1)',
                    background: simulationStatus === 'failure' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.02)',
                    color: simulationStatus === 'failure' ? '#f87171' : 'var(--text-secondary)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  🔴 Failure
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => { setShowSimulatedModal(false); setIsProcessing(false); }}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'transparent',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSimulatedPayment}
                style={{
                  flex: 1.5,
                  padding: '0.85rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#2563eb',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor='#1d4ed8'}
                onMouseOut={e => e.currentTarget.style.backgroundColor='#2563eb'}
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
