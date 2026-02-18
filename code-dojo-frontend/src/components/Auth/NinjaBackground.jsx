export default function NinjaBackground({ children }) {
  return (
    <div className="ninja-bg">
      {/* Stars */}
        <span className="star near s1">✦</span>
        <span className="star far s2">✦</span>
        <span className="star near s3">✦</span>
        <span className="star far s4">✦</span>
        <span className="star far s5">✦</span>
        <span className="star far s5">✦</span>
        <span className="star far s6">✦</span>
        <span className="star far s7">✦</span>
        <span className="star far s8">✦</span>
        <span className="star far s9">✦</span>



      {children}
    </div>
  );
}
