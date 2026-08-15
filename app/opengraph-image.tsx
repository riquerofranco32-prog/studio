import {
  renderSocialCard,
  SOCIAL_CARD_ALT,
  SOCIAL_CARD_SIZE,
} from "@/lib/og-card";

export const alt = SOCIAL_CARD_ALT;
export const size = SOCIAL_CARD_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderSocialCard();
}
