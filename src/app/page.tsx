import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SectionDivider from '@/components/SectionDivider';
import Features from '@/components/Features';
import Workflow from '@/components/Workflow';
import DevExperience from '@/components/DevExperience';
import CtaSection from '@/components/CtaSection';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import IconProvider from '@/components/IconProvider';

export default function Home() {
  return (
    <IconProvider>
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
    </IconProvider>
  );
}

