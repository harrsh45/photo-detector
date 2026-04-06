import React, { useState, useContext, useEffect, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from '../config/axios'
import { UserContext } from '../context/user.context'

/* ═══════════════════════════════════════════════════════
   Connectivity Map — Procedural SVG Background
   Generates a semi-abstract grid of nodes + edges
   implying "structure from chaos" / neural connectivity.
   All coordinates are deterministic (seeded by index).
   ═══════════════════════════════════════════════════════ */

const ConnectivityMap = () => {
  const { nodes, edges } = useMemo(() => {
    const n = []
    const e = []

    // Generate nodes on a loosely structured grid with deliberate displacement
    const cols = 14
    const rows = 10
    const spacingX = 120
    const spacingY = 100

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const idx = row * cols + col
        // Seeded pseudo-random displacement using sine
        const dx = Math.sin(idx * 7.3 + 2.1) * 35
        const dy = Math.cos(idx * 4.7 + 1.3) * 28
        const x = col * spacingX + spacingX / 2 + dx
        const y = row * spacingY + spacingY / 2 + dy
        const radius = 1.2 + Math.abs(Math.sin(idx * 3.1)) * 1.3
        n.push({ x, y, r: radius, id: idx })
      }
    }

    // Connect nearby nodes — skip some for organic feel
    for (let i = 0; i < n.length; i++) {
      for (let j = i + 1; j < n.length; j++) {
        const dx = n[i].x - n[j].x
        const dy = n[i].y - n[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)

        // Only connect if close and pseudo-randomly selected
        if (dist < 160 && Math.sin(i * 13.7 + j * 7.3) > -0.15) {
          e.push({
            x1: n[i].x, y1: n[i].y,
            x2: n[j].x, y2: n[j].y,
            id: `${i}-${j}`
          })
        }
      }
    }

    return { nodes: n, edges: e }
  }, [])

  const svgWidth = 1700
  const svgHeight = 1050

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Edges */}
      {edges.map((edge) => (
        <line
          key={edge.id}
          x1={edge.x1}
          y1={edge.y1}
          x2={edge.x2}
          y2={edge.y2}
          stroke="#242426"
          strokeWidth="0.6"
          strokeOpacity="0.5"
        />
      ))}
      {/* Nodes */}
      {nodes.map((node) => (
        <circle
          key={node.id}
          cx={node.x}
          cy={node.y}
          r={node.r}
          fill="#242426"
          fillOpacity="0.7"
        />
      ))}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════ */

