
import { useState } from 'react'
import './App.css'

function App() {
  const [customer, setCustomer] = useState({
    gender: 'Male',
    seniorCitizen: '0',
    partner: 'No',
    dependents: 'No',
    tenure: '',
    phoneService: 'Yes',
    multipleLines: 'No',
    internet: 'Fiber optic',
    onlineSecurity: 'No',
    onlineBackup: 'No',
    deviceProtection: 'No',
    techSupport: 'No',
    streamingTV: 'No',
    streamingMovies: 'No',
    contract: 'Month-to-month',
    paperlessBilling: 'Yes',
    payment: 'Electronic check',
    monthlyCharges: '',
    totalCharges: ''
  })

  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  // Handle form input changes
  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value
    })
  }

  // Send customer information to the trained ML model
  const handlePredict = async (e) => {
    e.preventDefault()

    setLoading(true)
    setApiError('')
    setPrediction(null)

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/predict',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            gender: customer.gender,
            seniorCitizen: Number(customer.seniorCitizen),
            partner: customer.partner,
            dependents: customer.dependents,
            tenure: Number(customer.tenure),
            phoneService: customer.phoneService,
            multipleLines: customer.multipleLines,
            internet: customer.internet,
            onlineSecurity: customer.onlineSecurity,
            onlineBackup: customer.onlineBackup,
            deviceProtection: customer.deviceProtection,
            techSupport: customer.techSupport,
            streamingTV: customer.streamingTV,
            streamingMovies: customer.streamingMovies,
            contract: customer.contract,
            paperlessBilling: customer.paperlessBilling,
            payment: customer.payment,
            monthlyCharges: Number(customer.monthlyCharges),
            totalCharges: Number(customer.totalCharges)
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.detail
            ? JSON.stringify(errorData.detail)
            : 'Prediction request failed'
        )
      }

      const result = await response.json()
      setPrediction(result)

    } catch (error) {
      console.error('Prediction error:', error)

      setApiError(
        error.message ||
        'Unable to connect to the prediction server. Please check your backend.'
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <h2 className="logo">
          Churn<span>Guard</span>
        </h2>

        <p className="menu-title">MENU</p>

        <nav>
          <a className="active" href="#dashboard">
            ▦ Dashboard
          </a>

          <a href="#prediction">
            ◎ Churn Prediction
          </a>

          <a href="#analytics">
            ▤ Analytics
          </a>

          <a href="#customers">
            ♙ Customers
          </a>
        </nav>

        <div className="sidebar-bottom">
          <p>Machine Learning</p>
          <small>Customer Retention System</small>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* TOP HEADER */}
        <header className="topbar">

          <div>
            <h2>Customer Analytics</h2>
            <p>
              Welcome to your customer retention dashboard
            </p>
          </div>

          <div className="profile">
            Admin
          </div>

        </header>

        {/* DASHBOARD */}
        <section id="dashboard">

          <div className="welcome">

            <div>
              <h1>Customer Churn Dashboard</h1>
              <p>
                Monitor customer behavior and predict potential churn.
              </p>
            </div>

            <span className="status">
              ● System Active
            </span>

          </div>

          {/* STATISTICS */}
          <div className="stats">

            <div className="stat-card">
              <p>Total Customers</p>
              <h2>7,043</h2>
              <small>Customer dataset</small>
            </div>

            <div className="stat-card">
              <p>Churned Customers</p>
              <h2 className="red">1,869</h2>
              <small>Historical churn</small>
            </div>

            <div className="stat-card">
              <p>Retention Rate</p>
              <h2 className="green">73.5%</h2>
              <small>Historical retention</small>
            </div>

            <div className="stat-card">
              <p>Model Accuracy</p>
              <h2 className="blue">76.01%</h2>
              <small>Random Forest model</small>
            </div>

          </div>

        </section>

        {/* ANALYTICS */}
        <section id="analytics" className="analytics">

          <div className="panel">

            <h3>Customer Churn Overview</h3>
            <p>Historical customer distribution</p>

            <div className="chart">

              <div className="bar-group">
                <div className="bar retained"></div>
                <span>Retained</span>
                <strong>73.5%</strong>
              </div>

              <div className="bar-group">
                <div className="bar churned"></div>
                <span>Churned</span>
                <strong>26.5%</strong>
              </div>

            </div>

          </div>

          <div className="panel">

            <h3>Project Information</h3>

            <div className="info">
              <p>Algorithm</p>
              <strong>Random Forest</strong>
            </div>

            <div className="info">
              <p>Technology</p>
              <strong>Python + React + FastAPI</strong>
            </div>

            <div className="info">
              <p>Prediction Type</p>
              <strong>Binary Classification</strong>
            </div>

            <div className="info">
              <p>Model Status</p>
              <strong className="green">
                Trained and Ready
              </strong>
            </div>

          </div>

        </section>

        {/* CUSTOMER PREDICTION FORM */}
        <section
          id="prediction"
          className="panel prediction-panel"
        >

          <h2>Customer Churn Prediction</h2>

          <p>
            Enter complete customer details to predict churn risk
            using the Random Forest machine learning model.
          </p>

          <form onSubmit={handlePredict}>

            {/* PERSONAL INFORMATION */}
            <h3 className="form-section-title">
              1. Personal Information
            </h3>

            <div className="form-grid">

              <div className="field">
                <label>Gender</label>

                <select
                  name="gender"
                  value={customer.gender}
                  onChange={handleChange}
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>

              <div className="field">
                <label>Senior Citizen</label>

                <select
                  name="seniorCitizen"
                  value={customer.seniorCitizen}
                  onChange={handleChange}
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>

              <div className="field">
                <label>Partner</label>

                <select
                  name="partner"
                  value={customer.partner}
                  onChange={handleChange}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>

              <div className="field">
                <label>Dependents</label>

                <select
                  name="dependents"
                  value={customer.dependents}
                  onChange={handleChange}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>

            </div>

            {/* ACCOUNT INFORMATION */}
            <h3 className="form-section-title">
              2. Account Information
            </h3>

            <div className="form-grid">

              <div className="field">
                <label>Customer Tenure (Months)</label>

                <input
                  type="number"
                  name="tenure"
                  min="0"
                  max="100"
                  placeholder="Enter tenure"
                  value={customer.tenure}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field">
                <label>Contract Type</label>

                <select
                  name="contract"
                  value={customer.contract}
                  onChange={handleChange}
                >
                  <option>Month-to-month</option>
                  <option>One year</option>
                  <option>Two year</option>
                </select>
              </div>

              <div className="field">
                <label>Paperless Billing</label>

                <select
                  name="paperlessBilling"
                  value={customer.paperlessBilling}
                  onChange={handleChange}
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>

              <div className="field">
                <label>Payment Method</label>

                <select
                  name="payment"
                  value={customer.payment}
                  onChange={handleChange}
                >
                  <option>Electronic check</option>
                  <option>Mailed check</option>
                  <option>Bank transfer (automatic)</option>
                  <option>Credit card (automatic)</option>
                </select>
              </div>

            </div>

            {/* PHONE AND INTERNET SERVICES */}
            <h3 className="form-section-title">
              3. Phone and Internet Services
            </h3>

            <div className="form-grid">

              <div className="field">
                <label>Phone Service</label>

                <select
                  name="phoneService"
                  value={customer.phoneService}
                  onChange={handleChange}
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>

              <div className="field">
                <label>Multiple Lines</label>

                <select
                  name="multipleLines"
                  value={customer.multipleLines}
                  onChange={handleChange}
                >
                  <option>No</option>
                  <option>Yes</option>
                  <option>No phone service</option>
                </select>
              </div>

              <div className="field">
                <label>Internet Service</label>

                <select
                  name="internet"
                  value={customer.internet}
                  onChange={handleChange}
                >
                  <option>Fiber optic</option>
                  <option>DSL</option>
                  <option>No</option>
                </select>
              </div>

              <div className="field">
                <label>Online Security</label>

                <select
                  name="onlineSecurity"
                  value={customer.onlineSecurity}
                  onChange={handleChange}
                >
                  <option>No</option>
                  <option>Yes</option>
                  <option>No internet service</option>
                </select>
              </div>

              <div className="field">
                <label>Online Backup</label>

                <select
                  name="onlineBackup"
                  value={customer.onlineBackup}
                  onChange={handleChange}
                >
                  <option>No</option>
                  <option>Yes</option>
                  <option>No internet service</option>
                </select>
              </div>

              <div className="field">
                <label>Device Protection</label>

                <select
                  name="deviceProtection"
                  value={customer.deviceProtection}
                  onChange={handleChange}
                >
                  <option>No</option>
                  <option>Yes</option>
                  <option>No internet service</option>
                </select>
              </div>

              <div className="field">
                <label>Tech Support</label>

                <select
                  name="techSupport"
                  value={customer.techSupport}
                  onChange={handleChange}
                >
                  <option>No</option>
                  <option>Yes</option>
                  <option>No internet service</option>
                </select>
              </div>

              <div className="field">
                <label>Streaming TV</label>

                <select
                  name="streamingTV"
                  value={customer.streamingTV}
                  onChange={handleChange}
                >
                  <option>No</option>
                  <option>Yes</option>
                  <option>No internet service</option>
                </select>
              </div>

              <div className="field">
                <label>Streaming Movies</label>

                <select
                  name="streamingMovies"
                  value={customer.streamingMovies}
                  onChange={handleChange}
                >
                  <option>No</option>
                  <option>Yes</option>
                  <option>No internet service</option>
                </select>
              </div>

            </div>

            {/* CHARGES INFORMATION */}
            <h3 className="form-section-title">
              4. Charges Information
            </h3>

            <div className="form-grid">

              <div className="field">
                <label>Monthly Charges ($)</label>

                <input
                  type="number"
                  name="monthlyCharges"
                  min="0"
                  step="0.01"
                  placeholder="Enter monthly charges"
                  value={customer.monthlyCharges}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field">
                <label>Total Charges ($)</label>

                <input
                  type="number"
                  name="totalCharges"
                  min="0"
                  step="0.01"
                  placeholder="Enter total charges"
                  value={customer.totalCharges}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            {/* PREDICTION BUTTON */}
            <button
              className="predict-btn"
              type="submit"
              disabled={loading}
            >
              {loading
                ? 'Predicting...'
                : 'Predict Customer Churn →'}
            </button>

          </form>

          {/* ERROR RESULT */}
          {apiError && (
            <div className="result">
              <h3>Prediction Error</h3>
              <p className="red">{apiError}</p>
            </div>
          )}

          {/* MACHINE LEARNING RESULT */}
          {prediction !== null && (
            <div className="result">

              <h3>Machine Learning Prediction Result</h3>

              <h2
                className={
                  prediction.risk_level === 'High'
                    ? 'red'
                    : 'green'
                }
              >
                {prediction.prediction}
              </h2>

              <h2>
                {prediction.churn_probability}%
              </h2>

              <p>Churn Probability</p>

              <p>
                Risk Level: {prediction.risk_level}
              </p>

              <p>
                Recommendation: {prediction.recommendation}
              </p>

              <small>
                Prediction generated by the trained Random Forest model.
              </small>

            </div>
          )}

        </section>

        {/* FOOTER */}
        <footer>
          ChurnGuard © 2026 | Customer Churn Prediction using Machine Learning
        </footer>

      </main>

    </div>
  )
}

export default App
