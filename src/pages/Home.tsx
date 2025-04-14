// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Server, RefreshCw, Zap, Globe, Lock, Activity, AlertCircle } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  // Colors for consistency across components
  const colors = {
    background: '#121212',
    backgroundDark: '#0a0a0a',
    accent: '#FF3A00',
    accentLight: '#FF5C00',
    accentDark: '#CC2500',
    accentTransparent: 'rgba(255, 58, 0, 0.15)',
    success: '#00E396',
    successTransparent: 'rgba(0, 227, 150, 0.15)',
    warning: '#FFAB00',
    warningTransparent: 'rgba(255, 171, 0, 0.15)',
    info: '#00B2FF',
    infoTransparent: 'rgba(0, 178, 255, 0.15)',
    error: '#FF3A00',
    errorTransparent: 'rgba(255, 58, 0, 0.15)',
    text: '#FFFFFF',
    textSecondary: '#E0E0E0',
    textMuted: '#AAAAAA',
    cardBg: '#1E1E1E',
    cardBgDark: '#171717',
    cardBgLight: '#252525',
    darkGrey: '#333333',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    chartColors: ['#FF3A00', '#00E396', '#FFAB00', '#00B2FF', '#A66AFC', '#58D0FF', '#FF5C41', '#2CCCB0'],
  };

  // Animation for fade-in effect
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Features data for the cards
  const features = [
    {
      title: "Real-Time Swarm Intelligence",
      description: "Our distributed agent network shares threat intel in real-time, creating a collective defense system that learns and adapts automatically.",
      icon: <Globe size={32} color={colors.accent} />,
      bgColor: "rgba(255, 58, 0, 0.1)",
      borderColor: "rgba(255, 58, 0, 0.3)"
    },
    {
      title: "Metamorphic Edge Proxies",
      description: "Dynamic encryption and packet morphing at the edge creates an ever-changing attack surface that's nearly impossible for attackers to profile.",
      icon: <RefreshCw size={32} color={colors.info} />,
      bgColor: "rgba(0, 178, 255, 0.1)",
      borderColor: "rgba(0, 178, 255, 0.3)"
    },
    {
      title: "Advanced Analytics",
      description: "Powerful visualization and correlation tools that turn complex threat data into actionable intelligence and measurable security outcomes.",
      icon: <Activity size={32} color={colors.success} />,
      bgColor: "rgba(0, 227, 150, 0.1)",
      borderColor: "rgba(0, 227, 150, 0.3)"
    },
    {
      title: "AI-Powered Threat Detection",
      description: "Machine learning models continuously analyze patterns to identify sophisticated attacks before they can cause damage.",
      icon: <Zap size={32} color={colors.warning} />,
      bgColor: "rgba(255, 171, 0, 0.1)",
      borderColor: "rgba(255, 171, 0, 0.3)"
    },
    {
      title: "Decentralized Architecture",
      description: "Eliminate single points of failure with our distributed system that remains operational even when parts of your network are compromised.",
      icon: <Server size={32} color={colors.accent} />,
      bgColor: "rgba(255, 58, 0, 0.1)",
      borderColor: "rgba(255, 58, 0, 0.3)"
    },
    {
      title: "Enterprise-Grade Security",
      description: "Built from the ground up with zero-trust principles and military-grade encryption to protect your most sensitive infrastructure.",
      icon: <Lock size={32} color={colors.info} />,
      bgColor: "rgba(0, 178, 255, 0.1)",
      borderColor: "rgba(0, 178, 255, 0.3)"
    }
  ];

  return (
    <div
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        minHeight: 'calc(100vh - 60px)', // Adjust based on NavBar height
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Demo Banner */}
      <div style={{
        backgroundColor: colors.warningTransparent,
        borderBottom: `1px solid ${colors.warning}`,
        padding: '10px 20px',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px'
      }}>
        <AlertCircle size={18} color={colors.warning} />
        <span style={{ color: colors.warning, fontWeight: 600 }}>
          DEMO ONLY: Sentinel Swarm is currently in early development and not yet available for production use.
        </span>
      </div>

      {/* Hero Section */}
      <div
        style={{
          padding: '80px 20px',
          background: `linear-gradient(135deg, ${colors.backgroundDark} 0%, ${colors.background} 100%)`,
          position: 'relative',
          borderBottom: `1px solid ${colors.borderColor}`,
          overflow: 'hidden',
        }}
      >
        {/* Animated background elements */}
        <div className="bg-elements">
          <div className="hex-grid"></div>
        </div>

        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 2,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '15px',
              background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentLight} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px',
              boxShadow: '0 10px 25px rgba(255, 58, 0, 0.5)',
            }}
          >
            <Shield size={40} color="#FFFFFF" />
          </div>

          <h1
            style={{
              fontSize: '3.5rem',
              fontWeight: 800,
              marginBottom: '20px',
              background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentLight} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 10px rgba(255, 58, 0, 0.2)',
            }}
          >
            Sentinel Swarm
          </h1>

          <h2
            style={{
              fontSize: '1.8rem',
              fontWeight: 400,
              marginBottom: '30px',
              color: colors.textSecondary,
            }}
          >
            Enterprise Security Redefined
          </h2>

          <p
            style={{
              fontSize: '1.2rem',
              lineHeight: 1.6,
              marginBottom: '40px',
              maxWidth: '800px',
              color: colors.textMuted,
            }}
          >
            Our innovative platform combines Geo‑Swarm Defensive Orchestration (GSDO) with 
            Metamorphic Proxy at the Edge (MPE) to create a dynamic, self‑adapting 
            cybersecurity fabric. Experience real‑time threat detection, adaptive defenses, 
            and advanced analytics — all in one powerful, decentralized platform.
          </p>

          <div style={{ display: 'flex', gap: '20px' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                backgroundColor: colors.accent,
                color: colors.text,
                padding: '14px 30px',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1.1rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease-in-out, transform 0.2s ease-in-out',
                boxShadow: '0 4px 15px rgba(255, 58, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = colors.accentLight;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(255, 58, 0, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = colors.accent;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 58, 0, 0.3)';
              }}
            >
              Explore Dashboard Demo
            </button>

            <button
              onClick={() => window.open('https://github.com/ame0101/sentinel-swarm', '_blank')}
              style={{
                backgroundColor: 'transparent',
                color: colors.text,
                padding: '14px 30px',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1.1rem',
                border: `1px solid ${colors.borderColor}`,
                cursor: 'pointer',
                transition: 'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = colors.textMuted;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = colors.borderColor;
              }}
            >
              Documentation
            </button>
          </div>

          <div
            style={{
              marginTop: '60px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              padding: '15px 25px',
              borderRadius: '30px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ fontSize: '0.9rem', color: colors.warning }}>
              ● DEMO PREVIEW
            </span>
            <span style={{ fontSize: '0.9rem', color: colors.textMuted }}>
              Concept Demonstration | Version: 2.4.8 | Not Production Ready
            </span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div
        style={{
          padding: '80px 20px',
          backgroundColor: colors.backgroundDark,
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <h2
            style={{
              fontSize: '2.2rem',
              fontWeight: 700,
              marginBottom: '20px',
              textAlign: 'center',
              color: colors.text,
            }}
          >
            Advanced Security Features
          </h2>
          
          <p style={{
            fontSize: '1.1rem',
            color: colors.textMuted,
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto 60px auto',
            lineHeight: 1.6,
          }}>
            These features are conceptual visualizations of our in-development technologies.
            Our team is actively working to bring these capabilities to market.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '30px',
            }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: colors.cardBg,
                  borderRadius: '12px',
                  padding: '30px',
                  border: `1px solid ${feature.borderColor}`,
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  cursor: 'pointer',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    backgroundColor: feature.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 600,
                    marginBottom: '15px',
                    color: colors.text,
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: '1rem',
                    color: colors.textMuted,
                    lineHeight: 1.6,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div
        style={{
          padding: '80px 20px',
          background: `linear-gradient(135deg, ${colors.backgroundDark} 0%, ${colors.background} 100%)`,
          borderTop: `1px solid ${colors.borderColor}`,
        }}
      >
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: '2.4rem',
              fontWeight: 700,
              marginBottom: '20px',
              color: colors.text,
            }}
          >
            Experience Our Vision
          </h2>
          <p
            style={{
              fontSize: '1.2rem',
              lineHeight: 1.6,
              marginBottom: '40px',
              color: colors.textMuted,
            }}
          >
            While Sentinel Swarm is still in development, you can explore our interactive dashboard demo to see our vision for the future of cybersecurity.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              backgroundColor: colors.accent,
              color: colors.text,
              padding: '16px 36px',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '1.2rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease-in-out, transform 0.2s ease-in-out',
              boxShadow: '0 4px 15px rgba(255, 58, 0, 0.3)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = colors.accentLight;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(255, 58, 0, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = colors.accent;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 58, 0, 0.3)';
            }}
          >
            Launch Interactive Demo
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          padding: '30px 20px',
          backgroundColor: colors.backgroundDark,
          borderTop: `1px solid ${colors.borderColor}`,
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Shield size={20} color={colors.accent} />
            <span style={{ fontSize: '0.9rem', color: colors.textMuted }}>
              © 2025 Sentinel Swarm • Concept Demonstration
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: colors.textMuted, maxWidth: '700px', margin: '0 auto' }}>
            <strong>IMPORTANT DISCLAIMER:</strong> This is a technology demonstration only. Sentinel Swarm is a conceptual prototype in early development 
            and not a production-ready product. All data shown is simulated for demonstration purposes.
            <br />Version 2.4.8 | Demo data current as of: April 13, 2025
          </p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
            
            <a
              href="#"
              style={{
                color: colors.textMuted,
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.2s ease-in-out',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = colors.accent;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = colors.textMuted;
              }}
            >
              Privacy Policy
            </a>
            <a
              href="#"
              style={{
                color: colors.textMuted,
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.2s ease-in-out',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = colors.accent;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = colors.textMuted;
              }}
            >
              Terms of Service
            </a>
            <a
              href="#"
              style={{
                color: colors.textMuted,
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.2s ease-in-out',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = colors.accent;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = colors.textMuted;
              }}
            >
              Contact
            </a>
          </div>
        </div>
      </footer>

      {/* CSS for Animated Background */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .bg-elements {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              overflow: hidden;
              z-index: 1;
            }
            
            .hex-grid {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-image: 
                radial-gradient(circle at 50% 50%, rgba(255, 58, 0, 0.1) 0%, transparent 50%),
                linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.03) 25%, rgba(255, 255, 255, 0.03) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.03) 75%, rgba(255, 255, 255, 0.03) 76%, transparent 77%, transparent),
                linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.03) 25%, rgba(255, 255, 255, 0.03) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.03) 75%, rgba(255, 255, 255, 0.03) 76%, transparent 77%, transparent);
              background-size: 
                100% 100%, 
                50px 50px, 
                50px 50px;
            }
          `,
        }}
      />
    </div>
  );
};

export default Home;