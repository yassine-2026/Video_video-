import SimplePage from '../components/SimplePage';

export default function About() {
  return (
    <SimplePage title="About Us">
      <p>
        We are building the next generation of AI video generation tools. Our platform 
        integrates with top-tier AI providers like Runway, Luma, and Pika to give you 
        the best possible results, all in one place.
      </p>
      <p className="mt-4">
        Our mission is to democratize high-quality video production, making it accessible 
        to creators, marketers, and filmmakers worldwide.
      </p>
    </SimplePage>
  );
}
