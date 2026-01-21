import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ImageSlider } from "@/components/home/ImageSlider";
import { ServicesSection } from "@/components/home/ServicesSection";
import { LocationSection } from "@/components/home/LocationSection";
import { ServiceCenterPromo } from "@/components/home/ServiceCenterPromo";
import { ContactSection } from "@/components/home/ContactSection";

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <HeroSection />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* About Section */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-center mb-6">
            Welcome to <span className="text-primary">VMOS</span>
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-8">
            Experience the ultimate gaming environment with high-end PCs, latest consoles, 
            and a vibrant community of gamers. Whether you're here to play, compete, or shop – we've got you covered.
          </p>
          <ServicesSection />
        </section>

        {/* Image Slider */}
        <section>
          <h2 className="font-heading text-xl font-bold mb-4">
            Our <span className="text-primary">Gaming Arena</span>
          </h2>
          <ImageSlider />
        </section>

        {/* Two Column Layout for Location & Service */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="font-heading text-xl font-bold mb-4">
              Find <span className="text-primary">Us</span>
            </h2>
            <LocationSection />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold mb-4">
              Repair <span className="text-primary">Services</span>
            </h2>
            <ServiceCenterPromo />
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <ContactSection />
        </section>
      </div>
    </Layout>
  );
};

export default Index;
