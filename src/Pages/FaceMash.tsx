import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import Lottie from "lottie-react";
// import rawLoadingAnim from "./../assets/animations/loading.json";
import { BiQuestionMark } from "react-icons/bi";
import { CiUser } from "react-icons/ci";
import { GrAdd } from "react-icons/gr";
import { AddNew } from "../Components/AddNew";
import { toast } from "sonner";
import { BsShare } from "react-icons/bs";
// import { nav } from "framer-motion/client";
import BouncingDots from "../Components/BoucingDots";
import Spinner from "../Components/Spinner";
// import rawRequestLoadingAnim from "./../assets/animations/loading_2.json";

// const loadingAnim = JSON.parse(JSON.stringify(rawLoadingAnim));
// const requestLoadingAnim = JSON.parse(JSON.stringify(rawRequestLoadingAnim));

interface Face {
  id?: number;
  name: string;
  image: string;
}

interface FaceCardProps {
  person: Face;
  onClick?: () => void;
  disabled?: boolean;
}

const FaceCard: React.FC<FaceCardProps> = ({ person, onClick, disabled }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-lg cursor-pointer flex flex-col items-center w-64"
    onClick={onClick}
    aria-disabled={disabled}
  >
    <img
      src={person.image}
      alt={person.name}
      className="w-52 h-52 object-cover rounded-xl mb-4"
    />
    <span className="text-lg font-semibold text-white bg-black/30 px-3 py-1 rounded-full">
      {person.name}
    </span>
  </motion.div>
);

