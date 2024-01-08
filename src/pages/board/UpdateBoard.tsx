import Loading from "@/components/atoms/common/Loading";
import NoticeEditor from "@/components/moleculars/board/NoticeEditor";
import QnaEditor from "@/components/moleculars/board/QnaEditor";
import Logger from "@/libs/logger";
import { axiosInstance } from "@/util/instances";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Notfound from "../Notfound";

const logger = new Logger(UpdateBoard.name);

function UpdateBoard() {
  const params = useParams();
  const [board, setBoard] = useState<Board | null>(null);
  const [isNotfound, setIsNotfound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axiosInstance.defaults.timeout = 3000;
    axiosInstance
      .get(`/boards/${params.type}/` + params.id)
      .then(({ data }) => data.data)
      .then((data) => {
        logger.log("found board", params.type);
        setBoard(data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (
          error.code === "ERR_BAD_REQUEST" &&
          error?.response.data.code === 404
        ) {
          setIsNotfound(true);
          setIsLoading(false);
        }
      });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (isNotfound) {
    return <Notfound />;
  }

  if (board) {
    if (params.type === "qna") {
      return <QnaEditor qna={board} />;
    } else if (params.type === "notice") {
      return <NoticeEditor notice={board} />;
    } else {
      return <Notfound />;
    }
  }
}

export default UpdateBoard;
