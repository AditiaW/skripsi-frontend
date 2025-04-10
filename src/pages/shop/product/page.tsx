import Header from "@/components/header";
import Footer from "@/components/footer";
import Main from "@/pages/shop/product/component/main";

const page = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header></Header>
      <Main></Main>
      <Footer></Footer>
    </div>
  );
};

export default page;
