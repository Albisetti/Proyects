// Converts a string of text (separated by spaces) to be lowercase
// and connected by dashes. This is useful for anchor links.
// e.g. Our Services -> our-services
export const dashify = (string) =>
  string.trim().toLowerCase().split(' ').join('-')
