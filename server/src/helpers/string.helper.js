export const capitalizeName = (name) => {
  const formattedName = name
    .toLowerCase()
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
  return formattedName;
};

export const capitalizeQuote = (quote) => {
  const formattedQuote =
    quote.charAt(0).toUpperCase() + quote.slice(1).toLowerCase();
  return formattedQuote;
};
