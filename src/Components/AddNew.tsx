import { motion, AnimatePresence } from "framer-motion";
// import Lottie from "lottie-react";
import { useState } from "react";
import { IoAdd } from "react-icons/io5";
import { toast } from "sonner";
import { CgClose } from "react-icons/cg";

export const AddNew = () => {
  const [image1url, setImage1url] = useState("");
  const [image2url, setImage2url] = useState("");
  const [image1, setImage1] = useState<File>();
  const [image2, setImage2] = useState<File>();

  const [mashTitle, setMashTitle] = useState<string>("");
  const [person1, setPerson1] = useState("");
  const [person2, setPerson2] = useState("");
  const [isProcessingRequest, setIsProcessingRequest] =
    useState<boolean>(false);

    const [isShown, setIsShown] = useState<boolean>(true);
    // const [requestLoadingAnim, setRequestLoadingAnim] = useState(null);

  // useEffect(() => {
  //   fetch("./../assets/animations/loading_2.json")
  //     .then((res) => res.json())
  //     .then((data) => setRequestLoadingAnim(data));
  // }, []);


  const handleFormImageOneUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage1(file);
      const url = URL.createObjectURL(file);
      setImage1url(url);
    }
  };

  const handleFormImageTwoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage2(file);
      const url = URL.createObjectURL(file);
      setImage2url(url);
    }
  };

  const handleSubmit = async () => {
    if (!image1 || !image2 || !person1 || !person2 || !mashTitle) {
      toast.error("Fill in all fields.");
      return;
    }

    setIsProcessingRequest(true);

    try {

        const formData = new FormData();
        formData.append("name_one", person1);
        formData.append("name_two", person2);
        formData.append("title", mashTitle);
        formData.append("person1", image1 as any); // image1 should be a File object
        formData.append("person2", image2 as any);
        
        const token = JSON.parse(localStorage.getItem("user") as string).token;

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/post`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${ token || ""}`
        },
        body: formData
      });

      if (res.ok) {
        toast.success("Post created successful.");
        const data = await res.json();
        setIsProcessingRequest(false);
        console.log(data);

        setPerson1('');
        setPerson2('');
        setImage1(undefined);
        setImage2(undefined);
        setImage1url('');
        setImage2url('');
        setMashTitle('');


        localStorage.setItem("latestMash", `/home?id=${data.post.id}`);
        window.open(`/home?id=${data.post.id}`, "_blank");
      } else {
        const data = await res.json();
        setIsProcessingRequest(false);
        console.log(data);

        toast.error(data.error || "Something went wrong.");
      }
    } catch (error) {
      setIsProcessingRequest(false);
    }
  };
  return (
    <>
      {
        isShown && (
            <AnimatePresence>
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
            className="bg-white/10 backdrop-blur-xl text-white rounded-xl max-w-xl w-full p-6 shadow-2xl border border-white/20"
          >
            <div className="w-full flex justify-end flex-end">
                <button className="w-10 h-10 rounded-full cursor-pointer" onClick={() => {setIsShown(false)}}>
                    <CgClose className="text-white text-3xl"></CgClose>
                </button>
            </div>

            <h2 className="text-xl font-bold mb-4 mx-auto w-auto text-center">
              Create a new Mash
            </h2>
            <input
              type="text"
              name=""
              id=""
              placeholder="Mash Title"
              className="w-full border-b border-white h-12 text-2xl focus:outline-0 text-center"
              value={mashTitle}
              onInput={(e: any) => {
                setMashTitle(e.target.value);
              }}
            />

            <div className="w-full flex md:flex-row flex-col my-5 justify-evenly mx-auto gap-3">
              <div className="flex flex-col gap-y-3 mx-auto">
                <div
                  className="relative w-40 h-40 rounded-lg border-dashed border border-white flex justify-center items-center bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${image1url})` }}
                >
                  {image1url == "" && <IoAdd className="text-7xl"></IoAdd>}
                  <input
                    type="file"
                    name=""
                    id=""
                    className="absolute top-0 right-0 left-0 bottom-0 cursor-pointer opacity-0"
                    onChange={handleFormImageOneUpload}
                  />
                </div>
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Name..."
                  className="w-40 border-b border-white h-12 text-2xl focus:outline-0"
                  value={person1}
                  onInput={(e: any) => {
                    setPerson1(e.target.value);
                  }}
                />
              </div>

              <div className="flex flex-col gap-y-3 mx-auto">
                <div
                  className="relative w-40 h-40 rounded-lg border-dashed border border-white flex justify-center items-center bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${image2url})` }}
                >
                  {image2url == "" && <IoAdd className="text-7xl"></IoAdd>}
                  <input
                    type="file"
                    name=""
                    id=""
                    className="absolute top-0 right-0 left-0 bottom-0 cursor-pointer opacity-0"
                    onChange={handleFormImageTwoUpload}
                  />
                </div>
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Name..."
                  className="w-40 border-b border-white h-12 text-2xl focus:outline-0"
                  value={person2}
                  onInput={(e: any) => {
                    setPerson2(e.target.value);
                  }}
                />
              </div>
            </div>
            <button
              className={`w-full py-2 ${isProcessingRequest ? 'bg-purple-300' : 'bg-purple-600 hover:bg-purple-700'} transition text-white font-semibold rounded-lg cursor-pointer h-12`}
              onClick={handleSubmit}
            >
                {
                    isProcessingRequest ? (
                        <div className="w-5 h-5 mx-auto">
                          Loading...
                            {/* <Lottie
                                animationData={requestLoadingAnim}
                                loop
                                autoplay
                                style={{ height: "100px", width: "100px", marginTop: '-250%', marginLeft: '-200%', marginRight: 'auto' }}
                            /> */}
                        </div>
                    ) : 'Post'
                }
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
        )
      }
    </>
  );
};