const LandingPage = () => {
  // ── Landing state ──────────────────────────────────
  const [showLogin, setShowLogin] = useState(false)
  const [buttonVisible, setButtonVisible] = useState(false)

  // ── Original Login state (preserved exactly) ──────
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ error, setError ] = useState('')
  
  const location = useLocation()
  const { setUser } = useContext(UserContext)
  const navigate = useNavigate()
  
  // Check for error parameters in the URL
  useEffect(() => {
      const params = new URLSearchParams(location.search);
      const errorType = params.get('error');
      
      if (errorType === 'google_auth_failed') {
          setError('Google authentication failed. Please try again or use username/password.');
      } else if (errorType === 'no_token') {
          setError('Authentication token not received. Please try again.');
      } else if (errorType === 'callback_error') {
          setError('Error processing login. Please try again.');
      }
  }, [location]);

  // Show the CTA button after the narrative completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonVisible(true)
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

  function submitHandler(e) {
      e.preventDefault()
      setError('') // Clear previous errors

      axios.post('/users/login', {
          username,
          password
      }).then((res) => {
          console.log(res.data)

          localStorage.setItem('token', res.data.token)
          setUser(res.data.user)

          navigate('/')
      }).catch((err) => {
          console.log(err.response?.data)
          if (err.response?.status === 401) {
              setError('Incorrect username or password. Please try again or create an account.')
          } else {
              setError('Login failed. Please try again later.')
          }
      })
  }

  const handleGoogleLogin = () => {
      // Redirect to the Google OAuth endpoint
      window.open("https://photo-detector-backend.onrender.com/api/auth/google", "_self")
  }

  // ── Framer Motion Variants ─────────────────────────

  const narrativeLineVariant = {
    hidden: { opacity: 0, y: 12 },
    visible: (delay) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }),
    exit: {
      opacity: 0,
      y: -50,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  }

  const backgroundVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 0.3,
      transition: {
        duration: 2.0,
        delay: 0.2,
        ease: 'linear'
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  }

  const buttonVariant = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  }

  const loginVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  }

  // ── Render ─────────────────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center bg-base relative overflow-hidden">

      {/* ─── Layer 1: Faint grid underlay ──────────── */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }}
      />

      {/* ─── Layer 2: Connectivity Map — SVG ────────── */}
      <AnimatePresence>
        {!showLogin && (
          <motion.div
            key="connectivity-bg"
            className="absolute inset-0 pointer-events-none"
            variants={backgroundVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="absolute inset-[-15%] origin-center"
              animate={{ rotate: [0, 1.5, 0, -1.5, 0] }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              <ConnectivityMap />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Layer 3: Radial vignette ─────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, #121212 80%)'
        }}
      />

      <AnimatePresence mode="wait">
        {!showLogin ? (
          /* ═══════════════════════════════════════════
             HERO / NARRATIVE SECTION
             ═══════════════════════════════════════════ */
          <motion.div
            key="hero"
            className="relative z-10 max-w-2xl w-full px-8 text-center flex flex-col items-center"
            exit={{
              opacity: 0,
              y: -50,
              transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }
            }}
          >
            {/* Line 1 */}
            <motion.p
              className="text-text-primary text-3xl md:text-4xl font-light leading-snug tracking-tight"
              variants={narrativeLineVariant}
              initial="hidden"
              animate="visible"
              custom={0.5}
            >
              Structured Data is the fuel for Modern ML.
            </motion.p>

            {/* Line 2 */}
            <motion.p
              className="text-text-secondary text-xl md:text-2xl font-light mt-8 tracking-tight"
              variants={narrativeLineVariant}
              initial="hidden"
              animate="visible"
              custom={1.5}
            >
              Authenticity is the currency.
            </motion.p>

            {/* Line 3 */}
            <motion.p
              className="text-text-tertiary text-base md:text-lg font-light mt-6 leading-relaxed max-w-lg"
              variants={narrativeLineVariant}
              initial="hidden"
              animate="visible"
              custom={2.5}
            >
              Segregate your training data. Verify and Validate Uploaded Media. Stop noise at the source.
            </motion.p>

            {/* Divider */}
            <motion.div
              className="w-12 h-px mt-10 mb-10"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
              variants={narrativeLineVariant}
              initial="hidden"
              animate="visible"
              custom={3.2}
            />

            {/* CTA Button — Enhanced with hover glow */}
            <AnimatePresence>
              {buttonVisible && (
                <motion.button
                  onClick={() => setShowLogin(true)}
                  className="relative px-12 py-4 rounded-[8px] text-sm font-medium tracking-wide cursor-pointer outline-none"
                  style={{
                    backgroundColor: '#2F2F32',
                    color: '#888888',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                  variants={buttonVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{
                    color: '#E0E0E0',
                    borderColor: 'rgba(224, 224, 224, 0.12)',
                    boxShadow: '0 0 20px 1px rgba(224, 224, 224, 0.06), inset 0 0 12px rgba(224, 224, 224, 0.03)',
                  }}
                  whileTap={{
                    scale: 0.985,
                  }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1.0] }}
                >
                  Begin Verification
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

        ) : (
          /* ═══════════════════════════════════════════
             LOGIN FORM — Identical logic to original
             ═══════════════════════════════════════════ */
          <motion.div
            key="login"
            className="relative z-10 w-full max-w-md px-4"
            variants={loginVariant}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-surface border border-border rounded-[10px] p-12">
              <h1 className="text-text-primary text-2xl font-semibold mb-8 tracking-tight">Sign in</h1>
              {error && (
                  <div className="bg-danger-subtle text-danger border border-danger/20 p-4 rounded-[8px] mb-6 text-sm">
                      {error}
                  </div>
              )}
              <form onSubmit={submitHandler}>
                  <div className="mb-6">
                      <label className="block text-text-secondary text-xs font-medium uppercase tracking-widest mb-2.5" htmlFor="username">
                          Username
                      </label>
                      <input
                          className="w-full py-3 px-4 bg-surface-elevated border border-border rounded-[8px] text-text-primary placeholder-text-tertiary focus:outline-none focus:border-border-focus transition"
                          id="username"
                          type="text"
                          placeholder="Enter your username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                      />
                  </div>
                  <div className="mb-8">
                      <label className="block text-text-secondary text-xs font-medium uppercase tracking-widest mb-2.5" htmlFor="password">
                          Password
                      </label>
                      <input
                          className="w-full py-3 px-4 bg-surface-elevated border border-border rounded-[8px] text-text-primary placeholder-text-tertiary focus:outline-none focus:border-border-focus transition"
                          id="password"
                          type="password"
                          placeholder="••••••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                      />
                  </div>
                  <div className="flex items-center justify-between">
                      <button
                          className="bg-accent hover:bg-accent-hover text-base font-medium py-3 px-8 rounded-[8px] focus:outline-none transition"
                          type="submit"
                      >
                          Sign In
                      </button>
                      <Link
                          className="text-sm text-text-secondary hover:text-accent transition"
                          to="/register"
                      >
                          Create an Account
                      </Link>
                  </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LandingPage
