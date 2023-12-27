import Loading from "@/components/atoms/Loading";
import ForumEditor from "@/components/moleculars/forum/ForumEditor";
import { axiosInstance } from "@/util/instances";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
        console.log("error", error);
      });
  }, []);

  return forum ? <ForumEditor forum={forum} /> : <Loading />;
}

export default UpdateForum;
