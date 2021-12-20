import React, { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { debounce } from "./utils/debounce";
const App = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const loader = useRef(null);

  const nextPage = useCallback(() => {
    setCurrentPage((page) => page + 1);
  }, [currentPage]);

  useEffect(() => {
    let options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };
    let observer = new IntersectionObserver(nextPage, options);
    if (loader.current) {
      observer.observe(loader.current);
    }
  }, []);

  useEffect(() => {
    fetch(
      `http://www.pinkvilla.com/photo-gallery-feed-page/page/${currentPage}`
    )
      .then((articles) => articles.json())
      .then((newArticles) => {
        setArticles([...articles, ...newArticles.nodes]);
      });
  }, [currentPage]);

  return (
    <div className="App">
      <div className="App-header">Articles Fetcher</div>

      {articles.map(({ node }) => {
        const url = `http://www.pinkvilla.com/${node.field_photo_image_section}`;
        return (
          <div className="article-container" key={node.title}>
            <img src={url} width="50px" />
            {node.title}
          </div>
        );
      })}

      <div className="special-div-pager" ref={loader}></div>
    </div>
  );
};

export default App;
