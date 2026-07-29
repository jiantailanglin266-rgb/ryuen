import SmoothScroll from "@/components/providers/SmoothScroll";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FixedMobileCta from "@/components/layout/FixedMobileCta";
import CustomCursor from "@/components/ui/CustomCursor";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Hero from "@/components/sections/Hero";
import Concept from "@/components/sections/Concept";
import Menu from "@/components/sections/Menu";
import SeasonalMenu from "@/components/sections/SeasonalMenu";
import Craft from "@/components/sections/Craft";
import Gallery from "@/components/sections/Gallery";
import Space from "@/components/sections/Space";
import Access from "@/components/sections/Access";
import Faq from "@/components/sections/Faq";
import FinalCta from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <SmoothScroll>
      <LoadingScreen />
      <CustomCursor />
      <Header />
      <main>
        <Hero />
        <Concept />
        <Menu />
        <SeasonalMenu />
        <Craft />
        <Gallery />
        <Space />
        <Access />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <FixedMobileCta />
    </SmoothScroll>
  );
}
