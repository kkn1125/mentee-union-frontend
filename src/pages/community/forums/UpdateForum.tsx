import Loading from "@/components/atoms/common/Loading";
import ForumEditor from "@/components/moleculars/forum/ForumEditor";
import Logger from "@/libs/logger";
import { axiosInstance } from "@/util/instances";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const logger = new Logger(UpdateForum.name);

function UpdateForum() {
  const params = useParams();
  const [forum, setForum] = useState<Forum | null>(null);

  useEffect(() => {
    axiosInstance
      .get("/forums/" + params.id)
      .then(({ data }) => data.data)
      .then((data) => {
        setForum(data);
      })
      .catch((error) => {
        logger.log("error", error);
      });
  }, []);

  return forum ? <ForumEditor forum={forum} /> : <Loading />;
}

export default UpdateForum;
