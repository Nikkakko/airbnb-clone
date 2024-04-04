import countries from "world-countries";

const formatedCountries = countries.map(country => ({
  label: country.name.common,
  value: country.cca2,
  flag: country.flag,
  latlng: country.latlng,
  region: country.region,
}));

const useCountries = () => {
  const getAll = () => formatedCountries;

  const getByValue = (value: string) => {
    return formatedCountries.find(country => country.label === value);
  };

  const getCoordinates = (value: string) => {
    const findCountry = formatedCountries.find(
      country => country.label === value
    );

    return findCountry?.latlng;
  };

  return { getAll, getByValue, getCoordinates };
};

export default useCountries;
