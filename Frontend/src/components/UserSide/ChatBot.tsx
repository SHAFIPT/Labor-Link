import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface WindowWithChatbot extends Window {
  chtlConfig?: {
    chatbotId: string;
  };
}

const Chatbot = () => {
  const location = useLocation();
  const currentPage = location.pathname.split("/").pop() || "";
  
  useEffect(() => {
    

    if (currentPage !== "" && currentPage !== "home") {
      return;
    }
    
    // Check if script already exists
    const existingScript = document.getElementById("chatling-embed-script");
    if (existingScript) {
      return; // Script already exists, don't add it again
    }
    
    (window as WindowWithChatbot).chtlConfig = { chatbotId: "9335149922" };
    
    const script = document.createElement("script");
    script.src = "https://chatling.ai/js/embed.js";
    script.async = true;
    script.dataset.id = "9335149922";
    script.id = "chatling-embed-script";
    
    document.body.appendChild(script);

    return () => {
      // Check if the script exists before removing it
      const embedScript = document.getElementById("chatling-embed-script");
      if (embedScript && embedScript.parentNode) {
        embedScript.parentNode.removeChild(embedScript);
      }
      
      // Clean up any chat widgets that might have been created
      const chatWidgets = document.querySelectorAll('[id^="chatling-"]');
      chatWidgets.forEach(widget => {
        if (widget.id !== "chatling-embed-script" && widget.parentNode) {
          widget.parentNode.removeChild(widget);
        }
      });
    };
  }, [currentPage, location.pathname]);

  return null;
};

export default Chatbot;