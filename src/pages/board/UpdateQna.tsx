import Loading from "@/components/atoms/common/Loading";
import QnaEditor from "@/components/moleculars/board/QnaEditor";
import Logger from "@/libs/logger";
import { axiosInstance } from "@/util/instances";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const logger = new Logger(UpdateQna.name);

function UpdateQna() {
  const params = useParams();
  const [qna, setQna] = useState<Board | null>(null);

  useEffect(() => {
    axiosInstance
      .get("/boards/qna/" + params.id)
      .then(({ data }) => data.data)
      .then((data) => {
        setQna(data);
      })
      .catch((error) => {
        logger.log("error", error);
      });
  }, []);

  return qna ? <QnaEditor qna={qna} /> : <Loading />;
}

export default UpdateQna;
