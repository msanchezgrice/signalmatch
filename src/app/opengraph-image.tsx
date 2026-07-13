import { ImageResponse } from "next/og";
export const alt = "SignalMatch creator partnerships resources";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() { return new ImageResponse(<div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between",background:"#08070f",color:"#f7f5ff",padding:"72px",fontFamily:"Arial,sans-serif"}}><div style={{display:"flex",fontSize:32,fontWeight:700}}>SignalMatch</div><div style={{display:"flex",flexDirection:"column",gap:20}}><div style={{display:"flex",color:"#a78bfa",fontSize:22,letterSpacing:5,textTransform:"uppercase"}}>Creator partnerships</div><div style={{display:"flex",fontSize:68,lineHeight:1.03,fontWeight:750}}>Outcome-based growth, explained with evidence.</div></div></div>,size); }
