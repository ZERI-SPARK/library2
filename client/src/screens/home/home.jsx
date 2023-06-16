import React, { useContext, useMemo, useRef, useState } from "react";
import { useEffect } from "react";
import Loading from "../../components/loading";
import { MyContext } from "../../MyContext";
import "./home.css";
import { useNavigate } from "react-router-dom";
let page = 1;
let totalItems = 1;
export default function Home() {
  const context = useContext(MyContext);
  let { cartItems, setCartItems } = context;
  console.log(context);
  const [Allbooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const targetRef = useRef(null);
  const getBooks = async () => {
    try {
      let books = await fetch(`http://localhost:5000/api/books/${page}`)
        .then((res) => res.json())
        .then((json) => {
          return json;
        });
      totalItems = books.totalItems;
      if (Allbooks.length === 0) {
        setAllBooks(books.items);
      } else if (Allbooks.length !== 0) {
        setAllBooks([...Allbooks, ...books.items]);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };
  const handleSearch = async () => {
    setLoading(true);
    let req = {
      searchValue: searchValue,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    };
    let res = await fetch("http://localhost:5000/api/search", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
    setAllBooks(res);
    setSearchValue("");
    setLoading(false);
  };

  useEffect(() => {
    getBooks();
  }, []);
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // myFunction();
          console.log("botom");
          if (page <= totalItems / 40 + 1) {
            getBooks();
            page = page + 1;
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);
    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    // Clean up the observer on component unmount
    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [Allbooks, loading]);
  const [mappedGenres, setMappedGenres] = useState([
    "Historical Fiction",
    "Classic",
    "Magical Realism",
    "Science Fiction",
    "Dystopian",
    "Epic",
    "Fantasy",
    "Biography",
    "Coming-of-age",
    "Gothic",
    "Thriller",
    "Horror",
    "Psychological Fiction",
    "Mystery",
  ]);

  const [mapgenres, setMapGenre] = useState();
  const [filterValue, setFilterValue] = useState("");
  const mapGenres = () => {
    setMapGenre(!mapgenres);
  };
  const [data, setData] = useState([]); // Your mapped data from the "get item" API
  const [sortedData, setSortedData] = useState([]); // State to store the sorted data
  const [sortBy, setSortBy] = useState(""); // State to track the sort option

  // Function to handle sorting based on the selected option
  const handleSort = (option) => {
    let sortedItems = [];

    if (option === "title") {
      sortedItems = [...Allbooks].sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === "year") {
      sortedItems = [...Allbooks].sort((a, b) => a.year - b.year);
    }

    setSortedData(sortedItems);
    setSortBy(option);
  };
  const navigate = useNavigate();
  const handleAddtoCart = (book) => {
    let userAuth = localStorage.getItem("userAuth");

    if (userAuth) {
      localStorage.setItem("books", JSON.stringify(book));
      navigate("/cart");
    } else {
      navigate("/login");
    }
  };
  return (
    <div>
      {loading ? (
        <>
          <Loading />
        </>
      ) : (
        <div>
          <div className="flexcenter topStick">
            <div className="searchContainer">
              <input
                placeholder="SEARCH BOOKS"
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
                className="searchInput"
              />
              <div className="searchSuggestion">
                {searchValue !== "" && (
                  <button onClick={() => handleSearch()} className="searchBtn">
                    SEARCH FOR '{searchValue}'
                  </button>
                )}

                {Allbooks.filter((value) => {
                  return (
                    value.author
                      .toLowerCase()
                      .includes(searchValue.toLowerCase()) ||
                    value.name
                      .toLowerCase()
                      .includes(searchValue.toLowerCase()) ||
                    value.genre
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  );
                }).map((suggestion) => {
                  return (
                    <>
                      {searchValue !== "" && (
                        <>
                          <p
                            onClick={() => {
                              setFilterValue(suggestion.name),
                                setSearchValue("");
                            }}
                          >
                            {" "}
                            {suggestion.name}
                          </p>
                        </>
                      )}
                    </>
                  );
                })}
              </div>
            </div>
            <div>
              <button onClick={() => mapGenres()} className="genreButton">
                GENRE
              </button>
              <div className="genreMenu" style={mapgenres ? {opacity:'100%'}:{opacity:'0'}}>
                {mapgenres &&
                  mappedGenres.map((genre, index) => (
                    <button key={index} onClick={() => setFilterValue(genre)}>
                      {genre}
                    </button>
                  ))}
              </div>
            </div>
            <div>
              <div className="flexcenter">
                <button
                  onClick={() => handleSort("title")}
                  className="sortButton"
                >
                  Sort A-Z
                </button>
                <button
                  onClick={() => handleSort("year")}
                  className="sortButton"
                >
                  Sort by Year
                </button>
              </div>
            </div>

            <p> {Allbooks.length} Books</p>
          </div>
          {sortedData.length > 0 ? (
            <div className="cardBox">
              {sortedData
                ?.filter((value) => {
                  return (
                    value.author
                      .toLowerCase()
                      .includes(filterValue.toLowerCase()) ||
                    value.name
                      .toLowerCase()
                      .includes(filterValue.toLowerCase()) ||
                    value.genre
                      .toLowerCase()
                      .includes(filterValue.toLowerCase())
                  );
                })
                ?.map((book) => (
                  <div className="cardContainer">
                    <span
                      className="genreSpan"
                      style={
                        book.genre === "Fiction"
                          ? { background: "red" }
                          : book.genre === "Dystopian "
                          ? { background: "green" }
                          : book.genre === "Fantasy"
                          ? { background: "#9a04ff" }
                          : book.genre === "Classic"
                          ? { background: "#91514b" }
                          : book.genre === "Adventure"
                          ? { background: "#63914d" }
                          : book.genre === "Epic"
                          ? { background: "black" }
                          : { background: "gray" }
                      }
                    >
                      {book.genre}
                    </span>
                    <p> {book.name}</p>
                    by {book.author}
                    <div>
                      <span>{book.year}</span>
                    </div>
                    <button onClick={() => handleAddtoCart(book)}>
                      ADD TO CART
                    </button>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                  </div>
                ))}
            </div>
          ) : (
            <>
              {Allbooks.length > 0 ? (
                <div className="cardBox">
                  {Allbooks?.filter((value) => {
                    return (
                      value.author
                        .toLowerCase()
                        .includes(filterValue.toLowerCase()) ||
                      value.name
                        .toLowerCase()
                        .includes(filterValue.toLowerCase()) ||
                      value.genre
                        .toLowerCase()
                        .includes(filterValue.toLowerCase())
                    );
                  })?.map((book, id) => {
                    return (
                      <div className="cardContainer">
                        <span
                          className="genreSpan"
                          style={
                            book.genre === "Fiction"
                              ? { background: "red" }
                              : book.genre === "Dystopian "
                              ? { background: "green" }
                              : book.genre === "Fantasy"
                              ? { background: "#9a04ff" }
                              : book.genre === "Classic"
                              ? { background: "#91514b" }
                              : book.genre === "Adventure"
                              ? { background: "#63914d" }
                              : book.genre === "Epic"
                              ? { background: "black" }
                              : { background: "gray" }
                          }
                        >
                          {book.genre}
                        </span>
                        <p> {book.name}</p>
                        by {book.author}
                        <div>
                          <span>{book.year}</span>
                        </div>
                        <button onClick={() => handleAddtoCart(book)}>
                          <b> ADD TO CART</b>
                          <br />

                          <span>AVAILABLE COPIES : {book.availableCopy}</span>
                        </button>
                      </div>
                    );
                  })}
                  <div ref={targetRef}></div>
                </div>
              ) : (
                <>NO BOOKS AVAILABLE</>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
