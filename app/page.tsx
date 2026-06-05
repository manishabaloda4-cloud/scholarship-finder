import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#eef2ff,#fff,#f5f3ff)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
      <div style={{maxWidth:"560px",width:"100%",textAlign:"center"}}>
        <div style={{fontSize:"56px",marginBottom:"1rem"}}>🎓</div>
        <h1 style={{fontSize:"2rem",fontWeight:"600",marginBottom:"1rem",color:"#111"}}>
          <span style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Scholarship</span>Finder
        </h1>
        <p style={{color:"#6b7280",marginBottom:"2rem",fontSize:"16px"}}>AI-powered scholarship matching for Indian students. Fill your profile once — get matched instantly.</p>
        <Link href="/login" style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"white",padding:"14px 32px",borderRadius:"16px",textDecoration:"none",fontSize:"15px",fontWeight:"500"}}>
          Get started →
        </Link>
      </div>
    </div>
  );
}