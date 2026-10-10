const positions = ["0% 0%", "100% 0%", "0% 100%", "100% 100%"];
export default function SectorArt({ index }: { index: number }) {
  return (
    <div
      className="sector-art sector-photo"
      aria-hidden="true"
      style={{ backgroundPosition: positions[index] }}
    />
  );
}
