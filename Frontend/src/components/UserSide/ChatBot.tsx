import { useEffect } from "react";

interface WindowWithChatbot extends Window {
  chtlConfig?: {
    chatbotId: string;
  };
}

const Chatbot = () => {
  useEffect(() => {
    (window as WindowWithChatbot).chtlConfig = { chatbotId: "9335149922" };
    
    const script = document.createElement("script");
    script.src = "https://chatling.ai/js/embed.js";
    script.async = true;
    script.dataset.id = "9335149922";
    script.id = "chatling-embed-script";
    
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // The chatbot widget loads automatically, no UI needed here
};

export default Chatbot;