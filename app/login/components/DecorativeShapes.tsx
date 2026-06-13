export default function DecorativeShapes() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <img
        src="/assets/images/shape1.svg"
        alt=""
        className="absolute top-0 left-0"
        style={{ width: "auto", height: "auto", maxWidth: "200px" }}
      />
      <img
        src="/assets/images/shape2.svg"
        alt=""
        className="absolute top-0 right-5"
        style={{ width: "auto", height: "auto", maxWidth: "450px" }}
      />
      <img
        src="/assets/images/shape3.svg"
        alt=""
        className="absolute bottom-0 right-[327px] hidden xl:block"
        style={{ width: "auto", height: "auto", maxWidth: "450px" }}
      />
    </div>
  );
}
