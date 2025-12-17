import md5 from "blueimp-md5";

export function getAvatarFromEmail(email) {
  if (!email) return "/default-avatar.png"; // fallback image in /public
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
}
