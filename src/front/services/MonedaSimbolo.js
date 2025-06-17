
export const MonedaSimbolo = () => {
  const moneda = sessionStorage.getItem("restaurante_moneda") || "EUR"; // Si no hay, por defecto EUR
  switch (moneda) {
    case "EUR":
      return "€";
    case "USD":
      return "$";
    case "GBP":
      return "£";
    default:
      return "€"; // Siempre devolvemos un símbolo válido
  }
};