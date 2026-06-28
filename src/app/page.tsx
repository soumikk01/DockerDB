import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Workflow from '@/components/Workflow';
import DevExperience from '@/components/DevExperience';
import CtaSection from '@/components/CtaSection';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

function SectionDivider() {
  return (
    <div className="container">
      <div className="section-divider" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <Hero />
      <SectionDivider />
      <Features />
      <SectionDivider />
      <Workflow />
      <SectionDivider />
      <DevExperience />
      <SectionDivider />
      <CtaSection />
      <Footer />
      <ScrollReveal />
    </div>
  );
}
