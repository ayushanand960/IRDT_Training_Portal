  export default function FeatureCard({ title, desc }) {
  return (
    <div className="col-md-4 mb-3">
      <div className="card h-100 shadow-sm">
        <div className="card-body text-center">
          <h5 className="card-title text-primary">{title}</h5>
          <p className="card-text">{desc}</p>
        </div>
      </div>
    </div>
  );
}
