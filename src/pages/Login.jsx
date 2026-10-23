
import "./Login.css";

function login() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>FIT<span>STUDIO</span></h1>
        <p className="login-subtitle">Welcome back! Please log in.</p>

        <form>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            required
          />

          <button type="submit">Login →</button>
        </form>

        <p className="login-note">
          Sign in to access your gym account.
        </p>
      </div>
    </div>
  )
}

export default login
