const BouncingDots = () => (
  <div className="flex gap-4 justify-center h-full items-center">
    <span className="w-6 h-6 bg-blue-500 rounded-full animate-bounce [animation-duration:0.9s] [animation-delay:0s] [--tw-translate-y:-3rem]"></span>
    <span className="w-6 h-6 bg-blue-500 rounded-full animate-bounce [animation-duration:0.9s] [animation-delay:0.3s] [--tw-translate-y:-3rem]"></span>
    <span className="w-6 h-6 bg-blue-500 rounded-full animate-bounce [animation-duration:0.9s] [animation-delay:0.6s] [--tw-translate-y:-3rem]"></span>
  </div>
);


export default BouncingDots;