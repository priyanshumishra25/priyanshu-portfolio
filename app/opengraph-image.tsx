import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#f3ede2",
        padding: 72,
        fontFamily: "Georgia, serif",
        color: "#26221d",
        position: "relative",
      }}
    >
      <div
        style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: 760 }}
      >
        <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 0.95, letterSpacing: -2 }}>
          PRIYANSHU
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 0.95, letterSpacing: -2 }}>
          MISHRA
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 26,
            letterSpacing: 6,
            color: "#5b5348",
            fontFamily: "monospace",
          }}
        >
          SOFTWARE ENGINEER
        </div>
        <div style={{ marginTop: 28, fontSize: 34, fontStyle: "italic", lineHeight: 1.3 }}>
          {`"${site.tagline}"`}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 90,
          top: 150,
          width: 300,
          height: 300,
          borderRadius: 999,
          background: "#e3a73b",
          border: "8px solid #2b2620",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 120,
          fontWeight: 700,
          boxShadow: "16px 16px 0 #2b2620",
        }}
      >
        PM
      </div>
    </div>,
    size,
  );
}
