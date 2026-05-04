import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_PHONE = "27761232491";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}`;

export function WhatsAppSticky() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 hover:bg-[#1ebe5d] transition-all flex items-center justify-center"
    >
      <FaWhatsapp className="w-7 h-7" />
    </a>
  );
}