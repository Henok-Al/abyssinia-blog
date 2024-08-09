import { Typography } from "@material-tailwind/react";
import { useContext } from "react";
import myContext from "../context/data/myContext";

function HeroSection() {
  const context = useContext(myContext);
  const { mode } = context;

  // Define colors based on mode
  const backgroundColor = mode === "dark" ? "rgb(30, 41, 59)" : "#FFEDD7";
  const textColor = mode === "dark" ? "white" : "black";

  return (
    <section style={{ background: backgroundColor }}>
      {/* Hero Section */}
      <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
        {/* Main Content */}
        <main>
          <div className="text-center">
            <div className="mb-2">
              {/* Image */}
              <div className="flex justify-center w-14 h-14">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/17072/17072589.png"
                  alt="AbyssiniaBlog Logo"
                />
              </div>

              {/* Title */}
              <h1 className={`text-3xl font-bold text-${textColor}`}>
                AbyssiniaBlog
              </h1>
            </div>

            {/* Paragraph */}
            <p
              className={`sm:text-3xl text-xl font-extralight sm:mx-auto text-${textColor}`}
            >
              Here are some latest blogs.
            </p>
          </div>
        </main>
      </div>
    </section>
  );
}

export default HeroSection;
