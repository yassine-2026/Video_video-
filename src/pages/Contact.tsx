import SimplePage from '../components/SimplePage';

export default function Contact() {
  return (
    <SimplePage title="Contact Us">
      <p>
        Have questions, feedback, or need support? We'd love to hear from you.
      </p>
      <div className="mt-8 space-y-4">
        <div>
          <h4 className="font-semibold text-neutral-300">Email Support</h4>
          <p className="text-indigo-400">support@aivideoengine.com</p>
        </div>
        <div>
          <h4 className="font-semibold text-neutral-300">Business Inquiries</h4>
          <p className="text-indigo-400">hello@aivideoengine.com</p>
        </div>
      </div>
    </SimplePage>
  );
}
