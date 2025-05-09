
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">{t('nav.about')}</h1>
          
          <div className="max-w-3xl mx-auto prose prose-invert">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, velit vel bibendum bibendum, elit elit bibendum elit, vel bibendum elit elit vel.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, velit vel bibendum bibendum, elit elit bibendum elit, vel bibendum elit elit vel.</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
