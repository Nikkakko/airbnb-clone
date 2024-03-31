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
    return formatedCountries.find(country => country.value === value);
  };

  return { getAll, getByValue };
};

export default useCountries;
