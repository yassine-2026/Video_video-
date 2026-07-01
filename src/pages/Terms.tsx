import SimplePage from '../components/SimplePage';

export default function Terms() {
  return (
    <SimplePage title="Terms of Service">
      <p>
        By accessing our website, you are agreeing to be bound by these terms of service, 
        all applicable laws and regulations, and agree that you are responsible for compliance 
        with any applicable local laws.
      </p>
      <h3 className="text-xl font-semibold mt-6 mb-2">Use License</h3>
      <p>
        You are granted permission to temporarily use the materials and generated videos on 
        our website for personal, non-commercial, or commercial use, subject to the terms of 
        the underlying AI providers (Runway, Luma, Pika).
      </p>
    </SimplePage>
  );
}
