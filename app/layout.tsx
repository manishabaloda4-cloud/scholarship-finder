import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export const metadata: Metadata = {
  title: "ScholarshipFinder — Find Indian scholarships you qualify for",
  description: "AI-powered scholarship matching for Indian students.",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body style={{background:"#f8f7ff",minHeight:"100vh",margin:"0"}}>
        <nav style={{background:"rgba(255,255,255,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid #f0f0ff",padding:"0.75rem 1.5rem",position:"sticky",top:"0",zIndex:"50",boxShadow:"0 1px 20px rgba(99,102,241,0.06)"}}>
          <div style={{maxWidth:"1024px",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <Link href="/" style={{display:"flex",alignItems:"center",gap:"8px",textDecoration:"none"}}>
              <span style={{fontSize:"22px"}}>🎓</span>
              <span style={{fontSize:"15px",fontWeight:"600"}}>
                <span style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Scholarship</span>
                <span style={{color:"#111"}}>Finder</span>
              </span>
            </Link>
            <div style={{display:"flex",alignItems:"center",gap:"4px"}}>
              {[{href:"/profile",label:"Find matches",icon:"🔍"},{href:"/results",label:"Results",icon:"✨"},{href:"/tracker",label:"Tracker",icon:"📋"}].map(({href,label,icon})=>(
                <Link key={href} href={href} style={{display:"flex",alignItems:"center",gap:"5px",padding:"6px 12px",borderRadius:"10px",fontSize:"12px",fontWeight:"500",color:"#6b7280",textDecoration:"none",transition:"all 0.2s"}}>
                  <span>{icon}</span>{label}
                </Link>
              ))}
              <LogoutButton />
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}