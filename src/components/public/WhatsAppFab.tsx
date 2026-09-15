import { WaIcon } from "@/components/icons";
import { quickChatMessage, whatsappLink } from "@/lib/whatsapp";
import { siteConfig } from "@/config/site";

export default function WhatsAppFab() {
  return (
    <a
      className="fab"
      href={whatsappLink(quickChatMessage())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${siteConfig.brand} on WhatsApp`}
    >
      <WaIcon />
      <span>WhatsApp</span>
    </a>
  );
}
