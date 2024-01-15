import NoticeEditor from "@/components/moleculars/board/NoticeEditor";
import QnaEditor from "@/components/moleculars/board/QnaEditor";
import { useParams } from "react-router-dom";
import Notfound from "../Notfound";

function WriteBoard() {
  const params = useParams();
  if (params.type === "qna") {
    return <QnaEditor />;
  } else if (params.type === "notice") {
    return <NoticeEditor />;
  } else {
    return <Notfound />;
  }
}

export default WriteBoard;
