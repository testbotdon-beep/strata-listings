/**
 * Build a WhatsApp click-to-chat URL for a given phone number + prefilled message.
 * Phone can be in any format (+65 9123 4567, 91234567, etc.) — this strips non-digits
 * and assumes Singapore (+65) if no country code is present.
 */
export function whatsappUrl(phone: string, message?: string): string {
  let digits = phone.replace(/\D/g, '')
  // If it looks like a local SG number (8 digits starting with 8 or 9), prepend 65
  if (digits.length === 8 && (digits.startsWith('8') || digits.startsWith('9'))) {
    digits = '65' + digits
  }
  const base = `https://wa.me/${digits}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
