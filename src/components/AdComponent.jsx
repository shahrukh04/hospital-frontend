import { useEffect, useState } from "react";

const AdComponent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200); // Small delay for layout stability

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Load AdSense script if not already present
      if (!window.adsbygoogle) {
        const script = document.createElement("script");
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        script.async = true;
        script.onload = () => {
          // Once script loads, push ad
          if (window.adsbygoogle) {
            try {
              window.adsbygoogle.push({});
            } catch (e) {
              console.error("AdSense error:", e);
            }
          }
        };
        document.head.appendChild(script);
      } else {
        // If already present, just push ad
        try {
          window.adsbygoogle.push({});
        } catch (e) {
          console.error("AdSense error:", e);
        }
      }
    }
  }, [isVisible]);

  if (!isVisible) {
    return null; // Don't render the ad until after layout delay
  }

  return (
    <div className="flex justify-center my-4 w-full min-h-[90px]">
      {/* Google AdSense */}
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: "90px" }}
        data-ad-client="ca-pub-4811298709706693"
        data-ad-slot="6516548710"
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdComponent;
