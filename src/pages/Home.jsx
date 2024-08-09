import BlogPostCard from "../components/BlogPostCard";
import HeroSection from "../components/HeroSection";
import Layout from "../components/Layout";

function Home() {
  return (
    <Layout>
      <HeroSection />
      <BlogPostCard />
    </Layout>
  );
}

export default Home;
