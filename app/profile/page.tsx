"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProfile } from "@/lib/storage";
import { StudentProfile } from "@/lib/types";

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"];

export default function ProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState<StudentProfile>({name:"",state:"",category:"",annualIncome:0,marks:0,course:"",yearOfStudy:1,gender:"All",isDisabled:false,isSportsPlayer:false});
  const [focused, setFocused] = useState("");
  const set = (k: keyof StudentProfile, v: any) => setForm(p => ({...p,[k]:v}));
  const isValid = form.name && form.state && form.category && form.course;

  const inp = {
    width:"100%",border:"1.5px solid #e5e7eb",borderRadius:"12px",padding:"11px 14px",fontSize:"14px",outline:"none",boxSizing:"border-box" as const,transition:"all 0.2s",background:"white",color:"#111"
  };
  const inpFocused = {...inp, borderColor:"#6366f1", boxShadow:"0 0 0 4px rgba(99,102,241,0.1)"};

  return (
    <>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes blob1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(20px,-15px) scale(1.05)}66%{transform:translate(-15px,8px) scale(0.95)}}
        .section-card{background:white;border-radius:20px;border:1px solid #f0f0ff;padding:1.25rem 1.5rem;transition:all 0.3s}
        .section-card:hover{border-color:#e0e7ff;box-shadow:0 4px 20px rgba(99,102,241,0.06)}
        .pill-btn{padding:8px 18px;border-radius:100px;font-size:13px;font-weight:500;border:1.5px solid #e5e7eb;background:white;cursor:pointer;transition:all 0.2s;color:#374151}
        .pill-btn:hover{border-color:#c7d2fe;color:#4338ca;background:#eef2ff}
        .pill-btn.active{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;border-color:transparent;box-shadow:0 4px 12px rgba(99,102,241,0.3)}
        .submit-btn{width:100%;padding:14px;border-radius:18px;color:white;font-size:14px;font-weight:500;border:none;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:8px;background:linear-gradient(135deg,#6366f1,#8b5cf6)}
        .submit-btn:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(99,102,241,0.35)}
        .submit-btn:disabled{opacity:0.4;cursor:not-allowed;transform:none;box-shadow:none}
        .check-label{display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;padding:10px 14px;border-radius:12px;border:1.5px solid #e5e7eb;transition:all 0.2s;color:#374151;background:white}
        .check-label:hover{border-color:#c7d2fe;background:#f5f3ff}
      `}</style>

      <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",top:"-10%",right:"-5%",width:"400px",height:"400px",borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.08),transparent 70%)",animation:"blob1 10s ease-in-out infinite"}} />
        <div style={{position:"absolute",bottom:"-10%",left:"-5%",width:"350px",height:"350px",borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.06),transparent 70%)",animation:"blob1 12s ease-in-out infinite reverse"}} />
      </div>

      <div style={{maxWidth:"560px",margin:"0 auto",padding:"2.5rem 1rem",position:"relative",zIndex:1}}>

        <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"2rem",animation:"fadeUp 0.4s ease both"}}>
          <div style={{width:"52px",height:"52px",borderRadius:"16px",background:"linear-gradient(135deg,#eef2ff,#e0e7ff)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"24px",animation:"float 4s ease-in-out infinite"}}>👤</div>
          <div>
            <h1 style={{fontSize:"22px",fontWeight:"600",margin:"0 0 2px",color:"#111"}}>Your profile</h1>
            <p style={{fontSize:"13px",color:"#6b7280",margin:"0"}}>Fill once — AI matches you forever</p>
          </div>
          <div style={{marginLeft:"auto",background:"linear-gradient(135deg,#eef2ff,#e0e7ff)",borderRadius:"12px",padding:"6px 14px",fontSize:"11px",fontWeight:"500",color:"#4338ca"}}>
            Step 1 of 3
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>

          <div className="section-card" style={{animation:"fadeUp 0.4s ease 0.05s both"}}>
            <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"16px"}}>
              <span style={{fontSize:"16px"}}>👤</span>
              <p style={{fontSize:"12px",fontWeight:"600",color:"#6366f1",textTransform:"uppercase",letterSpacing:"0.06em",margin:"0"}}>Personal details</p>
            </div>
            <div style={{display:"grid",gap:"12px"}}>
              <div>
                <label style={{display:"block",fontSize:"12px",fontWeight:"500",color:"#374151",marginBottom:"6px"}}>Full name</label>
                <input style={focused==="name"?inpFocused:inp} value={form.name}
                  onChange={e=>set("name",e.target.value)}
                  onFocus={()=>setFocused("name")} onBlur={()=>setFocused("")}
                  placeholder="e.g. Manisha Sharma" />
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                <div>
                  <label style={{display:"block",fontSize:"12px",fontWeight:"500",color:"#374151",marginBottom:"6px"}}>State</label>
                  <select style={focused==="state"?inpFocused:inp} value={form.state}
                    onChange={e=>set("state",e.target.value)}
                    onFocus={()=>setFocused("state")} onBlur={()=>setFocused("")}>
                    <option value="">Select state</option>
                    {STATES.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{display:"block",fontSize:"12px",fontWeight:"500",color:"#374151",marginBottom:"6px"}}>Gender</label>
                  <select style={focused==="gender"?inpFocused:inp} value={form.gender}
                    onChange={e=>set("gender",e.target.value)}
                    onFocus={()=>setFocused("gender")} onBlur={()=>setFocused("")}>
                    <option value="All">Prefer not to say</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="section-card" style={{animation:"fadeUp 0.4s ease 0.1s both"}}>
            <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"16px"}}>
              <span style={{fontSize:"16px"}}>🏷️</span>
              <p style={{fontSize:"12px",fontWeight:"600",color:"#6366f1",textTransform:"uppercase",letterSpacing:"0.06em",margin:"0"}}>Eligibility details</p>
            </div>
            <div>
              <label style={{display:"block",fontSize:"12px",fontWeight:"500",color:"#374151",marginBottom:"10px"}}>Category</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:"8px",marginBottom:"16px"}}>
                {["General","OBC","SC","ST","Minority"].map(c=>(
                  <button key={c} type="button" onClick={()=>set("category",c)}
                    className={`pill-btn${form.category===c?" active":""}`}>{c}</button>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                <div>
                  <label style={{display:"block",fontSize:"12px",fontWeight:"500",color:"#374151",marginBottom:"6px"}}>Annual family income (Rs)</label>
                  <input style={focused==="income"?inpFocused:inp} type="number"
                    value={form.annualIncome||""} onChange={e=>set("annualIncome",Number(e.target.value))}
                    onFocus={()=>setFocused("income")} onBlur={()=>setFocused("")}
                    placeholder="e.g. 250000" />
                </div>
                <div>
                  <label style={{display:"block",fontSize:"12px",fontWeight:"500",color:"#374151",marginBottom:"6px"}}>Last exam marks (%)</label>
                  <input style={focused==="marks"?inpFocused:inp} type="number"
                    value={form.marks||""} onChange={e=>set("marks",Number(e.target.value))}
                    onFocus={()=>setFocused("marks")} onBlur={()=>setFocused("")}
                    placeholder="e.g. 78" min="0" max="100" />
                </div>
              </div>
            </div>
          </div>

          <div className="section-card" style={{animation:"fadeUp 0.4s ease 0.15s both"}}>
            <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"16px"}}>
              <span style={{fontSize:"16px"}}>🎓</span>
              <p style={{fontSize:"12px",fontWeight:"600",color:"#6366f1",textTransform:"uppercase",letterSpacing:"0.06em",margin:"0"}}>Education</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"14px"}}>
              <div>
                <label style={{display:"block",fontSize:"12px",fontWeight:"500",color:"#374151",marginBottom:"6px"}}>Course</label>
                <input style={focused==="course"?inpFocused:inp} value={form.course}
                  onChange={e=>set("course",e.target.value)}
                  onFocus={()=>setFocused("course")} onBlur={()=>setFocused("")}
                  placeholder="e.g. B.Tech CSE" />
              </div>
              <div>
                <label style={{display:"block",fontSize:"12px",fontWeight:"500",color:"#374151",marginBottom:"6px"}}>Year of study</label>
                <select style={focused==="year"?inpFocused:inp} value={form.yearOfStudy}
                  onChange={e=>set("yearOfStudy",Number(e.target.value))}
                  onFocus={()=>setFocused("year")} onBlur={()=>setFocused("")}>
                  {[1,2,3,4].map(y=><option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"flex",gap:"10px"}}>
              <label className="check-label" style={{flex:1}}>
                <input type="checkbox" checked={form.isDisabled} onChange={e=>set("isDisabled",e.target.checked)} style={{width:"16px",height:"16px",accentColor:"#6366f1"}} />
                <span>Differently abled</span>
                <span style={{marginLeft:"auto",fontSize:"16px"}}>♿</span>
              </label>
              <label className="check-label" style={{flex:1}}>
                <input type="checkbox" checked={form.isSportsPlayer} onChange={e=>set("isSportsPlayer",e.target.checked)} style={{width:"16px",height:"16px",accentColor:"#6366f1"}} />
                <span>Sports player</span>
                <span style={{marginLeft:"auto",fontSize:"16px"}}>🏅</span>
              </label>
            </div>
          </div>

          <button className="submit-btn" onClick={()=>{saveProfile(form);router.push("/results");}} disabled={!isValid}
            style={{animation:"fadeUp 0.4s ease 0.2s both"}}>
            Find my scholarships
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>

          {!isValid && (
            <p style={{textAlign:"center",fontSize:"12px",color:"#9ca3af",animation:"fadeUp 0.4s ease 0.25s both"}}>
              Fill all required fields to continue
            </p>
          )}
        </div>
      </div>
    </>
  );
}