export default function Facemash() {
  const [faces, setFaces] = useState<Face[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [accpetedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [user, setUser] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [addNewUI, setAddNewUI] = useState<boolean>(false);
  const [postId, setPostId] = useState<string>("");
  const [mashTitle, setMashTitle] = useState<string>("");
  const [viewLeaderBoard, setViewLeaderBoard] = useState<boolean>(false);
  const [person1Votecount, setPerson1Votecount] = useState<number>(0);
  const [person2Votecount, setPerson2Votecount] = useState<number>(0);
  const [fetchingLeaderBoard, setFetchingLeaderBoard] = useState<boolean>(false);
  const [createdNewMash, setCreatedNewMash] = useState<boolean>(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  // const [requestLoadingAnim, setRequestLoadingAnim] = useState(null);
  // const [loadingAnim, setLoadingAnim] = useState(null);
  // useEffect(() => {
  //   fetch("./../assets/animations/loading_2.json")
  //     .then((res) => res.json())
  //     .then((data) => setRequestLoadingAnim(data));

  //   fetch("./../assets/animations/loading.json")
  //     .then((res) => res.json())
  //     .then((data) => setLoadingAnim(data));
  // }, []);

  const fetchFaces = async (id?: string) => {
    setLoading(true);

    if (id) {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/fetchPost/${id}`,
        {
          method: "GET",
        }
      );

      if (res.ok) {
        const data = await res.json();

        const formattedFaces = [
          {
            image: data.post.image_url_one,
            name: data.post.name_one,
          },
          {
            image: data.post.image_url_two,
            name: data.post.name_two,
          },
        ];

        setPerson1Votecount(data.person1Votecount);
        setPerson2Votecount(data.person2Votecount);

        setMashTitle(data.post.title);
        setFaces(formattedFaces);
      }

      setLoading(false);
    } else {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/feed`, {
        method: "POST",
        body: JSON.stringify({
          viewedPosts: JSON.parse(localStorage.getItem("viewedPosts") || "[]"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();

        if(!data.post){
          localStorage.setItem("viewedPosts", JSON.stringify([]));
          fetchFaces();
          return;
        }
        else{
          setPostId(data.post.id);
          setMashTitle(data.post.title);
          setPerson1Votecount(data.person1Votecount);
          setPerson2Votecount(data.person2Votecount);
          setFaces([
            {
              image: data.post.image_url_one,
              name: data.post.name_one,
            },
            {
              image: data.post.image_url_two,
              name: data.post.name_two,
            },
          ]);
        }
      }

      setLoading(false);
    }
  };

  const markVote = async (person: number) => {
    window.history.replaceState({}, "", window.location.pathname);
    if (localStorage.getItem(postId)) {
      toast.info("Already voted for this person");
      fetchFaces();
      return;
    }

    setLoading(true);

    try {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, votedFor: person == 1 ? "one" : "two" }),
      });

      const viewedPostsRaw = localStorage.getItem("viewedPosts");
      const viewedPosts = Array.isArray(JSON.parse(viewedPostsRaw || "[]"))
        ? [...JSON.parse(viewedPostsRaw || "[]")]
        : [];
      viewedPosts.push(postId);
      localStorage.setItem("viewedPosts", JSON.stringify(viewedPosts));


      localStorage.setItem(
        postId,
        JSON.stringify({ votedFor: person == 1 ? "one" : "two" })
      );
      toast.success(`Voted for person ${person}`);
      fetchFaces();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderBoard = async () => {
    setViewLeaderBoard(true);
    setFetchingLeaderBoard(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/fetchPost/${postId}`, {
        method: "GET",
      });

      if (res.ok) {
        const data = await res.json();
        setPerson1Votecount(data.person1Votecount);
        setPerson2Votecount(data.person2Votecount);
        setFetchingLeaderBoard(false);

        setViewLeaderBoard(true)
      } else {
        toast.error("Failed to fetch leaderboard.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching the leaderboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (id) {
      setPostId(id);
      fetchFaces(id);
    } else {
      fetchFaces();
    }
  }, []);

  // useEffect(() => {
  //   fetchFaces(postId);
  // }, [postId]);

useEffect(() => {
  if (typeof window !== "undefined") {
    setIsLargeScreen(window.innerWidth > 768);
  }
}, []);

  return (
    <>
      <div className="fixed md:right-10 md:left-auto md:top-10 md:h-20 md:min-w-20 md:w-auto md:p-6 left-2 top-2 h-14 w-14 p-4 z-50 bg-black/20 backdrop-blur-lg flex items-center justify-center rounded-full cursor-pointer gap-x-3">
        {isLargeScreen && (
          <h3 className="text-white text-4xl font-light">{user.name}</h3>
        )}
        <CiUser className="text-4xl text-white" />
      </div>

      <AnimatePresence>
        {!accpetedTerms && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white/10 backdrop-blur-xl text-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-white/20"
            >
              <h2 className="text-xl font-bold mb-4">
                Terms & Community Guidelines
              </h2>
              <p className="text-sm text-gray-200 mb-4">
                By using this platform, you agree not to upload offensive,
                harassing, or non-consensual content. FaceMash is meant for fun
                and respectful comparisons only. Violations may lead to removal
                or bans.
              </p>
              <p className="text-sm text-gray-400 mb-6">
                We do not tolerate bullying, discrimination, or hate speech in
                any form.
              </p>
              <button
                onClick={() => setAcceptedTerms(true)}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 transition text-white font-semibold rounded-lg"
              >
                I Understand & Agree
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="fixed md:bottom-10 md:right-10 bottom-3 right-3 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 rounded-full cursor-pointer h-16 w-16"
        onClick={() => setAcceptedTerms(false)}
      >
        <BiQuestionMark className="text-3xl text-white" />
      </div>

      <div
        className="fixed md:bottom-10 md:left-10 bottom-3 left-3 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-5 rounded-full cursor-pointer h-16 w-16"
        onClick={() => {
          if(localStorage.getItem("user")){
            setAddNewUI(true);
            if (addNewUI == true) {
              setAddNewUI(false);
            } else {
              setAddNewUI(true);
            }
          }
          else{
            window.location.href = `/auth`;
          }
        }}
      >
        <GrAdd className="text-3xl text-white" />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex flex-col items-center justify-center text-white p-4">
        <h1 className="text-4xl font-bold mb-2">facemash 🧸</h1>
        <p className="text-md mb-2 text-gray-300">
          Vote the vibe 👀 — Who wins your pick?
        </p>
        <h1 className="text-3xl md:text-5xl my-5 font-bold text-center">{mashTitle}</h1>

        {loading ? (
          <div className="w-40 h-40">
            {
              <BouncingDots />
            }
          </div>
        ) : faces.length === 2 ? (
          <AnimatePresence>
            <motion.div
              key={`${faces[0].image}-${faces[1].image}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-center gap-10"
            >
              <FaceCard
                person={faces[0]}
                onClick={() => {
                  markVote(1);
                }}
              />
              <div className="text-2xl font-bold">VS</div>
              <FaceCard
                person={faces[1]}
                onClick={() => {
                  markVote(2);
                }}
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <p className="text-gray-300">No faces found.</p>
        )}

        <footer className="mt-12 text-sm text-gray-400 flex flex-row items-center w-full gap-x-3 mx-auto justify-center">
          <button
            type="button"
            onClick={() => {fetchLeaderBoard()}}
            className={`${fetchingLeaderBoard ? 'bg-purple-300' : 'bg-purple-600 hover:bg-purple-700'} text-white py-2 px-4 rounded-lg shadow-md transition text-xl cursor-pointer md:mb-0 mb-20`}
          >
            {
              fetchingLeaderBoard ? (
                <Spinner />
              ): '🏆 View Leaderboard'
            }
          </button>
          <div
            className="bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 rounded-full cursor-pointer h-14 w-14 mb-20"
            onClick={() => {
              navigator.clipboard.writeText(`${location.origin}/home?id=${postId}`);
              toast.info("Link copied to clipboard!");
            }}
          >
            <BsShare className="text-3xl text-white" />
          </div>
        </footer>
      </div>

      <AnimatePresence>
        {viewLeaderBoard && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-xl text-white shadow-2xl relative"
            >
              <button
                className="absolute top-4 right-4 text-white/60 hover:text-white text-xl m-3"
                onClick={() => setViewLeaderBoard(false)}
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-6 text-center">
                🏆 Leaderboard
              </h2>

              <div className="flex-1 md:flex items-center justify-evenly gap-4 w-full hidden">
                <div className="flex flex-col gap-x-2 items-center justify-center w-1/2">
                  <img
                    src={faces[0]?.image}
                    className="w-40 h-40 object-cover rounded-full"
                  />
                  <span className="md:text-3xl">{faces[0]?.name}</span>
                </div>

                <span className="mx-2 text-2xl text-gray-400">vs</span>

                <div className="flex flex-col gap-x-2 items-center justify-center w-1/2">
                  <img
                    src={faces[1]?.image}
                    className="w-40 h-40 object-cover rounded-full"
                  />
                  <span className="md:text-3xl">{faces[1]?.name}</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl items-center gap-4 border border-white/10 flex flex-row h-16 justify-between mt-6 relative">
                <div
                  className={`h-full bg-purple-600 rounded-lg flex flex-row items-center gap-x-3 absolute top-0 left-0 bottom-0 ${
                    person1Votecount == person2Votecount &&
                    person1Votecount == 0 &&
                    person1Votecount == 0
                      ? "w-0 p-0 pl-0"
                      : "pl-4"
                  } ${person1Votecount == 0 && 'pl-0'} ${
                    person1Votecount > person2Votecount ||
                    (person1Votecount == person2Votecount &&
                      person1Votecount != 0)
                      ? "w-full"
                      : ""
                  }`}
                  style={{
                    width: `${
                      person2Votecount > person1Votecount
                        ? `${(person1Votecount / person2Votecount) * 100}%`
                        : ""
                    }`,
                    paddingLeft: person1Votecount == 0 ? '0px' : 'initial',
                  }}
                ></div>
                <div className="absolute top-0 left-0 bottom-0 flex flex-row items-center gap-x-3 pl-3">
                  <img
                    src={faces[0]?.image}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <span className="md:text-3xl">{faces[0]?.name}</span>
                </div>

                <div className="absolute top-0 right-4 bottom-0 flex items-center justify-center">
                  <span className="md:text-3xl text-white">
                    {person1Votecount}
                  </span>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl items-center gap-4 border border-white/10 flex flex-row h-16 justify-between mt-6 relative">
                <div
                  className={`h-full bg-purple-600 rounded-lg flex flex-row items-center gap-x-3 absolute top-0 left-0 bottom-0 ${
                    person1Votecount == person2Votecount &&
                    person1Votecount == 0
                    && person2Votecount == 0
                      ? "w-0 p-0 pl-0"
                      : "pl-4"
                  }  ${person2Votecount == 0 && 'pl-0'} ${
                    person2Votecount > person1Votecount ||
                    (person1Votecount == person2Votecount &&
                      person1Votecount != 0)
                      ? "w-full"
                      : ""
                  }`}
                  style={{
                    width: `${
                      person1Votecount > person2Votecount
                        ? `${(person2Votecount / person1Votecount) * 100}%`
                        : ""
                    }`,
                    paddingLeft: person2Votecount == 0 ? '0px' : 'initial',
                  }}
                ></div>
                <div className="absolute top-0 left-0 bottom-0 flex flex-row items-center gap-x-3 pl-3">
                  <img
                    src={faces[1]?.image}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <span className="md:text-3xl">{faces[1]?.name}</span>
                </div>

                <div className="absolute top-0 right-4 bottom-0 flex items-center justify-center">
                  <span className="md:text-3xl text-white">
                    {person2Votecount}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {addNewUI && <AddNew />}


      {
        createdNewMash && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-xl text-white shadow-2xl relative"
            >
              <button
                className="absolute top-4 right-4 text-white/60 hover:text-white text-xl m-3"
                onClick={() => setCreatedNewMash(false)}
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-6 text-center">  
                New Mash Created!
              </h2>
              <p className="text-lg text-center mb-4">
                Your new mash has been created successfully. You can now share it with others!
              </p>
              <button
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 transition text-white font-semibold rounded-lg"
                onClick={() => {
                  setCreatedNewMash(false);
                  setAddNewUI(false);
                  fetchFaces();
                }}
              >
                Go to Mash
              </button>

              <button
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 transition text-white font-semibold rounded-lg my-3"
                onClick={() => {
                  navigator.clipboard.writeText(`${location.origin}/${localStorage.getItem("latestMash")}`);
                  toast.info("Link copied to clipboard!");
                }}
              >
                <BsShare className="inline-block mr-2" />
                Share Mash
              </button>
            </motion.div>
          </motion.div>
        )
      }
    </>
  );
}
