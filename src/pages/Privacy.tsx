import SimplePage from '../components/SimplePage';

export default function Privacy() {
  return (
    <SimplePage title="Privacy Policy">
      <p>
        Your privacy is important to us. It is our policy to respect your privacy regarding 
        any information we may collect from you across our website and other sites we own and operate.
      </p>
      <h3 className="text-xl font-semibold mt-6 mb-2">Information we collect</h3>
      <p>
        We only ask for personal information when we truly need it to provide a service to you. 
        We collect it by fair and lawful means, with your knowledge and consent. 
        All uploaded images and generated videos are temporarily stored and automatically deleted 
        after processing.
      </p>
    </SimplePage>
  );
}
