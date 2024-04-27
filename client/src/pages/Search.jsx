import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { PostCard } from "../components/PostCard";
import { Button, Select, Spinner, TextInput } from "flowbite-react";

export const Search = () => {
  // definimos los parámetros de búsqueda predeterminados
  const [searchData, setSearchData] = useState({
    searchTerm: "",
    order: "asc",
    category: "unselected",
  });
  // obtenemos la ubicación actual y la navegación
  // useLocation nos permite acceder a la ubicación actual y obtener los valores de los parámetros de búsqueda
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchedPosts, setSearchedPosts] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    // obtenemos los parámetros de búsqueda de la URL
    const urlParams = new URLSearchParams(location.search);
    // obtenemos los valores específicos de los parámetros de búsqueda
    const searchTermFromUrl = urlParams.get("searchTerm");
    const orderFromUrl = urlParams.get("order");
    const categoryFromUrl = urlParams.get("category");

    // si no hay un término de búsqueda de categoría en la URL, lo eliminamos (se borra de la url tmb)
    if (searchData.category === "unselected") {
      urlParams.delete("category");
    }
    // si el parámetro de búsqueda searchTerm esta vacio, lo eliminamos de searchData y de la url
    if (searchTermFromUrl === "" || !searchTermFromUrl) {
      //aca lo eliminamos de la url
      urlParams.delete("searchTerm");
      setSearchData({
        ...searchData,
        searchTerm: "",
      });
    }
    // si envían todos los parámetros de búsqueda en la url, los seteamos en searchData
    if (searchTermFromUrl || orderFromUrl || categoryFromUrl) {
      setSearchData({
        ...searchData,
        order: orderFromUrl ? orderFromUrl : "asc",
        category: categoryFromUrl ? categoryFromUrl : "unselected",
        searchTerm: searchTermFromUrl ? searchTermFromUrl : "",
      });
    }

    try {
      const getPosts = async () => {
        setIsLoading(true);
        const searchQuery = urlParams.toString();
        const res = await axios.get(`api/post/getposts?${searchQuery}`);
        if (res.status !== 200) {
          setIsLoading(false);
          return;
        }
        if (res.status === 200) {
          setIsLoading(false);
          setSearchedPosts(res.data.posts);
          if (res.data.posts.length === 4) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        }
      };
      getPosts();
    } catch (error) {
      setIsLoading(false);
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    if (searchData.searchTerm !== "" || searchData.searchTerm) {
      urlParams.set("searchTerm", searchData.searchTerm);
    } else {
      urlParams.delete("searchTerm");
    }

    if (searchData.order) {
      urlParams.set("order", searchData.order);
    } else {
      urlParams.delete("order");
    }

    if (searchData.category && searchData.category !== "unselected") {
      urlParams.set("category", searchData.category);
    } else {
      urlParams.delete("category");
    }
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.id.includes("searchTerm")) {
      setSearchData({
        ...searchData,
        searchTerm: e.target.value,
      });
    }

    if (e.target.id.includes("order")) {
      const order = e.target.value || "desc";
      setSearchData({
        ...searchData,
        order: order,
      });
    }

    if (e.target.id.includes("category")) {
      const category = e.target.value || "unselected";
      setSearchData({
        ...searchData,
        category: category,
      });
    }
  };

  const handleShowMore = async () => {
    const numberOfPosts = searchedPosts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await axios.get(`/api/post/getposts?${searchQuery}`);
    if (res.status !== 200) {
      return;
    }
    if (res.status === 200) {
      const { data } = res;
      setSearchedPosts([...searchedPosts, ...data.posts]);
      console.log(data.posts)
      if (data.posts.length < 4) {
        setShowMore(false);
      } 
        
      
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-start z-10 justify-center mt-12 min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* SearchNavbar */}

      <form
        onSubmit={handleSubmit}
        className="z-20 w-screen flex-col gap-4 h-full p-4 md:flex-row bg-gray-300 dark:bg-gray-800 flex items-center justify-evenly"
      >
        <TextInput
          type="text"
          className="w-full"
          id="searchTerm"
          placeholder="Search.."
          value={searchData.searchTerm}
          onChange={handleChange}
        />
        <Select
          className="w-full"
          id="order"
          value={searchData.order}
          onChange={handleChange}
        >
          <option value="desc">Latest</option>
          <option value="asc">Oldest</option>
        </Select>

        <Select
          className="w-full"
          id="category"
          value={searchData.category}
          onChange={handleChange}
        >
          <option value="unselected">Select Category</option>
          <option value="tech-gadgets">Technology & Gadgets</option>
          <option value="animals-nature">Animals and Nature</option>
          <option value="travel-adventure">Travel & Adventure</option>
          <option value="cooking-recipes">Cooking & Recipes</option>
          <option value="books-literature">Books & Literature</option>
          <option value="health-wellness">Health & Wellness</option>
          <option value="movies-tv">Movies & TV</option>
          <option value="fashion-style">Fashion & Style</option>
          <option value="art-design">Art & Design</option>
          <option value="music-concerts">Music & Concerts</option>
          <option value="history-culture">History & Culture</option>
          <option value="photography-videography">
            Photography & Videography
          </option>
          <option value="science-discoveries">Science & Discoveries</option>
          <option value="education-learning">Education & Learning</option>
          <option value="environment-ecology">Environment & Ecology</option>
          <option value="entrepreneurship-business">
            Entrepreneurship & Business
          </option>
          <option value="sports-fitness">Sports & Fitness</option>
          <option value="automobiles-vehicles">Automobiles & Vehicles</option>
          <option value="relationships-family">Relationships & Family</option>
          <option value="games-videogames">Games & Videogames</option>
          <option value="news-current-events">News & Current Events</option>
          <option value="other">Other...</option>
        </Select>
        <Button type="submit">Search</Button>
      </form>

      <div className="mt-5 flex flex-wrap items-center justify-center">
        {searchedPosts.length !== 0 && !isLoading ? (
          <>
            {searchedPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </>
        ) : (
          <h1 className="text-3xl mt-5">No posts found :(</h1>
        )}
      </div>
      {showMore && (
        <Button
          gradientDuoTone="purpleToBlue"
          outline
          onClick={handleShowMore}
          className="hover:brightness-90 dark:hover:brightness-115 p-1 my-5 self-center mx-auto"
        >
          Show more
        </Button>
      )}
    </div>
  );
};
