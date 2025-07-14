import { useEffect, useState } from "react";
import { toast } from "sonner";
// import rawRequestLoadingAnim from "./../assets/animations/loading_2.json";
// import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";


// const requestLoadingAnim = JSON.parse(JSON.stringify(rawRequestLoadingAnim));

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isProcessingRequest, setIsProcessingRequest] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(isLogin){
        setIsProcessingRequest(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                }),
            });

            if(res.ok){
                toast.success('Login successful.');
                const data = await res.json();
                setIsProcessingRequest(false);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/home');
            }
            else{
                const data = await res.json();
                setIsProcessingRequest(false);

                toast.error(data.error || 'Something went wrong.');
            }
        } catch (error) {
            setIsProcessingRequest(false);
        }
    }
    else{
        setIsProcessingRequest(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                }),
            });

            if(res.ok){
                toast.success('Account created successful.');
                const data = await res.json();
                setIsProcessingRequest(false);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/home');
            }
            else{
                const data = await res.json();
                setIsProcessingRequest(false);

                toast.error(data.error || 'Something went wrong.');
            }
        } catch (error) {
            setIsProcessingRequest(false);
        }
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.token) {
        navigate("/home");
      }
    }
    
  }, [])
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e1e2f] via-[#34354a] to-[#222] text-white p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">
          {isLogin ? "Login to Facemash" : "Create Your Account"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {
                !isLogin && (
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="px-4 py-3 rounded-lg bg-white/20 text-white placeholder:text-gray-300 focus:outline-none"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                )
            }
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="px-4 py-3 rounded-lg bg-white/20 text-white placeholder:text-gray-300 focus:outline-none"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="px-4 py-3 rounded-lg bg-white/20 text-white placeholder:text-gray-300 focus:outline-none"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className={`${isProcessingRequest ? 'bg-purple-300' : 'bg-purple-600 hover:bg-purple-700'} transition px-4 py-3 rounded-lg font-semibold h-12`}
            disabled={isProcessingRequest}
          >
            {isProcessingRequest ? (
                <div className="w-5 h-5 mx-auto">
                  Loading...
                    {/* <Lottie
                        animationData={requestLoadingAnim}
                        loop
                        autoplay
                        style={{ height: "100px", width: "100px", marginTop: '-250%', marginLeft: '-200%', marginRight: 'auto' }}
                    /> */}
                </div>
            ) : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-300">
          {isLogin ? "Don't have an account?" : "Already have an account?"} {" "}
          <button
            className="text-purple-400 underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
