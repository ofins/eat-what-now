import SearchResultList from "./google/SearchResultList";
import data from "./google/data.json";

const Search = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <SearchResultList
        searchResults={data}
        loading={false}
        onSelectPlace={(place) => {
          console.log("Selected place:", place);
          // Here you would typically:
          // 1. Add the restaurant to your database
          // 2. Navigate to the restaurant details
          // 3. Close the search modal
        }}
      />
    </div>
  );
};

export default Search;
