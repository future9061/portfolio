import React, { useContext } from "react";
import classes from "./SlideMenu.module.css";
import MeLi, { IconMeLi } from "./li/MeLi";
import { BsGithub } from "react-icons/bs";
import { ThemeContext } from "../store/Context";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useSelector } from "react-redux";

function SlideMenu() {
  const { setSlideToggle, slideToggle } = useContext(ThemeContext);
  const theme = useSelector((state) => state.themSlice);
  let dark = theme === "dark" ? classes.dark : "";

  const clickSlide = () => {
    setSlideToggle(() => false);
  };

  return (
    <div
      className={`${classes.slide_wrap} ${
        slideToggle ? classes.show : ""
      } ${dark}`}
    >
      <div className={classes.slide_inner}>
        <div onClick={clickSlide}>
          <AiOutlineCloseCircle />
        </div>
        <ul>
          <h3>Log</h3>
          <a href="https://github.com/future9061" target="_blank">
            <IconMeLi icon={<BsGithub />} text="GitHub" />
          </a>
          <h3>Direct Menu</h3>
          <MeLi />
        </ul>
      </div>
    </div>
  );
}

export default SlideMenu;
