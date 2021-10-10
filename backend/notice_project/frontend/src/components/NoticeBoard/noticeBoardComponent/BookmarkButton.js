import { useState, useEffect, useContext } from "react";
import BookmarkIcon from "../../../assets/bookmark-icon.svg";
import BookmarkIconActive from "../../../assets/bookmark-icon-active.svg";
import { DataContext } from "../../../App";
import axios from "axios";
import Box from "@material-ui/core/Box";
import ListItemText from "@material-ui/core/ListItemText";
import { BookmarkContext } from "./BookmarkContext";

const BookmarkButton = ({ noticeID }) => {
  const { bookmarkDetails, setToggleBookmark, toggleBookmark } =
    useContext(BookmarkContext);
  const [bookmarkStatus, setBookmarkStatus] = useState(false);
  let user = JSON.parse(sessionStorage.getItem("user"));

  const AdminMenuStyle = {
    width: "100%",
    display: "flex",
    alignItems: "center",
  };

  const _globalData = useContext(DataContext);
  const org_id = _globalData.Organizations[0];
  const [bookmarkedNoticeID, setBookmarkNoticeID] = useState();
  useEffect(() => {
    if (bookmarkDetails) {
      const check = bookmarkDetails?.data.filter(
        (data) => data.notice_id === noticeID
      );
      setBookmarkNoticeID(check[0]);
      if (check.length !== 0) {
        setBookmarkStatus(true);
      } else {
        setBookmarkStatus(false);
      }
    }
  });

  const bookmarkNotice = () => {
    axios
      .post(
        `https://noticeboard.zuri.chat/api/v1/organisation/${_globalData.Organizations[0]}/bookmark`,
        {
          notice_id: noticeID,
          user_id: user.id,
        }
      )
      .then((data) => {
        setBookmarkStatus(true);
        setToggleBookmark(!toggleBookmark);
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  };

  const deleteBookmarkNotice = () => {
    axios
      .delete(
        `https://noticeboard.zuri.chat/api/v1/organisation/${_globalData.Organizations[0]}/bookmark/${bookmarkedNoticeID?._id}/delete`
      )
      .then((data) => {
        setBookmarkStatus(false);
        setToggleBookmark(!toggleBookmark);
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  };

  const bookmarkFunction = () => {
    if (!bookmarkStatus) {
      bookmarkNotice();
    } else {
      deleteBookmarkNotice();
    }
  };

  return (
    <div
      style={AdminMenuStyle}
      onClick={() => {
        bookmarkFunction();
      }}
    >
      <img
        src={bookmarkStatus ? BookmarkIconActive : BookmarkIcon}
        alt="Bookmark"
        style={{ paddingRight: "10px" }}
      />
      <span
        style={{
          color: "#999999",
          width: "100%",
        }}
      >
        Bookmark
      </span>
    </div>
  );
};

export default BookmarkButton;
