"use client";
import { useState } from "react";

type Step = "enter" | "sent" | "verify";

export default function LoginPage() {
  const [step, setStep] = useState<Step>("enter");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState(["","","","","",""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendCode() {
    if (!email.includes("@") || !name.trim()) { setError("Please enter a valid email and name."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/send-otp", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({email,name}) });
      const data = await res.json();
      if (data.error) { setError(data.error); setLoading(false); return; }
      setLoading(false); setStep("sent");
      setTimeout(() => setStep("verify"), 2000);
    } catch { setError("Something went wrong."); setLoading(false); }
  }

  async function verifyCode() {
    const fullCode = code.join("");
    if (fullCode.length < 6) { setError("Enter all 6 digits."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/verify-otp", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({email,code:fullCode}) });
      const data = await res.json();
      if (data.error) { setError(data.error); setLoading(false); return; }
      localStorage.setItem("sf_user", JSON.stringify({name:data.name, email:data.email}));
      document.cookie = "sf_user=" + encodeURIComponent(JSON.stringify({name:data.name,email:data.email})) + "; path=/; max-age=86400";
      window.location.href = "/profile";
    } catch { setError("Something went wrong."); setLoading(false); }
  }

  function handleDigit(i: number, val: string) {
    if (!/^\d*$/.test(val)) return;
    const next = [...code]; next[i] = val.slice(-1); setCode(next);
    if (val && i < 5) document.getElementById("d"+(i+1))?.focus();
  }

  function handleBackspace(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !code[i] && i > 0) document.getElementById("d"+(i-1))?.focus();
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes blob1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.1)}66%{transform:translate(-20px,10px) scale(0.9)}}
        @keyframes blob2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-30px,20px) scale(1.1)}66%{transform:translate(20px,-10px) scale(0.9)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.8;transform:scale(0.98)}}
        .login-input{width:100%;border:1.5px solid #e5e7eb;border-radius:14px;padding:12px 16px;font-size:14px;outline:none;box-sizing:border-box;transition:all 0.2s;background:white;color:#111}
        .login-input:focus{border-color:#6366f1;box-shadow:0 0 0 4px rgba(99,102,241,0.1)}
        .otp-input{width:52px;height:60px;text-align:center;font-size:24px;font-weight:600;border:1.5px solid #e5e7eb;border-radius:14px;outline:none;box-sizing:border-box;transition:all 0.2s;background:white;color:#111}
        .otp-input:focus{border-color:#6366f1;box-shadow:0 0 0 4px rgba(99,102,241,0.1);transform:scale(1.05)}
        .btn-primary{width:100%;padding:14px;border-radius:16px;color:white;font-size:14px;font-weight:500;border:none;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:8px}
        .btn-primary:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(99,102,241,0.3)}
        .btn-primary:active{transform:translateY(0)}
        .card{background:rgba(255,255,255,0.95);backdrop-filter:blur(20px);border-radius:28px;border:1px solid rgba(255,255,255,0.8);padding:2.5rem;animation:fadeUp 0.5s ease both;box-shadow:0 20px 60px rgba(99,102,241,0.1)}
        .feature-pill{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.9);border:1px solid rgba(99,102,241,0.15);border-radius:100px;padding:8px 16px;font-size:12px;font-weight:500;color:#4338ca}
      `}</style>

      <div style={{minHeight:"100vh",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",overflow:"hidden",background:"#fafafa"}}>
        
        {/* Animated background blobs */}
        <div style={{position:"fixed",top:"-20%",left:"-10%",width:"500px",height:"500px",borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.15),transparent 70%)",animation:"blob1 8s ease-in-out infinite",pointerEvents:"none"}} />
        <div style={{position:"fixed",bottom:"-20%",right:"-10%",width:"600px",height:"600px",borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.12),transparent 70%)",animation:"blob2 10s ease-in-out infinite",pointerEvents:"none"}} />
        <div style={{position:"fixed",top:"40%",right:"15%",width:"300px",height:"300px",borderRadius:"50%",background:"radial-gradient(circle,rgba(16,185,129,0.08),transparent 70%)",animation:"blob1 12s ease-in-out infinite",pointerEvents:"none"}} />

        <div style={{width:"100%",maxWidth:"440px",position:"relative",zIndex:1}}>

          {/* Logo area */}
          <div style={{textAlign:"center",marginBottom:"1.5rem",animation:"fadeUp 0.4s ease both"}}>
            <div style={{fontSize:"52px",display:"inline-block",animation:"float 3s ease-in-out infinite",filter:"drop-shadow(0 8px 16px rgba(99,102,241,0.3))"}}>🎓</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",marginTop:"8px"}}>
              <span style={{fontSize:"20px",fontWeight:"600",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Scholarship</span>
              <span style={{fontSize:"20px",fontWeight:"600",color:"#111"}}>Finder</span>
            </div>
            <p style={{fontSize:"13px",color:"#6b7280",margin:"4px 0 0"}}>Find Indian scholarships you qualify for</p>
          </div>

          {/* Feature pills */}
          <div style={{display:"flex",gap:"8px",justifyContent:"center",marginBottom:"1.5rem",flexWrap:"wrap",animation:"fadeUp 0.4s ease 0.05s both"}}>
            <div className="feature-pill">✨ AI-powered</div>
            <div className="feature-pill">🆓 Free forever</div>
            <div className="feature-pill">🔒 Secure login</div>
          </div>

          {step === "enter" && (
            <div className="card">
              <h2 style={{fontSize:"18px",fontWeight:"500",margin:"0 0 4px",color:"#111"}}>Welcome back</h2>
              <p style={{fontSize:"13px",color:"#6b7280",margin:"0 0 24px"}}>Sign in to find scholarships matched for you</p>
              
              <div style={{marginBottom:"16px"}}>
                <label style={{display:"block",fontSize:"12px",fontWeight:"500",color:"#374151",marginBottom:"6px"}}>Full name</label>
                <input className="login-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Manisha Sharma" />
              </div>
              <div style={{marginBottom:"20px"}}>
                <label style={{display:"block",fontSize:"12px",fontWeight:"500",color:"#374151",marginBottom:"6px"}}>Email address</label>
                <input className="login-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendCode()} placeholder="you@gmail.com" />
              </div>
              
              {error && (
                <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"10px",padding:"10px 12px",marginBottom:"16px",fontSize:"12px",color:"#dc2626"}}>
                  {error}
                </div>
              )}
              
              <button className="btn-primary" onClick={sendCode} disabled={loading}
                style={{background:loading?"#a5b4fc":"linear-gradient(135deg,#6366f1,#8b5cf6)"}}>
                {loading ? (
                  <><div style={{width:"16px",height:"16px",border:"2px solid white",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 1s linear infinite"}} />Sending code...</>
                ) : "Send verification code →"}
              </button>
              
              <div style={{display:"flex",alignItems:"center",gap:"12px",margin:"20px 0"}}>
                <div style={{flex:1,height:"1px",background:"#f3f4f6"}} />
                <span style={{fontSize:"11px",color:"#9ca3af"}}>A 6-digit OTP will be sent</span>
                <div style={{flex:1,height:"1px",background:"#f3f4f6"}} />
              </div>
              
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px"}}>
                {[{icon:"🏛️",text:"50+ scholarships"},{icon:"🤖",text:"AI matching"},{icon:"⚡",text:"Instant results"}].map(({icon,text})=>(
                  <div key={text} style={{background:"#f9fafb",borderRadius:"12px",padding:"10px",textAlign:"center"}}>
                    <div style={{fontSize:"18px",marginBottom:"4px"}}>{icon}</div>
                    <div style={{fontSize:"10px",color:"#6b7280",fontWeight:"500"}}>{text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === "sent" && (
            <div className="card" style={{textAlign:"center"}}>
              <div style={{width:"72px",height:"72px",borderRadius:"50%",background:"linear-gradient(135deg,#ecfdf5,#d1fae5)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:"32px"}}>📬</div>
              <h2 style={{fontSize:"20px",fontWeight:"500",margin:"0 0 8px",color:"#111"}}>Check your inbox!</h2>
              <p style={{fontSize:"13px",color:"#6b7280",margin:"0 0 20px"}}>We sent a verification code to</p>
              <div style={{background:"#eef2ff",borderRadius:"12px",padding:"10px 16px",marginBottom:"20px"}}>
                <span style={{fontSize:"14px",fontWeight:"500",color:"#4338ca"}}>{email}</span>
              </div>
              <div style={{display:"flex",justifyContent:"center",gap:"6px",marginBottom:"8px"}}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{width:"8px",height:"8px",borderRadius:"50%",background:"#6366f1",animation:`pulse 1.4s ease ${i*0.2}s infinite`}} />
                ))}
              </div>
              <p style={{fontSize:"12px",color:"#9ca3af"}}>Redirecting to verification...</p>
            </div>
          )}

          {step === "verify" && (
            <div className="card">
              <div style={{textAlign:"center",marginBottom:"24px"}}>
                <div style={{width:"64px",height:"64px",borderRadius:"50%",background:"linear-gradient(135deg,#eef2ff,#e0e7ff)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:"28px"}}>🔐</div>
                <h2 style={{fontSize:"18px",fontWeight:"500",margin:"0 0 6px",color:"#111"}}>Enter verification code</h2>
                <p style={{fontSize:"13px",color:"#6b7280",margin:"0"}}>Sent to <strong style={{color:"#4338ca"}}>{email}</strong></p>
              </div>
              
              <div style={{display:"flex",gap:"8px",justifyContent:"center",marginBottom:"24px"}}>
                {code.map((digit,i)=>(
                  <input key={i} id={"d"+i} className="otp-input" type="text" inputMode="numeric" maxLength={1}
                    value={digit} onChange={e=>handleDigit(i,e.target.value)} onKeyDown={e=>handleBackspace(i,e)} />
                ))}
              </div>
              
              {error && (
                <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"10px",padding:"10px 12px",marginBottom:"16px",fontSize:"12px",color:"#dc2626",textAlign:"center"}}>
                  {error}
                </div>
              )}
              
              <button className="btn-primary" onClick={verifyCode} disabled={loading}
                style={{background:loading?"#6ee7b7":"linear-gradient(135deg,#059669,#0891b2)",marginBottom:"16px"}}>
                {loading ? (
                  <><div style={{width:"16px",height:"16px",border:"2px solid white",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 1s linear infinite"}} />Verifying...</>
                ) : "Verify and continue ✓"}
              </button>
              
              <p style={{textAlign:"center",fontSize:"12px",color:"#9ca3af",margin:"0"}}>
                Did not receive the code?{" "}
                <span onClick={()=>{setStep("enter");setCode(["","","","","",""]);setError("");}}
                  style={{color:"#6366f1",cursor:"pointer",fontWeight:"500",textDecoration:"underline"}}>
                  Send again
                </span>
              </p>
            </div>
          )}

          {/* Step indicators */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",marginTop:"20px",animation:"fadeUp 0.5s ease 0.2s both"}}>
            {[{s:"enter",l:"Email"},{s:"sent",l:"Inbox"},{s:"verify",l:"Verify"}].map(({s,l},i)=>(
              <>
                <div key={s} style={{display:"flex",alignItems:"center",gap:"6px"}}>
                  <div style={{width:"22px",height:"22px",borderRadius:"50%",fontSize:"11px",fontWeight:"500",display:"flex",alignItems:"center",justifyContent:"center",background:step===s?"#6366f1":"#f3f4f6",color:step===s?"white":"#9ca3af",transition:"all 0.3s"}}>{i+1}</div>
                  <span style={{fontSize:"11px",fontWeight:step===s?"500":"400",color:step===s?"#6366f1":"#9ca3af",transition:"all 0.3s"}}>{l}</span>
                </div>
                {i < 2 && <div key={"line"+i} style={{width:"20px",height:"1px",background:"#e5e7eb"}} />}
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}